var _ = require('underscore');

var StringWriter = require('./StringWriter');

var reporterBasePath = "../../node_modules/vows/lib/vows/reporters/";

function SuiteRunner(suite, options){
  this.suite = suite;
  this.stringWriter = new StringWriter();

  if(options.reporter){
    var reporterPath = reporterBasePath + options.reporter;
    delete require.cache[require.resolve(reporterPath)];
    options.reporter = require(reporterPath);
  }

  _.extend(suite.options, options);
  suite.options.reporter.setStream(this.stringWriter);

  _.bindAll(this);
}

SuiteRunner.prototype = {
  constructor : SuiteRunner,
  run : function(callback){
    var suiteCallback = function(result){
      process.nextTick(function (){
        callback(null, result);
      });
    };
    this.suite.run({}, suiteCallback);
  },
  getOutput : function(){
    return this.stringWriter.toString();
  }
};

module.exports = SuiteRunner;
