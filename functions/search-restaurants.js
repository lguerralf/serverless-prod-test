'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const defaultResults = 8;
const tableName = process.env.restaurants_table;

async function getRestaurants(count) {

  const req = {
    TableName: tableName,
    Limit: count
  }

  const response = await dynamo.scan(req).promise();

  return response.Items;

}

module.exports.handler = async event => {

  const restaurants = await getRestaurants(defaultResults);
  
  return {
    statusCode: 200,
    body: JSON.stringify(restaurants)
  }
}