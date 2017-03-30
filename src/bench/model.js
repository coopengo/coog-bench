var _ = require('underscore');
var Backbone = require('backbone');
//
var Bench = Backbone.Model.extend({
  defaults: function () {
    return {
      status: 'idle',
      enable: true,
      iterations: '-',
      average: '-',
      minimum: '-',
      maximum: '-',
    };
  },
  toggle: function () {
    this.set({
      enable: !this.get('enable')
    });
  },
  reset: function () {
    this.set({
      status: 'idle',
      iterations: '-',
      average: '-',
      minimum: '-',
      maximum: '-',
    });
  },
  execute: function () {
    this.set('status', 'working');
    return this.collection.session.rpc('model.bench.' + this.get('method'))
      .then(
        (res) => {
          this.set({
            status: 'done',
            iterations: res.iterations,
            average: res.average.toFixed(5),
            minimum: res.minimum.toFixed(5),
            maximum: res.maximum.toFixed(5),
          });
        });
  },
  executeLatency: function () {
    var prm = Promise.resolve();
    var times = [];
    var start, end;
    var iterations = 100;
    this.set('status', 'working');
    var newLatency = () => {
      start = (new Date())
        .getTime();
      return this.collection.session.rpc('model.bench.' + this.get(
          'method'))
        .then(() => {
          end = (new Date())
            .getTime();
          times.push(((end - start) / 1000));
        });
    };
    for (var i = iterations; i > 0; i--) {
      prm = prm.then(newLatency);
    }
    return prm.then(() => {
      times.sort();
      this.set({
        status: 'done',
        minimum: _.first(times)
          .toFixed(5),
        maximum: _.last(times)
          .toFixed(5),
        average: (_.reduce(times, (memo, v) => memo + v) / times.length)
          .toFixed(5),
        iterations: iterations,
      });
    });
  },
});
//
module.exports = Backbone.Collection.extend({
  model: Bench,
  init: function (session) {
    this.session = session;
    this.session.rpc('model.bench.list')
      .then((data) => {
        this.setup = data.setup;
        this.teardown = data.teardown;
        this.reset(data.methods);
      });
  },
  execute: function () {
    this.trigger('error:reset');
    var promise = Promise.resolve();
    var enabled = this.filter({
      enable: true
    });
    var disabled = this.filter({
      enable: false
    });
    var setup = _.filter(enabled, (bench) => bench.get('setup'))
      .length;
    if (setup) {
      promise = promise.then(() => {
        return this.session.rpc('model.bench.' + this.setup);
      });
    }
    _.each(disabled, (bench) => {
      bench.reset();
    });
    _.each(enabled, (bench) => {
      bench.reset();
      promise = promise.then(() => {
        if (bench.get('method') == 'test_latency') {
          return bench.executeLatency();
        }
        else {
          return bench.execute();
        }
      });
    });
    if (setup) {
      promise = promise.then(() => {
        return this.session.rpc('model.bench.' + this.teardown);
      });
    }
    return promise.then(() => {
      this.trigger('bench:ok');
      this.trigger('bench:done');
    }, (err) => {
      this.trigger('error:add', err.error);
    });
  },
  drop: function () {
    this.session.rpc('model.bench.' + this.teardown);
  },
  save: function (doc) {
    var blob = new Blob([JSON.stringify(doc)], {
      type: 'application/json'
    });
    var blob_url = window.URL.createObjectURL(blob);
    var data = encodeURI(blob_url);
    var link = document.createElement('a');
    link.setAttribute('href', data);
    link.setAttribute('download', 'bench_data.txt');
    document.body.appendChild(link);
    link.click();
  },
});
