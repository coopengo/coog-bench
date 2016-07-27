var $ = require('jquery'),
  Backbone = require('backbone');
var LoginModel = require('../models/login.js');
Backbone.$ = $;
module.exports = Backbone.Collection.extend({
  model: LoginModel,
  next_order: function () {
    if (!this.length) {
      return 1;
    }
    return this.last()
      .get('order') + 1;
  },
  empty: function () {
    var ret = false;
    this.models.forEach((model) => {
      if (model.attributes.value.length <= 0) {
        ret = true;
      }
    });
    return ret;
  },
  comparator: 'order'
});
