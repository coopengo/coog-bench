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
    var setup = _.filter(enabled, (bench) => bench.get('setup'))
      .length;
    if (setup) {
      promise = promise.then(() => {
        return this.session.rpc('model.bench.' + this.setup);
      });
    }
    _.each(enabled, (bench) => {
      promise = promise.then(() => {
        return bench.execute();
      });
    });
    if (setup) {
      promise = promise.then(() => {
        return this.session.rpc('model.bench.' + this.teardown);
      });
    }
    return promise.then(() => {
      this.trigger('bench:ok');
    }, (err) => {
      this.trigger('error:add', err.error);
    });
  },
  drop: function () {
    this.session.rpc('model.bench.' + this.teardown);
  },
});
