var Backbone = require('backbone');
var Session = require('tryton-session');
var Marionette = require('backbone.marionette');
var tpl = require('./template/login.tpl');
//
// models
//
var Model = Backbone.Model.extend({
  initialize: function () {
    this.set({
      database: 'coog',
      username: 'admin',
      password: 'admin'
    });
  },
  validate: function (attrs) {
    var errors = [];
    if (!attrs.database) {
      errors.push('missing database');
    }
    if (!attrs.username) {
      errors.push('missing username');
    }
    if (!attrs.password) {
      errors.push('missing password');
    }
    if (errors.length > 0) {
      return errors;
    }
  },
  login: function () {
    var session = new Session(window.location.protocol + '//' + window.location
      .host, this.get('database'));
    session.start(this.get('username'), {
        password: this.get('password')
      })
      .then(() => {
        this.trigger('login', true, session);
      }, (error) => {
        this.trigger('login', false, error);
      });
  },
});
//
// views
//
var View = Marionette.View.extend({
  className: 'container-fluid',
  template: tpl,
  ui: {
    submit: 'button'
  },
  triggers: {
    'click @ui.submit': 'submit'
  },
  onSubmit: function () {
    this.model.set(Backbone.Syphon.serialize(this), {
      validate: true
    });
    if (this.model.isValid()) {
      this.model.login();
    }
  },
  onRender: function () {
    Backbone.Syphon.deserialize(this, this.model.toJSON());
  },
});
//
// exports
//
exports.View = View;
exports.Model = Model;
