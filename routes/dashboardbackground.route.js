var dashboardBackgroundController = require('../controllers/dashboardbackground.controller');

const multer=require('multer');

let router=require('express').Router();
const mongoose = require("mongoose");
const DashboardBackground = require('../models/dashboardbackground.model');

// BackgroundImages routes
router.route('/backgroundpictures/allrandom').get(dashboardBackgroundController.allrandom);
router.route('/backgroundpictures/uploadpic').post(dashboardBackgroundController.uploadpic);
// router.route('/backgroundpictures/categoryrandom/:category').get(dashboardBackgroundController.categoryrandom);
// router.route('/background/post').post([dashboardBackgroundController.uploadimage,dashboardBackgroundController.newdashboardbackground]);

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './backgroundpictures/');
  },
  filename: function(req, file, cb) {
    cb(null,  file.originalname);
  }
});

//accept specific file types
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Only jpeg and png supported.'), false);
  }
};

//max 2GB files - change if necessary
const upload=multer({storage:storage,limits: {fileSize: 1024 * 1024 * 1024},fileFilter:fileFilter});

// Export API routes
module.exports = router;
