var $           = require('jquery'),
  template   = require('./index.tpl'),
  co            = require('co'),
  Session       = require('tryton-session'),
  BenchView     = require('./views/benchmark/benchmark.js'),
  BenchSelector = require('./views/benchmark-selector/benchmark-selector.js'),
  BenchLatency  = require('./models/bench-latency.js'),
  BenchList     = require('./collections/benchmark.js'),
  Backbone      = require('backbone');
var Notificator = require('./collections/notification');
Backbone.$ = $;
require('backbone.localstorage');

var TRYTON_SERVER = 'http://localhost:7999';
var TRYTON_DATABASE = '4.0';
var TRYTON_LOGIN = 'admin';
var TRYTON_PASSWORD = 'admin';

var AppView = Backbone.View.extend({
  el: $('body'),
  template: template,

  // add button click
  events:{
    'click #start_btn': 'start_benchmark',
    'click #clean_collect_btn': 'clean_collection',
    'click #clean_btn': 'clean_db'
  },

  initialize: function(session) {
    this.session = session;
    this.Benchs = new BenchList(session);
    this.initial_render();
    this.bench_running = false;

    this.listenTo(this.Benchs, 'add', this.add_one);
    this.Benchs.fetch()
    .then(() => this.clean_collection())
    .then(() => this.inti_benchs());
  },

  initial_render: function() {
    this.$el.html(this.template);
  },

  add_one: function(bench) {
    var view_bench = new BenchView({model: bench});
    var view_select = new BenchSelector({model: bench});
    this.$('#bench-container').append(view_bench.render().el);
    this.$('#benchmarks-selector').append(view_select.render().el);
  },

  inti_benchs: function() {
    // create and save a custom Model inheriting from Benchmark model
    var latency = new BenchLatency({
      title: 'Latency',
      order: this.Benchs.next_order(),
      method: '_benchmark_latency',
      use_db: false,
      custom: true
    });
    latency.set_session(this.session);
    this.Benchs.add(latency);
    latency.save();

    this.Benchs.create({
      title: 'CPU',
      order: this.Benchs.next_order(),
      method: '_benchmark_cpu',
      use_db: false
    }).set_session(this.session);

    this.Benchs.create({
      title: 'Memory',
      order: this.Benchs.next_order(),
      method: '_benchmark_memory',
      use_db: false
    }).set_session(this.session);

    this.Benchs.create({
      title: 'Read',
      order: this.Benchs.next_order(),
      method: '_benchmark_db_read'
    }).set_session(this.session);

    this.Benchs.create({
      title: 'Write',
      order: this.Benchs.next_order(),
      method: '_benchmark_db_write'
    }).set_session(this.session);
  },

  start_benchmark: function() {
    if (!this.bench_running) {
      this.Benchs.each(function (bench) { bench.save({'status': 'started'}); });
      this.bench_running = true;
      this.Benchs.start_bench().then(()=>{
        this.bench_running = false;
      });
    } else {
      Notificator.new_notif('Benchmark already in progress', 'error');
    }
  },

  clean_db: function() {
    if (!this.bench_running) {
      this.bench_running = true;
      this.Benchs.clean_db().then(()=>{
        this.bench_running = false;
      });
    } else {
      Notificator.new_notif('Benchmark already in progress', 'error');
    }
  },

  clean_collection: function() {
    while (this.Benchs.length){
      this.Benchs.models.forEach((model) => {
        model.destroy();
      });
    }
    return $.when();
  }

});

$(() => {
  var login = function () {
    return co(function* () {
      var session = new Session(TRYTON_SERVER, TRYTON_DATABASE);
      yield session.start(TRYTON_LOGIN, TRYTON_PASSWORD);
      return session;
    });
  };

  var login_prm = login();
  login_prm.then((session) => {
    new AppView(session);
  });
});
