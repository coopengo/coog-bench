var $ = require('jquery'),
  Backbone = require('backbone');
var template = require('./benchmark.tpl');
Backbone.$ = $;
module.exports = Backbone.View.extend({
  tagName: 'tr',
  className: 'bench-body',
  template: template,
  events: {
    'click .benchmark-selector-btn': 'on_btn_clicked',
  },
  initialize: function () {
    this.model.on('change:status', this.render, this);
    this.model.on('change:enable', this.toggle, this);
    this.model.on('destroy', this.remove, this);
  },
  on_btn_clicked: function () {
    this.model.toggle();
  },
  toggle: function (model, val) {
    if (val) {
      this.$el.find('.benchmark-selector-btn')
        .addClass('bench-selector-ok');
      this.$el.find('.benchmark-selector-btn')
        .removeClass('bench-selector-ko');
      this.$el.removeClass('bench-disable');
    }
    else {
      this.$el.find('.benchmark-selector-btn')
        .removeClass('bench-selector-ok');
      this.$el.find('.benchmark-selector-btn')
        .addClass('bench-selector-ko');
      this.$el.addClass('bench-disable');
    }
  },
  start_loading: function () {
    var elem = this.$el;
    elem.removeClass('body-ready');
    elem.addClass('body-loaded');
    this.interval_id = setInterval(() => {
      if (elem.hasClass('body-ready')) {
        elem.removeClass('body-ready');
        elem.addClass('body-loaded');
      }
      else {
        elem.addClass('body-ready');
        elem.removeClass('body-loaded');
      }
    }, 1000);
  },
  stop_loading: function () {
    clearInterval(this.interval_id);
    this.$el.removeClass('body-ready');
    this.$el.addClass('body-loaded');
  },
  render: function () {
    this.$el.html(this.template(this.model.toJSON()));
    switch (this.model.attributes.status) {
    case 'working':
      this.start_loading();
      break;
    case 'done':
      this.stop_loading();
      break;
    case 'prepared':
      this.$el.addClass('body-ready');
      this.$el.removeClass('body-loaded');
      break;
    }
    return this;
  }
});
