var Backbone = require('backbone');
require('backbone.syphon');
var Marionette = require('backbone.marionette');
var route = require('./route');
var appTpl = require('./app.tpl');
//
var AppView = Marionette.View.extend({
  template: appTpl,
  regions: {
    'main': '#main',
    'error': '#error',
    'menu': '#menu',
    'actions': '#actions',
  },
});
//
// app class
//
var App = Marionette.Application.extend({
  region: '#app',
  initialize: function () {
    this._connected = false;
    this._promise = Promise.resolve();
    this.on('before:start', function () {
      this.showView(new AppView());
    });
    this.on('start', () => {
      Backbone.history.start();
    });
    route(this);
  },
  isConnected: function () {
    return this._connected;
  },
  connect: function () {
    if (!this._connected) {
      this._connected = true;
      this.trigger('connect', true);
    }
  },
  disconnect: function () {
    if (this._connected) {
      this._connected = false;
      this.trigger('connect', false);
    }
  },
  then: function (fn) {
    this._promise = this._promise.then(fn);
  },
  ready: function (ok, ko) {
    this._promise.then(ok, ko);
  }
});
//
// app instance
//
var app = new App();
app.ready(() => app.start(), (error) => window.alert('app not started: ' +
  error));
