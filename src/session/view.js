var Backbone = require('backbone');
var Marionette = require('backbone.marionette');
var tpl = require('./template/login.tpl');
//
var Session = Marionette.View.extend({
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
exports.Session = Session;
