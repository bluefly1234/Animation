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