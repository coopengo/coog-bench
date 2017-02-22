var Session = require('tryton-session');
//
exports.setSession = function (session) {
  return session.pack()
    .then((data) => {
      localStorage.setItem('session', data);
    });
};
//
exports.getSession = function () {
  var data = localStorage.getItem('session');
  if (data) {
    return Session.unpack(data)
      .then((session) => session.check()
        .then((ok) => ok ? session : null));
  }
  else {
    return Promise.resolve(null);
  }
};
exports.closeSession = function () {
  return localStorage.clear();
};
