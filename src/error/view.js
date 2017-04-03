var Marionette = require('backbone.marionette');
var errorTpl = require('./template/error.tpl');
require('./style.css');
//
var Err = Marionette.View.extend({
  template: errorTpl,
  ui: {
    close: '#error-close-btn',
  },
  triggers: {
    'click @ui.close': 'close',
  },
  onClose: function () {
    this.model.destroy();
  },
});
var Errors = Marionette.CollectionView.extend({
  childView: Err,
});
//
exports.Errors = Errors;
