// algorithm which runs over all the fetched data and determines all the threads

// all the main tweet [not replies and retweets] ids will be stored here, in this object as keys, and an array will store the tweet ids of the replies by the main user of the tweet [which makes it a thread]
let storedTweets = {}

// function to add a new key of a main tweet [not a reply/retweet]
const updateStoredTweets = (id, arr) => {
  storedTweets = {
    ...storedTweets,
    [id]: [...arr],
  }
}

// checks if the given tweet is a reply to the main tweet [which makes it the second most tweet of the thread] or if it is a reply to a reply to a thread tweet

// look at a tweet object to understand this code
const isAValidThreadTwt = (twtObj, twtId) => {
  if (!twtObj.in_reply_to_user_id || !twtObj.referenced_tweets) return false

  const refTweetIds = twtObj.referenced_tweets.map(refTwt => {
    return refTwt.id
  })

  if (refTweetIds.includes(twtId)) return true

  let flag = 0

  refTweetIds.forEach(refTwtId => {
    if (storedTweets[twtId].includes(refTwtId)) {
      flag = 1
      return true
    }
  })

  if (flag) return true

  return false
}

// main function to validate thread tweets
const fetchThreads = (data, twitter_user_id, count) => {
  if (!data.length || !twitter_user_id || !count || twitter_user_id.length < 8)
    return false

  const sortedTweets = data.sort((a, b) => {
    return a.id - b.id
  })

  sortedTweets.forEach(twtObj => {
    if (!twtObj.referenced_tweets) {
      updateStoredTweets(twtObj.id, [])
    } else {
      if (twtObj.in_reply_to_user_id == twitter_user_id) {
        const currentTweetIds = Object.keys(storedTweets)

        currentTweetIds.forEach(twtId => {
          if (isAValidThreadTwt(twtObj, twtId)) {
            storedTweets[twtId].push(twtObj.id)
          }
        })
      }
    }
  })

  const tweetsIDS = Object.keys(storedTweets)
  const threadIDS = []

  // if the number of replies [specified in the main file] exists for a thread then count it as a thread
  tweetsIDS.forEach(tweetID => {
    if (storedTweets[tweetID].length >= count) threadIDS.push(tweetID)
  })

  return threadIDS
}

module.exports = fetchThreads
