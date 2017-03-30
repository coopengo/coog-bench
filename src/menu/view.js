var Marionette = require('backbone.marionette');
var menuTpl = require('./template/menu.tpl');
require('./style.css');
//
var Menu = Marionette.View.extend({
  template: menuTpl,
  className: 'text-center',
  ui: {
    save: '#menu-btn-save',
    clean: '#menu-btn-clean',
    drop: '#menu-btn-drop',
    logout: '#menu-btn-logout',
  },
  triggers: {
    'click @ui.save': 'save',
    'click @ui.clean': 'clean',
    'click @ui.drop': 'drop',
    'click @ui.logout': 'logout',
  },
  onSave: function () {
    this.model.trigger('save');
  },
  onClean: function () {
    this.model.trigger('clean');
  },
  onDrop: function () {
    this.model.trigger('drop');
  },
  onLogout: function () {
    this.model.trigger('logout');
  },
});
//
exports.Menu = Menu;
