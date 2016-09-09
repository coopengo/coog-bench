var Marionette = require('backbone.marionette');
var benchCollection = require('./collection.js');
var tableTpl = require('./template/table.tpl');
var rowTpl = require('./template/row.tpl');
var mainTpl = require('./template/index.tpl');
require('./template/table.css');
require('./template/row.css');
//
var row = Marionette.View.extend({
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
exports.row = row;
//
var TableBody = Marionette.CollectionView.extend({
  tagName: 'tbody',
  childView: row,
  childViewEventPrefix: 'bench',
});
//
var table = Marionette.View.extend({
  tagName: 'div',
  className: 'pure-g',
  template: tableTpl,
  ui: {
    checkbox: '.bench-all-checkbox',
    button: '#start-btn'
  },
  regions: {
    body: {
      el: 'tbody',
      replaceElement: true
    }
  },
  events: {
    'click @ui.checkbox': 'handleCheckboxClick',
    'click @ui.button': 'handleButtonClick'
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
});
exports.table = table;
//
exports.main = Marionette.View.extend({
  template: mainTpl,
  regions: {
    'lst': '#benchList'
  },
  initialize: function (options) {
    this.collection = new benchCollection(null, {
      session: options.session
    });
    this.collection.initBenchs();
    this.tableView = new table({
      collection: this.collection
    });
  },
  onRender: function () {
    this.showChildView('lst', this.tableView);
  },
});
