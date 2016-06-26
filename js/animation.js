"use strict";
var loadImg = require('./loadimg');
var TimeLine = require('./timeline');

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
		//_add返回的是this，这样写一句顶两句，既返回了this也执行了_add
		return this._add(taskFn, type) //最后定义_add方法
	}
	/**
	 * 添加一个异步定时任务，通过定时器改变背景位置，实现帧动画
	 *
	 * @param      {<type>}  ele        The ele
	 * @param      {<type>}  positions  The positions 背景位置数组
	 * @param      {<type>}  imgUrl     The image url
	 */
Animation.prototype.changePosition = function(ele, positions, imgUrl) {
	var self = this;
	var len = positions.length;
	var taskFn;
	var type;
	if (len) {
		if (imgUrl) {
			ele.style.backgroundImage = 'url(' + imgUrl + ')';
		}
		taskFn = function(next, time) {
			// 获得当前背景图片位置下标 ,参考demo1 time/that.interval  | 0  取整
			//  time / this.interval | 0 相当于 Math.floor(time / this.interval);  但是效率更好
			var index = Math.min(time / self.interval | 0, len) - 1;
			var position = positions[index].split(' ');

			//改变dom对象的背景图片位置索引(坐标)
			ele.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
			if (index === len - 1) {
				//图片最后一帧实现下一个方法
				next();
			};
		}
		type = TASK_SYNC;
	} else {
		taskFn = next;
		type = TASK_SYNC;
	}
	return this._add(taskFn, type);
}

/**
 * 添加一个定时任务，通过改变image的src属性，实现帧动画
 *
 * @param      {<type>}  ele      The ele
 * @param      {<type>}  imgList  The image list
 */
Animation.prototype.changeSrc = function(ele, imgList) {
	var self = this;
	var len = imgList.length;
	var taskFn;
	var type;
	if (len) {
		taskFn = function(next, time) {
			//获得当前图片的索引
			var index = Math.min(time / self.interval | 0, len - 1);
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
 * @param  {<type>}  taskFn 自定义每帧的任务函数
 */
Animation.prototype.enterFrame = function(taskFn) {
	return this._add(taskFn, TASK_ASYNC);
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
	return this._add(taskFn, TASK_SYNC);
}

/**
 * 开始执行任务，异步定义执行任务执行间隔
 *
 * @param      {<type>}  interval  The interval
 */
Animation.prototype.start = function(interval) {
	if (this.state === STATE_START) {
		return this;
	}
	//如果任务链中没有任务，则返回
	if (!this.taskQueue.length) {
		return this
	}
	this.state = STATE_START;
	this.interval = interval;
	this._runTask();
	return this;
}

/**
 * 添加一个同步任务，这个任务就是回退到上一个任务中
 * 实现重复上一个任务的效果，可以重复定义任务的次数
 *
 * @param      {Number}  times 重复次数
 */
Animation.prototype.repeat = function(times) {
	var self = this;
	var taskFn = function(next) {
		if (typeof times === 'undefined') {
			self.index--;
			self._runTask();
			return;
		}
		if (times) {
			times--;
			self.index--;
			self._runTask();
		} else {
			self._next(self.taskQueue[self.index]);
		}
	}
	return this._add(taskFn, TASK_SYNC);
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
		return this;
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
		return this;
	}
	return this;
}


/**
 * 释放对象内存资源
 */
Animation.prototype.dispose = function() {
	if (this.state !== STATE_INITIAL) {
		this.state = STATE_INITIAL;
		this.timeline.stop();
		this.timeline = null;
		this.taskQueue = [];
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
};

/**
 * 同步任务
 *
 * @param task  执行任务的对象
 */
Animation.prototype._syncTask = function(task) {
	var self = this;
	var next = function() {
		self._next(task);
	}
	task.taskFn(next);
}

/**
 *异步任务
 * @param task  执行任务的对象
 */
Animation.prototype._asyncTask = function(task) {
	var self = this;
	//定义每一帧执行的回调函数
	var enterFrame = function(time) {
		var taskFn = task.taskFn;
		var next = function() {
			self.timeline.stop();
			self._next(task);
		}
		taskFn(next, time);
	}
	this.timeline.onenterframe = enterFrame;
	this.timeline.start(this.interval);
}

/**
 * 切换到下一个任务
 * wait(如果当前任务需要等待，则延时执行),重构_next,增加
 * 增加 @param task 当前任务
 */
Animation.prototype._next = function(task) {
	var self = this;
	this.index++;
	task.wait ?
		setTimeout(function() {
			self._runTask();
		}, task.wait) :
		this._runTask();
};

/**
 * 简单的函数封装，执行callback
 *
 * @param  {Function}  callback  The 执行函数
 */
function next(callback) {
	callback && callback();
}

module.exports = function() {
	return new Animation();
}