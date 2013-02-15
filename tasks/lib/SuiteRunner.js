var _ = require('underscore');

var StringWriter = require('./StringWriter');

var reporterPaths = {
  spec : "../../node_modules/vows/lib/vows/reporters/spec"
}

function SuiteRunner(suite, options){
  this.suite = suite;
  this.stringWriter = new StringWriter();

  if(options.reporter){
    var reporterPath = reporterPaths[options.reporter];
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

  }
}

module.exports = SuiteRunner;
