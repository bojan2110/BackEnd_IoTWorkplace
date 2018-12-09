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
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());


// Connect to Mongoose and set connection variable
// database name is resthub in this case
mongoose.connect('mongodb://localhost/resthub');


var db=mongoose.connection;
//////////
var port = process.env.PORT || 8080;
// Send message for default URL
app.get('/', (req, res) => res.send('Hello World with Express and Node and mongo'));
// Launch app to listen to specified port
// Use Api routes in the App
app.use('/api', bluetoothRoutes)
app.use('/api', microphoneRoutes)
app.listen(3000,'130.37.53.25');
console.log('Server running!!');
