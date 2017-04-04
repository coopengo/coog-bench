var Backbone = require('backbone');
var Session = require('tryton-session');
//
var Login = Backbone.Model.extend({
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
exports.Login = Login;
