var Marionette = require('backbone.marionette');
var menuTpl = require('./menu.tpl');
var blankTpl = require('./blank.tpl');
require('./menu.css');
//
var Menu = Marionette.View.extend({
  template: menuTpl,
  ui: {
    buttonlgt: '#buttonlgt',
    buttonclean: '#buttonclean',
    buttontasks: '#buttontasks',
  },
  events: {
    'click @ui.buttonlgt': 'handleClickLogoutButton',
    'click @ui.buttonclean': 'handleClickCleanButton',
    'click @ui.buttontasks': 'handleClickTasksButton',
  },
  handleClickLogoutButton: function () {
    this.model.logout();
  },
  handleClickCleanButton: function () {
    this.model.clean();
  },
  handleClickTasksButton: function (app) {
    this.model.drop(app);
  },
});
//
var Blank = Marionette.View.extend({
  template: blankTpl,
});
//
exports.Menu = Menu;
exports.Blank = Blank;
