var util = require('util');

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
