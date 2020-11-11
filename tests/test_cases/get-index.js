"use strict";

const init = require("../steps/init").init;
const when = require("../steps/when");
const given = require("../steps/given");
const expect = require("chai").expect;
const tearDown = require('../steps/tearDown');

describe('given an authenticated user', function() { 
  this.timeout(60000);

  let user;
  before(async () => {
    await init();
    user = await given.an_authenticated_user();
  });

  after(async () => { 
    await tearDown.an_authenticated_user(user);
  })

  describe("when we invoke the GET / index", function () {
    
    it("should return 8 restaurants", async () => {
  
      const res = await when.we_invoke_get_index();
     
      console.log(' TEST  => it repsonse ? ', res.headers)
  
      expect(res.statusCode).to.equal(200);
      expect(res.headers["content-type"]).to.equal(
        "text/html; charset=UTF-8"
      );
      expect(res.body).to.not.be.null;
    });
  });
})

