var Backbone = require('backbone');
require('backbone.syphon');
var Marionette = require('backbone.marionette');
var route = require('./route');
require('bootstrap/dist/css/bootstrap.css');
require('./app.css');
var appTpl = require('./app.tpl');
//
var AppView = Marionette.View.extend({
  template: appTpl,
  regions: {
    'menu': '#app-menu',
    'error': '#app-error',
    'main': '#app-main'
  }
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
    this.on('start', function () {
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
