var Backbone = require('backbone');
var _ = require('underscore');
var model = require('./model.js');
var api = require('../api.js');
//
module.exports = Backbone.Collection.extend({
  model: model.bench,
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
      var cls = desc[1].server_side ? model.bench : model.custom;
      var bench = new cls({
        title: desc[1].name,
        method: desc[0],
        useDB: desc[1].requires_setup
      }, {
        'session': this.session
      });
      this.add(bench);
    };
    api.bench.getAll(this.session)
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
      prm = api.db.prepare(this.session)
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
          return api.db.cleanup(this.session);
        }, () => {
          return Promise.reject();
        });
    }
    return prm;
  },
});
