// index.js:wq

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

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


// Connect to Mongoose and set connection variable
// database name is resthub in this case
mongoose.connect('admin:bombona@mongodb://localhost:27017/resthub', { useNewUrlParser: true });


var db=mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("h");
  var port = 3000;
  // Send message for default URL 
  app.get('/', (req, res) => res.send('Hello World with Express and Node and mongo'));
  // Launch app to listen to specified port
  // Use Api routes in the App
  app.use('/api', bluetoothRoutes)
  app.use('/api', microphoneRoutes)
  app.use('/api', messagesRoutes)
  app.use('/api', stepsRoutes)
  app.use('/api', sitEventRoutes)
  app.use('/api', sitCycleRoutes)
  app.listen(port,'130.37.53.25');
  console.log('Server running!!');
});

//////////
