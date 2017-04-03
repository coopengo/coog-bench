var Backbone = require('backbone');
//
var ErrorModel = Backbone.Model.extend({});
//
var ErrorCollection = Backbone.Collection.extend({
  model: ErrorModel,
});
//
exports.ErrorCollection = ErrorCollection;
