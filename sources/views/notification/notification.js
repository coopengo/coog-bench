var $           = require('jquery'),
  Backbone      = require('backbone'),
  template      = require('./notification.tpl');
Backbone.$ = $;

module.exports = Backbone.View.extend({
  tagName: 'aside',
  template: template,
  className: 'notification',
  events: {
    'dblclick'      : 'clear',
    'mouseenter'    : 'on_mouse_enter',
    'mouseleave'    : 'on_mouse_leave'
  },

  initialize: function() {
    this.model.on('change:show', this.show_changed, this);
    this.listenTo(this.model, 'destroy', this.remove);
  },

  show_changed: function(model, value) {
    if (!value){
        this.$el.hide();
    }
  },

  render: function() {
    var model = this.model.attributes.mode;
    if (model == 'info' || model == 'warning' || model == 'error'){
        this.$el.addClass('notification-' + model);
    }
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },

  clear: function() {
    this.model.toggle();
  },

  on_mouse_enter: function() {
    this.model.mouse_hover = true;
  },

  on_mouse_leave: function() {
    this.model.mouse_hover = false;
    this.model.start_timeout(1000);
  },

});
