var model = require('./model');
var view = require('./view');
//
module.exports = function (app) {
  app.on('before:start', function () {
    var errors = new model.Errs();
    app.getView()
      .getRegion('error')
      .show(new view.Errs({
        collection: errors
      }));
    errors.listenTo(app, 'error:add', function (error) {
      this.add({
        message: 'Error : ' + error,
      });
    });
    errors.listenTo(app, 'error:reset', function () {
      this.reset();
    });
  });
};
