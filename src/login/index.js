var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var loginTpl = require('./template/login.tpl');
var loginFormTpl = require('./template/login-form.tpl');
var loginErrorTpl = require('./template/login-error.tpl');
var api = require('../api.js');
//
exports.Model = Backbone.Model.extend({
  schema: {
    server: {
      type: 'Text',
      validators: ['required']
    },
    database: {
      type: 'Text',
      validators: ['required']
    },
    username: {
      type: 'Text',
      validators: ['required']
    },
    password: {
      type: 'Password',
      validators: ['required']
    }
  },
  initialize: function () {
    this.set('server', 'http://localhost:7999');
  },
  connect: function () {
    api.session.connect(this.get('server'), this.get('database'), this.get(
        'username'), this.get('password'))
      .then((session) => {
        this.trigger('connect:ok', session);
      }, (error) => {
        this.trigger('connect:ko', error);
      });
  }
});
//
var LoginForm = Backbone.Form.extend({
  template: loginFormTpl
});
var LoginError = Marionette.View.extend({
  template: loginErrorTpl
});
exports.View = Marionette.View.extend({
  className: 'pure-g',
  template: loginTpl,
  regions: {
    form: '#login-form',
    error: '#login-error'
  },
  ui: {
    connect: 'button'
  },
  triggers: {
    'click @ui.connect': 'connect'
  },
  onRender: function () {
    var form = new LoginForm({
      model: this.model
    });
    this.on('connect', () => {
      var errors = form.commit({
        validate: true
      });
      if (!errors) {
        this.model.connect();
      }
    });
    this.listenTo(this.model, 'connect:ko', (error) => {
      var v = new LoginError({
        model: new Backbone.Model({
          message: error
        })
      });
      this.showChildView('error', v);
    });
    this.showChildView('form', form);
  }
});
