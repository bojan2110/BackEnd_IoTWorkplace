DashboardBackground = require('../models/dashboardbackground.model');
const multer=require('multer');
const mongoose = require("mongoose");
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

var upload = multer({dest:'backgroundpictures/',storage:storage,limits: {fileSize: 1024 * 1024 * 1024},fileFilter:fileFilter}).single('backgroundImage')

exports.allrandom = function (req, res) {

  DashboardBackground.find()
      .select("name _id backgroundImage")
      .exec()
      .then(
        function (docs) {
          // use doc
          console.log('DashboardBackground',docs)
          var doc = docs[Math.floor(Math.random() * docs.length)];
          res.json({
                        name: doc.name,
                        filePath: doc.backgroundImage,
                        _id: doc._id
          });
        }
      )
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};

exports.getbackground = function (req, res) {

  DashboardBackground.find()
      .select("name _id backgroundImage")
      .exec()
      .then(
        function (docs) {
          // use doc
          console.log('DashboardBackground',docs,req.params.name)
          var doc = docs.filter(function(item) { return item.name === req.params.name });
          console.log('DashboardBackground doc',doc)

          res.json({
                        name: doc.name,
                        filePath: doc.backgroundImage,
                        _id: doc._id
          });
        }
      )
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};


exports.uploadpic = function (req, res) {
    upload(req,res,function(err){
        if(err)
        {
          return res.end("Error uploading");
        }
        //file is uploaded
        const dashboardBackground = new DashboardBackground({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          backgroundImage: req.file.path,
          category: req.body.category
        });

        dashboardBackground.save().
        then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created background image successfully",
            backgroundImage: {
                name: result.name,
                _id: result._id,
                category:result.category
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
};


// exports.categoryrandom = function (req, res) {
//
//   const id = req.params.category;
//
//     DashboardBackground.find({'category':category})
//       .select('name _id backgroundImage')
//       .exec()
//       .then(
//         function (docs) {
//           // use doc
//           var doc = docs[Math.floor(Math.random() * docs.length)];
//           res.json({
//                         name: doc.name,
//                         filePath: doc.backgroundImage,
//                         _id: doc._id
//           });
//         }
//
//       )
//       .catch(err => {
//         console.log(err);
//         res.status(500).json({ error: err });
//       });
// };
