var Backbone = require('backbone');
var api = require('../api.js');
//
var bench = Backbone.Model.extend({
  defaults: function () {
    return {
      title: 'no title',
      method: 'no method',
      enable: true,
      useDB: true,
    };
  },
  initialize: function (attributes, options) {
    this.reset();
    this.session = options.session;
  },
  reset: function () {
    this.set({
      status: 'prepared',
      score: '- -',
      iter: '-',
      avg: '--',
      min: '--',
      max: '--'
    });
  },
  toggle: function () {
    if (this.collection.benchRunning) {
      console.log('bench is running');
    }
    else {
      this.set({
        enable: !this.get('enable')
      });
    }
  },
  enable: function (val) {
    if (this.collection.benchRunning) {
      console.log('bench is running');
    }
    else {
      this.set('enable', val);
    }
  },
  callBench: function () {
    this.set('status', 'working');
    return api.bench.call(this.session, this.get('method'))
      .then(
        (ret) => {
          if (ret) {
            this.set(ret);
            this.set('status', 'done');
          }
        }, (err) => {
          this.set('status', 'prepared');
          return Promise.reject(err);
        });
  },
});
exports.bench = bench;
//
var custom = bench.extend({
  callBench: function () {
    var prm = Promise.resolve();
    var iter = 100;
    var times = [];
    var start, end;
    this.set('status', 'working');
    var throwError = function (err) {
      this.set('status', 'prepared');
      return Promise.reject(err);
    };
    var newCall = () => {
      start = (new Date())
        .getTime();
      return api.bench.call(this.session, this.get('method'), true)
        .then(() => {
          end = (new Date())
            .getTime();
          times.push(((end - start) / 1000));
        }, throwError);
    };
    for (var i = iter; i > 0; i--) {
      prm = prm.then(newCall);
    }
    return prm.then(() => {
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
exports.custom = custom;
