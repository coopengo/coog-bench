var Backbone = require('backbone');
var Ajv = require('ajv');
var Session = require('tryton-session');
var Marionette = require('backbone.marionette');
var tpl = require('./login.tpl');
var blankTpl = require('./blank.tpl');
require('./login.css');
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
  schema: {
    type: 'object',
    properties: {
      database: {
        type: 'string'
      },
      username: {
        type: 'string'
      },
      password: {
        type: 'string'
      }
    },
    required: ['database', 'username', 'password']
  },
  validate: function (attrs) {
    var ajv = new Ajv();
    var validate = ajv.compile(this.schema);
    var valid = validate(attrs);
    if (!valid) {
      return validate.errors;
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
  onRender: function () {
    Backbone.Syphon.deserialize(this, this.model.toJSON());
    this.on('submit', () => {
      this.model.set(Backbone.Syphon.serialize(this), {
        validate: true
      });
      if (this.model.isValid()) {
        this.model.login();
      }
    });
  },
});
//
var Blank = Marionette.View.extend({
  template: blankTpl,
});
//
// exports
//
exports.View = View;
exports.Model = Model;
exports.Blank = Blank;
