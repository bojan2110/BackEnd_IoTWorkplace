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

var cron = require('node-cron');
//*/20 * * * * *
//fitbit calls cron job
cron.schedule('* * */2 * * *', () => {
  //get the fitbit users> maybe this can be changed to be done in 6 hours,
  // instead of every time and saved in a global variable?
  console.log('cron job started')
  let fitbitData = require('./fitbitusers.json');
  for (var i = 0; i < fitbitData.length; i++) {
    var fitbituser = fitbitData[i];
    console.log('fitbituser.username',fitbituser.username);
    console.log('fitbituser.accesstoken',fitbituser.accesstoken);
    console.log('fitbituser.refreshtoken',fitbituser.refreshtoken);
    var today=moment().format("YYYY-MM-DD");
    var apipath="/activities/steps/date/" + today + "/1d.json";
    //call the fitbit api
    client.get(apipath, token)
      .then(async function(results) {
      console.log('ím in async')
      console.log('results',results[0].success)
      //successfully retreived data
      if(results[0].success)
      {
        console.log('Fitbit data obtained')
        var date = results[0]['activities-steps'][0]['dateTime'];
        var data = JSON.stringify(results[0]['activities-steps'][0]['value']);
        var time_stamp = JSON.stringify(results[0]['activities-steps'][0]['dateTime'])
        console.log('number of steps ',data)
      }//access token is expired. refresh token and update the json object
      else{
          refreshAccessToken(fitbituser.accesstoken, fitbituser.refreshtoken)
          .then(result => {

            console.log('refreshAccessToken result', result)})
          .catch(err => {
            console.log('Fitbit refresh token error', err)
            res.status(err.status).send(err);
          });
      }
      }).catch(err => {
      console.log('Fitbit API call error', err)
      });

  }
  // console.log('running a task every minute');
  // var token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMkRIVzciLCJzdWIiOiI3R01SUjgiLCJpc3MiOiJGaXRiaXQiLCJ0eXAiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOiJyYWN0IHJociByc2V0IHJwcm8iLCJleHAiOjE1NjIxODMwMTEsImlhdCI6MTU2MjE1NDIxMX0.RPf-JNq8a8VAtyYmyU4wralTQ-1zHBAvsL7ZVmQzCPk";
  // var datafor='2019-06-13'
  // var apipath="/activities/steps/date/" + datafor + "/1d.json";
  // // console.log('api path',apipath);
  // client.get(apipath, token)
  //   .then(async function(results) {
  //   console.log('ím in async')
  //
  //   console.log('results',results[0].success)
  //   var date = results[0]['activities-steps'][0]['dateTime'];
  //   console.log('date',date)
  //   var data = JSON.stringify(results[0]['activities-steps'][0]['value']);
  //   //var data2 = JSON.stringify(results[0]['activities-steps-intraday']['dataset']);
  //   var time_stamp = JSON.stringify(results[0]['activities-steps'][0]['dateTime'])
  // //  var starttime = JSON.stringify(results[0]['activities-steps'][0]['activities/minutesSedentary']);
  //
  //   console.log('number of steps ',data)
  //
  //
  //   }).catch(err => {
  //   console.log('Fitbit error', err)
  //   });


});

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


  //FITBIT credentials

  const FitbitApiClient = require("fitbit-node");
  const client = new FitbitApiClient({
    clientId: "22DHW7",
    clientSecret: "75130623b587b7a4ac64b7a11f719087",
    apiVersion: '1.2'
  });
    //fitbit get
  app.get("/authorize",(req, res) => {
    console.log('authorize')

    //request access to the user's activity, loc, etc.
    res.redirect(client.getAuthorizeUrl('heartrate activity profile settings', 'https://health-iot.labs.vu.nl/callback'));
  });
  //fitbit callback
  app.get("/callback", (req, res) => {
    console.log('i am in callback')
      // exchange the authorization code we just received for an access token
      client.getAccessToken(req.query.code, 'https://health-iot.labs.vu.nl/callback').then(result => {
      // use the access token to fetch the user's profile information
      console.log('callback result', result)

      let jsonData = require('./fitbitusers.json');
      //jsonData=JSON.stringify(jsonData);
      console.log('jsonData type', typeof jsonData)
      console.log('jsonData length', jsonData.length)

      accesstoken = result.access_token;
      refreshtoken=result.refresh_token;
      var username='testuser'
      let credentials = {
          username: username,
          accesstoken: accesstoken,
          refreshtoken: refreshtoken
      };
      jsonData.push(JSON.stringify(credentials))
      console.log('jsonData after', jsonData)
      fs.writeFileSync('fitbitusers.json', jsonData);


      console.log("i am token", accesstoken)
      client.get("/profile.json", result.access_token).then(results => {
        var username = results[0]['user']['username'];
      res.send(results[0]);
      }).catch(err => {
        console.log('error ', err)
        res.status(err.status).send(err);
      });
    }).catch(err => {
      console.log('error', err)
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

  app.listen('8080','127.0.0.1');
  // app.listen(config.server.port,config.server.host);
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
