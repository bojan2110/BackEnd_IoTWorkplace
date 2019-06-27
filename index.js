// add timestamps in front of log messages
require('console-stamp')(console, '[HH:MM:ss.l]');
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

//import routes
//commented out for the student project
// let bluetoothRoutes = require("./routes/bluetooth.route");
// let microphoneRoutes = require("./routes/microphone.route");
// let activityRoutes=require("./routes/activity.route");

let messagesRoutes = require("./routes/dashboardmessages.route");
let dashboardBackgroundRoutes = require("./routes/dashboardbackground.route");
let flashCardRoutes = require("./routes/flashcard.route");
let activityTimeSeriesRoutes=require("./routes/activity_time_series.route");
let userRoutes=require("./routes/user.route");
let stepRoutes=require("./routes/step.route");


//for google calendar calls
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
// const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// var OAuth2 = google.auth.OAuth2;
// var Session = require('express-session');
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
// const TOKEN_PATH = 'token.json';

//ENABLING HTTPS CONNECTIONS
// var key=fs.readFileSync('domain.key');
// console.log('key',key);
// var cert=fs.readFileSync('domain.crt');
// console.log('cert',cert);
// var options = {
// key: key,
// cert: cert
// };
//
// var httpServer = http.createServer(app);
// var httpsServer = https.createServer(options, app);



mongoose.set('debug', true)
// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());
app.use('/backgroundpictures', express.static(__dirname+'/backgroundpictures'));

//FITBIT credentials

const FitbitApiClient = require("fitbit-node");
const client = new FitbitApiClient({
  clientId: "22DHW7",
  clientSecret: "75130623b587b7a4ac64b7a11f719087",
  apiVersion: '1.2'
});



// Connect to Mongoose and set connection variable
// database name is resthub in this case
// we use authentication with user,pass. there are other options also available

  //change to production to get production credentials
  var env = 'production';
  var config = require('./config')[env];
  mongoose.connect('mongodb://'+config.database.user+':'+config.database.password+'@'+
  config.database.host+':'+config.database.port+'/'+config.database.db, { useNewUrlParser: true });


  var db=mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error:'));
  //connection is open
  db.once('open', function callback () {
  console.log("Start Server node js");
  //fitbit get
  app.get("/authorize", (req, res) => {
    console.log('I am in authorize')
  // request access to the user's activity, heartrate, location, nutrion, profile, settings, sleep, social, and weight scopes
    res.redirect(client.getAuthorizeUrl('activity heartrate location nutrition \
    profile settings sleep social weight', 'http://health-iot.labs.vu.nl/callback'));
    });
  //fitbit callback
  app.get("/callback", (req, res) => {
    console.log('I am in callback')
    // exchange the authorization code we just received for an access token
    client.getAccessToken(req.query.code, 'http://health-iot.labs.vu.nl/callback').then(result => {
      // use the access token to fetch the user's profile information
      token = result.access_token;
      console.log('Fitbit token', token)

      client.get("/profile.json", result.access_token).then(results => {
        console.log('results')
        res.send(results[0]);
      }).catch(err => {
          console.log('catch 1',err)
        res.status(err.status).send(err);
      });
    }).catch(err => {
        console.log('catch 2',err)
      res.status(err.status).send(err);
    });
  });

 // Send message for default URL
  app.get('/',function(req,res){
     res.sendFile(__dirname + '/landingpage/index.html');
     // var url = getAuthUrl();
     // console.log(url);

  });
  // Launch the website
  app.use(express.static(__dirname + '/landingpage'));
 // Use Api routes
  // app.use('/api', bluetoothRoutes)
  // app.use('/api', microphoneRoutes)
  // app.use('/api', activityRoutes)

  app.use('/api', messagesRoutes)
  app.use('/api', dashboardBackgroundRoutes)
  app.use('/api', activityTimeSeriesRoutes)
  app.use('/api', flashCardRoutes)
  app.use('/api', userRoutes)
  app.use('/api', stepRoutes)

  // app.listen('8080','127.0.0.1');
  app.listen(config.server.port,config.server.host);
  // httpServer.listen(80);
  // httpsServer.listen(433);
  console.log('Server running!!');

  // CODE RELATED TO GOOGLE CALENDAR
  // // Load client secrets from a local file.
  // // fs.readFile('credentials.json', (err, content) => {
  // //   console.log('readFile')
  // //   if (err) return console.log('Error loading client secret file:', err);
  // //   // Authorize a client with credentials, then call the Google Calendar API.
  // //   authorize(JSON.parse(content), listEvents);
  // // });
  //
  // /**
  //  * Create an OAuth2 client with the given credentials, and then execute the
  //  * given callback function.
  //  * @param {Object} credentials The authorization client credentials.
  //  * @param {function} callback The callback to call with the authorized client.
  //  */
  // function authorize(credentials, callback) {
  //   console.log('authorize')
  //   // const {client_secret, client_id, redirect_uris} = credentials.installed;
  //   const oAuth2Client = getOAuthClient();
  //   // Check if we have previously stored a token.
  //   fs.readFile(TOKEN_PATH, (err, token) => {
  //     if (err) return getAccessToken(oAuth2Client, callback);
  //     console.log(token)
  //     oAuth2Client.setCredentials(JSON.parse(token));
  //     callback(oAuth2Client);
  //   });
  // }
  //
  // /**
  //  * Get and store new token after prompting for user authorization, and then
  //  * execute the given callback with the authorized OAuth2 client.
  //  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
  //  * @param {getEventsCallback} callback The callback for the authorized client.
  //  */
  // function getAccessToken(oAuth2Client, callback) {
  //   console.log('getAccessToken')
  //   const authUrl = oAuth2Client.generateAuthUrl({
  //     access_type: 'offline',
  //     scope: SCOPES,
  //   });
  //   console.log('Authorize this app by visiting this url:', authUrl);
  // }
  //
  // /**
  //  * Lists the next 10 events on the user's primary calendar.
  //  * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
  //  */
  // function listEvents(auth) {
  //   console.log('listEvents')
  //   const calendar = google.calendar({version: 'v3', auth});
  //   calendar.events.list({
  //     calendarId: 'primary',
  //     timeMin: (new Date()).toISOString(),
  //     maxResults: 10,
  //     singleEvents: true,
  //     orderBy: 'startTime',
  //   }, (err, res) => {
  //     if (err) return console.log('The API returned an error: ' + err);
  //     const events = res.data.items;
  //     if (events.length) {
  //       console.log('Upcoming 10 events:');
  //       events.map((event, i) => {
  //         const start = event.start.dateTime || event.start.date;
  //         console.log(`${start} - ${event.summary}`);
  //       });
  //     } else {
  //       console.log('No upcoming events found.');
  //     }
  //   });
  // }


}); // db.open ends here


// // //creates an oAuth client
// function getOAuthClient () {
//   console.log('getOAuthClient')
//     //clientid,client secret,redirect uri
//     return new OAuth2("394896214180-1lc9sc7uje9tnd3vf2ueos4fqh263mu5.apps.googleusercontent.com" ,  "5NmGemSAjbNRfhgpmybQR8vH", "http://localhost:3005/redirect");
// }
//
// app.use("/redirect", function (req, res) {
//   console.log('redirect')
//     var session = req.session;
//     var code = req.query.code; // the query param code
//     console.log('session ' + session)
//     console.log('code ' + code)
//     var oAuth2Client = getOAuthClient();
//     // console.log(oAuth2Client)
//     oAuth2Client.getToken(code, (err, token) => {
//       if (err) return console.error('Error retrieving access token', err);
//       oAuth2Client.setCredentials(token);
//       // Store the token to disk for later program executions
//       fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//         if (err) return console.error(err);
//         console.log('Token stored to', TOKEN_PATH);
//       });
//       callback(oAuth2Client);
//     });
//
// });
