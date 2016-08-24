var Backbone = require('backbone');
var NotificationModel = require('../models/notification.js');
var NotificationView = require('../views/notification/notification.js');
//
var Notificator = null;
var NotificationList = Backbone.Collection.extend({
  model: NotificationModel,
  initialize: function () {
    this.listenTo(this, 'add', this.add_one);
  },
  next_order: function () {
    if (!this.length) {
      return 1;
    }
    return this.last()
      .get('order') + 1;
  },
  new_notif: function (value, mode, time) {
    if (value === undefined) {
      return;
    }
    var attributes = {};
    attributes.mode = mode || 'info';
    attributes.value = value;
    attributes.order = this.next_order();
    if (time !== undefined) {
      attributes.timeout = time;
    }
    var notif = new NotificationModel(attributes);
    this.add(notif);
  },
  add_one: function (model) {
    var view = new NotificationView({
      model: model
    });
    Backbone.$('#notification-area')
      .append(view.render()
        .el);
  },
  comparator: 'order'
});
if (Notificator) {
  module.exports = Notificator;
}
else {
  Notificator = new NotificationList();
  module.exports = Notificator;
}
