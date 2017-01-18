var _ = require('underscore');
var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var Ajv = require('ajv');
var Session = require('tryton-session');
var tpl = require('./login.tpl');
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
  }
});
//
// views
//
var ErrorView = Marionette.View.extend({
  tagName: 'li'
});
var ErrorsView = Marionette.CollectionView.extend({
  tarName: 'ul',
  childView: ErrorView
});
var View = Marionette.View.extend({
  className: 'pure-g',
  template: tpl,
  ui: {
    submit: 'button'
  },
  regions: {
    error: '#error'
  },
  triggers: {
    'click @ui.submit': 'submit'
  },
  initialize: function () {
    this.listenTo(this.model, 'invalid', (error) => {
      this.triggerMethod('error', error);
    });
    this.listenTo(this.model, 'login', (ok, info) => {
      if (!ok) {
        this.triggerMethod('error', info);
      }
    });
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
  onError: function (error) {
    if (_.isString(error)) {
      error = [error];
    }
    this.showChildView('error', new ErrorsView(error));
  }
});
//
// exports
//
exports.Model = Model;
exports.View = View;
