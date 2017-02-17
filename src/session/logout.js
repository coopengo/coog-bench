var Marionette = require('backbone.marionette');
var logoutTpl = require('./logout.tpl');
var blankTpl = require('./blank.tpl');
require('./logout.css');
//
var Logout = Marionette.View.extend({
  template: logoutTpl,
  ui: {
    button: '#buttonlgt',
  },
  events: {
    'click @ui.button': 'handleClickLogoutButton',
  },
  handleClickLogoutButton: function () {
    this.model.logout();
  }
});
var Blank = Marionette.View.extend({
  template: blankTpl,
});
//
exports.Logout = Logout;
exports.Blank = Blank;
