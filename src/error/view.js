var Marionette = require('backbone.marionette');
var errorTpl = require('./error.tpl');
require('./error.css');
//
var Row = Marionette.View.extend({
  tagName: 'container-fluid',
  template: errorTpl,
  ui: {
    button: '#delete-btn',
  },
  triggers: {
    'click @ui.button': 'clicked',
  },
  onClicked: function () {
    this.model.destroy();
  },
});
//
var Table = Marionette.CollectionView.extend({
  tagName: 'container-fluid',
  childView: Row,
});
//
module.exports = Table;
