var _ = require('underscore');

var StringWriter = require('./StringWriter');

var reporterBasePath = "../../node_modules/vows/lib/vows/reporters/";

function SuiteRunner(suite, options){
  this.suite = suite;
  this.stringWriter = new StringWriter();

  options = options || {};

  var defaultOptions = {
    reporter : "dot-matrix"
  };

  _.defaults(options, defaultOptions);

  if(!suite.options.reporter){
    var reporterPath = reporterBasePath + options.reporter;
    delete require.cache[require.resolve(reporterPath)];
    options.reporter = require(reporterPath);
  }

  _.defaults(suite.options, options);

  suite.options.reporter.setStream(this.stringWriter);

  _.bindAll(this);
}

SuiteRunner.prototype = {
  constructor : SuiteRunner,
  run : function(callback){
    var suiteCallback = function(result){
      process.nextTick(function (){
        callback(null, result, this.getOutput());
      }.bind(this));
    }.bind(this);
    this.suite.run({}, suiteCallback);
  },
  getOutput : function(){
    return this.stringWriter.toString();
  }
};

module.exports = SuiteRunner;
