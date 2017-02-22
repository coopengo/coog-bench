var Marionette = require('backbone.marionette');
var dropTpl = require('./template/drop.tpl');
var blankTpl = require('./template/blank.tpl');
require('./template/drop.css');
//
var Drop = Marionette.View.extend({
  template: dropTpl,
  ui: {
    button: '#buttondrop',
  },
  events: {
    'click @ui.button': 'handleClicDropButton',
  },
  handleClicDropButton: function () {
    this.collection.drop();
  }
});
var Blank = Marionette.View.extend({
  template: blankTpl,
});
//
exports.Drop = Drop;
exports.Blank = Blank;
