var Marionette = require('backbone.marionette');
var menuTpl = require('./menu.tpl');
var blankTpl = require('./blank.tpl');
require('./menu.css');
//
var Menu = Marionette.View.extend({
  template: menuTpl,
  ui: {
    button: '#buttonlgt',
    buttonclean: '#buttonclean',
  },
  events: {
    'click @ui.button': 'handleClickLogoutButton',
    'click @ui.buttonclean': 'handleClickCleanButton',
  },
  handleClickLogoutButton: function () {
    this.model.logout();
  },
  handleClickCleanButton: function () {
    this.model.clean();
  },
});
//
var Blank = Marionette.View.extend({
  template: blankTpl,
});
//
exports.Menu = Menu;
exports.Blank = Blank;
