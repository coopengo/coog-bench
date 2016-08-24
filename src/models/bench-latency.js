var co = require('co');
var BenchModel = require('./benchmark.js');
var Notificator = require('../collections/notification');
//
var BENCH_MODEL = 'utils.benchmark_class';
//
module.exports = BenchModel.extend({
  call_bench: function () {
    Notificator.new_notif(this.attributes.title +
      ' benchmarking started..');
    this.set('status', 'working');
    var iter = 100;
    var times = [];
    var fn = co.wrap(function* (model) {
      var throw_error = function (err) {
        model.set('status', 'prepared');
        return Promise.reject(err);
      };
      var start, end;
      for (var i = iter; i > 0; i--) {
        start = (new Date())
          .getTime();
        yield model.rpc(model.session, BENCH_MODEL, model.attributes.method)
          .then(() => {}, throw_error);
        end = (new Date())
          .getTime();
        times.push(((end - start) / 1000));
      }
    });
    return fn(this)
      .then(() => {
        times.sort();
        var min = times.shift();
        var max = times.pop();
        var avg = times.reduce((a, b) => a + b) / times.length;
        this.set({
          status: 'done',
          iter: iter,
          avg: avg.toFixed(5),
          min: min.toFixed(5),
          max: max.toFixed(5)
        });
      });
  }
});
