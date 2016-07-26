//[Model]   LoginModel

var $           = require('jquery'),
  Backbone      = require('backbone');
Backbone.$ = $;

module.exports = Backbone.Model.extend({
    defaults: function() {
        return {
            name    : '',
            value   : '',
            valid   : true,
            type    : 'text',
            filled  : false,
        };
    },
});