// [View]   LoginAppView

var $           = require('jquery'),
  co            = require('co'),
  Session       = require('tryton-session'),
  Backbone      = require('backbone');
Backbone.$ = $;

var template    = require('./login.tpl'),
    LoginView   = require('../login/login.js'),
    LoginLst    = require('../../collections/login.js');

var TRYTON_SERVER = 'http://localhost:7999';
var TRYTON_DATABASE = '4.0';
var TRYTON_LOGIN = 'admin';
var TRYTON_PASSWORD = 'admin';

module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'login-app',
  template: template,
  events: {
    'click #connect': 'connect',
  },

  initialize: function() {
    this.initial_render();

    this.collection = new LoginLst();
    this.container = this.$el.find('#login-container');

    this.listenTo(this.collection, 'add', this.add_one);
    this.inti_models();
  },

  initial_render: function() {
    $('body').empty();
    $('body').append(this.$el);
    this.$el.html(this.template);
  },

  clean_collection: function() {
    while (this.collection.length){
      this.collection.models.forEach((model) => {
        model.destroy();
      });
    }
    return $.when();
  },

  add_one: function(model) {
    var view = new LoginView({model: model});
    this.container.append(view.render().el);
  },

  inti_models: function() {
    // init all the models here

    this.collection.create({
      name: 'server',
      value: TRYTON_SERVER,
      order: this.collection.next_order(),
    });

    this.collection.create({
      name: 'db',
      value: TRYTON_DATABASE,
      order: this.collection.next_order(),
    });

    this.collection.create({
      name: 'login',
      value: TRYTON_LOGIN,
      order: this.collection.next_order(),
    });

    this.collection.create({
      name: 'password',
      type: 'password',
      value: TRYTON_PASSWORD,
      order: this.collection.next_order(),
    });
  },

  login: function() {
    var func = co.wrap(function* (credentials) {
      var session = new Session(credentials.server, credentials.db);
      yield session.start(credentials.login, credentials.password);
      return session;
    });

    var credentials = {
      'server'  : this.collection.findWhere({name: 'server'}).attributes.value,
      'db'      : this.collection.findWhere({name: 'db'}).attributes.value,
      'login'   : this.collection.findWhere({name: 'login'}).attributes.value,
      'password': this.collection.findWhere({name: 'password'}).attributes.value
    };

    return func(credentials);
  },

  connect: function() {
    if (!this.collection.empty()) {
      this.login().then(
        (session) => this.trigger('logged', session), 
        () => console.log('Fail to connect'));
    }
  },

  close: function() {
    // remove all views from DOM
    // remove this from DOM
    // unbind events
    // delete Models in collection
    // delete collection
    // delete this
  }
});
