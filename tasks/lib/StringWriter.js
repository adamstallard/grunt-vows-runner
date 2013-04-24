'use strict';

var _ = require('underscore');

function StringWriter(){
  this.String = "";
  _.bindAll(this);
}

StringWriter.prototype = {
  constructor : StringWriter,
  write : function(s){
    this.String += s;
  },
  toString : function(){
    return this.String;
  }
};

module.exports = StringWriter;
