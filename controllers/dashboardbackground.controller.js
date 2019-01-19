DashboardBackground = require('../models/dashboardbackground.model');
const multer=require('multer');
// const upload=multer({dest:'backgroundpictures/'});

const mongoose = require("mongoose");
// var upload = multer({dest:'backgroundpictures/'}).single('backgroundImage')

exports.allrandom = function (req, res) {

  DashboardBackground.find()
      .select("name _id backgroundImage")
      .exec()
      .then(
        function (docs) {
          // use doc
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


// DashboardBackground.find()
//     .select("name _id backgroundImage")
//     .exec()
//     .then(docs => {
//       const response = {
//         count: docs.length,
//         images: docs.map(doc => {
//           return {
//             name: doc.name,
//             backgroundImage: doc.backgroundImage,
//             _id: doc._id,
//             request: {
//               type: "GET",
//               url: "http://127.0.0.1:3005/api/backgroundpictures/" + doc._id
//             }
//           };
//         })
//       };
//       //   if (docs.length >= 0) {
//       res.status(200).json(response);
//       //   } else {
//       //       res.status(404).json({
//       //           message: 'No entries found'
//       //       });
//       //   }
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });




exports.categoryrandom = function (req, res) {

  const id = req.params.category;

    DashboardBackground.find({'category':category})
      .select('name _id backgroundImage')
      .exec()
      .then(
        function (docs) {
          // use doc
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
        res.status(500).json({ error: err });
      });
};

// doc => {
//   console.log("From database", doc);
//   if (doc) {
//     res.status(200).json({
//         image: doc,
//         request: {
//             type: 'GET',
//             url: 'http://127.0.0.1:3005/api/backgroundpictures'
//         }
//     });
//   } else {
//     res
//       .status(404)
//       .json({ message: "No valid entry found for provided ID" });
//   }
// }
