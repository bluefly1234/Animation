/**
 * p_jiewwang email@ahthw.com
 * 2016年6月23日
 */
var imgurl = 'images/rabbit.png';
var imgurl2 = 'images/rabbit2.png';
var positions = ['0 -697', '-174 -697', '-349 -697', '-524 -697', '-698 -697', '-873 -694'];
var positions2 = ['-8 -69', '-92 -69', '-180 -69', '-269 -69', '-360 -69', '-440 -69'];
var ele = document.getElementById("rabbit");
var ele2 = document.getElementById("deer")

animation(ele, positions, imgurl)
animation(ele2, positions2, imgurl2)

function animation(ele, positions, imgurl) {
	ele.style.backgroundImage = 'url(' + imgurl + ')';
	ele.style.backgroundRepeat = 'no-repeat';

	var index = 0;

	function run() {
		var position = positions[index].split(' ');

		ele.style.backgroundPosition = position[0] + 'px' + ' ' +
			position[1] + 'px';
		index++;

		if (index >= positions.length) {
			index = 0;
		}

		setTimeout(run, 80)

	};
	run();
}