'use strict'

//初始化状态
var STATE_INITIAL = 0;
//开始状态
var STATE_START = 1;
//停止状态
var STATE_STOP = 2;

/**
 * 帧动画库类
 * p_jiewwang 
 * email@ahthw.com
 */
function Animation() {
	this.taskQueue = []; //任务链
	this.index = 0; //任务链状态
	this.state = STATE_INITIAL;
}
/**
 * Loads an image.添加一个同步任务，加载图片
 * @param  [Array] imgList 图片数组 
 * The image list
 */
Animation.prototype.loadImg = function(imgList) {

}

/**
 * 添加一个异步定时任务，通过定时器改变背景位置，实现帧动画
 *
 * @param      {<type>}  ele        The ele
 * @param      {<type>}  positions  The positions
 * @param      {<type>}  imgUrl     The image url
 */
Animation.prototype.changePosition = function(ele, positions, imgUrl) {

}

/**
 * 添加一个定时任务，通过改变image的src属性，实现帧动画
 *
 * @param      {<type>}  ele      The ele
 * @param      {<type>}  imgList  The image list
 */
Animation.prototype.changeSrc = function(ele, imgList) {

}

/**
 * 高级用法，添加一个异步定时执行的任务
 * 这个任务自定义动画每帧执行的任务函数
 *
 * @param      {<type>}  taskFn  The task function
 */
Animation.prototype.enterFrame = function(taskFn) {

}

/**
 * 添加同一个同步任务，可以在上一个任务完成后执行执行回调函数
 *
 * @param      {Function}  callback  The callback
 */
Animation.prototype.then = function(callback) {

}

/**
 * 开始执行任务，异步定义执行任务执行间隔
 *
 * @param      {<type>}  interval  The interval
 */
Animation.prototype.start = function(interval) {

}

/**
 * 添加一个同步任务，这个任务就是回退到上一个任务中
 * 实现重复上一个任务的效果，可以重复定义任务的次数
 *
 * @param      {Number}  times 重复次数
 */
Animation.prototype.repeat = function(times) {

}

/**
 * 添加一个同步任务，相当于repeat()更友好的接口，无限循环上一次任务
 */
Animation.prototype.repeatForever = function() {

}

/**
 * 设置当前任务结束后到下一个任务的间隔时长
 *
 * @param      {<type>}  time    The time
 */
Animation.prototype.wait = function(time) {

}

/**
 * 暂停当前异步定时任务
 */
Animation.prototype.pause = function() {

}


/**
 * 恢复定时任务的执行
 */
Animation.prototype.restart = function() {

}


/**
 * 释放对象内存资源
 */
Animation.prototype.dispose = function() {

}