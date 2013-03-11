var express = require('express');
var s3 = require('./server/s3');

var app = express();

app.use(express.logger('dev'));
app.use(express.bodyParser());

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

app.post('/upload', function(req, res) {
  var file = req.files.file;
  if (file) return res.send(200);
  res.send(400);
});

app.get('/signurl', function(req, res) {
  var options = {
    filename: req.query.filename,
    contentType: req.query.contenttype,
    objectName: 'impact/' + req.query.filename
  };
  var url = s3.signURL(options);
  res.send(200, url);
});

app.post('/failure', function(req, res) {
  res.send(500, 'something blew up');
});

app.use(express.static(__dirname));
app.use(express.static(__dirname + '/..'));

app.listen(4000);
console.log('listening on port 4000');