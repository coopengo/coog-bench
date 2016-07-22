var $           = require('jquery'),
  Backbone      = require('backbone');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
  initialize: function(Notifications) {
    this.Notifications = Notifications;
    this.lock = false;
    this.time_lock = false;
    this.mouse_hover = false;
    if (this.attributes.auto_remove){
      this.start_timeout();
    }
  },

  defaults: function() {
    // modes: info, error, warning
    return {
      value:      'none',
      mode:       'no method',
      auto_remove:true,
      show:       true,
      timeout:    4
    };
  },

  toggle: function() {
    this.mouse_hover = false;
    this.to_destroy();
  },

  start_timeout: function(time) {
    if (this.time_lock){
      return;
    }
    if (!time){
      time = this.attributes.timeout * 1000;
    }
    this.time_lock = true;
    setTimeout(() => {
      this.time_lock = false;
      this.to_destroy();
    }, time);
  },

  to_destroy: function() {
    if (this.mouse_hover || this.lock){
      return;
    }
    if (this.time_lock) {
      this.set('show', false);
    } else {
      this.destroy();
    }
  }
});
