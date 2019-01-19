var dashboardBackgroundController = require('../controllers/dashboardbackground.controller');

const multer=require('multer');

let router=require('express').Router();
const mongoose = require("mongoose");
const DashboardBackground = require('../models/dashboardbackground.model');

// BackgroundImages routes
router.route('/backgroundpictures/allrandom').get(dashboardBackgroundController.allrandom);
router.route('/backgroundpictures/categoryrandom/:category').get(dashboardBackgroundController.categoryrandom);
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
const upload=multer({storage:storage,
   limits: {
   fileSize: 1024 * 1024 * 1024
  },
  fileFilter:fileFilter
});



// decouple similar to above when you know how
router.post('/backgroundpictures/post', upload.single('backgroundImage'), (req, res, next) => {

  const dashboardBackground = new DashboardBackground({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    backgroundImage: req.file.path
  });

  dashboardBackground
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created background image successfully",
        backgroundImage: {
            name: result.name,
            _id: result._id,
            request: {
                type: 'GET',
                url: "http://127.0.0.1:3005/api/backgroundpictures/" + result._id
            }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
// Export API routes
module.exports = router;
