'use strict';

var assert = require('assert');
var vows = require('vows');
var SuiteRunner = require('../tasks/lib/SuiteRunner');

vows.describe('SuiteRunner').addBatch({
  "A new SuiteRunner" : {
    topic : new SuiteRunner(vows.describe('suite2')),
    "should be a SuiteRunner" : function(topic){
      assert(topic instanceof SuiteRunner, "topic was not a SuiteRunner");
    }
  }
}).export(module);
