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
      // defer the finish command until all the suites in the task are done, so we can output the totals
      if (data[0] === 'finish') {
        this.stringWriter.write(' \n');
      }
      else {
        this.reporter.report(data, filename);
      }
    }.bind(this)
  };

  _.bindAll(this);
}

SuiteRunner.prototype = {
  constructor : SuiteRunner,

  run : function(callback){
    var suiteCallback = function(results){
      process.nextTick(function(){
        results = this.checkAsync() || results;
        callback(null, results, this.getOutput());
      }.bind(this));
    }.bind(this);
    this.suite.run({}, suiteCallback);
  },

  getOutput : function(){
    return this.stringWriter.toString();
  },

  reportTotals : function(totals){
    this.reporter.report(['finish', totals], this.stringWriter);
  },

  checkAsync : function(){
    var totals = { honored : 0, broken : 0, errored : 0, pending : 0, total : 0 };
    var s = this.suite;
    var sw = this.stringWriter;
    var failure;

    if ((s.results.total > 0) && (s.results.time === null)) {
      sw.write('\n\n');
      s.reporter.report(['error', { error : "Asynchronous Error", suite : s }]);
    }
    s.batches.forEach(function(b){
      var unFired = [];

      b.vows.forEach(function(vow){
        if (!vow.status) {
          if (unFired.indexOf(vow.context) === -1) {
            unFired.push(vow.context);
          }
        }
      });

      if (unFired.length > 0) {
        sw.write('\n');
      }

      unFired.forEach(function(title){
        s.reporter.report([
          'error', {
            error : "callback not fired",
            context : title,
            batch : b,
            suite : s
          }
        ]);
      });

      if (b.status === 'begin') {
        failure = true;
        totals.errored++;
        totals.total++;
      }
      Object.keys(totals).forEach(function(k){ totals[k] += b[k] });
    });

    if (failure) {
      return totals;
    }
  }

};

module.exports = SuiteRunner;
