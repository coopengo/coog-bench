var Marionette = require('backbone.marionette');
var dropTpl = require('./template/drop.tpl');
var blankTpl = require('./template/blank.tpl');
require('./template/drop.css');
//
var Drop = Marionette.View.extend({
  template: dropTpl,
  /*regions : {
    'menu' : '#buttontasks'
  },*/
  className: 'container-fluid',
  ui: {
    button: '#bench-button-drop',
  },
  events: {
    'click @ui.button': 'handleClicDropButton',
  },
  handleClicDropButton: function () {
    this.collection.drop();
    this.$el.addClass('wait');
    this.destroy();
  }
});
var Blank = Marionette.View.extend({
  template: blankTpl,
});
//
exports.Drop = Drop;
exports.Blank = Blank;
