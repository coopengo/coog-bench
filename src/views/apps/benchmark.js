var Backbone = require('backbone');
var template = require('./benchmark.tpl');
var BenchView = require('../benchmark/benchmark.js');
var ReconnectView = require('../login/reconnect.js');
var Notificator = require('../../collections/notification');
var BenchLatency = require('../../models/bench-latency.js');
var BenchModel = require('../../models/benchmark.js');
var BenchList = require('../../collections/benchmark.js');
//
var BENCH_MODEL = 'utils.benchmark_class';
//
module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'bench-app',
  template: template,
  events: {
    'click #start_btn': 'start_benchmark',
    'click .bench-all-checkbox': 'toggle_all'
  },
  initialize: function (session) {
    this.session = session;
    this.collection = new BenchList();
    this.bench_running = false;
    this.timedout = false;
    this.collection.set_session(session);
    this.initial_render();
    this.all_checkbox = this.$('.bench-all-checkbox')[0];
    this.listenTo(this.collection, 'add', this.add_one);
    this.listenTo(this.collection, 'all', this.render);
    this.listenTo(this.collection, 'timedout', this.session_timedout);
    this.inti_benchs();
  },
  initial_render: function () {
    Backbone.$('body')
      .empty();
    Backbone.$('body')
      .append(this.$el);
    this.$el.html(this.template);
  },
  render: function () {
    this.all_checkbox.checked = !this.collection.disable()
      .length;
  },
  add_one: function (bench) {
    var view_bench = new BenchView({
      model: bench
    });
    this.$('#bench-container')
      .append(view_bench.render()
        .el);
  },
  inti_benchs: function () {
    var new_bench = (desc) => {
      if (!desc[1].server_side) {
        return new_client_side_bench(desc);
      }
      var bench = new BenchModel({
        title: desc[1].name,
        order: this.collection.next_order(),
        method: desc[0],
        use_db: desc[1].requires_setup,
      });
      bench.set_session(this.session);
      this.collection.add(bench);
    };
    var new_client_side_bench = (desc) => {
      // create and save a custom Model inheriting from Benchmark model
      var bench = new BenchLatency({
        title: desc[1].name,
        order: this.collection.next_order(),
        method: desc[0],
        use_db: desc[1].requires_setup,
        custom: true
      });
      bench.set_session(this.session);
      this.collection.add(bench);
    };
    this.session.rpc('model.' + BENCH_MODEL + '.' + '_benchmark_list', [], {})
      .then((ret) => {
        ret.methods.forEach(new_bench);
      });
  },
  start_benchmark: function () {
    var bench_running = (state) => {
      this.collection.each(function (bench) {
        bench.set('started', state);
      });
      this.bench_running = state;
    };
    if (!this.bench_running && !this.timedout) {
      bench_running(true);
      this.collection.start_bench()
        .then(
          () => {
            bench_running(false);
          }, () => {
            bench_running(false);
          });
    }
    else {
      Notificator.new_notif('Can\'t launch benchmarks now', 'error');
    }
  },
  toggle_all: function () {
    var state = this.all_checkbox.checked;
    this.collection.each((bench) => {
      bench.toggle(state);
    });
  },
  session_timedout: function () {
    Notificator.new_notif('Session timed out', 'error');
    var view = new ReconnectView();
    view.set_session(this.session);
    this.listenTo(view, 'on_login', this.on_login);
    this.timedout = true;
    this.$('#reconnect-area')
      .append(view.render()
        .el);
  },
  on_login: function (val, view) {
    if (val) {
      this.stopListening(view);
      view.remove();
      this.timedout = false;
      Notificator.new_notif('You are logged');
    }
    else {
      Notificator.new_notif('Bad password', 'error');
    }
  }
});
