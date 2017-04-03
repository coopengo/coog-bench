var Backbone = require('backbone');
//
var MenuModel = Backbone.Model.extend({
  disableMenu: function () {
    this.trigger('menu:change');
  },
  enableMenu: function () {
    this.trigger('bench:done');
  }
});
//
module.exports = MenuModel;
