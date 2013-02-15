var util = require('util');

var async = require('async');
var _ = require('underscore');

var cutils = require('../../node_modules/vows/lib/vows/console');
var stylize = require('../../node_modules/vows/lib/vows/console').stylize;

var SuiteRunner = require('./SuiteRunner');

//var _reporter = require('../../node_modules/vows/lib/vows/reporters/spec');



//var reporter = {
//  name: _reporter.name
//};

var options = {
  isolate: false,
  nocolor: false
};

//var suiteOptions = {
//  reporter: reporter,
//  matcher: /.*/,
//  error: true
//}

cutils.nocolor = options.nocolor;

function run(files, options, done){
  var file, suite;
  var suites = [];

  for (i in files){
    file = require('../../' + files[i]);
    //console.dir(file);
    _.forEach(file, function(suite){
      suite._filename = files[i];
      var runner = new SuiteRunner(suite, options);
      suites.push(runner.run);
    });
  }

  async.parallel(suites, done);

//    var reporter = .report = function (data, filename) {
//      switch (data[0]) {
//        case 'subject':
//        case 'vow':
//        case 'context':
//        case 'error':
//          _reporter.report(data, filename);
//          break;
//        case 'end':
//          (options.verbose || _reporter.name === 'json') &&
//          _reporter.report(data);
//          break;
//        case 'finish':
//          options.verbose ?
//            _reporter.print('\n')
//            :
//            _reporter.print(' ');
//          break;
//      }
//    };
//    reporter.reset = function () { _reporter.reset && _reporter.reset() };
//    reporter.print = _reporter.print;
//    suite.run()

//  runSuites(suites, function (results) {
//    var status = results.errored ? 2 : (results.broken ? 1 : 0);
//
//    !options.verbose && _reporter.print('\n');
//
//    _reporter.report(['finish', results], {
//      write: function (str) {
//        util.print(str.replace(/^\n\n/, '\n'));
//      }
//    });
//    done();
//  });
}

function runSuite(suite, callback) {
  var results = {
    honored: 0,
    broken:  0,
    errored: 0,
    pending: 0,
    total:   0,
    time:    0
  };
  reporter.reset();

  (function run(suites, callback) {
    var suite = suites.shift();
    if (suite) {
      suite.run(options, function (result) {
        Object.keys(result).forEach(function (k) {
          results[k] += result[k];
        });
        run(suites, callback);
      });
    } else {
      callback(results);
    }
  })(suites, callback);
}

function checkStatus(){
  var results = { honored: 0, broken: 0, errored: 0, pending: 0, total: 0 },
    failure;

  suites.forEach(function (s) {
    if ((s.results.total > 0) && (s.results.time === null)) {
      s.reporter.print('\n\n');
      s.reporter.report(['error', { error: "Asynchronous Error", suite: s }]);
    }
    s.batches.forEach(function (b) {
      var unFired = [];

      b.vows.forEach(function (vow) {
        if (! vow.status) {
          if (unFired.indexOf(vow.context) === -1) {
            unFired.push(vow.context);
          }
        }
      });

      if (unFired.length > 0) { util.print('\n') }

      unFired.forEach(function (title) {
        s.reporter.report(['error', {
          error: "callback not fired",
          context: title,
          batch: b,
          suite: s
        }]);
      });

      if (b.status === 'begin') {
        failure = true;
        results.errored ++;
        results.total ++;
      }
      Object.keys(results).forEach(function (k) { results[k] += b[k] });
    });
  });
  if (failure) {
    util.puts(console.result(results));
  }
}

module.exports = {run : run};