const { get, values, keys, sortBy, round } = require('lodash');

const emojisRegex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;

class Utils {
  /**
   * Sorts and returns top 10 keys on specified entity
   * @param groupName
   * @param data
   * @returns {any}
   */
  static getTop10InGroup(groupName, data) {
    const results = {};
    const entities = keys(get(data, `groups.${groupName}`, {})).map(key => ({
      key,
      value: data.groups[groupName][key]
    }));
    Object.assign(
      results,
      ...sortBy(entities, 'value')
        .slice(entities.length - 10)
        .reverse()
        .map(({ key, value }) => ({ [key]: value }))
    );

    return results;
  }

  /**
   * Calculates the percentage that a key stat represents from the total tweets
   * @param key
   * @param data
   * @returns {number}
   */
  static getPercentage(key, data) {
    const { stats } = data;
    if (!stats.numberOfTweetsReceived) {
      return 0;
    }

    return round((get(data, `stats.${key}`, 0) / stats.numberOfTweetsReceived) * 100, 2);
  }

  /**
   * Calculates the average in specified groups
   * @param groupName
   * @param data
   * @returns {number}
   */
  static getGroupAverage(groupName, data) {
    const vals = values(get(data, `groups.${groupName}`, {}));
    const average = vals.length ? vals.reduce((v, ac) => ac + v, 0) / vals.length : 0;

    return round(average, 2);
  }

  /**
   * Extracts emojis from a given text
   * @param text
   * @returns {RegExpMatchArray | Promise<Response | undefined> | *}
   */
  static extractEmojis(text) {
    return text.match(emojisRegex);
  }

  /**
   * Pretty-prints stats
   * @param stats
   */
  static logStats(stats) {
    const separator = '-------------------------------------------------------------------------------------------\n';
    console.log('\n\n');
    keys(stats).forEach(key => console.log(separator, key, ':', JSON.stringify(stats[key], null, 0)));
    console.log(separator);
  }
}

module.exports = Utils;