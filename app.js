const axios = require('axios').default
const fetchThreads = require('./algo')

const fs = require('fs')

require('dotenv').config()

// input data start

const twitter_username = '_pratikpakhale' // change this variable value to required user
let twitter_user_id = '' // you can enter twitter user id directly and make required changes to not to fetch id from username
let tweets_to_scan = 1000 // change this count to the number of tweets you want to scan to fetch threads from in it
let count = 3 // number of tweets in a thread - 1
const bearer_token = process.env.TWITTER_BEARER_TOKEN // add your twitter bearer token in a .env file, which you can get from twitter developer portal

// input data end

//function to get twitter user id
const getUsername = async () => {
  try {
    const res = await axios.get(
      'https://api.twitter.com/2/users/by/username/' + twitter_username,
      {
        headers: {
          Authorization: 'Bearer ' + bearer_token,
        },
      }
    )
    return res.data
  } catch (e) {
    console.log(e.message)
    return e
  }
}

// variable to divide total no of tweets to scan into parts of 100, as twitter allows to fetch data only in 100s
let noOf100s = 0
while (tweets_to_scan > 100) {
  noOf100s++
  tweets_to_scan -= 100
}

// a variable to set the last scanned tweet id, as we'll be scanning multiple times, we need to know the id of last tweet
let until_id = null

// gets the twitter data
const fetchData = async count => {
  try {
    // twitter endpoint to get all tweets
    const endpoint =
      'https://api.twitter.com/2/users/' + twitter_user_id + '/tweets'

    // some required parameters
    let params = {
      max_results: count,
      expansions: 'in_reply_to_user_id,referenced_tweets.id',
      exclude: 'retweets',
    }

    // add until id only after first scan i.e until_id != null
    if (until_id && until_id !== null) {
      params = {
        ...params,
        until_id,
      }
    }

    // give auth token
    const headers = {
      Authorization: `Bearer ${bearer_token}`,
    }

    // combine params and headers
    const config = {
      params,
      headers,
    }

    // make the req
    const res = await axios.get(endpoint, config)
    return res.data
  } catch (e) {
    console.log(e.message)
  }
}

// fetches the data by calling fetchData required number of times
const fetchAll = async () => {
  // comment below two lines of code if you've specified twitter user id manually
  const res = await getUsername()
  twitter_user_id = res.data.id

  let data = []
  while (noOf100s) {
    const temp = await fetchData(100)
    until_id = temp.meta.oldest_id

    if (temp.data) data = [...data, ...temp.data]

    // store data fetched until, so that you can access data later and also if something goes wrong  [as twitter limits the number of tweets you can get. If you fetched 1000s of tweets unnecessarily, you'll exhaust your twitter cap limit in no time]
    fs.writeFile('data.json', JSON.stringify(data), 'utf8', () => {})

    noOf100s--
    console.log('fetched 100 tweets')
  }
  until_id = null

  // just another safety save data method
  fs.writeFile('data.json', JSON.stringify(data), 'utf8', () => {})

  const temp = await fetchData(tweets_to_scan)
  data = [...data, ...temp.data]

  // just another safety save data method
  fs.writeFile('data.json', JSON.stringify(data), 'utf8', () => {})

  return data
}

// to know if program execution has started or not
console.log('Loading..')

try {
  fetchAll().then(data => {
    const arr = fetchThreads(data, twitter_user_id, count)
    const linkArr = arr.map(
      id => `https://twitter.com/${twitter_username}/status/${id}`
    )

    // thread ids
    console.log(arr)

    // thread links
    console.log(linkArr)

    // stores fetched links of twitter threads in a file too
    fs.writeFile('links.json', JSON.stringify(linkArr), 'utf8', () => {
      console.log('done')
    })
  })
} catch (e) {
  console.log(e.message)
}
