'use strict';

var assert = require('assert');
var vows = require('vows');
var SuiteRunner = require('../tasks/lib/SuiteRunner');

vows.describe('options').addBatch({
  "Task- and target-level options" : {
    "\n\tA suite in a SuiteRunner" : {
      topic : function(){
        var suite = vows.describe('suite');
        suite.options.foo = 'bar';

        var taskAndTargetOptions = {
          foo : "baz",
          barq : "qux"
        };

        return new SuiteRunner(suite, taskAndTargetOptions);
      },
      "should inherit options that are missing on the suite-level" : function(topic){
        assert(topic.suite.options.barq === 'qux', "missing option wasn't inherited");
      },
      "should not inherit options that already exist on the suite-level" : function(topic){
        assert(topic.suite.options.foo !== 'baz', "suite option was over-written");
      }
    }
  }
}).export(module);
