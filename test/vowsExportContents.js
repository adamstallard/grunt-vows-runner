var assert = require('assert');
var vows = require('vows');

vows.describe('Contents of a vows export')
  .addBatch({
    "Truthiness:" : {
      "'true'" : {
        topic : true,
        "should be true" : function(topic){
          assert(topic, "'true' wasn't true.");
        }
      }
    }
  })
  .export(module);
