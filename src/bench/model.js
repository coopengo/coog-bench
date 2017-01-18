var _ = require('underscore');
var Backbone = require('backbone');
var api = require('./api');
//
var Bench = Backbone.Model.extend({
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
    return api.execute(this.session, this.get('method'))
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
//
var CustomBench = Bench.extend({
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
      return api.execute(this.session, this.get('method'), true)
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
module.exports = Backbone.Collection.extend({
  model: Bench,
  initialize: function (attrs, options) {
    this.session = options.session;
    this.benchRunning = false;
  },
  getModulesDisabled: function () {
    return this.where({
      enable: false
    });
  },
  getModulesEnabled: function () {
    return this.where({
      enable: true
    });
  },
  getModulesUsingDB: function () {
    return this.where({
      useDB: true,
      enable: true
    });
  },
  initBenchs: function () {
    var newBench = (desc) => {
      var cls = desc[1].server_side ? Bench : CustomBench;
      var bench = new cls({
        title: desc[1].name,
        method: desc[0],
        useDB: desc[1].requires_setup
      }, {
        'session': this.session
      });
      this.add(bench);
    };
    api.list(this.session)
      .then((ret) => {
        ret.methods.forEach(newBench);
      });
  },
  preBench: function () {
    var benchLst = this.getModulesEnabled();
    if (!benchLst) {
      console.log('Nothing to bench');
      return Promise.resolve;
    }
    if (!this.session) {
      console.log('Invalid session');
      return Promise.resolve;
    }
    if (this.benchRunning) {
      console.log('Bench already started');
      return Promise.resolve;
    }
    this.benchRunning = true;
    this.startBench(benchLst)
      .then(() => {
        this.benchRunning = false;
      }, (err) => {
        console.log('bench failed');
        if (err) {
          console.log(err);
        }
      });
  },
  handleError: function (err) {
    if (!err) {
      return Promise.reject();
    }
    if (err[0] == '403: Forbidden') {
      console.log('Timedout');
      this.trigger('timedout');
    }
    else if (err[0].startsWith('Benchmark table already ')) {
      // non bloking exception
      return;
    }
    console.log('bench KO', err);
    return Promise.reject();
  },
  startBench: function (benchLst) {
    var prm = Promise.resolve();
    var setupDB = false;
    // check if database must be prepared
    if (this.getModulesUsingDB()
      .length) {
      setupDB = true;
      prm = api.setup(this.session)
        .then(null, this.handleError);
    }
    // start benching
    prm = _.reduce(benchLst, (memo, bench) => {
      bench.reset();
      return memo.then(
        () => {
          return bench.callBench()
            .then(null, this.handleError);
        }, this.handleError);
    }, prm);
    // clean database if prepared
    if (setupDB) {
      prm = prm.then(
        () => {
          return api.teardown(this.session);
        }, () => {
          return Promise.reject();
        });
    }
    return prm;
  },
});