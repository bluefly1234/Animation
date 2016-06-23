# 一：常见帧动画存在的问题

## 1.GIF 和 CSS3 Animation
###### (1)不能控制动画的暂停和播放
###### (2)不能捕捉完成事件
###### (3)不能对帧动画做灵活扩展

# 二：js帧动画实现的原理
**改变background-position位置来实现**

# 三：实现的功能

## 1.支持功能
###### (1).图片预加载
###### (2).2种动画播放方式和自定义每帧动画
###### (3).单组动画控制循环次数（可无限次循环）
###### (4).一组动画完成后，进行下一组动画
###### (5).每个动画完成后有等待时间
###### (6).动画暂停和播放
###### (7).动画完成后回调函数

## 2.编程接口
###### (1).loadImg(imgList) //预加载图片
###### (2).changePosition(ele, positions, imgUrl) //改变background-position位置来实现
###### (3).changeSrc(ele, imgList) //通过改变元素的src
###### (4).enterFrame(callback) //每一帧动画执行的函数
###### (5).repeat(times) //空表示无限次
###### (6).repeatForever() //无限次执行上一次的动画，相当于repeat()
###### (7).wait(time) //每个动画完成后等待的时间
###### (8).then(callback) //动画完成后执行的回调
###### (9).start(interval) //动画开始执行
###### (10).pause() //动画暂停
###### (11).restart() //动画恢复（从上一次暂停处从新执行）
###### (12).dispose() //释放资源

## 3.调用方式
###### 支持链式调用，调用方式如下
```
    var animation = require("animation");
    var demoAnimation = animation().loadImg(images).changePosition(ele,positions).repeat(2).then(
            function(){}
        );
    demoAnimation.start(80)
```

