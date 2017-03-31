var storage = require('./storage');
var login = require('./login');
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
    app.trigger('error:reset');
    storage.clearSession();
    this.disconnect();
  });
  return {
    login: () => {
      var m = new login.Model();
      m.on('login', function (ok, info) {
        if (ok) {
          app.session = info;
          app.connect();
          storage.setSession(info);
          app.trigger('error:reset');
        }
        else {
          app.trigger('error:reset');
          app.trigger('error:add', info.error);
        }
      });
      app.trigger('menu:hide');
      app.getView()
        .getRegion('main')
        .show(new login.View({
          model: m
        }));
    },
  };
};
