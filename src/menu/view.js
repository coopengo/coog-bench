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
    tasks: '#menu-btn-tasks',
    logout: '#menu-btn-logout',
  },
  triggers: {
    'click @ui.save': 'save',
    'click @ui.clean': 'clean',
    'click @ui.tasks': 'tasks',
    'click @ui.logout': 'logout',
  },
  onSave: function () {
    this.model.save();
  },
  onClean: function () {
    this.model.clean();
  },
  onTasks: function () {
    this.model.drop();
  },
  onLogout: function () {
    this.model.logout();
  },
});
//
exports.Menu = Menu;
