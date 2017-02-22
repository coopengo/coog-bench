var Marionette = require('backbone.marionette');
var errorTpl = require('./error.tpl');
var mainTpl = require('./index.tpl');
require('./error.css');
//
var Row = Marionette.View.extend({
  tagName: 'ul',
  template: errorTpl,
  ui: {
    button: '#delete-btn',
  },
  events: {
    'click @ui.button': 'handleDeleteButtonClick',
  },
  triggers: {
    'click @ui.button': 'clicked',
  },
  handleDeleteButtonClick: function () {
    this.model.destroy();
  },
});
//
var Table = Marionette.CollectionView.extend({
  tagName: 'pure-g',
  childView: Row,
  template: mainTpl,
});
//
module.exports = Table;
