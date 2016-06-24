(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["animation"] = factory();
	else
		root["animation"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	"use strict";
	var loadImg = __webpack_require__(1);
	var TimeLine = __webpack_require__(2)

	/**
	 * 帧动画库类
	 * p_jiewwang 
	 * email@ahthw.com
	 */

	//初始化状态
	var STATE_INITIAL = 0;
	//开始状态
	var STATE_START = 1;
	//停止状态
	var STATE_STOP = 2;

	//同步任务
	var TASK_SYNC = 0;
	//异步任务
	var TASK_ASYNC = 1;

	/**
	 * 简单的函数封装，执行callback
	 *
	 * @param  {Function}  callback  The 执行函数
	 */
	function next(callback) {
		callback && callback();
	}
	/**
	 * 类库
	 */

	function Animation() {
		this.taskQueue = []; //任务链
		this.index = 0; //任务链状态
		this.timeline = new TimeLine();
		this.state = STATE_INITIAL;
	}
	/**
	 * Loads an image.添加一个同步任务，加载图片
	 * @param  [Array] imgList 图片数组 
	 * The image list
	 */
	Animation.prototype.loadImg = function(imgList) {
			var taskFn = function(next) {
				//要求数组深拷贝
				loadImg(imgList.slice(), next);
			};

			var type = TASK_SYNC;
			return this._add(taskFn, type) //最后定义_add方法
		}
		/**
		 * 添加一个异步定时任务，通过定时器改变背景位置，实现帧动画
		 *
		 * @param      {<type>}  ele        The ele
		 * @param      {<type>}  positions  The positions
		 * @param      {<type>}  imgUrl     The image url
		 */
	Animation.prototype.changePosition = function(ele, positions, imgUrl) {
		var len = positions.length;
		var taskFn;
		var type;
		if (len) {
			var me = this;
			taskFn = function(next, time) {
				if (imgUrl) {
					ele.style.backgroundImage = 'url(' + imgUrl + ')';
				}
				// 获得当前背景图片位置下标 ,参考demo1 time/me.interval  | 0  取整
				var index = Math.min(time / me.interval | 0, len - 1);
				var position = positions[index].split(' ');
				//改变dom对象的背景图片位置索引(坐标)
				ele.style.backgroundPosition = position[0] + 'px' + ' ' + position[1] + 'px';
				if (index === len - 1) {
					//图片最后一帧实现下一个方法
					next()
				};
			}
			type = TASK_SYNC;
		} else {
			taskFn = next;
			type = TASK_SYNC;
		}
		return this._add(taskFn, type)
	}

	/**
	 * 添加一个定时任务，通过改变image的src属性，实现帧动画
	 *
	 * @param      {<type>}  ele      The ele
	 * @param      {<type>}  imgList  The image list
	 */
	Animation.prototype.changeSrc = function(ele, imgList) {
		var len = imgList.length;
		var taskFn;
		var type;
		if (len) {
			var me = this;
			taskFn = function(next, time) {
				//获得当前图片的索引
				var index = Math.min(time / me.interval | 0, len - 1);
				//改变image对象的图片地址
				ele.src = imgList[index]
				if (index === len - 1) {
					next()
				}
			}
			type = TASK_ASYNC;
		} else {
			taskFn = next;
			type = TASK_SYNC;
		}
		return this._add(taskFn, type)
	}

	/**
	 * 高级用法，添加一个异步定时执行的任务
	 * 这个任务自定义动画每帧执行的任务函数
	 *
	 * @param      {<type>}  taskFn  The task function
	 */
	Animation.prototype.enterFrame = function(taskFn) {
		return this._add(taskFn, TASK_ASYNC)
	}

	/**
	 * 添加同一个同步任务，可以在上一个任务完成后执行执行回调函数
	 *
	 * @param      {Function}  callback  The callback
	 */
	Animation.prototype.then = function(callback) {
		var taskFn = function(next) {
			callback();
			next()
		}
		var type = TASK_SYNC;
		return this._add(taskFn, type);
	}

	/**
	 * 开始执行任务，异步定义执行任务执行间隔
	 *
	 * @param      {<type>}  interval  The interval
	 */
	Animation.prototype.start = function(interval) {
		if (this.state === STATE_START) {
			return this
		}
		//如果任务链中没有任务，则返回
		if (!this.taskQueue.length) {
			return this
		}
		this.state = STATE_START;
		this.interval = interval;
		this._runTask();
		return this

	}

	/**
	 * 添加一个同步任务，这个任务就是回退到上一个任务中
	 * 实现重复上一个任务的效果，可以重复定义任务的次数
	 *
	 * @param      {Number}  times 重复次数
	 */
	Animation.prototype.repeat = function(times) {
		var me = this;
		var taskFn = function() {
			if (typeof times === 'undefined') {
				//无限回退到上一任务,实现了无限循环的目的
				me.index--;
				me._runTask();
				return;
			}
			if (times) {
				times--;
				//回退
				me.index--;
				me._runTask();
			} else {
				//达到重复的次数(times-- === 0)，跳转下一个任务
				var task = me.taskQueue[me.index]
				me._next(task)
			}
		}
		var type = TASK_SYNC;
		return this._add(taskFn, type);
	}

	/**
	 * 添加一个同步任务，相当于repeat()更友好的接口，无限循环上一次任务
	 */
	Animation.prototype.repeatForever = function() {
		return this.repeat();
	}

	/**
	 * 设置当前任务结束后到下一个任务的间隔时长
	 * @param      {<type>}  time    The time
	 */
	Animation.prototype.wait = function(time) {
		if (this.taskQueue && this.taskQueue.length > 0) {
			this.taskQueue[this.taskQueue.length - 1].wait = time;
		}
		return this;
	}

	/**
	 * 暂停当前异步定时任务
	 */
	Animation.prototype.pause = function() {
		if (this.state === STATE_START) {
			this.state = STATE_STOP;
			this.timeline.stop();
			return this
		}
		return this;
	}


	/**
	 * 恢复定时任务的执行,重新执行上一次暂停的异步任务
	 */
	Animation.prototype.restart = function() {
		if (this.state === STATE_STOP) {
			this.state = STATE_START;
			this.timeline.restart();
			return this
		}
		return this;
	}


	/**
	 * 释放对象内存资源
	 */
	Animation.prototype.dispose = function() {
		if (this.state !== STATE_INITIAL) {
			this.state = STATE_INITIAL;
			this.taskQueue = null;
			this.timeline.stop();
			this.timeline = null;
			return this;
		}
		return this;
	}

	/**
	 * 私有方法 区域
	 */

	/**
	 * 添加一个任务到任务队列中
	 *
	 * @param      {<type>}  taskFn  任务方法
	 * @param      {<type>}  type    The type 任务类型
	 */
	Animation.prototype._add = function(taskFn, type) {
		this.taskQueue.push({
			taskFn: taskFn,
			type: type
		});

		return this;
	}

	/**
	 * 执行任务
	 */
	Animation.prototype._runTask = function() {
		if (!this.taskQueue || this.state !== STATE_START) {
			return;
		}
		//任务执行完毕
		if (this.index === this.taskQueue.length) {
			this.dispose();
			return;
		}
		//获得任务链上的当前任务
		var task = this.taskQueue[this.index];
		if (task.type === TASK_SYNC) {
			this._syncTask(task);
		} else {
			this._asyncTask(task);
		}
	}

	/**
	 * 同步任务
	 *
	 * @param task  执行任务的对象
	 */
	Animation.prototype._syncTask = function(task) {
		var me = this;
		var next = function() {
			//切换到一下个任务
			me._next(task);
		}
		var taskFn = task.taskFn;
		taskFn = task.taskFn;
		taskFn(next);
	}

	/**
	 *异步任务
	 * @param task  执行任务的对象
	 */
	Animation.prototype._asyncTask = function(task) {
		var me = this;
		//定义每一帧执行的回调函数
		var enterFrame = function(time) {
			var taskFn = task.taskFn;
			var next = function() {
				//停止当前任务
				me.timeline.stop();
				//执行下一个任务
				me._next(task);
			};
			taskFn(next, time)
		}
		this.timeline.onenterframe = enterFrame;
		this.timeline.start(this.interval)
	}

	/**
	 * 切换到下一个任务
	 * wait(如果当前任务需要等待，则延时执行),重构_next,增加
	 * 增加 @param task 当前任务
	 */
	Animation.prototype._next = function(task) {
		this.index++;
		var me = this;
		task.wait ? setTimeout(function() {
			me._runTask()
		}, task.wait) : this._runTask();
	};



	module.exports = function() {
		return new Animation();
	}

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * 预加载图片函数
	 * p_jiewwang 
	 * email@ahthw.com
	 *
	 * @param  {<type> Array} images 加载图片的数组或对象
	 * @param  {Function}  callback  全部图片加载完的回调
	 * @param  {<type>}    timeout   加载超时的时间
	 */
	function loadImg(images, callback, timeout) {
		//加载完成图片的计数器
		var count = 0;
		//全部图片加载成功标志
		var success = true;
		//超时timer的id
		var timeoutId = 0;
		//是否加载超时的标志位
		var isTimeout = false;

		//对图片数组（对象）进行遍历
		for (var key in images) {
			//过滤prototype上的属性
			if (images.hasOwnProperty(key)) {
				continue;
			}
			//获得每个图片元素
			//期望格式是object:{src:xxx}
			var item = images[key];

			if (typeof item === "string") {
				item = images[key] = {
					src: item
				};
			}

			//如果格式不满足期望，丢掉这条数据进行下一步判断
			if (!item || !item.src) {
				continue;
			}

			//计数器+1
			count++;
			//设置图片元素的id
			item.id = '__img__' + key + getId();
			//设置图片元素的img,他是一个Image对象
			item.img = window[item.id] = new Image();

			doLoad(item);
		}

		//如果遍历完成计数为0，直接调用callback
		if (!count) {
			callback(success)
		} else if (timeout) {
			timeoutId = setTimeout(onTimeout, timeout)
		}
		/**
		 * 真正进行图片加载的函数
		 * @param  {<type>}  item  图片元素对象
		 */

		function doLoad(item) {
			item.status = "loading";

			var img = item.img;
			//定义图片加载成功的回调函数
			img.onload = function() {
				success = success & true;
				item.status = 'loaded';
				done();
			}

			//定义图片加载失败的回调函数
			img.onerror = function() {
				success = false;
				item.status = 'error';
				done();
			}

			//发起了一个http请求
			img.src = item.src;
			/**
			 * 每个图片加载完的回调函数
			 */
			function done() {
				//清理操作，清理这些事件，解除绑定
				img.onload = img.onerror = null;
				try {
					delete window[item.id];
				} catch (e) {}

				//每张图片加载完成后，计数器-1，当所有图片加载完成且没有超时
				//清除超时，且执行回调函数
				if (!--count && !isTimeout) { //加完完成
					clearTimeout(timeoutId);
					callback(success)
				}
			}
		}

		//超时函数
		function onTimeout() {
			isTimeout = true;
			callback(false);
		}
	}

	var __id = 0;

	function getId() {
		return ++__id;
	}

	module.exports = loadImg;

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";

	/**
	 * 时间轴方法
	 *	p_jiewwang 
	 *	email@ahthw.com
	 * @type {number}
	 */

	/**
	 * 状态
	 */
	var STATE_INITIAL = 0; //初始化状态
	var STATE_START = 1; //开始状态
	var STATE_STOP = 2; //停止状态
	/**
	 * 兼容各个浏览器，提高动画流畅效果
	 * @type {number}
	 */
	var DEFAULT_INTERVAL = 1000 / 60;
	//17毫秒，接近cpu刷新
	var requestAnimationFrame = (function() {
		return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			function(callback) {
				return window.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);
			};
	})()

	/**
	 * 清除requestAnimationFrame 解释器
	 * @return     {<type>}  { description_of_the_return_value }
	 */
	var cancelAnimationFrame = (function() {
		return window.cancelAnimationFrame ||
			window.webkitCancelAnimationFrame ||
			window.mozCancelAnimationFrame ||
			window.oCancelAnimationFrame ||
			function(id) {
				return window.clearTimeout(id);
			};
	})();

	/**
	 * timeline时间轴
	 * @class  Timeline (name)
	 */
	function Timeline() {
		this.animationHandler = 0;
		this.state = STATE_INITIAL;
	}

	/**
	 * 时间轴上每一次回调执行函数
	 * @param time 从动画开始到当前执行的时间
	 */
	Timeline.prototype.onenterframe = function(time) {

	}

	/**
	 * 每一次回调的时间间隔
	 *
	 * @param      {<type>}  interval  The interval
	 */
	Timeline.prototype.start = function(interval) {
		if (this.state === STATE_START) {
			return;
			this.state = STATE_START;

			this.interval = interval || DEFAULT_INTERVAL;
			startTimeline(this, +new Date())
		}
	}

	/**
	 * 动画停止
	 */
	Timeline.prototype.stop = function() {
		if (this.state !== STATE_START) {
			return;
		}
		this.state = STATE_STOP;

		if (this.startTime) {
			//记录一下从动画开始到当前停止的时间间隔
			this.dur = +new Date() - this.startTime;
		}
		cancelAnimationFrame(this.animationHandler)
	}

	/**
	 * 重新开始动画
	 */
	Timeline.prototype.restart = function() {
		if (this.state === STATE_START) {
			return;
		}
		if (!this.dur || !this.interval) {
			return;
		}
		this.state = STATE_START;
		//如果不减去，就会丢掉在stop时间。
		//完全连接动画
		startTimeline(this, +new Date() - this.dur)
	}

	/**
	 * Starts a timeline.
	 * 时间轴动画启动函数
	 * @param      {<type>}  timeline  时间轴的实例
	 * @param      {<type>}  startTime  动画开始的时间戳
	 */
	function startTimeline(timeline, startTime) {
		timeline.startTime = startTime;
		nextTick.interval = timeline.interval;

		//记录上一次回调的时间戳
		var lastTick = +new Date();
		nextTick();

		/**
		 * 每一帧执行的函数
		 */
		function nextTick() {
			var now = +new Date()
			timeline.animationHandler = requestAnimationFrame(nextTick);

			//如果当前时间与上一次回调的时间戳大宇设置的时间间隔，表示这次可以执行
			//回调函数onenterframe
			if (now - lastTick >= timeline.interval) {
				timeline.onenterframe(now - startTime);
				lastTick = now;
			}
		}
	}


	module.exports = Timeline;

/***/ }
/******/ ])
});
;