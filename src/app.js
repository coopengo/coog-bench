var Backbone = require('backbone');
require('backbone.syphon');
var Marionette = require('backbone.marionette');
var route = require('./route');
require('purecss');
//
// app class
//
var App = Marionette.Application.extend({
  region: '#app',
  initialize: function () {
    this._connected = false;
    this._promise = Promise.resolve();
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
  },
  onStart: function () { 
    Backbone.history.start();
  }
});
//
// app instance
//
var app = new App();
app.ready(() => app.start(), (error) => window.alert('app not started: ' +
  error));
