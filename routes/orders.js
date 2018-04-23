const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/Order.js');
const distance = require('google-distance');

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
router.post('/', (req, res, next) => {
  const pickUpAddress = req.body.pickUpAddress;
  const deliveryUpAddress = req.body.deliveryUpAddress;

  getTravelTime(pickUpAddress, deliveryUpAddress)
    .then((data) => {
      console.log(data);
      req.body.pickUpToDeliveyTime = data.duration;
      req.body.orderStatus = 'ReadyToPick';
      Order.create(req.body)
      .then((order) => {
        res.json(order);
      });
    })
    .catch((err) => {
      return next(err);
    });
});

/* GET ALL ORDERS */
router.get('/', (req, res, next) => {
  Order.find()
  .then((data) => {
    if (data) {
      res.json(data);
    } else {
      res.json('No data found');
    }
  })
  .catch((err) => {
    return next(err);
  });
});

/* GET SINGLE ORDER BY ID */
router.get('/:id', (req, res, next) => {
  Order.findById(req.params.id)
    .then((data) => {
      if (data) {
        res.json(data);
      } else {
        res.json('No data found');
      }
    })
    .catch((err) => {
      return next(err);
    });
});

/* UPDATE ORDER */
router.put('/:id', (req, res, next) => {
  Order.findByIdAndUpdate(req.params.id, req.body)
  .then((data) => {
    if (data) {
      res.json(data);
    } else {
      res.json('No data found');
    }
  })
  .catch((err) => {
    return next(err);
  });
});

/* DELETE ORDER */
router.delete('/:id', (req, res, next)  => {
  Order.findByIdAndRemove(req.params.id, req.body)
  .then((data) => {
    if (data) {
      res.json(data);
    } else {
      res.json('No data found');
    }
  })
  .catch((err) => {
    return next(err);
  });
});

module.exports = router;