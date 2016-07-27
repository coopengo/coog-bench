var $ = require('jquery'),
  Backbone = require('backbone');
var template = require('./benchmark-selector.tpl');
Backbone.$ = $;
module.exports = Backbone.View.extend({
  tagName: 'button',
  template: template,
  className: 'pure-button benchmark-selector-btn bench-selector-ok',
  events: {
    'click': 'button_clicked'
  },
  initialize: function () {
    this.listenTo(this.model, 'destroy', this.remove);
  },
  button_clicked: function () {
    this.$el.toggleClass('bench-selector-ko bench-selector-ok');
    this.model.toggle();
  },
  render: function () {
    this.$el.html(this.template({
      title: this.model.attributes.title
    }));
    return this;
  }
});
