'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const defaultResults = 8;
const tableName = process.env.restaurants_table;

async function findRestaurantsByTheme(theme, count) {

  const req = {
    TableName: tableName,
    Limit: count,
    FilterExpression: "contains(theme, :theme)",
    ExpressionAttributeValues: { ":theme": theme }
  }

  const response = await dynamo.scan(req).promise();

  return response.Items;

}

module.exports.handler = async (event) => {
  console.log('enterd get restaurans > handler', { event });
  const req = JSON.parse(event.body || '{}');
  const theme = req.theme || 'cartoon';
  const restaurants = await findRestaurantsByTheme(theme, defaultResults);

  return {
    statusCode: 200,
    body: JSON.stringify({
      restaurants
    })
  }
}