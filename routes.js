var express = require('express');
var request = require('request');

var router = express.Router();


/*
  var api_id and app_key are undefined for security

*/
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
function first(obj) {
    for (var a in obj) return a;
}
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
        if(body)
        {
          body = JSON.parse(body);
        }
        if(body.images[0].candidates[0])
        {
          // {'message' : "Closest Match: " + JSON.stringify(closestCandidate)}
          var closestCandidate = first(body.images[0].candidates[0]);
          res.redirect('https://www.twitter.com/' + closestCandidate);
        }
        else
        {
        res.render('test', {'message' : "No closest match!"});
        }
        
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
            if(body)
            {
              // parse into JSON
              body = JSON.parse(body);
            }
            res.render('viewgallery', {'message' : body.subject_ids});
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

  res.render('index');
});

router.get('/app', function(req, res){

  res.render('login');
});

module.exports = router;