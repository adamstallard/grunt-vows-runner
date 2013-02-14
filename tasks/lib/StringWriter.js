function StringWriter(){
  this.String = "";
};

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
