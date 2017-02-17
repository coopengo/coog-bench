var Backbone = require('backbone');
//
var ErrorModel = Backbone.Model.extend({});
//
var ErrorCollection = Backbone.Collection.extend({
  model: ErrorModel,
});
//
module.exports = ErrorCollection;
