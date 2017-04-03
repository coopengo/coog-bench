var Marionette = require('backbone.marionette');
var rowTpl = require('./template/row.tpl');
var tableTpl = require('./template/table.tpl');
var mainTpl = require('./template/index.tpl');
require('./style.css');
//
var BenchRow = Marionette.View.extend({
  tagName: 'tr',
  template: rowTpl,
  ui: {
    button: '.bench-selector-btn',
    row: 'td',
  },
  modelEvents: {
    'change': 'render',
  },
  triggers: {
    'click @ui.button': 'clicked',
    'click @ui.row': 'clicked',
  },
  onClicked: function () {
    this.model.toggle();
  },
  onRender: function () {
    this.$el.removeClass();
    this.$el.addClass('bench-row-status-' + this.model.get('status') +
      ' bench-row-selected-' + (this.model.get('selected') ? 'yes' :
        'no'));
  }
});
//
var BenchTableBody = Marionette.CollectionView.extend({
  tagName: 'tbody',
  childView: BenchRow,
  childViewEventPrefix: 'bench',
});
//
var BenchTable = Marionette.View.extend({
  className: 'container-fluid',
  template: tableTpl,
  ui: {
    checkbox: '#table-checkbox',
    button: '#bench-start-btn',
  },
  regions: {
    body: {
      el: 'tbody',
      replaceElement: true
    }
  },
  triggers: {
    'click @ui.checkbox': 'multiselect',
    'click @ui.button': 'start',
  },
  onMultiselect: function () {
    var state = this.getUI('checkbox')[0].checked;
    this.collection.each((bench) => {
      bench.toggle(state);
    });
  },
  onStart: function () {
    this.collection.execute();
  },
  collectionEvents: {
    'bench:start': 'disable',
    'bench:done': 'enable'
  },
  enable: function () {
    this.$el.removeClass('bench-disabled');
  },
  disable: function () {
    this.$el.addClass('bench-disabled');
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
  onRender: function () {
    this.showChildView('body', new BenchTableBody({
      collection: this.collection
    }));
    this.updateCheckbox();
  },
});
//
var Benchs = Marionette.View.extend({
  template: mainTpl,
  regions: {
    'lst': '#benchList'
  },
  initialize: function () {
    this.tableView = new BenchTable({
      collection: this.collection
    });
  },
  onRender: function () {
    this.showChildView('lst', this.tableView);
  },
});
//
exports.Benchs = Benchs;
