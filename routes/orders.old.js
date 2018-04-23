var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Order = require('../models/Order.js');
var distance = require('google-distance');

// distance.get(
//   {
//     // origin: 'San Francisco, CA',
//     // destination: 'San Diego, CA'
//     origin: '100 George Street, Sydney, NSW, AU',
//     destination: '14 Mitchell Street, Wentworth Falls, NSW, AU'
//   },
//   function(err, data) {
//     if (err) return console.log(err);
//     console.log(data);
// });
function getTravelTime(originIn, destinationIn) {
  return new Promise((resolve, reject) => {
    distance.get(
      {
        origin: originIn,
        destination: destinationIn
      },
      function (err, data) {
        if (err) reject(err);
        if (data) resolve(data);
      });
  });
}

/* SAVE ORDER */
router.post('/', function (req, res, next) {
  const currentLocation = req.body.currentLocation;
  const pickUpAddress = req.body.pickUpAddress;
  const deliveryUpAddress = req.body.deliveryUpAddress;

  getTravelTime(currentLocation, pickUpAddress)
    .then((data) => {
      console.log(data);
      req.body.etaPickUpToDelivey = data.duration;
      getTravelTime(pickUpAddress, deliveryUpAddress)
        .then((data) => {
          req.body.etaPickUpToDelivey = data.duration;
          req.body.orderStatus = 'New';
          Order.create(req.body, function (err, order) {
            if (err) return next(err);
            res.json(order);
          });
        });
    })
    .catch((err) => {
      return next(err);
    });
  //  .then((data) => {
  //   Order.create(req.body, function (err, order) {
  //     if (err) return next(err);
  //     res.json(order);
  //   });
  //  });

});

/* GET ALL ORDERS */
router.get('/', function (req, res, next) {
  Order.find(function (err, orders) {
    if (err) return next(err);
    res.json(orders);
  });
});

/* GET SINGLE ORDER BY ID */
router.get('/:id', function (req, res, next) {
  Order.findById(req.params.id, function (err, data) {
    if (err) return next(err);
    if (data) return res.json(data);
    res.json('No data found');
  });
});

/* UPDATE ORDER */
router.put('/:id', function (req, res, next) {
  Order.findByIdAndUpdate(req.params.id, req.body, function (err, data) {
    if (err) return next(err);
    if (data) return res.json(data);
    res.json('No data found');
  });
});

/* DELETE ORDER */
router.delete('/:id', function (req, res, next) {
  Order.findByIdAndRemove(req.params.id, req.body, function (err, data) {
    if (err) return next(err);
    if (data) return res.json(data);
    res.json('No data found');
  });
});

module.exports = router;