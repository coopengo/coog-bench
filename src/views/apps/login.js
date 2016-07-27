// [View] LoginAppView
var $ = require('jquery'),
  co = require('co'),
  Session = require('tryton-session'),
  Backbone = require('backbone');
Backbone.$ = $;
var template = require('./login.tpl'),
  LoginView = require('../login/login.js'),
  LoginModel = require('../../models/login.js'),
  LoginLst = require('../../collections/login.js');
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
  initialize: function () {
    this.initial_render();
    this.collection = new LoginLst();
    this.container = this.$el.find('#login-container');
    this.listenTo(this.collection, 'add', this.add_one);
    this.inti_models();
  },
  initial_render: function () {
    $('body')
      .empty();
    $('body')
      .append(this.$el);
    this.$el.html(this.template);
  },
  add_one: function (model) {
    var view = new LoginView({
      model: model
    });
    this.container.append(view.render()
      .el);
  },
  new_model: function (name, value, type) {
    if (type === undefined) {
      type = 'text';
    }
    var model = new LoginModel({
      name: name,
      type: type,
      value: value,
      order: this.collection.next_order(),
    });
    this.collection.add(model);
  },
  inti_models: function () {
    // init all the models here
    this.new_model('server', TRYTON_SERVER);
    this.new_model('db', TRYTON_DATABASE);
    this.new_model('login', TRYTON_LOGIN);
    this.new_model('password', TRYTON_PASSWORD, 'password');
  },
  login: function () {
    var func = co.wrap(function* (credentials) {
      var session = new Session(credentials.server, credentials.db);
      yield session.start(credentials.login, credentials.password);
      return session;
    });
    var credentials = {
      'server': this.collection.findWhere({
          name: 'server'
        })
        .attributes.value,
      'db': this.collection.findWhere({
          name: 'db'
        })
        .attributes.value,
      'login': this.collection.findWhere({
          name: 'login'
        })
        .attributes.value,
      'password': this.collection.findWhere({
          name: 'password'
        })
        .attributes.value
    };
    return func(credentials);
  },
  connect: function () {
    if (!this.collection.empty()) {
      this.login()
        .then(
          (session) => this.trigger('logged', session), () => console.log(
            'Fail to connect'));
    }
  },
  close: function () {
    // remove all views from DOM
    // remove this from DOM
    // unbind events
    // delete Models in collection
    // delete collection
    // delete this
  }
});
