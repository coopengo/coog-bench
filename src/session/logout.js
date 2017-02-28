var Marionette = require('backbone.marionette');
var logoutTpl = require('./logout.tpl');
var blankTpl = require('./blank.tpl');
require('./logout.css');
//
var Logout = Marionette.View.extend({
  template: logoutTpl,
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
exports.Logout = Logout;
exports.Blank = Blank;
