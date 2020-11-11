'use strict';

const fs = require('fs');
const axios = require('axios');
const { to } = require('await-to-js');
const Mustache = require('mustache');
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const log = (text, value = '') => {
  console.log(`${text}`, value);
}

const ordersApiRoot = process.env.orders_api;
const restaurantsApiROot = process.env.restaurants_api;

let html = null;

const aws4 = require('aws4');
const URL = require('url');

const awsRegion = process.env.AWS_REGION;
const cognitoUserPoolId = process.env.cognito_user_pool_id;
const cognitoClientId = process.env.cognito_client_id;


function readFileAsync() {
  console.log('entered readFileAsync');
  return new Promise((resolve, reject) => {
    fs.readFile('static/index.html', 'utf-8', (err, data) => {
      if (err) {
        return reject(err);
      }

      return resolve(data);
    })
  });
}

async function loadHTML() {
  log('entered load template')
  if (html) {
    return html;
  }

  html = await readFileAsync();

  return html;
}

async function getRestaurants() {
  console.log('entered getRestaurants');
  

  let url = URL.parse(restaurantsApiROot);
  let options = {
    host: url.hostname,
    path: url.pathname,
  }

  aws4.sign(options);

  const headers = {
    'Host': options.headers['Host'],
    'X-Amz-Date': options.headers['X-Amz-Date'],
    'Authorization': options.headers['Authorization'],
  }


  if (options.headers['X-Amz-Security-Token']) {
    headers['X-Amz-Security-Token'] = options.headers['X-Amz-Security-Token'];
  }

  const request = {
    method: 'get',
    url: restaurantsApiROot,
    headers
  }

  console.log(' getRestaurants > request', { request });

  const [err, response] = await to(axios.default(request));
  log('getRestaurants > err, response ', { err, data: response });
  if (err) {
    throw err;
  }

  let restaurants = [];
  // const { restaurants } = response.data

  // console.log('getRestaurants > restaurants', { restaurants })

  return  restaurants;
}


module.exports.handler = async event => {
  log('getindex > handler');
  const template = await loadHTML();
  const restaurants = await getRestaurants();
  log('getindex > handler> restaurants ', { restaurants });

  const dayOfWeek = days[new Date().getDay()];

  const view = {
    dayOfWeek,
    restaurants,
    awsRegion,
    cognitoUserPoolId,
    cognitoClientId,
    searchUrl: `${restaurantsApiROot}/search`,
    placeOrderUrl: ordersApiRoot
  };

  log('getindex > handler> view ', { view });

  const html = Mustache.render(template, view);

  const response =  {
    statusCode: 200,
    body: html,
    headers: {
      'content-type': 'text/html; charset=UTF-8'
    }
  };

  log('getindex > handler> response ', { response });

  return response;
};
