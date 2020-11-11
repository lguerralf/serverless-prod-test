"use strict";

const awscred = require("awscred");

let initialized = false;

function loadAsync () {
  console.log('loadAsync');
  return new Promise((resolve, reject) => {
    awscred.load({}, function (err, response) {
      console.log('load async > load , ', { err, response });
      if (err) {
        return reject(err);
      }
      resolve(response);
    });
  });
};

async function init() {
  console.log('init');
  if (initialized) {
    return;
  }
  process.env.restaurants_api =
    "https://zkphouagcc.execute-api.us-east-1.amazonaws.com/dev/restaurants";
  process.env.cognito_user_pool_id = "us-east-1_eMQRILn1F";
  process.env.cognito_client_id = "6sdgdibhj88vb6sioep7ddoj9j";
  process.env.restaurants_table = "restaurants";
  process.env.cognito_server_client_id = '1minrojqrtvm1ngt1ucn3u63i7'

  const response = await loadAsync();

  console.log("init > resposne ", { response });

  const cred = response.credentials;

  process.env.AWS_ACCESS_KEY_ID = cred.accessKeyId;
  process.env.AWS_SECRET_ACCESS_KEY = cred.secretAccessKey;

  console.log("init > credentials set");

  initialized = true;
};

module.exports = {
  init,
};
