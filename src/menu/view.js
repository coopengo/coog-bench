var Marionette = require('backbone.marionette');
var menuTpl = require('./menu.tpl');
require('./menu.css');
//
var Menu = Marionette.View.extend({
  template: menuTpl,
  className: 'text-center',
  ui: {
    buttonlgt: '#buttonlgt',
    buttonclean: '#buttonclean',
    buttontasks: '#buttontasks',
    buttonsave: '#buttonsave',
  },
  triggers: {
    'click @ui.buttontasks': 'tasks',
    'click @ui.buttonsave': 'save',
    'click @ui.buttonlgt': 'logout',
    'click @ui.buttonclean': 'clean',
  },
  onLogout: function () {
    this.model.logout();
  },
  onClean: function () {
    this.model.clean();
  },
  onSave: function () {
    this.model.save();
  },
  onTasks: function () {
    this.model.drop();
  },
});
//
exports.Menu = Menu;
