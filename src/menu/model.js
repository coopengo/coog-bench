var Backbone = require('backbone');
//
var Menu = Backbone.Model.extend({
  defaults: {
    active: true
  }
});
//
exports.Menu = Menu;
