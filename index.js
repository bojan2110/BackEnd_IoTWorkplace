// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');
var moment = require('moment');
// var https = require('https');
// // var http = require('http');
// Import express
let express = require('express')
// Initialize the app
let app = express();
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
var cron = require('node-cron');

//import routes
let messagesRoutes = require("./routes/dashboardmessages.route");
let dashboardBackgroundRoutes = require("./routes/dashboardbackground.route");
let userRoutes=require("./routes/user.route");
let goalRoutes=require("./routes/goal.route");
let cycleRoutes=require("./routes/cycle.route");
let idleStateRoutes=require("./routes/idlestate.route");
let workdaysRoutes=require("./routes/workdays.route");

// mongoose.set('debug', true)

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use('/backgroundpictures', express.static(__dirname+'/backgroundpictures'));

// Connect to Mongoose and set connection variable
// database name is resthub in this case
// we use authentication with user,pass. there are other options also available

  //env is set to development OR production | depending of local vs remote server
  var env = 'production';
  var config = require('./config')[env];
  mongoose.connect('mongodb://'+config.database.user+':'+config.database.password+'@'+
  config.database.host+':'+config.database.port+'/'+config.database.db, { useNewUrlParser: true });


  var db=mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  //connection is open
  db.once('open', function callback () {
  console.log("Start Server node js");

 // Send message for default URL
  app.get('/',function(req,res){
     res.sendFile(__dirname + '/landingpage/index.html');
     // var url = getAuthUrl();
     // console.log(url);

  });
  // Launch the website
  app.use(express.static(__dirname + '/landingpage'));
 // Use Api routes
  app.use('/api', messagesRoutes)
  app.use('/api', dashboardBackgroundRoutes)
  app.use('/api', userRoutes)
  app.use('/api', idleStateRoutes)
  app.use('/api', goalRoutes)
  app.use('/api', workdaysRoutes)
  app.use('/api', cycleRoutes)
  
  app.listen('8080','127.0.0.1');
  // app.listen(config.server.port,config.server.host);
  // httpServer.listen(80);
  // httpsServer.listen(433);
  console.log('Server running!!');

}); // db.open ends here
