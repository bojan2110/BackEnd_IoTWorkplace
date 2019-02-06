// Import express
let express = require('express')
// Initialize the app
let app = express();
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
//import routes
let bluetoothRoutes = require("./routes/bluetooth.route");
let microphoneRoutes = require("./routes/microphone.route");
let messagesRoutes = require("./routes/dashboardmessages.route");
let stepsRoutes = require("./routes/steps.route");
let sitEventRoutes = require("./routes/sittingevent.route");
let sitCycleRoutes = require("./routes/sitcycle.route");
let dashboardBackgroundRoutes = require("./routes/dashboardbackground.route");
let flashCardRoutes = require("./routes/flashcard.route");
mongoose.set('debug', true)
let activityTimeSeriesRoutes=require("./routes/activity_time_series.route");
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use('/backgroundpictures', express.static(__dirname+'/backgroundpictures'));

// Connect to Mongoose and set connection variable
// database name is resthub in this case
mongoose.connect('admin:bombona@mongodb://localhost:27017/resthub', { useNewUrlParser: true });


  var db=mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  db.once('open', function callback () {
  console.log("Start Server node js");
//local: 3005	, remote : 80
  var port = 80;
  //local: 127.0.0.1, remote/VM: 130.37.53.25 or health-iot.labs.vu.nl
  var address='health-iot.labs.vu.nl';
 // Send message for default URL
  app.get('/',function(req,res){
     res.sendFile(__dirname + '/landingpage/index.html');
  });
  // Launch the website
  app.use(express.static(__dirname + '/landingpage'));
 // Use Api routes
  app.use('/api', bluetoothRoutes)
  app.use('/api', microphoneRoutes)
  app.use('/api', messagesRoutes)
  app.use('/api', stepsRoutes)
  app.use('/api', sitEventRoutes)
  app.use('/api', sitCycleRoutes)
  app.use('/api', dashboardBackgroundRoutes)
  app.use('/api', activityTimeSeriesRoutes)
  app.use('/api', flashCardRoutes)

  app.listen(port,address);
  console.log('Server running!!');
});

//////////
