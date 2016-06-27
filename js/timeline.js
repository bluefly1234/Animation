"use strict";

/**
 * 时间轴方法
 *  p_jiewwang 
 *  email@ahthw.com
 * @type {number}
 */

/**
 * 兼容各个浏览器，提高动画流畅效果
 * @type {number}
 */
var DEFAULT_INTERVAL = 1000 / 60;
/**
 * 状态
 */
//初始化状态
var STATE_INITIAL = 0;
//开始状态
var STATE_START = 1;
//停止状态
var STATE_STOP = 2;
//17毫秒，接近cpu刷新
var requestAnimationFrame = (function() {
    var win = window;
    return win.requestAnimationFrame ||
        win.webkitRequestAnimationFrame ||
        win.mozRequestAnimationFrame ||
        win.oRequestAnimationFrame ||
        function(callback) {
            return win.setTimeout(callback, callback.interval || DEFAULT_INTERVAL);
        }
})();

/**
 * 清除requestAnimationFrame 解释器
 * @return     {<type>}  { description_of_the_return_value }
 */
var cancelAnimationFrame = (function() {
    var win = window;
    return win.cancelRequestAnimationFrame ||
        win.webkitCancelRequestAnimationFrame ||
        win.mozCancelRequestAnimationFrame ||
        win.oCancelRequestAnimationFrame ||
        function(id) {
            return win.clearTimeout(id);
        }
})();

/**
 * timeline时间轴
 * @class  Timeline (name)
 */
function Timeline() {
    this.animationHandler = null;
    this.state = STATE_INITIAL;
}

/**
 * 时间轴上每一次回调执行函数
 * @param time 从动画开始到当前执行的时间
 */
Timeline.prototype.onenterframe = function(time) {};
/**
 * 每一次回调的时间间隔
 *
 * @param      {<type>}  interval  The interval
 */
Timeline.prototype.start = function(interval) {
    if (this.state === STATE_START) {
        return;
    }
    this.state = STATE_START;
    this.interval = interval || DEFAULT_INTERVAL;
    startTimeline(this, +new Date());
}

/**
 * 动画停止
 */
Timeline.prototype.stop = function() {
    if (this.state !== STATE_START) {
        return;
    }
    this.state = STATE_STOP;
    if (this.starttime) {
        //记录一下从动画开始到当前停止的时间间隔
        this.dur = +new Date() - this.starttime;
    }
    cancelAnimationFrame(this.animationHandler);
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
    //无缝连接动画
    startTimeline(this, +new Date() - this.dur);
};

/**
 * Starts a timeline.
 * 时间轴动画启动函数
 * @param      {<type>}  timeline  时间轴的实例
 * @param      {<type>}  startTime  动画开始的时间戳
 */

function startTimeline(timeline, starttime) {
    timeline.starttime = starttime;
    nextTick.interval = timeline.interval;

    //记录上一次回调的时间戳
    var prevTime = +new Date();
    nextTick();

    /**
     * 每一帧执行的函数
     */
    function nextTick() {
        var nowTime = +new Date();

        //如果当前时间与上一次回调的时间戳大宇设置的时间间隔，
        //表示这一次可以执行回调函数onenterframe
        timeline.animationHandler = requestAnimationFrame(nextTick);
        if (nowTime - prevTime >= timeline.interval) {
            timeline.onenterframe(nowTime - starttime);
            prevTime = nowTime;
        }
    }
}

module.exports = Timeline;