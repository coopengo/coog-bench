var Backbone = require('backbone');
//
module.exports = Backbone.Model.extend({
  defaults: function () {
    return {
      name: '',
      value: '',
      valid: true,
      type: 'text',
      filled: false,
    };
  },
});
