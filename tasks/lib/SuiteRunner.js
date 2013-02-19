var _ = require('grunt').util._;

var StringWriter = require('./StringWriter');

var reporterBasePath = "vows/lib/vows/reporters/";

function SuiteRunner(suite, options){
  this.suite = suite;
  this.stringWriter = new StringWriter();

  options = options || {};

  var defaultOptions = {
    reporter : "dot-matrix"
  };

  _.defaults(options, defaultOptions);
  _.defaults(suite.options, options);
  // special case: options.error : false set on the task/target overrides options.error : true on the suite
  if (options.error === false) {
    suite.options.error = false;
  }

  var reporterPath = reporterBasePath + suite.options.reporter;

  delete require.cache[require.resolve(reporterPath)];
  this.reporter = require(reporterPath);

  this.reporter.setStream(this.stringWriter);

  suite.options.reporter = {
    report : function(data, filename){
      // defer the finish command until all the suites in the task are done, so we can output the grand totals
      if (data[0] === 'finish') {
        this.stringWriter.write(' \n');
      }
      else
      {
        this.reporter.report(data, filename);
      }
    }.bind(this)
  };

  _.bindAll(this);
}

SuiteRunner.prototype = {
  constructor : SuiteRunner,
  run : function(callback){
    var suiteCallback = function(result){
      process.nextTick(function(){
        callback(null, result, this.getOutput());
      }.bind(this));
    }.bind(this);
    this.suite.run({}, suiteCallback);
  },
  getOutput : function(){
    return this.stringWriter.toString();
  },
  reportTotals : function(totals){
    this.reporter.report(['finish', totals], this.stringWriter);
  }
};

module.exports = SuiteRunner;
