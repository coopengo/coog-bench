//[Collection]  LoginLst
var $ = require('jquery'),
  Backbone = require('backbone');
Backbone.$ = $;
var LoginModel = require('../models/login.js');
require('backbone.localstorage');
module.exports = Backbone.Collection.extend({
  model: LoginModel,
  localStorage: new Backbone.LocalStorage('logins-backbone'),
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
