'use strict';

const co = require('co');
const AWS = require('aws-sdk');
const kinesis = new AWS.Kinesis();
const chance = require('chance').Chance();
const streamName = process.env.order_events_stream;


module.exports.handler = co.wrap(function* (event, contenxt, cb) {
  let restaurantName = JSON.parse(event.body).restaurantName;

  let userEmail = event.requestContext.authorizer.claims.email

  let orderId = chance.guid();

  console.log(`placing order id [${orderId}] to [${restaurantName}] from user [${userEmail}]`)


  let data = {
    orderId,
    userEmail,
    restaurantName,
    eventType: 'order_placed'
  };

  let putReq = {
    Data: JSON.stringify(data),
    PartitionKey: orderId,
    StreamName: streamName
  };

  yield kinesis.putRecord(putReq).promise();

  console.log('published order placed event to kinesis');

  let response = {
    statusCode: 200,
    body: JSON.stringify({ orderId }),
  }

  cb(null, response);
});