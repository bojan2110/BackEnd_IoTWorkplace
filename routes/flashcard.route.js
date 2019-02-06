let router =require('express').Router();
var flashCardController = require('../controllers/flashcard.controller');

router.route('/flashcard/:flashcard').get(flashCardController.getFlashcard);
router.route('/motivation/post').post(flashCardController.postMotivation);
router.route('/challenge/post').post(flashCardController.postChallenge);
router.route('/goal/post').post(flashCardController.postGoal);

module.exports = router;
