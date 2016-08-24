var Backbone = require('backbone');
var template = require('./reconnect.tpl');
//
module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'reconnect',
  template: template,
  events: {
    'click .reconnect-btn': 'btn_clicked',
  },
  initialize: function () {},
  set_session: function (session) {
    this.session = session;
    this.username = session.username;
  },
  btn_clicked: function () {
    var pwd = this.$el.find('.reconnect-pwd')
      .val();
    if (pwd && pwd.length > 0) {
      this.login(pwd)
        .then(
          () => this.trigger('on_login', true, this), () => this.trigger(
            'on_login', false, this));
    }
  },
  login: function (pwd) {
    if (!this.session) {
      return Promise.reject('no session');
    }
    return this.session.login(this.username, pwd);
  },
  render: function () {
    this.$el.html(this.template());
    return this;
  }
});
