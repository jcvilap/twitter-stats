const Twit = require('twit');
const moment = require('moment');
const { get, set, isArray, omit } = require('lodash');

const config = require('./../config');
const Utils = require('./utils');

class TweeterService {
  constructor() {
    this._data = {
      stats: {},
      rawData: [],
    };
  }

  /**
   * Initiates data stream from Tweeter
   */
  initStream() {
    const twit = new Twit(config);
    const stream = twit.stream('statuses/sample');

    stream.on('tweet', tweet => this.processTweet(tweet));
    setInterval(async () => Utils.logStats(await this.generateStats()), 5000);
  }

  /**
   * Prepares data to be analysed after each tweet
   * @param tweet
   */
  async processTweet(tweet) {
    try {
      const { created_at: createdAt, entities } = tweet;
      const date = moment(new Date(createdAt));
      const emojis = Utils.extractEmojis(tweet.text);
      const pathsToBeIncremented = [
        `groups.hours.${date.format('MMDDYYhh')}`,
        `groups.minutes.${date.format('MMDDYYhhmm')}`,
        `groups.seconds.${date.format('MMDDYYhhmmss')}`,
        'stats.numberOfTweetsReceived',
      ];

      if (get(emojis, 'length', 0) > 0) {
        const emojiPaths = emojis.map(emoji => `groups.emojis.${emoji}`);
        pathsToBeIncremented.push(...emojiPaths, 'stats.numberOfTweetsWithEmojis');
      }

      if (get(entities, 'hashtags.length') > 0) {
        const hashtagPaths = entities.hashtags.map(({ text }) => `groups.hashtags.${text}`);
        pathsToBeIncremented.push(...hashtagPaths, 'stats.numberOfTweetsWithHashtags');
      }

      if (get(entities, 'urls.length') > 0) {
        const urlPaths = [];
        const containsPhotoUrl = entities.urls.find(url => {
          const urlString = get(url, 'expanded_url') || get(url, 'url', '');
          return urlString.includes('pic.twitter.com') || urlString.includes('instagram');
        });
        const domainPaths = entities.urls.map(url => {
          const urlString = get(url, 'expanded_url') || get(url, 'url', '');
          return `groups.domains['${new URL(urlString).hostname.replace('www.', '')}']`;
        });

        if (containsPhotoUrl) {
          urlPaths.push('stats.numberOfTweetsWithPhotoUrls');
        }

        urlPaths.push(...domainPaths);
        pathsToBeIncremented.push(...urlPaths, 'stats.numberOfTweetsWithUrls');
      }

      this.incrementPaths(pathsToBeIncremented);
      this._data.rawData.push(tweet);
      if (this._data.rawData.length > 1000) {
        this.cleanStorage();
      }
    }
    catch (error) {
      console.error('An error occurred while processing tweet', error);
    }
  }

  /**
   * Increments counters data only specified paths
   * @param paths
   */
  incrementPaths(paths) {
    if (!isArray(paths)) {
      throw new Error('Input paths should be an array');
    }

    paths.filter(p => p).forEach(path => {
      const currentValue = get(this._data, path, 0);
      set(this._data, path, currentValue + 1);
    });
  }

  /**
   * Keeps only last 1000 items in storage
   */
  cleanStorage() {
    const { rawData } = this._data;
    this._data.rawData = rawData.slice(rawData.length - 1000, rawData.length);
  }

  /**
   * Data getter
   * @returns {*}
   */
  getProcessedData() {
    return omit(this._data, 'rawData');
  }

  /**
   * Calculates specified stats
   */
  async generateStats() {
    const data = this.getProcessedData();
    const results = {};

    // Total number of tweets received
    results.numberOfTweetsReceived = get(data, 'stats.numberOfTweetsReceived', 0);

    // Average tweets per hour/minute/second
    results.averageTweetsPerHour = Utils.getGroupAverage('hours', data);
    results.averageTweetsPerMinute = Utils.getGroupAverage('minutes', data);
    results.averageTweetsPerSecond = Utils.getGroupAverage('seconds', data);

    // Top emojis/hashtags/domains in tweets
    results.topEmojis = Utils.getTop10InGroup('emojis', data);
    results.topHashtags = Utils.getTop10InGroup('hashtags', data);
    results.topDomains = Utils.getTop10InGroup('domains', data);

    // Percent of tweets that contains emojis/urls/photo-urls
    results.percentOfTweetsThatContainsEmojis = Utils.getPercentage('numberOfTweetsWithEmojis', data);
    results.percentOfTweetsThatContainsUrls = Utils.getPercentage('numberOfTweetsWithUrls', data);
    results.percentOfTweetsThatContainPhotoUrls = Utils.getPercentage('numberOfTweetsWithPhotoUrls', data);

    return results;
  }
}

module.exports = new TweeterService();