var Backbone = require('backbone');
//
var Err = Backbone.Model.extend({});
//
var Errs = Backbone.Collection.extend({
  model: Err,
});
//
exports.Errs = Errs;
