    (function() {
    	var rightRunningMap = ["0 -854", "-174 -852", "-349 -852", "-524 -852", "-698 -851", "-873 -848"];
    	var leftRunningMap = ["0 -373", "-175 -376", "-350 -377", "-524 -377", "-699 -377", "-873 -379"];
    	var rabbitWinMap = ["0 0", "-198 0", "-401 0", "-609 0", "-816 0", "0 -96", "-208 -97", "-415 -97", "-623 -97", "-831 -97", "0 -203", "-207 -203", "-415 -203", "-623 -203", "-831 -203", "0 -307", "-206 -307", "-414 -307", "-623 -307"];
    	var rURL = ['images/rabbit-big.png', 'images/rabbit-win.png'];
    	var r = document.querySelector('#rabbit');
    	var frame = 3;
    	var framelength = 6;
    	var initLeft = 100;
    	var finalLeft = 400;
    	var interval = 50;
    	var speed = 6;
    	var right = true;
    	var x = 0;
    	var position = 0;
    	var rabbitAnimation = animation().loadImg(rURL).then(function() {
    		r.style.backgroundImage = 'url(' + rURL[0] + ')'
    	}).enterFrame(function(next, time) {
    		var radio = time / interval | 0;
    		if (right) {
    			x = Math.min(initLeft + radio * 6, finalLeft);
    			position = rightRunningMap[frame].split(' ');
    			if (x === finalLeft) {
    				right = false;
    				frame = 3;
    				next();
    				return;
    			}
    		} else {
    			x = Math.max(finalLeft - radio * 6, initLeft);
    			position = leftRunningMap[frame].split(' ');
    			if (x === initLeft) {
    				right = true;
    				frame = 3;
    				next();
    				return;
    			}
    		}
    		if (++frame === framelength) {
    			frame = 0;
    		}
    		r.style.backgroundPosition = position[0] + 'px ' + position[1] + 'px';
    		r.style.left = x + 'px';
    	}).repeat(1).wait(1000).changePosition(r, rabbitWinMap, rURL[1]).start(interval);
    	//var rabbitAnimation = animation().loadImage(rURL).changePosition(r,rabbitWinMap,rURL[1]).start(interval);
    })();