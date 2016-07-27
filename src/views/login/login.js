// [View]   LoginView
var $ = require('jquery'),
  Backbone = require('backbone');
Backbone.$ = $;
var template = require('../login/login_elem.tpl');
module.exports = Backbone.View.extend({
  tagName: 'div',
  template: template,
  className: 'pure-u-1',
  events: {
    'change input': 'value_changed',
    'autocomplete input': 'value_changed',
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  value_changed: function () {
    var val = this.$el.find('input')
      .val();
    this.model.set({
      value: val
    });
  },
  get_value_from_dom: function () {
    return this.$el.find('input')
      .val();
  }
});
