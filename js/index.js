var $ = require('jquery');
var Backbone = require('backbone');
Backbone.$ = $;
var template = require('./template.tpl');
var View = Backbone.View.extend({
  el: 'body',
  template: template,
  render: function () {
    this.$el.html(this.template({
      name: 'Coopengo'
    }));
  }
});
$(() => {
  var view = new View();
  view.render();
});
