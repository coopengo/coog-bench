var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var login = require('./login');
var bench = require('./bench');
var form = require('./forms');
var api = require('./api.js');
//
var App = Marionette.Application.extend({
  region: '#bench-root',
  initialize: function () {
    this.router = new Marionette.AppRouter();
    this.router.processAppRoutes(this, {
      'login': 'showLogin',
      '': 'showBench'
    });
  },
  onStart: function (app, options) {
    form.setTemplates();
    this.session = options.session;
    Backbone.history.start();
  },
  onConnect: function (session) {
    this.session = session;
    api.session.save(session);
    this.router.navigate('', {
      trigger: true
    });
  },
  showLogin: function () {
    var model = new login.Model();
    this.listenTo(model, 'connect:ok', (session) => {
      this.triggerMethod('connect', session);
    });
    this.showView(new login.View({
      model: model
    }));
  },
  showBench: function () {
    if (this.session) {
      this.showView(new bench.View({
        session: this.session
      }));
    }
    else {
      this.router.navigate('login', {
        trigger: true,
      });
    }
  }
});
//
var app = new App();
//
api.session.retrieve()
  .then((session) => app.start({
    session: session
  }));
module.exports = app;
