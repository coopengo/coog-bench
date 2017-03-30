var Marionette = require('backbone.marionette');
var rowTpl = require('./template/row.tpl');
var tableTpl = require('./template/table.tpl');
var mainTpl = require('./template/index.tpl');
require('./template/row.css');
require('./template/table.css');
//
var Row = Marionette.View.extend({
  tagName: 'tr',
  className: 'bench-body',
  template: rowTpl,
  ui: {
    button: '.benchmark-selector-btn',
    row: '',
  },
  modelEvents: {
    'change:enable': 'actEnableChange',
    'change:status': 'render'
  },
  triggers: {
    'click @ui.button': 'clicked',
    'click @ui.row': 'clicked'
  },
  onClicked: function () {
    this.model.toggle();
  },
  actEnableChange: function (model, val) {
    if (val) {
      this.$el.removeClass(
          'bench-disable body-ready body-loading body-loaded')
        .addClass('idle');
    }
    else {
      this.$el.removeClass(
          'bench-disable body-ready body-loading body-loaded')
        .addClass('bench-disable');
    }
    this.render();
  },
  onRender: function () {
    switch (this.model.get('status')) {
    case 'working':
      this.$el.removeClass('body-ready body-loading body-loaded')
        .addClass('body-loading');
      break;
    case 'done':
      this.$el.removeClass('body-ready body-loaded body-loading')
        .addClass('body-loaded');
      break;
    }
    return this;
  },
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
    button: '#start-btn',
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
        enable: false
      })
      .length;
    this.getUI('checkbox')[0].checked = checked;
  },
  changeStatus: function () {
    this.$el.removeClass('disabled');
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
    this.$el.addClass('disabled');
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
