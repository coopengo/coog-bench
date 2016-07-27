// [View]       BenchView
var $ = require('jquery'),
  Backbone = require('backbone'),
  template = require('./benchmark.tpl');
Backbone.$ = $;
module.exports = Backbone.View.extend({
  tagName: 'div',
  template: template,
  // events handle in initializer
  initialize: function () {
    this.model.on('change:status', this.render, this);
    this.listenTo(this.model, 'destroy', this.remove);
  },
  render: function () {
    var status = this.model.attributes.status;
    var hide_elems = () => {
      this.$el.find('.bench-body')
        .hide();
      this.$el.find('.bench-loading')
        .hide();
      this.$el.find('.custom-body')
        .hide();
      this.$el.find('.status')
        .hide();
      this.$el.find('.iter')
        .hide();
      this.$el.hide();
    };
    if (status == 'loading') {
      this.$el.html(this.template(this.model.toJSON()));
      hide_elems();
      this.$el.find('.bench-loading')
        .show();
      this.$el.find('.status')
        .show();
      this.$el.show();
    }
    else if (status == 'done') {
      this.$el.html(this.template(this.model.toJSON()));
      hide_elems();
      this.$el.find('.bench-body')
        .slideDown();
      this.$el.find('.iter')
        .show();
      this.$el.show();
    }
    else {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.hide();
    }
    if (this.model.attributes.custom && status == 'done') {
      hide_elems();
      this.$el.find('.custom-body')
        .show();
      this.$el.find('.iter')
        .show();
      this.$el.show();
    }
    return this;
  }
});
