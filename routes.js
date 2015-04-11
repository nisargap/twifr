var express = require('express');
var request = require('request')
, passport = require('passport')
  , util = require('util')
  , TwitterStrategy = require('passport-twitter').Strategy;

var router = express.Router();
var cookieParser = require('cookie-parser');

router.use(cookieParser());
var g_token;
var g_tokenSecret;
var tws = new TwitterStrategy({
    consumerKey: "RRVoDZUDwyWn7vVrNqo02c7HQ",
    consumerSecret: "Wxy758B8OqVkfQbMcbWwyXx5oXcrT0Ibxgg8UT9b4Ok0bkevjP",
    callbackURL: "http://twitterfr.azurewebsites.net/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
     process.nextTick(function () {
      
      // To keep the example simple, the user's Twitter profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the Twitter account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  });
passport.use(tws);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Twitter profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Redirect the user to Twitter for authentication.  When complete, Twitter
// will redirect the user back to the application at
//   /auth/twitter/callback
router.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.use('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/login',
                                     failureRedirect: '/' }));

var api_id = '8bb81d88';
var app_key = 'db8c243ee956d9de1ae8e824f87b6a01';

router.get('/enroll', function(req, res){

    var imgURL = req.query.img;
    var subID = req.query.id;
    var myRequest = request({
      method: 'POST',
      url: 'https://api.kairos.com/enroll',
      headers: {
        'Content-Type': 'application/json',
        'app_id': api_id,
        'app_key': app_key
      },
      body: "{  \"image\": \"" + imgURL + "\", \"subject_id\": \"" + subID + "\", \"gallery_name\": \"gallerytest1\", \"selector\" : \"SETPOSE\", \"symmetricFill\": \"true\"}"

      }, function (error, response, body) {

      if(imgURL == null || subID == null)
      {
        res.render('test', {'message' : 'no input specified'});
      }
      else
      {
        res.render('test', {'message' : body});
      }
    });
});

router.get('/recognize', function(req, res){

    var imgURL = req.query.img;
    var myRequest = request({

      method: 'POST',
      url: 'https://api.kairos.com/recognize',
      headers: {
        'Content-Type': 'application/json',
        'app_id': api_id,
        'app_key': app_key
      },
      body: "{  \"image\": \"" + imgURL + "\", \"threshold\" : \"0.40\", \"gallery_name\" : \"gallerytest1\" }"
      }, function (error, response, body) {

      // body = JSON.parse(body);
      if(imgURL == null)
      {
        res.render('test', {'message' : 'no input specified'});
      }
      else
      {

        // if(body != null)

        // var closestCandidate = body.images[0].candidates[0];

        // res.render('test', {'message' : JSON.stringify(closestCandidate)});
        res.render('test', {'message' : body});
        
      }
    });
});

router.get('/list_all', function(req, res){

    var myRequest = request({

      method: 'POST',
      url: 'https://api.kairos.com/gallery/list_all',
      headers: {
        'Content-Type': 'application/json',
        'app_id': api_id,
        'app_key': app_key
      }}, function (error, response, body) {

      res.render('test', {'message' : body});
    }
    );
});

router.get('/view', function(req, res){

    var gallery_name = req.query.gallery;

    var myRequest = request({

        method: 'POST',
        url: 'https://api.kairos.com/gallery/view',
        headers: {
        'Content-Type': 'application/json',
        'app_id': api_id,
        'app_key': app_key
        },
        body: "{  \"gallery_name\": \"" +  gallery_name  + "\"}"
        }, function (error, response, body) {

        if(gallery_name == null)
        {
            res.render('test', {'message' : "No input specified"});
        }
        else
        {
            res.render('test', {'message' : body});
        }
    });
});

router.get('/delete', function(req, res){

    var subject_id = req.query.id;
    var gallery_name = req.query.gallery;

    var myRequest = request({

        method: 'POST',
        url: 'https://api.kairos.com/gallery/remove_subject',
        headers: {
        'Content-Type': 'application/json',
        'app_id': api_id,
        'app_key': app_key
        },
        body: "{  \"gallery_name\": \"" +  gallery_name  + "\", \"subject_id\": \"" + subject_id + "\"}"
        }, function (error, response, body) {

        if(gallery_name == null || subject_id == null)
        {
            res.render('test', {'message' : "No input specified"});
        }
        else
        {
            res.render('test', {'message' : "Removal successful!"});
        }
    });
});

router.get('/', function(req, res){
  if(req.session.user){
    res.redirect('/login');
  }
  res.render('index');
});

router.get('/login', function(req, res){
  var userData = '@' + JSON.stringify(req.user.username).replace(/^"(.+)"$/,'$1');
  req.session.user = userData;
  
  res.render('login', { user: userData, profile: req.user.photos[0].value.replace('_normal','')});
});

router.get('/logout', function(req, res){
  req.session.user = null;
  req.cookies = null;
  req.logout();
  res.redirect('/');
});

module.exports = router;