FlashCards = require('../models/flashcard.model.js');
Motivation = require('../models/motivation.model.js');
Goal = require('../models/goal.model.js');
Challenge = require('../models/challenge.model.js');

var mongoose = require('mongoose');
// Handle index actions
exports.getFlashcard = function (req, res) {
    //type of messages to be obtained
    var flashcard=parseInt(req.params.flashcard);
    var cardtype = [1, 2, 3, 4];
    console.log(cardtype,flashcard)
      // information
      if (cardtype.includes(flashcard))
      {
          FlashCards.aggregate([{$match:{type: flashcard}},{ $sample: { size: 1 } }], function (err, cardsdata) {
            if (err) {
                res.json({
                    status: "error",
                    message: err,
                });
            }
            // return array (messagesData) is empty
            if (!cardsdata.length) {
                res.json({
                          status: "success",
                          message: "not the right ID for '" + messagetype + "'   message type",
                });
            }

            else{
              console.log(cardsdata)
              res.json({
                  status: "success",
                  flashcard_data: cardsdata
              });
            // }
          }
        });
      }
};

exports.postMotivation = function (req, res) {
    var userMotivation = new Motivation();

    userMotivation.userid = req.body.userid;
    userMotivation.motivation = req.body.motivation;
    userMotivation.date=new Date(req.body.date);

    userMotivation.save(function (err) {
        if (err)
            res.json(err);
        else{
          res.json({
              message: 'New Motivation Entry Created!',
              data: userMotivation
          });
        }
    });
};

exports.postChallenge = function (req, res) {
    var challenge = new Challenge();
    challenge.userid = req.body.userid;
    challenge.challengeid = req.body.challengeid;
    challenge.status = req.body.status;
    challenge.date=new Date(req.body.date).toISOString();

    challenge.save(function (err) {
      if (err)
          res.json(err);
      else{
        res.json({
            message: 'New Challenge Entry Created!',
            data: challenge
        });
      }
    });
};

exports.postGoal = function (req, res) {
    var goal = new Goal();
    goal.userid = req.body.userid;
    goal.goalid = req.body.goalid;
    goal.acceptedgoal = req.body.acceptedgoal;
    goal.recommendedgoal = req.body.recommendedgoal;
    goal.date=new Date(req.body.date).toISOString();

    goal.save(function (err) {
      if (err)
          res.json(err);
      else{
        res.json({
            message: 'New Goal Entry Created!',
            data: goal
        });
      }
    });
};
