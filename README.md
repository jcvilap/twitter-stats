# twitter-stats
A Node app that consumes the Twitter Streaming API and computes various statistics

Computed stats:

- Total number of tweets received
- Average tweets per hour/minute/second
- Top emojis in tweets(ordered by total number of occurrences)
- Percent of tweets that contains emojis
- Top hashtags(ordered by total number of occurrences)
- Percent of tweets that contain a url
- Percent of tweets that contain a photo url (pic.twitter.com or instagram)
- Top domains of urls in tweets(ordered by total number of occurrences)

#### Usage
##### Install dependencies
```
yarn install
```
or
```
npm install
```

##### Run the app
The app will run on port 8011 when executing:
```
yarn start
```
or
```
npm start
```

##### Visualizing computed stats

API:

The app exposes a Rest API, calling ```api/reports``` will generate the stats.
Sample curl:
```
curl -X GET http://localhost:8011/api/report
```

Console:

The app will start logging stats in the console every 5 seconds. Sample output:
```
-------------------------------------------------------------------------------------------
 numberOfTweetsReceived : 6946
-------------------------------------------------------------------------------------------
 averageTweetsPerHour : 6946
-------------------------------------------------------------------------------------------
 averageTweetsPerMinute : 1389.2
-------------------------------------------------------------------------------------------
 averageTweetsPerSecond : 30.2
-------------------------------------------------------------------------------------------
 topEmojis : {"😂":293,"😭":229,"❤":129,"🏻":81,"✨":76,"🔥":75,"💕":65,"😍":56}
-------------------------------------------------------------------------------------------
 topHashtags : {"iHeartAwards":31,"TiffanyYoung":18,"BestSoloBreakout":17}
-------------------------------------------------------------------------------------------
 topDomains : {"twitter.com":599,"du3a.org":83,"instagram.com":14,"ift.tt":12}
-------------------------------------------------------------------------------------------
 percentOfTweetsThatContainsEmojis : 19.81
-------------------------------------------------------------------------------------------
 percentOfTweetsThatContainsUrls : 17.97
-------------------------------------------------------------------------------------------
 percentOfTweetsThatContainPhotoUrls : 0.2
-------------------------------------------------------------------------------------------
```