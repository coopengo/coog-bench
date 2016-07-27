// [Collection] BenchList
var $ = require('jquery'),
  Backbone = require('backbone'),
  Bench = require('../models/benchmark');
Backbone.$ = $;
require('backbone.localstorage');
var BENCH_MODEL = 'utils.benchmark_class';
var Notificator = require('./notification');
module.exports = Backbone.Collection.extend({
  model: Bench,
  localStorage: new Backbone.LocalStorage('benchs-backbone'),
  set_session: function (session) {
    this.session = session;
  },
  enable: function () {
    return this.where({
      enable: true
    });
  },
  use_db: function () {
    return this.where({
      use_db: true,
      enable: true
    });
  },
  next_order: function () {
    if (!this.length) {
      return 1;
    }
    return this.last()
      .get('order') + 1;
  },
  start_bench: function () {
    var prm = $.when();
    var setup_db = false;
    var to_bench = this.enable();
    if (!to_bench.length) {
      Notificator.new_notif('Nothing to bench', 'warning');
      return prm;
    }
    if (!this.session) {
      Notificator.new_notif('Invalid session', 'error', 8);
      return prm;
    }
    // check if database must be prepared
    if (this.use_db()
      .length) {
      setup_db = true;
    }
    // prepare database
    if (setup_db) {
      prm = this.session.rpc('model.' + BENCH_MODEL + '.' +
          '_benchmark_setup', [], {})
        .then(
          () => Notificator.new_notif('Database prepared', 'warning', 2),
          (err) => {
            console.log(err);
            Notificator.new_notif('Database already prepared', 'warning',
              2);
          });
    }
    // call benchs
    to_bench.forEach((bench) => {
      prm = prm.then(
        () => bench.call_bench(), (err) => {
          console.log(err);
          Notificator.new_notif('Error while benchmarking', 'error',
            6);
        });
    });
    // clean database if prepared
    if (setup_db) {
      prm = prm.then(() => {
        this.session.rpc('model.' + BENCH_MODEL + '.' +
            '_benchmark_teardown', [], {})
          .then(
            () => Notificator.new_notif('Database cleaned up',
              'warning', 2), (err) => {
              console.log(err);
              Notificator.new_notif('Can\'t close database', 'error',
                6);
            });
      });
    }
    return prm;
  },
  clean_db: function () {
    return this.session.rpc('model.' + BENCH_MODEL + '.' +
        '_benchmark_teardown', [], {})
      .then(
        () => Notificator.new_notif('Database cleaned up'), (err) => {
          console.log(err);
          Notificator.new_notif('Can\'t close database', 'error', 6);
        });
  },
  comparator: 'order'
});
