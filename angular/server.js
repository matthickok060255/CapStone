var express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
var Pusher = require('pusher');
const crypto = require("crypto");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// to serve our JavaScript, CSS and index.html
app.use(express.static('./dist/'));

app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

var pusher = new Pusher({
  app_id: "1226419",
  key: "cd3b623ce769e9f6154f",
  secret: "bf324145e5e6e3c04145",
  cluster: "us2",
  useTLS: true
});

app.post('/pusher/auth', function (req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var presenceData = {
    user_id: crypto.randomBytes(16).toString("hex")
  };
  var auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var port = process.env.PORT || 3000;
app.listen(port, () => console.log('Listening at http://localhost:' + port));
