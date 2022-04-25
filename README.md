# Twitter User's Threads Finder

A simple nodejs application to find the threads of a user.

## Run Locally

Clone the project

```bash
  git clone https://github.com/pratikpakhale/twitter-threads-finder
```

Go to the project directory

```bash
  cd twitter-threads-finder
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node ./app.js
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`TWITTER_BEARER_TOKEN`= "your twitter bearer token"

You can get the bearer token from [Twitter Dev Portal](https://developer.twitter.com/dashboard)

## Local Variables

Change the following variable values in app.js file accordingly-

`twitter_username`: "associated twitter handle"

`tweets_to_scan`: "number of tweets to scan [eg. 5000]"

`count`: "number of tweets in a thread, preferably '3' "

## FAQ

#### Where will I get the links?

The thread IDs and thread links will be logged in the terminal, also a seperate link.json file will be created which will contain the array of links.

## Addition Info

- A seperate data.json file will be created which will hold all the data fetched, just in case if something goes wrong you'll have the data to perform further operations. Mainly because twitter of twitter cap limit.
- 'fetched 100 tweets' will be logged for every iteration of fetching 100 tweets

## Acknowledgements

Do check the official docs for more endpoints and understanding responses.

- [Twitter Doc Ref](https://developer.twitter.com/en/docs/twitter-api/tweets/timelines/api-reference)
- [Twitter & Postman Integration](https://developer.twitter.com/en/docs/tools-and-libraries/using-postman.html)

## Authors

- [@pratikpakhale](https://www.github.com/pratikpakhale)

## Feedback

If you have any feedback, please reach out to me at pratikpakhale20@gmail.com or Twitter DM me [@\_pratikpakhale](https://twitter.com/_pratikpakhale)
