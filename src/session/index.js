var storage = require('./storage');
var model = require('./model');
var view = require('./view');
//
module.exports = function (app) {
  app.then(() => storage.getSession()
    .then((session) => {
      if (session) {
        app.session = session;
        app.connect();
      }
    }));
  app.on('session:logout', function () {
    storage.clearSession();
    this.disconnect();
  });
  return {
    login: () => {
      app.trigger('menu:hide');
      var login = new model.Login();
      login.on('login', function (ok, info) {
        app.trigger('error:reset');
        if (ok) {
          app.session = info;
          app.connect();
          storage.setSession(info);
        }
        else {
          app.trigger('error:add', info);
        }
      });
      app.getView()
        .getRegion('main')
        .show(new view.Login({
          model: login
        }));
    },
  };
};
