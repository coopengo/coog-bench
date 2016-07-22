// [Collection] BenchList

var $           = require('jquery'),
  Backbone      = require('backbone'),
  Bench         = require('../models/benchmark');
Backbone.$ = $;
require('backbone.localstorage');

var BENCH_MODEL = 'utils.benchmark_class';
var Notificator = require('./notification');

module.exports = Backbone.Collection.extend({
  model: Bench,
  localStorage: new Backbone.LocalStorage('benchs-backbone'),

  initialize: function(session) {
    this.session = session;
  },

  enable: function() {
    return this.where({enable: true});
  },

  use_db: function() {
    return this.where({use_db: true, enable: true});
  },

  next_order: function() {
    if (!this.length) {return 1;}
    return this.last().get('order') + 1;
  },

  start_bench: function() {
    var prm = $.when();
    var setup_db = false;
    // get enable benchs
    var to_bench = this.enable();
    if (!to_bench.length || !this.session){ return prm; }
    // check if database must be prepared
    if (this.use_db().length){
      setup_db = true;
    }
    // prepare database
    if (setup_db){
      prm = this.session.rpc('model.' + BENCH_MODEL + '.' + '_benchmark_setup', [], {})
      .then(() => Notificator.new_notif('Database prepared', 'warning', 2));
    }
    // call benchs
    to_bench.forEach((bench) => {
      prm = prm.then(() => bench.call_bench());
    });
    // if database prepared
    // clean database
    if (setup_db){
      prm = prm.then(() => {
        this.session.rpc('model.' + BENCH_MODEL + '.' + '_benchmark_teardown', [], {})
        .then(() => Notificator.new_notif('Database cleaned up', 'warning', 2));
      });
    }
    return prm;
  },

  clean_db: function() {
    return this.session.rpc('model.' + BENCH_MODEL + '.' + '_benchmark_teardown', [], {})
    .then(() => Notificator.new_notif('Database cleaned up'));
  },

  comparator: 'order'
});