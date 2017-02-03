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
  events: {
    'click @ui.button': 'handleButtonClick',
    'click @ui.row': 'handleButtonClick',
  },
  triggers: {
    'click @ui.button': 'clicked',
  },
  handleButtonClick: function () {
    this.model.toggle();
  },
  actEnableChange: function (model, val) {
    if (val) {
      this.$el.removeClass('bench-disable');
    }
    else {
      this.$el.addClass('bench-disable');
    }
    this.render();
  },
  switchClass: function (cls) {
    this.$el.removeClass('body-ready');
    this.$el.removeClass('body-loaded');
    this.$el.removeClass('body-loading');
    this.$el.addClass(cls);
  },
  onRender: function () {
    switch (this.model.get('status')) {
    case 'working':
      this.switchClass('body-loading');
      break;
    case 'done':
      this.switchClass('body-loaded');
      break;
    case 'prepared':
      this.switchClass('body-ready');
      break;
    }
    return this;
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
  className: 'pure-g',
  template: tableTpl,
  ui: {
    checkbox: '.bench-all-checkbox',
    button: '#start-btn',
    button2: '#error-btn',
  },
  regions: {
    body: {
      el: 'tbody',
      replaceElement: true
    }
  },
  events: {
    'click @ui.checkbox': 'handleCheckboxClick',
    'click @ui.button': 'handleButtonClick',
    'click @ui.button2': 'handleErrorButtonClick',
  },
  childViewEvents: {
    'bench:clicked': 'updateCheckbox'
  },
  initialize: function () {
    this.benchRunning = false;
    this.timedout = false;
  },
  updateCheckbox: function () {
    var checked = !this.collection.getModulesDisabled()
      .length;
    this.getUI('checkbox')[0].checked = checked;
  },
  onRender: function () {
    this.showChildView('body', new TableBody({
      collection: this.collection
    }));
    var checked = !this.collection.getModulesDisabled()
      .length;
    this.getUI('checkbox')[0].checked = checked;
  },
  handleCheckboxClick: function () {
    var state = this.getUI('checkbox')[0].checked;
    this.collection.each((bench) => {
      bench.enable(state);
    });
  },
  handleButtonClick: function () {
    this.collection.preBench();
  },
  handleErrorButtonClick: function () {
    document.getElementById('error-container')
      .innerHTML = 'toutes les erreurs, ici';
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
