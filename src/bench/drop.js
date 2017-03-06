var Marionette = require('backbone.marionette');
var blankTpl = require('./template/blank.tpl');
var Blank = Marionette.View.extend({
  template: blankTpl,
});
//
exports.Blank = Blank;
