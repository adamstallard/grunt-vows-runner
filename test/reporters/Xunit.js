'use strict';

var vows = require('vows');
var expect = require('chai').expect;
var xunit = require('../../tasks/lib/reporters/xunit.js');

vows.describe('xunit').addBatch({
  "Splitting Levels:" : {
    "A context name with one level and a dot in it" : {
      topic : function(){
        var params = {
          suite : "foo",
          data : {
            context : "jim.john"
          }
        };
        var names = {};
        xunit.getNames(params, names);
        return names;
      },
      "should replace the dot with a dash in the 'classname'" : function(names){
        expect(names.class).to.equal('foo.jim-john');
      }
    }
  }
}).export(module);
