var Backbone = require('backbone');
var Storage = require('./storage');
//
var MenuModel = Backbone.Model.extend({
  logout: function () {
    Storage.closeSession();
    location.reload();
  },
  clean: function () {
    location.reload();
  },
  drop: function () {
    this.trigger('bench:drop');
  },
  save: function () {
    this.trigger('bench:save');
  },
});
//
module.exports = MenuModel;
