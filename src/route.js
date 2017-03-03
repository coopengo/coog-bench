var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var session = require('./session');
var bench = require('./bench');
var error = require('./error');
var menu = require('./menu');
//
// routing utils
//
function goto(route) {
  Backbone.history.navigate(route, {
    trigger: true
  });
}
var AppRouter = Marionette.AppRouter.extend({
  onRoute: function (name, path) {
    this.getOption('app')
      .trigger('route', path);
  }
});
var AuthRouter = AppRouter.extend({
  execute: function (callback, args, name) {
    var app = this.getOption('app');
    if (!app.isConnected()) {
      var origin = _.invert(this.appRoutes)[name];
      app.origin = origin;
      goto('login');
      return false;
    }
    else {
      if (callback) {
        callback.apply(this, args);
      }
    }
  }
});
//
// create routers
//
module.exports = function (app) {
  error(app);
  session(app);
  menu(app);
  app.on('start', () => {
    app.on('connect', (connected) => {
      if (connected) {
        if (this.origin) {
          goto(this.origin);
          delete this.origin;
        }
        else {
          goto('');
        }
      }
      else {
        goto('login');
      }
    });
  });
  new AppRouter({
    app: app,
    controller: {
      home: () => goto('bench')
    },
    appRoutes: {
      '': 'home'
    }
  });
  new AppRouter({
    app: app,
    controller: session(app),
    appRoutes: {
      'login': 'login',
    }
  });
  new AuthRouter({
    app: app,
    controller: bench(app),
    appRoutes: {
      'bench': 'bench'
    }
  });
};
