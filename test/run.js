var runner = require('../tasks/lib/vows-runner');

runner.run(['test/input/true.js']);

process.nextTick(function(){
  console.log('hi!');
})
