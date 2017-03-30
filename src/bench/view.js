var Marionette = require('backbone.marionette');
var rowTpl = require('./template/row.tpl');
var tableTpl = require('./template/table.tpl');
var mainTpl = require('./template/index.tpl');
require('./style.css');
//
var Row = Marionette.View.extend({
  tagName: 'tr',
  className: function () {
    return 'bench-row-status-' + this.get('status') +
      ' bench-row-selected-' + this.get('selected') ? 'yes' : 'not';
  },
  template: rowTpl,
  ui: {
    button: '.bench-selector-btn',
  },
  modelEvents: {
    'change': 'render',
  },
  triggers: {
    'click @ui.button': 'clicked',
  },
  onClicked: function () {
    this.model.toggle();
  }
});
//
var TableBody = Marionette.CollectionView.extend({
  tagName: 'tbody',
  childView: Row,
  childViewEventPrefix: 'bench',
});
//
var Table = Marionette.View.extend({
  tagName: 'div',
  className: 'container-fluid',
  template: tableTpl,
  ui: {
    checkbox: '.bench-all-checkbox',
    button: '#bench-start-btn',
  },
  regions: {
    body: {
      el: 'tbody',
      replaceElement: true
    }
  },
  triggers: {
    'click @ui.checkbox': 'handleCheckboxClick',
    'click @ui.button': 'handleButtonClick',
  },
  collectionEvents: {
    'bench:done': 'changeStatus',
    'error:add': 'changeStatus'
  },
  childViewEvents: {
    'bench:clicked': 'updateCheckbox'
  },
  updateCheckbox: function () {
    var checked = !this.collection.filter({
        selected: false
      })
      .length;
    this.getUI('checkbox')[0].checked = checked;
  },
  changeStatus: function () {
    this.$el.removeClass('bench-disabled');
  },
  onRender: function () {
    this.showChildView('body', new TableBody({
      collection: this.collection
    }));
    this.updateCheckbox();
  },
  onHandleCheckboxClick: function () {
    var state = this.getUI('checkbox')[0].checked;
    this.collection.each((bench) => {
      bench.toggle(state);
    });
  },
  onHandleButtonClick: function () {
    this.$el.addClass('bench-disabled');
    this.collection.execute();
  },
});
//
module.exports = Marionette.View.extend({
  template: mainTpl,
  regions: {
    'lst': '#benchList'
  },
  initialize: function () {
    this.tableView = new Table({
      collection: this.collection
    });
  },
  onRender: function () {
    this.showChildView('lst', this.tableView);
  },
});
