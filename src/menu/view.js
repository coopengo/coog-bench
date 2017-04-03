var Marionette = require('backbone.marionette');
var menuTpl = require('./template/menu.tpl');
require('./style.css');
//
var Menu = Marionette.View.extend({
  template: menuTpl,
  className: 'text-center',
  ui: {
    reinit: '#menu-btn-reinit',
    drop: '#menu-btn-drop',
    save: '#menu-btn-save',
    logout: '#menu-btn-logout',
  },
  triggers: {
    'click @ui.reinit': 'reinit',
    'click @ui.drop': 'drop',
    'click @ui.save': 'save',
    'click @ui.logout': 'logout',
  },
  modelEvents: {
    'change:active': 'toggleActive'
  },
  onReinit: function () {
    this.model.trigger('reinit');
  },
  onDrop: function () {
    this.model.trigger('drop');
  },
  onSave: function () {
    this.model.trigger('save');
  },
  onLogout: function () {
    this.model.trigger('logout');
  },
  toggleActive: function (active) {
    if (active) {
      this.$el.removeClass();
    }
    else {
      this.$el.addClass('bench-disabled');
    }
  }
});
//
exports.Menu = Menu;
