var Marionette = require('backbone.marionette');
var menuTpl = require('./template/menu.tpl');
require('./style.css');
//
var Menu = Marionette.View.extend({
  template: menuTpl,
  className: 'text-center',
  ui: {
    refresh: '#menu-btn-refresh',
    drop: '#menu-btn-drop',
    save: '#menu-btn-save',
    logout: '#menu-btn-logout',
  },
  triggers: {
    'click @ui.refresh': 'refresh',
    'click @ui.drop': 'drop',
    'click @ui.save': 'save',
    'click @ui.logout': 'logout',
  },
  modelEvents: {
    'bench:done': 'changeStatus',
    'menu:change': 'changeEnable'
  },
  onRefresh: function () {
    this.model.trigger('refresh');
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
  changeStatus: function () {
    this.$el.removeClass();
  },
  changeEnable: function () {
    this.$el.addClass('bench-disabled');
  }
});
//
exports.Menu = Menu;
