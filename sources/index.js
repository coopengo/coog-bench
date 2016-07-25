var $           = require('jquery'),
  Backbone      = require('backbone');
Backbone.$ = $;

var BenchAppView  = require('./views/apps/benchmark.js'),
  LoginAppView    =  require('./views/apps/login.js');

var AppView = Backbone.View.extend({
  initialize: function() {
    // start LoginAppView
    this.log = new LoginAppView();
    // listen to logged
    this.log.on('logged', this.on_connection, this);
    this.log.render();
  },

  on_connection: function(session) {
    this.session = session;
    console.log('CONNECTED');
    // close login
    this.log.close();
    this.log.remove();
    // start BenchAppView
    this.bench = new BenchAppView(session);
    // listen to logout
  },

  on_logout: function() {
    this.session = null;
    console.log('LOGOUT');
    // close bench

    // start LoginAppView
    this.log = new LoginAppView();
    // listen to logged
    this.log.on('logged', this.on_connection, this);
    this.log.render();
  }
});

$(() => {
  new AppView();
});
