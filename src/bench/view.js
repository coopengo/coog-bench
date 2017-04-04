var Marionette = require('backbone.marionette');
var rowTpl = require('./template/row.tpl');
var benchTpl = require('./template/bench.tpl');
var mainTpl = require('./template/index.tpl');
require('./style.css');
//
var BenchRow = Marionette.View.extend({
  tagName: 'tr',
  template: rowTpl,
  ui: {
    row: 'td',
  },
  modelEvents: {
    'change': 'render',
  },
  triggers: {
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
var Bench = Marionette.View.extend({
  className: 'container-fluid',
  template: benchTpl,
  ui: {
    selection: '#selection-btn',
    button: '#bench-start-btn',
  },
  regions: {
    body: {
      el: 'tbody',
      replaceElement: true
    }
  },
  triggers: {
    'click @ui.selection': 'multiselect',
    'click @ui.button': 'start',
  },
  onMultiselect: function () {
    var count = 0;
    var state = false;
    this.collection.each((bench) => {
      if (bench.get('selected')) {
        count++;
      }
    });
    if (this.collection.length === count || this.collection.length === 0) {
      this.collection.each((bench) => {
        bench.toggle(state);
        bench.set('selected', state);
      });
    }
    else {
      this.collection.each((bench) => {
        bench.set('selected', true);
      });
    }
  },
  onStart: function () {
    this.collection.execute();
  },
  collectionEvents: {
    'change:active': 'toggleActive'
  },
  toggleActive: function (active) {
    if (active === true) {
      this.$el.addClass('bench-disabled');
    }
    else {
      this.$el.removeClass();
    }
  },
  onRender: function () {
    this.showChildView('body', new BenchTableBody({
      collection: this.collection
    }));
  },
});
//
var Benchs = Marionette.View.extend({
  template: mainTpl,
  regions: {
    'lst': '#benchList'
  },
  initialize: function () {
    this.tableView = new Bench({
      collection: this.collection
    });
  },
  onRender: function () {
    this.showChildView('lst', this.tableView);
  },
});
//
exports.Benchs = Benchs;
