'use strict';

const APP_ROOT = '../..';
const _ = require('lodash');
async function we_invoke_get_index() {
  console.log('we_invoke_get_index');
  let handler = require(`${APP_ROOT}/functions/get-index`).handler;
  const response = await handler();

  return response;
}

module.exports = {
  we_invoke_get_index
}