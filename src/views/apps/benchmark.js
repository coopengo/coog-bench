var $ = require('jquery'),
  Backbone = require('backbone');
var template = require('./benchmark.tpl'),
  BenchView = require('../benchmark/benchmark.js'),
  Notificator = require('../../collections/notification'),
  BenchLatency = require('../../models/bench-latency.js'),
  BenchModel = require('../../models/benchmark.js'),
  BenchList = require('../../collections/benchmark.js');
Backbone.$ = $;
var BENCH_MODEL = 'utils.benchmark_class';
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
    this.collection.set_session(session);
    this.initial_render();
    this.all_checkbox = this.$('.bench-all-checkbox')[0];
    this.listenTo(this.collection, 'add', this.add_one);
    this.listenTo(this.collection, 'all', this.render);
    this.inti_benchs();
  },
  initial_render: function () {
    $('body')
      .empty();
    $('body')
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
        bench.set({
          'started': state
        });
      });
      this.bench_running = state;
    };
    if (!this.bench_running) {
      bench_running(true);
      this.collection.start_bench()
        .then(() => {
          bench_running(false);
        });
    }
    else {
      Notificator.new_notif('Benchmark already in progress', 'error');
    }
  },
  toggle_all: function () {
    var state = this.all_checkbox.checked;
    this.collection.each((bench) => {
      bench.toggle(state);
    });
  }
});
