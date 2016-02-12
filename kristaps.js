var request = require('request');
var Twit = require('twit');
var express = require('express');
var app = express();
var random_lists = require('./random_lists');
var randomEmoji = require('random-emoji');
var env = require('./env');

app.get('/', function(req, res){
    res.send('Hello world.');
    akaKristaps();
});
app.listen(3000);

// Create twitter client

var kristaps = new Twit({
  consumer_key:         process.env.CONSUMER_KEY,
  consumer_secret:      process.env.CONSUMER_SECRET,
  access_token:         process.env.ACCESS_TOKEN,
  access_token_secret:  process.env.ACCESS_TOKEN_SECRET
});

// Grab URLS from stats.nba.com for all time leaders in blocks/points

var points_leaders_url = "http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=S&Season=All+Time&SeasonType=Regular+Season&StatCategory=PTS";
var blocks_leaders_url = "http://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=Totals&Scope=S&Season=All+Time&SeasonType=Regular+Season&StatCategory=BLK";

// akaKristaps is the main function that will tweet out a tweet in the format
// Kristaps Porzingis, AKA the (randome adjective) (random point leader) meets
// (random block leader) (random emoji)

function akaKristaps(){
  var tweet = "";

// grabbing random numbers for grabbing top players in each category

  var scorer = Math.floor(Math.random() * 300);
  var blocker = Math.floor(Math.random() * 150);

// grabbing random emoji character

  var emoji = randomEmoji.random()[0].character;

// requests the points_leaders_url to grab data to add to tweet

  request(points_leaders_url, function(error, response, body){
    var pointLeader = JSON.parse(body).resultSet.rowSet[scorer][1];

// requests the blocks_leaders_url to grab data to add to tweet

    request(blocks_leaders_url,function(error, response, body){
      var blockLeader = JSON.parse(body).resultSet.rowSet[blocker][1];

// creates finalized tweet string and let's server know it tweeted

      tweet = "Kristaps Porzingis, AKA the " + randomWord(random_lists.adj()) + " " + pointLeader + " meets the " + randomWord(random_lists.adj()) + " " + blockLeader + " " + emoji;
      console.log("tweeted");

// post created tweet to Porzingis_AKA twitter account

      kristaps.post('statuses/update', { status: tweet}, function(err, reply) {
        console.log("error: " + err);
        console.log("reply: " + reply);
      });
    });

  });

}

// function to grab a random word from an array of strings

function randomWord(array) {

    var length = array.length;
    var randomNumber = Math.floor(Math.random() * length);
    return array[randomNumber];

}

// runs akaKristaps initially and then sets an interval of tweeting every 30 minutes

akaKristaps();

setInterval(function() {
  try {
    akaKristaps();
  }
 catch (e) {
    console.log(e);
  }
},1800000);
