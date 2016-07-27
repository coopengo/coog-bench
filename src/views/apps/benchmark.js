// [View]     BenchAppView
var $ = require('jquery'),
  Backbone = require('backbone');
var template = require('./benchmark.tpl'),
  BenchView = require('../benchmark/benchmark.js'),
  BenchSelector = require('../benchmark-selector/benchmark-selector.js'),
  Notificator = require('../../collections/notification'),
  BenchLatency = require('../../models/bench-latency.js'),
  BenchList = require('../../collections/benchmark.js');
Backbone.$ = $;
var BENCH_MODEL = 'utils.benchmark_class';
module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'bench-app',
  template: template,
  events: {
    'click #start_btn': 'start_benchmark',
    'click #clean_collect_btn': 'clean_collection',
    'click #clean_btn': 'clean_db'
  },
  initialize: function (session) {
    this.session = session;
    this.Benchs = new BenchList();
    this.Benchs.set_session(session);
    this.initial_render();
    this.bench_running = false;
    this.listenTo(this.Benchs, 'add', this.add_one);
    this.Benchs.fetch()
      .then(() => this.clean_collection())
      .then(() => this.inti_benchs());
  },
  initial_render: function () {
    // this.$el.html(this.template);
    $('body')
      .empty();
    $('body')
      .append(this.$el);
    this.$el.html(this.template);
  },
  add_one: function (bench) {
    var view_bench = new BenchView({
      model: bench
    });
    var view_select = new BenchSelector({
      model: bench
    });
    this.$('#bench-container')
      .append(view_bench.render()
        .el);
    this.$('#benchmarks-selector')
      .append(view_select.render()
        .el);
  },
  inti_benchs: function () {
    var new_bench = (desc) => {
      if (!desc[1].server_side) {
        return new_client_side_bench(desc);
      }
      this.Benchs.create({
          title: desc[1].name,
          order: this.Benchs.next_order(),
          method: desc[0],
          use_db: desc[1].requires_setup,
        })
        .set_session(this.session);
    };
    var new_client_side_bench = (desc) => {
      // create and save a custom Model inheriting from Benchmark model
      var bench = new BenchLatency({
        title: desc[1].name,
        order: this.Benchs.next_order(),
        method: desc[0],
        use_db: desc[1].requires_setup,
        custom: true
      });
      bench.set_session(this.session);
      this.Benchs.add(bench);
      bench.save();
    };
    this.session.rpc('model.' + BENCH_MODEL + '.' + '_benchmark_list', [], {})
      .then((ret) => {
        ret.methods.forEach(new_bench);
      });
  },
  start_benchmark: function () {
    if (!this.bench_running) {
      this.Benchs.each(function (bench) {
        bench.save({
          'status': 'started'
        });
      });
      this.bench_running = true;
      this.Benchs.start_bench()
        .then(() => {
          this.bench_running = false;
        });
    }
    else {
      Notificator.new_notif('Benchmark already in progress', 'error');
    }
  },
  clean_db: function () {
    if (!this.bench_running) {
      this.bench_running = true;
      this.Benchs.clean_db()
        .then(() => {
          this.bench_running = false;
        });
    }
    else {
      Notificator.new_notif('Benchmark already in progress', 'error');
    }
  },
  clean_collection: function () {
    while (this.Benchs.length) {
      this.Benchs.models.forEach((model) => {
        model.destroy();
      });
    }
    return $.when();
  }
});
