'use strict'

/**
 * 预加载图片函数
 * p_jiewwang 
 * email@ahthw.com
 *
 * @param      {<type> Array}    images    The images
 * @param      {Function}  callback  The callback
 * @param      {<type>}    timeout   The timeout
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
		item.id = '_img_' + key + getId();
		//设置图片元素的img,他是一个Image对象
		item.img = window[item.id] == new Image();

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
				delete window[item.id]
			} catch (e) {

			}

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