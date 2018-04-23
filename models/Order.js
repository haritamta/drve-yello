const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderNumber: Number,
  pickUpAddress: String,
  deliveryUpAddress: String,
  pickUpToDeliveyTime: String,
  orderStatus: String,
  orderType: String,
  driverFirstName: String,
  driverLastName: String,
  receivingConatctFirstName: String,
  receivingConatctLastName: String,
  receivingConatctPhoneNumber: Number,
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
