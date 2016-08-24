/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var Session = __webpack_require__(2);
	//
	var BenchAppView = __webpack_require__(3),
	  LoginAppView = __webpack_require__(17);
	var AppView = Backbone.View.extend({
	  initialize: function () {
	    this.is_logged()
	      .then(
	        (session) => this.on_connection(session), () => {
	          this.log = new LoginAppView();
	          this.log.on('logged', this.on_connection, this);
	          this.log.render();
	        });
	  },
	  on_connection: function (session) {
	    this.session = session;
	    // save session
	    this.session.pack()
	      .then((pack) => {
	        sessionStorage.pack = pack;
	      });
	    // close login
	    if (this.log) {
	      this.log.close();
	      this.log.remove();
	      this.log = null;
	    }
	    // start BenchAppView
	    this.bench = new BenchAppView(session);
	    // listen to logout
	  },
	  on_logout: function () {
	    this.session = null;
	    // close bench
	    // start LoginAppView
	    this.log = new LoginAppView();
	    // listen to logged
	    this.log.on('logged', this.on_connection, this);
	    this.log.render();
	  },
	  is_logged: function () {
	    if (typeof (Storage) !== 'undefined' && sessionStorage.pack) {
	      return Session.unpack(sessionStorage.pack)
	        .then(
	          (session) => {
	            return session.rpc('model.res.user.get_preferences', [], {})
	              .then(
	                () => {
	                  return session; 
	                }, () => {
	                  return Promise.reject();
	                });
	          }, () => {
	            return Promise.reject();
	          });
	    }
	    return Promise.reject();
	  }
	});
	Backbone.$(() => {
	  new AppView();
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = Backbone;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = Session;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var template = __webpack_require__(4);
	var BenchView = __webpack_require__(5);
	var ReconnectView = __webpack_require__(7);
	var Notificator = __webpack_require__(9);
	var BenchLatency = __webpack_require__(13);
	var BenchModel = __webpack_require__(15);
	var BenchList = __webpack_require__(16);
	//
	var BENCH_MODEL = 'utils.benchmark_class';
	//
	module.exports = Backbone.View.extend({
	  tagName: 'div',
	  className: 'bench-app',
	  template: template,
	  events: {
	    'click #start_btn': 'start_benchmark',
	    'click .bench-all-checkbox': 'toggle_all'
	  },
	  initialize: function (session) {
	    this.session = session;
	    this.collection = new BenchList();
	    this.bench_running = false;
	    this.timedout = false;
	    this.collection.set_session(session);
	    this.initial_render();
	    this.all_checkbox = this.$('.bench-all-checkbox')[0];
	    this.listenTo(this.collection, 'add', this.add_one);
	    this.listenTo(this.collection, 'all', this.render);
	    this.listenTo(this.collection, 'timedout', this.session_timedout);
	    this.inti_benchs();
	  },
	  initial_render: function () {
	    Backbone.$('body')
	      .empty();
	    Backbone.$('body')
	      .append(this.$el);
	    this.$el.html(this.template);
	  },
	  render: function () {
	    this.all_checkbox.checked = !this.collection.disable()
	      .length;
	  },
	  add_one: function (bench) {
	    var view_bench = new BenchView({
	      model: bench
	    });
	    this.$('#bench-container')
	      .append(view_bench.render()
	        .el);
	  },
	  inti_benchs: function () {
	    var new_bench = (desc) => {
	      if (!desc[1].server_side) {
	        return new_client_side_bench(desc);
	      }
	      var bench = new BenchModel({
	        title: desc[1].name,
	        order: this.collection.next_order(),
	        method: desc[0],
	        use_db: desc[1].requires_setup,
	      });
	      bench.set_session(this.session);
	      this.collection.add(bench);
	    };
	    var new_client_side_bench = (desc) => {
	      // create and save a custom Model inheriting from Benchmark model
	      var bench = new BenchLatency({
	        title: desc[1].name,
	        order: this.collection.next_order(),
	        method: desc[0],
	        use_db: desc[1].requires_setup,
	        custom: true
	      });
	      bench.set_session(this.session);
	      this.collection.add(bench);
	    };
	    this.session.rpc('model.' + BENCH_MODEL + '.' + '_benchmark_list', [], {})
	      .then((ret) => {
	        ret.methods.forEach(new_bench);
	      });
	  },
	  start_benchmark: function () {
	    var bench_running = (state) => {
	      this.collection.each(function (bench) {
	        bench.set('started', state);
	      });
	      this.bench_running = state;
	    };
	    if (!this.bench_running && !this.timedout) {
	      bench_running(true);
	      this.collection.start_bench()
	        .then(
	          () => {
	            bench_running(false);
	          }, () => {
	            bench_running(false);
	          });
	    }
	    else {
	      Notificator.new_notif('Can\'t launch benchmarks now', 'error');
	    }
	  },
	  toggle_all: function () {
	    var state = this.all_checkbox.checked;
	    this.collection.each((bench) => {
	      bench.toggle(state);
	    });
	  },
	  session_timedout: function () {
	    Notificator.new_notif('Session timed out', 'error');
	    var view = new ReconnectView();
	    view.set_session(this.session);
	    this.listenTo(view, 'on_login', this.on_login);
	    this.timedout = true;
	    this.$('#reconnect-area')
	      .append(view.render()
	        .el);
	  },
	  on_login: function (val, view) {
	    if (val) {
	      this.stopListening(view);
	      view.remove();
	      this.timedout = false;
	      Notificator.new_notif('You are logged');
	    }
	    else {
	      Notificator.new_notif('Bad password', 'error');
	    }
	  }
	});


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="pure-g">\n   <div class="pure-u-1 pure-u-md-1-6 pure-u-lg-1-4"></div>\n   <div class="pure-u-1 pure-u-md-2-3 pure-u-lg-1-2">\n\n      <div class="pure-g">\n        <div class="pure-u-1">\n           <div id="title">\n              <img class="company-img" src="dist/img/coopengo.png" alt="Coopengo">\n              <p>C<span class="blue">oo</span>g Benchmark</p>\n           </div>\n        </div>\n        <div class="pure-u-1">\n          <p class="home-right-title">Powered by Co<span class="blue">open</span>go</p>\n        </div>\n      </div>\n\n      <div class="pure-g">\n\n        <div class="pure-u-1">\n           <div id="notification-area"></div>\n        </div>\n\n        <div class="pure-u-1">\n           <div id="reconnect-area"></div>\n        </div>\n\n        <div class="pure-u-1">\n          <table class="pure-table pure-table-horizontal bench-table" style="width: 100%">\n              <thead>\n                  <tr>\n                      <th class="align-center bench-all-checkbox-container" > <input class="bench-all-checkbox" type="checkbox" name="enable"> </th>\n                      <th class="align-center" ></th>\n                      <th class="align-center" >Iteration</th>\n                      <th class="align-center" >Average</th>\n                      <th class="align-center" >Minimum</th>\n                      <th class="align-center" >Maximum</th>\n                      <!-- <th class="align-center" >Score</th> -->\n                  </tr>\n              </thead>\n              <tbody id="bench-container"></tbody>\n          </table>\n        </div>\n\n        <div class="pure-u-1">\n           <button class="pure-button" id="start_btn">Start Bench</button>\n        </div>\n\n\n      </div>\n\n\n    </div>\n   <div class="pure-u-1 pure-u-md-1-6 pure-u-lg-1-4"></div>\n</div>\n';

	}
	return __p
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var template = __webpack_require__(6);
	//
	module.exports = Backbone.View.extend({
	  tagName: 'tr',
	  className: 'bench-body',
	  template: template,
	  events: {
	    'click .benchmark-selector-btn': 'on_btn_clicked',
	  },
	  initialize: function () {
	    this.model.on('change:status', this.render, this);
	    this.model.on('change:enable', this.toggle, this);
	    this.model.on('destroy', this.remove, this);
	  },
	  on_btn_clicked: function () {
	    this.model.toggle();
	  },
	  toggle: function (model, val) {
	    if (val) {
	      this.$el.find('.benchmark-selector-btn')
	        .addClass('bench-selector-ok');
	      this.$el.find('.benchmark-selector-btn')
	        .removeClass('bench-selector-ko');
	      this.$el.removeClass('bench-disable');
	    }
	    else {
	      this.$el.find('.benchmark-selector-btn')
	        .removeClass('bench-selector-ok');
	      this.$el.find('.benchmark-selector-btn')
	        .addClass('bench-selector-ko');
	      this.$el.addClass('bench-disable');
	    }
	  },
	  start_loading: function () {
	    var elem = this.$el;
	    elem.removeClass('body-ready');
	    elem.addClass('body-loaded');
	    this.interval_id = setInterval(() => {
	      if (elem.hasClass('body-ready')) {
	        elem.removeClass('body-ready');
	        elem.addClass('body-loaded');
	      }
	      else {
	        elem.addClass('body-ready');
	        elem.removeClass('body-loaded');
	      }
	    }, 1000);
	  },
	  stop_loading: function () {
	    clearInterval(this.interval_id);
	    this.$el.removeClass('body-ready');
	    this.$el.addClass('body-loaded');
	  },
	  render: function () {
	    this.$el.html(this.template(this.model.toJSON()));
	    switch (this.model.attributes.status) {
	    case 'working':
	      this.start_loading();
	      break;
	    case 'done':
	      this.stop_loading();
	      break;
	    case 'prepared':
	      clearInterval(this.interval_id);
	      this.$el.addClass('body-ready');
	      this.$el.removeClass('body-loaded');
	      break;
	    }
	    return this;
	  }
	});


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '', __e = _.escape;
	with (obj) {
	__p += '<td class="bench-checkbox-container align-center" >\n    <button class="pure-button benchmark-selector-btn bench-selector-ok"><span>&nbsp;</span></button>\n</td>\n\n<td class="" >' +
	__e( title ) +
	'</td>\n\n<td class="align-center" >' +
	__e( iter ) +
	'</td>\n<td class="align-center" >' +
	__e( avg ) +
	'</td>\n\n<td class="align-center" >' +
	__e( min ) +
	'</td>\n<td class="align-center" >' +
	__e( max ) +
	'</td>\n';

	}
	return __p
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var template = __webpack_require__(8);
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="pure-g">\n    <div class="pure-u-1-3">\n        <p style="display: inline-block">Password:</p>\n    </div>\n\n    <div class="pure-u-1-3">\n        <input class="reconnect-pwd" type="password" autocomplete="off" name="password" >\n    </div>\n\n    <div class="pure-u-1-3">\n        <input class="reconnect-btn" type="submit" value="Submit">\n    </div>\n\n</div>';

	}
	return __p
	}

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var NotificationModel = __webpack_require__(10);
	var NotificationView = __webpack_require__(11);
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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	//
	module.exports = Backbone.Model.extend({
	  initialize: function () {
	    this.lock = false;
	    this.time_lock = false;
	    this.mouse_hover = false;
	    if (this.attributes.auto_remove) {
	      this.start_timeout();
	    }
	  },
	  defaults: function () {
	    // modes: info, error, warning
	    return {
	      value: 'none',
	      mode: 'no method',
	      auto_remove: true,
	      show: true,
	      timeout: 4
	    };
	  },
	  toggle: function () {
	    this.mouse_hover = false;
	    this.to_destroy();
	  },
	  start_timeout: function (time) {
	    if (this.time_lock) {
	      return;
	    }
	    if (!time) {
	      time = this.attributes.timeout * 1000;
	    }
	    this.time_lock = true;
	    setTimeout(() => {
	      this.time_lock = false;
	      this.to_destroy();
	    }, time);
	  },
	  to_destroy: function () {
	    if (this.mouse_hover || this.lock) {
	      return;
	    }
	    if (this.time_lock) {
	      this.set('show', false);
	    }
	    else {
	      this.destroy();
	    }
	  }
	});


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var template = __webpack_require__(12);
	//
	module.exports = Backbone.View.extend({
	  tagName: 'aside',
	  template: template,
	  className: 'notification',
	  events: {
	    'dblclick': 'clear',
	    'mouseenter': 'on_mouse_enter',
	    'mouseleave': 'on_mouse_leave'
	  },
	  initialize: function () {
	    this.model.on('change:show', this.show_changed, this);
	    this.listenTo(this.model, 'destroy', this.remove);
	  },
	  show_changed: function (model, value) {
	    if (!value) {
	      this.$el.hide();
	    }
	  },
	  render: function () {
	    var model = this.model.attributes.mode;
	    if (model == 'info' || model == 'warning' || model == 'error') {
	      this.$el.addClass('notification-' + model);
	    }
	    this.$el.html(this.template(this.model.toJSON()));
	    return this;
	  },
	  clear: function () {
	    this.model.toggle();
	  },
	  on_mouse_enter: function () {
	    this.model.mouse_hover = true;
	  },
	  on_mouse_leave: function () {
	    this.model.mouse_hover = false;
	    this.model.start_timeout(1000);
	  },
	});


/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '', __e = _.escape;
	with (obj) {
	__p += '<p>' +
	__e( value ) +
	'</p>';

	}
	return __p
	}

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var co = __webpack_require__(14);
	var BenchModel = __webpack_require__(15);
	var Notificator = __webpack_require__(9);
	//
	var BENCH_MODEL = 'utils.benchmark_class';
	//
	module.exports = BenchModel.extend({
	  call_bench: function () {
	    Notificator.new_notif(this.attributes.title +
	      ' benchmarking started..');
	    this.set('status', 'working');
	    var iter = 100;
	    var times = [];
	    var fn = co.wrap(function* (model) {
	      var throw_error = function (err) {
	        model.set('status', 'prepared');
	        return Promise.reject(err);
	      };
	      var start, end;
	      for (var i = iter; i > 0; i--) {
	        start = (new Date())
	          .getTime();
	        yield model.rpc(model.session, BENCH_MODEL, model.attributes.method)
	          .then(() => {}, throw_error);
	        end = (new Date())
	          .getTime();
	        times.push(((end - start) / 1000));
	      }
	    });
	    return fn(this)
	      .then(() => {
	        times.sort();
	        var min = times.shift();
	        var max = times.pop();
	        var avg = times.reduce((a, b) => a + b) / times.length;
	        this.set({
	          status: 'done',
	          iter: iter,
	          avg: avg.toFixed(5),
	          min: min.toFixed(5),
	          max: max.toFixed(5)
	        });
	      });
	  }
	});


/***/ },
/* 14 */
/***/ function(module, exports) {

	
	/**
	 * slice() reference.
	 */

	var slice = Array.prototype.slice;

	/**
	 * Expose `co`.
	 */

	module.exports = co['default'] = co.co = co;

	/**
	 * Wrap the given generator `fn` into a
	 * function that returns a promise.
	 * This is a separate function so that
	 * every `co()` call doesn't create a new,
	 * unnecessary closure.
	 *
	 * @param {GeneratorFunction} fn
	 * @return {Function}
	 * @api public
	 */

	co.wrap = function (fn) {
	  createPromise.__generatorFunction__ = fn;
	  return createPromise;
	  function createPromise() {
	    return co.call(this, fn.apply(this, arguments));
	  }
	};

	/**
	 * Execute the generator function or a generator
	 * and return a promise.
	 *
	 * @param {Function} fn
	 * @return {Promise}
	 * @api public
	 */

	function co(gen) {
	  var ctx = this;
	  var args = slice.call(arguments, 1)

	  // we wrap everything in a promise to avoid promise chaining,
	  // which leads to memory leak errors.
	  // see https://github.com/tj/co/issues/180
	  return new Promise(function(resolve, reject) {
	    if (typeof gen === 'function') gen = gen.apply(ctx, args);
	    if (!gen || typeof gen.next !== 'function') return resolve(gen);

	    onFulfilled();

	    /**
	     * @param {Mixed} res
	     * @return {Promise}
	     * @api private
	     */

	    function onFulfilled(res) {
	      var ret;
	      try {
	        ret = gen.next(res);
	      } catch (e) {
	        return reject(e);
	      }
	      next(ret);
	    }

	    /**
	     * @param {Error} err
	     * @return {Promise}
	     * @api private
	     */

	    function onRejected(err) {
	      var ret;
	      try {
	        ret = gen.throw(err);
	      } catch (e) {
	        return reject(e);
	      }
	      next(ret);
	    }

	    /**
	     * Get the next value in the generator,
	     * return a promise.
	     *
	     * @param {Object} ret
	     * @return {Promise}
	     * @api private
	     */

	    function next(ret) {
	      if (ret.done) return resolve(ret.value);
	      var value = toPromise.call(ctx, ret.value);
	      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
	      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
	        + 'but the following object was passed: "' + String(ret.value) + '"'));
	    }
	  });
	}

	/**
	 * Convert a `yield`ed value into a promise.
	 *
	 * @param {Mixed} obj
	 * @return {Promise}
	 * @api private
	 */

	function toPromise(obj) {
	  if (!obj) return obj;
	  if (isPromise(obj)) return obj;
	  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
	  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
	  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
	  if (isObject(obj)) return objectToPromise.call(this, obj);
	  return obj;
	}

	/**
	 * Convert a thunk to a promise.
	 *
	 * @param {Function}
	 * @return {Promise}
	 * @api private
	 */

	function thunkToPromise(fn) {
	  var ctx = this;
	  return new Promise(function (resolve, reject) {
	    fn.call(ctx, function (err, res) {
	      if (err) return reject(err);
	      if (arguments.length > 2) res = slice.call(arguments, 1);
	      resolve(res);
	    });
	  });
	}

	/**
	 * Convert an array of "yieldables" to a promise.
	 * Uses `Promise.all()` internally.
	 *
	 * @param {Array} obj
	 * @return {Promise}
	 * @api private
	 */

	function arrayToPromise(obj) {
	  return Promise.all(obj.map(toPromise, this));
	}

	/**
	 * Convert an object of "yieldables" to a promise.
	 * Uses `Promise.all()` internally.
	 *
	 * @param {Object} obj
	 * @return {Promise}
	 * @api private
	 */

	function objectToPromise(obj){
	  var results = new obj.constructor();
	  var keys = Object.keys(obj);
	  var promises = [];
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    var promise = toPromise.call(this, obj[key]);
	    if (promise && isPromise(promise)) defer(promise, key);
	    else results[key] = obj[key];
	  }
	  return Promise.all(promises).then(function () {
	    return results;
	  });

	  function defer(promise, key) {
	    // predefine the key in the result
	    results[key] = undefined;
	    promises.push(promise.then(function (res) {
	      results[key] = res;
	    }));
	  }
	}

	/**
	 * Check if `obj` is a promise.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isPromise(obj) {
	  return 'function' == typeof obj.then;
	}

	/**
	 * Check if `obj` is a generator.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isGenerator(obj) {
	  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
	}

	/**
	 * Check if `obj` is a generator function.
	 *
	 * @param {Mixed} obj
	 * @return {Boolean}
	 * @api private
	 */
	function isGeneratorFunction(obj) {
	  var constructor = obj.constructor;
	  if (!constructor) return false;
	  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
	  return isGenerator(constructor.prototype);
	}

	/**
	 * Check for plain object.
	 *
	 * @param {Mixed} val
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(val) {
	  return Object == val.constructor;
	}


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var Notificator = __webpack_require__(9);
	var BENCH_MODEL = 'utils.benchmark_class';
	module.exports = Backbone.Model.extend({
	  defaults: function () {
	    // status : prepared, started, working, done
	    return {
	      title: 'no title',
	      method: 'no method',
	      enable: true,
	      use_db: true,
	      custom: false,
	      score: '- -',
	      status: 'prepared',
	      started: false,
	      iter: '-',
	      avg: '--',
	      min: '--',
	      max: '--'
	    };
	  },
	  toggle: function (force_value) {
	    if (this.attributes.started) {
	      return;
	    }
	    this.set({
	      enable: force_value || !this.get('enable')
	    });
	  },
	  will_bench: function () {
	    this.set({
	      status: 'prepared',
	      iter: '-',
	      avg: '--',
	      min: '--',
	      max: '--',
	      score: '- -'
	    });
	  },
	  set_session: function (session) {
	    this.session = session;
	  },
	  call_bench: function () {
	    Notificator.new_notif(this.attributes.title +
	      ' benchmarking started..');
	    this.set({
	      status: 'working',
	      started: true
	    });
	    return this.rpc(this.session, BENCH_MODEL, this.attributes.method)
	      .then(
	        (result) => {
	          var attr = this.read_result(result);
	          if (attr) {
	            this.set(attr);
	            this.set('status', 'done');
	          }
	        }, (err) => {
	          this.set('status', 'prepared');
	          return Promise.reject(err);
	        });
	  },
	  rpc: function (session, model_name, method_name, args, context) {
	    if (!session) {
	      Notificator.new_notif('no session setted in Bench Model', 'error');
	      return;
	    }
	    if (args === undefined) {
	      args = [];
	    }
	    if (context === undefined) {
	      context = {};
	    }
	    return session.rpc('model.' + model_name + '.' + method_name, args,
	      context);
	  },
	  read_result: function (value) {
	    var newlst = [];
	    var ret = {};
	    var lst = value.split(',');
	    if (lst.length != 4) {
	      return;
	    }
	    var remove_char = function (str, start, stop) {
	      if (!stop) {
	        stop = start;
	      }
	      if (str.startsWith(start)) {
	        str = str.substr(1, str.length - 1);
	      }
	      if (str.endsWith(stop)) {
	        str = str.substr(0, str.length - 1);
	      }
	      return str;
	    };
	    lst.forEach((str) => {
	      newlst.push(remove_char(str, ' '));
	    });
	    ret.iter = newlst[0].split(' ')[0];
	    ret.avg = newlst[1].split(' : ')[1];
	    ret.min = remove_char(newlst[2].split(' ')[2], '(', ')');
	    ret.max = remove_char(newlst[3].split(' ')[1], '(', ')');
	    return ret;
	  },
	});


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var Notificator = __webpack_require__(9);
	var BenchModel = __webpack_require__(15);
	//
	var BENCH_MODEL = 'utils.benchmark_class';
	//
	module.exports = Backbone.Collection.extend({
	  model: BenchModel,
	  set_session: function (session) {
	    this.session = session;
	  },
	  enable: function () {
	    return this.where({
	      enable: true
	    });
	  },
	  disable: function () {
	    return this.where({
	      enable: false
	    });
	  },
	  use_db: function () {
	    return this.where({
	      use_db: true,
	      enable: true
	    });
	  },
	  next_order: function () {
	    if (!this.length) {
	      return 1;
	    }
	    return this.last()
	      .get('order') + 1;
	  },
	  start_bench: function () {
	    var prm = Promise.resolve();
	    var setup_db = false;
	    var to_bench = this.enable();
	    if (!to_bench.length) {
	      Notificator.new_notif('Nothing to bench', 'warning');
	      return prm;
	    }
	    if (!this.session) {
	      Notificator.new_notif('Invalid session', 'error', 8);
	      return prm;
	    }
	    // check if database must be prepared
	    if (this.use_db()
	      .length) {
	      setup_db = true;
	    }
	    // prepare database
	    if (setup_db) {
	      prm = this.session.rpc('model.' + BENCH_MODEL + '.' +
	          '_benchmark_setup', [], {})
	        .then(
	          () => Notificator.new_notif('Database prepared', 'warning', 2),
	          (err) => {
	            if (err[0] == '403: Forbidden') {
	              this.trigger('timedout');
	              return Promise.reject();
	            }
	            else {
	              console.log(err);
	              Notificator.new_notif('Database already prepared',
	                'warning', 2);
	            }
	          });
	    }
	    // call benchs
	    to_bench.forEach((bench) => {
	      bench.will_bench();
	      prm = prm.then(
	        () => {
	          return bench.call_bench()
	            .then(
	              () => {}, (err) => {
	                if (err[0] == '403: Forbidden') {
	                  this.trigger('timedout');
	                }
	                return Promise.reject();
	              });
	        }, () => {
	          return Promise.reject();
	        });
	    });
	    // clean database if prepared
	    if (setup_db) {
	      prm = prm.then(
	        () => {
	          this.session.rpc('model.' + BENCH_MODEL + '.' +
	              '_benchmark_teardown', [], {})
	            .then(
	              () => Notificator.new_notif('Database cleaned up',
	                'warning', 2), (err) => {
	                console.log(err);
	                Notificator.new_notif('Can\'t close database', 'error',
	                  6);
	              });
	        }, () => {
	          return Promise.reject();
	        });
	    }
	    return prm;
	  },
	  comparator: 'order'
	});


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var co = __webpack_require__(14);
	var Session = __webpack_require__(2);
	var Backbone = __webpack_require__(1);
	var template = __webpack_require__(18);
	var LoginView = __webpack_require__(19);
	var LoginModel = __webpack_require__(21);
	var LoginLst = __webpack_require__(22);
	//
	var TRYTON_SERVER = 'http://localhost:7999';
	var TRYTON_DATABASE = '4.0';
	var TRYTON_LOGIN = 'admin';
	var TRYTON_PASSWORD = 'admin';
	//
	module.exports = Backbone.View.extend({
	  tagName: 'div',
	  className: 'login-app',
	  template: template,
	  events: {
	    'click #connect': 'connect',
	  },
	  initialize: function () {
	    this.initial_render();
	    this.collection = new LoginLst();
	    this.container = this.$el.find('#login-container');
	    this.listenTo(this.collection, 'add', this.add_one);
	    this.inti_models();
	  },
	  initial_render: function () {
	    Backbone.$('body')
	      .empty();
	    Backbone.$('body')
	      .append(this.$el);
	    this.$el.html(this.template);
	  },
	  add_one: function (model) {
	    var view = new LoginView({
	      model: model
	    });
	    this.container.append(view.render()
	      .el);
	  },
	  new_model: function (name, value, type) {
	    if (type === undefined) {
	      type = 'text';
	    }
	    var model = new LoginModel({
	      name: name,
	      type: type,
	      value: value,
	      order: this.collection.next_order(),
	    });
	    this.collection.add(model);
	  },
	  inti_models: function () {
	    // init all the models here
	    this.new_model('server', TRYTON_SERVER);
	    this.new_model('db', TRYTON_DATABASE);
	    this.new_model('login', TRYTON_LOGIN);
	    this.new_model('password', TRYTON_PASSWORD, 'password');
	  },
	  login: function () {
	    var func = co.wrap(function* (credentials) {
	      var session = new Session(credentials.server, credentials.db);
	      yield session.start(credentials.login, credentials.password);
	      return session;
	    });
	    var credentials = {
	      'server': this.collection.findWhere({
	          name: 'server'
	        })
	        .attributes.value,
	      'db': this.collection.findWhere({
	          name: 'db'
	        })
	        .attributes.value,
	      'login': this.collection.findWhere({
	          name: 'login'
	        })
	        .attributes.value,
	      'password': this.collection.findWhere({
	          name: 'password'
	        })
	        .attributes.value
	    };
	    return func(credentials);
	  },
	  connect: function () {
	    if (!this.collection.empty()) {
	      this.login()
	        .then(
	          (session) => this.trigger('logged', session), () => console.log(
	            'Fail to connect'));
	    }
	  },
	  close: function () {
	    // remove all views from DOM
	    // remove this from DOM
	    // unbind events
	    // delete Models in collection
	    // delete collection
	    // delete this
	  }
	});


/***/ },
/* 18 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '';
	with (obj) {
	__p += '<div class="pure-g">\n    <div class="pure-u-1-5"></div>\n    <div class="pure-u-1-5"></div>\n    <div class="pure-u-1 pure-u-md-1-3 pure-u-lg-1-5">\n\n        <div class="pure-g login-main">\n        <!-- center all -->\n\n            <!-- LOGO -->\n            <div class="pure-u-1 img-container">\n                  <img class="company-img" src="dist/img/coopengo.png" alt="Coopengo">\n            </div>\n            <!-- spacer (logo margin)-->\n\n            <div class="pure-u-1 hidden">\n                <p id="error-holder">Error:</p>\n            </div>\n\n            <div class="pure-g" id="login-container"></div>\n\n            <div class="pure-u-1 login-connection">\n                <button class="pure-button" id="connect">Connect</button>\n            </div>\n\n        </div>\n\n\n    </div>\n    <div class="pure-u-1-5"></div>\n    <div class="pure-u-1-5"></div>\n</div>\n\n';

	}
	return __p
	}

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var template = __webpack_require__(20);
	//
	module.exports = Backbone.View.extend({
	  tagName: 'div',
	  template: template,
	  className: 'pure-u-1',
	  events: {
	    'change input': 'value_changed',
	    'autocomplete input': 'value_changed',
	  },
	  render: function () {
	    this.$el.html(this.template(this.model.toJSON()));
	    return this;
	  },
	  value_changed: function () {
	    var val = this.$el.find('input')
	      .val();
	    this.model.set({
	      value: val
	    });
	  },
	  get_value_from_dom: function () {
	    return this.$el.find('input')
	      .val();
	  }
	});


/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function (obj) {
	obj || (obj = {});
	var __t, __p = '', __e = _.escape;
	with (obj) {
	__p += '<div class="pure-g">\n    <div class="pure-u-1-3">\n        <p style="display: inline-block">' +
	__e( name ) +
	':</p>\n    </div>\n\n    <div class="pure-u-2-3">\n        <input class="login-input" type="' +
	__e( type ) +
	'" autocomplete="off" name="' +
	__e( name ) +
	'" value="' +
	__e(value) +
	'">\n    </div>\n\n</div>\n';

	}
	return __p
	}

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	//
	module.exports = Backbone.Model.extend({
	  defaults: function () {
	    return {
	      name: '',
	      value: '',
	      valid: true,
	      type: 'text',
	      filled: false,
	    };
	  },
	});


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var Backbone = __webpack_require__(1);
	var LoginModel = __webpack_require__(21);
	//
	module.exports = Backbone.Collection.extend({
	  model: LoginModel,
	  next_order: function () {
	    if (!this.length) {
	      return 1;
	    }
	    return this.last()
	      .get('order') + 1;
	  },
	  empty: function () {
	    var ret = false;
	    this.models.forEach((model) => {
	      if (model.attributes.value.length <= 0) {
	        ret = true;
	      }
	    });
	    return ret;
	  },
	  comparator: 'order'
	});


/***/ }
/******/ ]);