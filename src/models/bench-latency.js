// [Model]  BenchLatency
var $ = require('jquery'),
  co = require('co'),
  Backbone = require('backbone'),
  Bench = require('./benchmark.js');
Backbone.$ = $;
var BENCH_MODEL = 'utils.benchmark_class';
var Notificator = require('../collections/notification');
module.exports = Bench.extend({
  call_bench: function () {
    Notificator.new_notif(this.attributes.title +
      ' benchmarking started..');
    this.save({
      status: 'loading'
    });
    var d = new Date();
    var n = d.getTime();
    var fn = co.wrap(function* (model) {
      for (var i = 100; i > 0; i--) {
        yield model.rpc(model.session, BENCH_MODEL, model.attributes.method);
      }
      return ($.when());
    });
    return fn(this)
      .then(() => {
        d = new Date();
        var res = d.getTime();
        res = (res - n);
        res = res / 100;
        this.save({
          status: 'done',
          iter: '100',
          score: res
        });
      });
  },
});
