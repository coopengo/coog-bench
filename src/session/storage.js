var Session = require('tryton-session');
//
exports.setSession = function (session) { // ZERO PASSAGE ICI NON PLUS
  return session.pack()
    .then((data) => {
      localStorage.setItem('session', data);
    });
};
exports.getSession = function () { // ZERO PASSAGE ICI
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
