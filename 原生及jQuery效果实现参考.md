#jQuery+Bootstrap+JS效果(蓝湖，标你妹啊，animate.css)
##jQuery
###定义
	
##原生轮播图
###轮播图公共html,css,js参考;(自己拷吧);
```css
	<style type="text/css">
		* {margin: 0;padding: 0;}
		#container {
			width: 590px;
			height: 470px;
			position: relative;
			margin: 50px auto;
			overflow: visible;
		}

		ul {
			width: 590px;
			height: 470px;
			list-style: none;
		}

		li {
			width: 590px;
			height: 470px;
			position: absolute;
			top: 0;
			left: 0;
			display: none;
		}
		.pages {
			width: 590px;
			height: 30px;
			position: absolute;
			bottom: 0;
			background: #000;
		}
		.pages i {
			display: inline-block;
			width:20px;
			height: 20px;
			border-radius: 10px;
			background: #fff;
			margin:5px;
		}

		.pages i.current {
			background: #f00;
		}

		.prev, .next {
			width: 45px;
			height: 100px;
			background: #000;
			color: #fff;
			position: absolute;
			top:0;
			bottom: 0;
			margin:auto;
			text-align: center;
			line-height: 100px;
			font-size:40px;
			cursor: pointer;
		}
		.next {
			right: 0;
		}
	</style>
```
```html
	<div id="container">
		<!-- 图片 -->
		<ul>
			<li style="display: block;"><a href="#"><img src="images/1.jpg"></a></li>
			<li><a href="#"><img src="images/2.jpg"></a></li>
			<li><a href="#"><img src="images/3.jpg"></a></li>
			<li><a href="#"><img src="images/4.jpg"></a></li>
		</ul>
		<!-- 小圆点 -->
		<div class="pages">
			<i class="current"></i>
			<i></i>
			<i></i>
			<i></i>
		</div>
		<!-- 向前/后 -->
		<div class="prev">&lt;</div>
		<div class="next">&gt;</div>
	</div>
```
	原生JS轮播图，最好先封装一个$()函数，方便找到所需的DOM节点,再封装一个animate()函数，用于图片的轮换。
```javascript
	//拿到所有的DOM元素,$得到的是一个数组，以$("#DOM")[0],$(".DOM")[0],$("TAG")[0]的格式来获取元素;
	function $(selector,context){
		context = context || document;
		return context.querySelectorAll(selector);
	}
	//animate函数的封装;
	function css(element, attr, value) {
	if (typeof attr === "object") { // 传递的 attr 参数为对象的结构，表示设置CSS属性
		for (var attrName in attr) {
			element.style[attrName] = attr[attrName];
		}
	} else if (typeof attr === "string") { // 传递的 attr 为字符串，则可能为获取CSS样式，也可能是为某单个CSS属性设置值
		// 判断是否传递 value 参数
		if (typeof value === "undefined")
			return window.getComputedStyle
					? window.getComputedStyle(element)[attr]
					: element.currentStyle[attr];

		// 设置 CSS 样式
		element.style[attr] = value;
	}
}
	function animate(element, options, speed, fn) {
	// 停止element元素上已有运动计时器
	clearInterval(element.timer);
	// 求各属性初值、区间
	var start = {}, range = {};
	for (var attr in options) {
		start[attr] = parseFloat(css(element, attr));
		range[attr] = options[attr] - start[attr];
	}
	// 记录启动计时器时间
	var startTime = +new Date();
	// 启动计时器，实现运动动画效果
	element.timer = setInterval(function(){
		// 计算运动时长
		var elapsed = Math.min(+new Date() - startTime, speed);
		// 计算各属性当前步位置
		for (var attr in options) {
			// 线性运动
			var result = elapsed * range[attr] / speed + start[attr];
			// 设置CSS
			css(element, attr, result + (attr === "opacity" ? "" : "px"));
		}
		// 判断是否结束
		if (elapsed === speed) { // 运动结束
			clearInterval(element.timer);
			// 如果运动结束后有继续执行的函数，则调用
			fn && fn();
		}
	}, 1000/60);
}
function fadeIn(element, speed, fn) {
	show(element);
	element.style.opacity = 0;
	animate(element, {opacity: 1}, speed, fn);
}

/**
   * 淡出
   */
function fadeOut(element, speed, fn) {
	animate(element, {opacity: 0}, speed, function(){
		hide(element);
		fn && fn();
	});
}
function show(element) {
	element.style.display = "block";
}
function hide(element){
	element.style.display = "none";
}		
```
###1.原生淡入淡出轮播
```javascript
	var lis = $("li"), // 所有待轮播切换的图片盒子
			len = lis.length, // 图片张数
			currentIndex = 0, // 当前正显示图片的索引
			nextIndex = 1, // 即将显示图片的索引
			circles = $("i"), // 所有小圆点
			timer = null; // 轮播计时器
		// 自动轮播
		timer = setInterval(move, 3000);

		// 轮播切换
		function move(){
			// 当前显示的图片淡出			
			fadeOut(lis[currentIndex], 400);
//			// 即将显示的图片淡入
			fadeIn(lis[nextIndex], 400);
//			// 修改小圆点样式
			circles[currentIndex].style.background = "white";
			circles[nextIndex].style.background = "red";

			// 修改待操作图片索引
			currentIndex = nextIndex;
			nextIndex++;
			if (nextIndex >= len)
				nextIndex = 0;
		}
		// 鼠标移入容器范围，停止自动轮播，移出容器范围，启动自动轮播
		$("#container")[0].onmouseenter = function(){
			clearInterval(timer);
		}
		$("#container")[0].onmouseleave = function(){
			timer = setInterval(move, 3000);
		}

		// 小圆点移入，切换对应图片，为每个小圆点绑定移入事件
		/*for (var i = 0; i < len; i++) {
			circles[i].index = i;
			circles[i].onmouseover = function(){
				// 获取当前移入小圆点的索引
				var index = this.index;
				if (currentIndex === index)
					return;
				// 设置即将显示图片的索引
				nextIndex = index;
				// 切换
				move();
			}
		}
		for (let i = 0; i < len; i++) {
			circles[i].onmouseover = function(){
				// 获取当前移入小圆点的索引
				if (currentIndex === i)
					return;
				// 设置即将显示图片的索引
				nextIndex = i;
				// 切换
				move();
			}
		}*/
		$(".pages")[0].onmouseover = function(e){
			e = e || event;
			var src = e.target || e.srcElement;
			if (src !== this) {
				// 获取 src 所表示小圆点在所有小圆点中的索引
				for (var i = 0; i < len; i++) {
					if (src === circles[i]) {
						nextIndex = i;
						move();
						break;
					}
				}
			}
		}

		// 向前/向后
		$(".prev")[0].onclick = function(){
			nextIndex = currentIndex - 1;
			if (nextIndex < 0)
				nextIndex = len - 1;
			move();
		}
		$(".next")[0].onclick = move;
```
###2.左右无缝轮播
```javascript
	var lis = $("li"), // 所有轮播图片
			len = lis.length, // 图片张数
			liWidth = lis[0].offsetWidth, // 图片盒子宽度
			currentIndex = 1,
			nextIndex = 2,
			timer = null,
			duration = 3000;

		// 克隆第一张与最后一张图片
		var first = lis[0].cloneNode(true),
			last = lis[len - 1].cloneNode(true);
		// 将克隆的第一张图片添加到最后，克隆的最后一张图片添加到最前
		$("#box")[0].appendChild(first);
		$("#box")[0].insertBefore(last, lis[0]);
		// 图片张数加上2
		len += 2;
		// 动态设置ul#box宽度，定位
		css($("#box")[0], {
			width: len * liWidth + "px",
			left: -liWidth + "px"
		});

		// 动态添加小圆点
		var html = "";
		for (let i = 0; i < len - 2; i++) {
			html += "<i></i>";
		}
		$(".pages")[0].innerHTML = html;
		// 获取所有小圆点
		var circles = $("i");
		// 第一个小圆点设置背景
		circles[0].className = "current";

		// 自动轮播
		timer = setInterval(move, duration);

		// 切换
		function move() {
			// 计算定位
			var _left = -1 * nextIndex * liWidth;
			// 运动动画
			animate($("#box")[0], {left: _left}, 200, function(){
				// 运动结束后，继续判断
				if (nextIndex >= len) {
					currentIndex = 1;
					nextIndex = 2;
					$("#box")[0].style.left = -liWidth + "px";
				}
				if (currentIndex <= 0) {
					currentIndex = len - 2;
					nextIndex = len - 1;
					$("#box")[0].style.left = (-liWidth * (len-2)) + "px";
				}
			});
			/* 修改小圆点样式 */
			// 找出修改为红色背景的小圆点索引
			var circleIndex = nextIndex - 1;
			if (circleIndex >= len - 2)
				circleIndex = 0;
			else if (circleIndex <= -1) 
				circleIndex = len - 3;
			// 清除所有小圆点所使用类名
			for (let i = 0; i < len - 2; i++) {
				circles[i].className = "";
			}
			// 将circleIndex索引处小圆点添加上类名
			circles[circleIndex].className = "current";

			// 修改索引
			currentIndex = nextIndex;
			nextIndex++;
		}

		/* 移入/出容器 */
		$("#container")[0].onmouseenter = function(){
			clearInterval(timer);
		}
		$("#container")[0].onmouseleave = function(){
			timer = setInterval(move, duration);
		}

		/* 移入小圆点事件 */
		/*for (let i = 0; i < len - 2; i++) {
			circles[i].onmouseover = function(){
				nextIndex = i + 1;
				move();
			}
		}*/
		$(".pages")[0].onmouseover = function(e){
			var src = e.target;
			if (src !== this && src.nodeName === "I") {
				// 小圆点索引
				var index = Array.from(circles).indexOf(src);
				// 即将显示图片的索引
				nextIndex = index + 1;
				move();
			}
		}

		// 向前/后
		$(".prev")[0].onclick = function(){
			nextIndex = currentIndex - 1;
			move();
		}

		$(".next")[0].onclick = function(){
			move();
		}
```
##jQuery
###1.jQuery基础
	JS库
	优点：
		轻量级;方便DOM操作、事件处理、运动动画实现、ajax......;支持使用所有的CSS的选择器来查找元素
		;跨浏览器使用：不考虑浏览器兼容;完善的API文档;非常丰富的插件;链式编程风格;隐式迭代
###2.jQuery常用方法(只是总结了部分较为常用的方法，更多方法请参考jQuery手册);
	在jQuery参考手册中提供了正则表达式和H5速查表;
	parent();parents();children();find();
	outerWidth()/outerHeight()--->默认包括补白和边框,对可见和隐藏元素均有效;
	innerWidth()/innerHeight()--->包括补白、不包括边框,对可见和隐藏元素均有效;
	height([val])/width([val])--->取得/设置匹配元素当前计算的高度值/宽度值;
	offset(val)--->offset.top/offset.left--->获取/设置当前元素在当前视口的偏移;
	position()--->position.top/position.left--->相对于父元素的偏移;
	scrollTop([val])/scrollLeft([val])--->获取/设置滚动条的偏移量;
	css()---->获取/设置元素的样式属性;
	html()/text()/val(); addClass()/removeClass();
	toggleClass()--->存在类名就删除该类，不存在类名就添加该类;
	attr()--->设置或返回被选元素的属性值。
	AJAX处理方法:
	$.ajax()/$.get()/$.getJSON()/$.getScript()/$.post();
	jQuery.extend(object)--->用来在jQuery命名空间上增加新函数;
	jQuery.fn.extend(object)--->扩展 jQuery 元素集来提供新的方法（通常用来制作插件）。
	查看这里<a href="http://docs.jquery.com/Plugins/Authoring" title="Plugins/Authoring">Plugins/Authoring</a>
	可以获取更多信息。
	data()--->在元素上存放或者读取数据;如购物车product值的存放和获取操作;
	选择器（常见选择器在这里不列出）：
	:not(selector)--->去除所有与给定选择器匹配的元素，1.3以后，支持复杂选择器;
	:eq(index)--->匹配一个给定索引值的元素;
	:gt(index)/:lt(index)--->匹配所有大于/小于给定索引值的元素;
	:last()--->获取最后个元素;
	:header--->匹配如 h1, h2, h3之类的标题元素;
	:animated--->匹配所有正在执行动画效果的元素;
	:focus--->匹配当前获取焦点的元素;
	:contains(text)--->匹配包含给定文本的元素;
	:empty--->匹配所有不包含子元素或者文本的空元素;
	:has(selector)--->匹配含有选择器所匹配的元素的元素;
	:hidden/:visible--->匹配所有的隐藏/可见元素;
	[attribute=value]--->匹配给定的属性是某个特定值的元素;
	[attribute!=value]--->匹配所有不含有指定的属性，或者属性不等于特定值的元素。
	[attribute^=value]--->匹配给定的属性是以某些值开始的元素;
	[attribute$=value]--->匹配给定的属性是以某些值结尾的元素;
	[attribute*=value]--->匹配给定的属性是以包含某些值的元素;
	:only-child--->如果某个元素是父元素中唯一的子元素，那将会被匹配;（表单元素的匹配:input;:password...）
	:disabled--->查找所有不可用的input元素;
	:checked--->匹配所有选中的被选中元素(复选框、单选框等，select中的option)，对于select元素来说，获取选中推荐使用 :selected
	:selected--->匹配所有选中的option元素;
	prop() --->获取/设置在匹配的元素集中的第一个元素的属性值。主要用于选中和没选中的状态切换;
	replaceWith(content|fn)--->将所有匹配的元素替换成指定的HTML或DOM元素;
	wrap(html|element|fn)--->把所有匹配的元素用其他元素的结构化标记包裹起来;
	replaceAll(selector)--->用匹配的元素替换掉所有 selector匹配到的元素;
	remove([expr])--->从DOM中删除所有匹配的元素;
	clone([Even[,deepEven]])--->从DOM中删除所有匹配的元素。--->克隆匹配的DOM元素并且选中这些克隆的副本;
	外部插入：
	after(content|fn)/before(content|fn)--->在每个匹配的元素之后/之前插入内容,B插入A;
	insertAfter()/insertBefore --->A插入B
	内部插入：
	append() / prepend()    --->向每个匹配的元素内部追加内容/向每个匹配的元素内部前置内容。向A追加B;
	appendTo()/ prependTo() --->把A追加到B;
	hover([over,]out)  --->标移动到一个匹配的元素上面时，会触发指定的第一个函数。
							当鼠标移出这个元素时，会触发指定的第二个函数。
	fadeIn()/fadeOut()
	animate() --->所有指定的属性必须用骆驼形式，比如用marginLeft代替margin-left. 
	stop() --->停止所有在指定元素上正在运行的动画。
	delay(duration,[queueName]) 设置一个延时来推迟执行队列中之后的项目 
	在.slideUp() 和 .fadeIn()之间延时800毫秒。 $('#foo').slideUp(300).delay(800).fadeIn(400);
	数组与对象的操作:
	jQuery.each(object, (index,value)) 此方法可用于例遍任何对象。
				如果需要退出 each 循环可使回调函数返回 false，其它返回值将被忽略。
	jQuery.map(arr|obj,(value,index)) 将一个数组中的元素转换到另一个数组中。
	jQuery.inArray(value,array,[fromIndex]) 确定第一个参数在数组中的位置，从0开始计数(如果没有找到则返回 -1 )。
	jQuery.merge(first,second) 合并两个数组
	返回的结果会修改第一个数组的内容——第一个数组的元素后面跟着第二个数组的元素.
	jQuery.isArray(obj)  jQuery 1.3 新增。测试对象是否为数组。
##Bootrap
	简洁、直观、强悍的前端开发框架，让web开发更迅速、简单。
	栅格系统
###Bootrap常用类（了解）
	图标的使用：
	将图片类引入即可，通常需要用span来包裹;
	btn -->Primary/Success/Info/Warning/Danger
	表单元素类 input-group nav form-control
			 .btn-lg、.btn-sm 或 .btn-xs
	值得注意的是使用bootstrap可以实现分页操作，本身就提供。
	pagination-->添加该类实现分页操作。.pagination 添加该 class 来在页面上显示分页。
```html
	分页的实现
		<ul class="pagination">
    	<li><a href="#">&laquo;</a></li>
   	 	<li><a href="#">1</a></li>
    	<li><a href="#">2</a></li>
   	 	<li><a href="#">3</a></li>
   		 <li><a href="#">4</a></li>
    	<li><a href="#">5</a></li>
    	<li><a href="#">&raquo;</a></li>
	</ul>
```
	更多类名请参考官方文档使用，在此不一一赘述。
##jQuery常用效果(jQuery实现:<script src="https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js"></script>) 
###1.搜索条的出现与隐藏
```css
	<style type="text/css">
		.search {
			width:100%;
			height:100px;
			line-height: 100px;
			background: #ccc;
			border-bottom: 5px solid #f00;
			position: fixed;
			top: -105px;
			/*display: none;*/
			overflow: hidden;
		}
	</style>
```
```html
	<div class="search"><input type="text"><input type="button" value="搜索"></div>
```
```javascript
	<script type="text/javascript">
			var search = $(".search");
			var isSlideDown = false; // 是否下拉展开
			window.onscroll = function(){
			var _scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			if (_scrollTop >= 1000) {
				if (!isSlideDown) {
					isSlideDown = true;
					search.show();
					search.css("height", "0px");
					search.animate({height: 100,top:0}, 2000);
//					search.animate({top : 0}, 2000);
				}
			} else {
				search.hide();
//				search.css("top", "-105px");
				isSlideDown = false;
			}
			}
	</script>
```
###2.楼层导航
	```html
		<button id="btn">跳转</button>
		<div class="header" style="height:300px; background: #ccc;"></div>
		<div class="content" style="height:700px"></div>
		<div class="main">
		<div class="floor" style="background: #f00;">1L</div>
		<div class="floor" style="background: #ff0;">2L</div>
		<div class="floor" style="background: #f0f;">3L</div>
		<div class="floor" style="background: #0ff;">4L</div>
		<div class="floor" style="background: #00f;">5L</div>
	</div>

	<ul id="menu">
		<li class="floorMenuItem">1L<span style="display: block;">常备</span></li>
		<li class="floorMenuItem">2L<span>专科</span></li>
		<li class="floorMenuItem">3L<span>保健</span></li>
		<li class="floorMenuItem">4L<span>医疗</span></li>
		<li class="floorMenuItem">5L<span>器械</span></li>
		<li>TOP</li>
	</ul>
	```
	```css
	<script>
		$("#btn").click("on",function(){
			document.documentElement.scrollTop = document.body.scrollTop = 1000;
		}); 

		// 所有楼层
		var floors = $(".floor");
		// 楼层对应的菜单项
		var lis = $(".floorMenuItem", $("#menu"));
		// 1L楼层布局距离文档顶部的间距
		var _top =$(floors[0]).offset().top;
		// 窗口高度
		var winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		window.onscroll = function(){
			var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
			// 滚动显示楼层菜单
			if (scrollTop >= _top - winHeight / 2) {
				$("#menu").show();
			} else {
				$("#menu").hide();
			}
			// 处理楼层菜单文字
			Array.from(floors).forEach(function(floor, index){
				// 当前楼层以上的布局结构高度
				var _top = $(floor).offset().top;
				if (scrollTop > _top - winHeight / 2) {
					Array.from(lis).forEach(function(menuItem){
						$(menuItem.children[0]).hide();
					});
					$(lis[index].children[0]).show();
				}
			});
		}

		// 为每个楼层菜单项绑定点击事件
		Array.from(lis).forEach(function(menuItem, index){
			$(menuItem).on("click",function(){
				// 计算当前点击菜单项对应楼层在文档中定位高度
				var _top = $(floors[index]).offset().top;
				/* 滚动动画 */
				// document.documentElement.scrollTop = document.body.scrollTop = _top;

				// 获取当前滚动高度
				var start = document.documentElement.scrollTop || document.body.scrollTop;
				// 滚动动画运动区间值
				var range = _top - start;
				// 记录运动开始时间
				var startTime = +new Date();
				// 运动总时间
				var speed = 3000;
				// 启动计时器
				window.timer = setInterval(function(){
					// 计算运动经过时间
					var elapsed = Math.min(+new Date() - startTime, speed);
					// 运动到？
					var result = elapsed * range / speed + start;
					// 设置 
					document.documentElement.scrollTop = document.body.scrollTop = result;

					if (elapsed === speed)
						clearInterval(window.timer);
				}, 1000/60);
			});
		});
	</script>
	```
###3.抛物线
```html
	<button id="btn">开始</button>

	<div id="start" style="width:20px; height: 20px; background: #f00; position: absolute; top: 600px; left:50px; border-radius: 10px;"></div>
	<div id="end" style="width:20px; height: 20px; background: #666; position: absolute; top: 500px; left:500px; border-radius: 10px;"></div>
```
```javascript
	<script>
		// 公式：y = a * x ^ 2 + b * x + c
		// a 的正负决定开口方向，a>0，开口向上，a < 0，开口向下
		// a 越大，开口越小

		// a 固定取值
		// c = 0
		// b = (y - a * x ^ 2) / x
		// ==> y = a * x * x + b * x


		$("#btn").on("click",function(){
			var element = $("#start");
			// 抛物线上两个坐标点：
			var src = element.offset(),
				dest = $("#end").offset();
			// 将源src坐标点平移到原点处，则
			// 平移后，目标dest坐标点位置
			var x = dest.left - src.left,
				y = dest.top - src.top;
			// 二次函数系数
			var a = 0.01,
				c = 0,
				b = (y - a * x * x) / x;

			// 抛物线水平方向匀速运动
			var speed = 3000,
				startTime = +new Date();

			var timer = setInterval(function(){
				var elapsed = Math.min(+new Date() - startTime, speed);
				var _x = elapsed * x / speed,
					_y = a * _x * _x + b * _x + c;
				element.css( {
					top : _y + src.top + "px",
					left : _x + src.left + "px"
				});
				if (elapsed === speed) {
					clearInterval(timer);
				}
			}, 1000/60);
		});
	</script>
```
###4.瀑布流
Be careful:innerWidth()==clientWidth 包括边框与补白;
		   outerWidth()==offsetWidth 不包括边框及补白;
```html
	<div id="container">
		<div><img src="images/imgs (1).jpg"></div>
		<div><img src="images/imgs (2).jpg"></div>
		<div><img src="images/imgs (3).jpg"></div>
		<div><img src="images/imgs (4).jpg"></div>
		<div><img src="images/imgs (5).jpg"></div>
		<div><img src="images/imgs (6).jpg"></div>
		<div><img src="images/imgs (7).jpg"></div>
		<div><img src="images/imgs (8).jpg"></div>
		<div><img src="images/imgs (9).jpg"></div>
		<div><img src="images/imgs (10).jpg"></div>
		<div><img src="images/imgs (11).jpg"></div>
		<div><img src="images/imgs (12).jpg"></div>
		<div><img src="images/imgs (13).jpg"></div>
		<div><img src="images/imgs (14).jpg"></div>
		<div><img src="images/imgs (15).jpg"></div>
		<div><img src="images/imgs (16).jpg"></div>
		<div><img src="images/imgs (17).jpg"></div>
		<div><img src="images/imgs (18).jpg"></div>
		<div><img src="images/imgs (19).jpg"></div>
		<div><img src="images/imgs (20).jpg"></div>
		<div><img src="images/imgs (21).jpg"></div>
		<div><img src="images/imgs (22).jpg"></div>
		<div><img src="images/imgs (23).jpg"></div>
		<div><img src="images/imgs (24).jpg"></div>
		<div><img src="images/imgs (25).jpg"></div>
		<div><img src="images/imgs (26).jpg"></div>
		<div><img src="images/imgs (27).jpg"></div>
		<div><img src="images/imgs (28).jpg"></div>
		<div><img src="images/imgs (29).jpg"></div>
	</div>
```
```css
	<style type="text/css">
		#container {
			width: 90%;
			position: relative;
			margin: 0 auto;
		}

		#container div {
			width: 200px;
			padding: 5px;
			border:1px solid;
			border-radius: 5px;
			position: absolute;
			top: 0;
			left: 0;
		}

		#container div img {
			width: 200px;
		}
	</style>
```
```javascript
<script>
		// 瀑布流
		// 绝对定位方式布局
		window.onload = waterfall;
		window.onresize = waterfall;

		function waterfall(){
			// 动态求解每行放置的列数
			var containerWidth = $("#container").outerWidth(), // 容器宽度
				imgBoxes = $("div", $("#container")), // 所有待定位的图片盒子
				colWidth = $(imgBoxes[0]).innerWidth(), // 列宽度
				cols = Math.floor(containerWidth / colWidth), // 列数
				spacing = (containerWidth - cols * colWidth) / (cols + 1),// 间距
				height = new Array(cols); // 数组，放置各列高度
				console.log($("#container").outerWidth())
			// 为数组每个元素赋值为0
			height.fill(0);

			// 循环为每个元素定位，按顺序从左向右定位
			for (var i = 0; i < imgBoxes.length; i++) {
				var currColIndex = i % cols;
				imgBoxes[i].style.left = (currColIndex + 1) * spacing + currColIndex * colWidth + "px";
				imgBoxes[i].style.top = height[currColIndex] + 10 + "px";

				height[currColIndex] += imgBoxes[i].offsetHeight + 10;
			}

			// 循环为每个元素定位，按最短列定位

			/*
			// 定位第一行
			console.log(height);

			for (; i < imgBoxes.length; i++) {
				var currColIndex = i % 5;
				imgBoxes[i].style.left = (currColIndex + 1) * spacing + currColIndex * colWidth + "px";
				imgBoxes[i].style.top = height[currColIndex] + 10 + "px";
				height[currColIndex] += imgBoxes[i].offsetHeight + 10;
			}

			// 定位第二行
			for (; i < 10; i++) {
				var currColIndex = i % 5;
				imgBoxes[i].style.left = (currColIndex + 1) * spacing + currColIndex * colWidth + "px";
				imgBoxes[i].style.top = height[currColIndex] + 10 + "px";
				height[currColIndex] += imgBoxes[i].offsetHeight + 10;
			}

			// 定位第三行
			for (; i < 15; i++) {
				var currColIndex = i % 5;
				imgBoxes[i].style.left = (currColIndex + 1) * spacing + currColIndex * colWidth + "px";
				imgBoxes[i].style.top = height[currColIndex] + 10 + "px";
				height[currColIndex] += imgBoxes[i].offsetHeight + 10;
			}*/
		}
	</script>
```
###5.最短列瀑布流
```html
	<div id="container">
		<div><img src="images/imgs (1).jpg"></div>
		<div><img src="images/imgs (2).jpg"></div>
		<div><img src="images/imgs (3).jpg"></div>
		<div><img src="images/imgs (4).jpg"></div>
		<div><img src="images/imgs (5).jpg"></div>
		<div><img src="images/imgs (6).jpg"></div>
		<div><img src="images/imgs (7).jpg"></div>
		<div><img src="images/imgs (8).jpg"></div>
		<div><img src="images/imgs (9).jpg"></div>
		<div><img src="images/imgs (10).jpg"></div>
		<div><img src="images/imgs (11).jpg"></div>
		<div><img src="images/imgs (12).jpg"></div>
		<div><img src="images/imgs (13).jpg"></div>
		<div><img src="images/imgs (14).jpg"></div>
		<div><img src="images/imgs (15).jpg"></div>
		<div><img src="images/imgs (16).jpg"></div>
		<div><img src="images/imgs (17).jpg"></div>
		<div><img src="images/imgs (18).jpg"></div>
		<div><img src="images/imgs (19).jpg"></div>
		<div><img src="images/imgs (20).jpg"></div>
		<div><img src="images/imgs (21).jpg"></div>
		<div><img src="images/imgs (22).jpg"></div>
		<div><img src="images/imgs (23).jpg"></div>
		<div><img src="images/imgs (24).jpg"></div>
		<div><img src="images/imgs (25).jpg"></div>
		<div><img src="images/imgs (26).jpg"></div>
		<div><img src="images/imgs (27).jpg"></div>
		<div><img src="images/imgs (28).jpg"></div>
		<div><img src="images/imgs (29).jpg"></div>
	</div>
```
```css
	<style type="text/css">
		#container {
			width: 90%;
			position: relative;
			margin: 0 auto;
		}

		#container div {
			width: 200px;
			padding: 5px;
			border:1px solid;
			border-radius: 5px;
			position: absolute;
			top: 0;
			left: 0;
		}

		#container div img {
			width: 200px;
		}
	</style>
```
```javascript
	<script>
		// 瀑布流
		// 绝对定位方式布局
		window.onload = waterfall;
		window.onresize = waterfall;

		function waterfall(){
			// 动态求解每行放置的列数
			var containerWidth = $("#container").outerWidth(), // 容器宽度
				imgBoxes = $("div", $("#container")), // 所有待定位的图片盒子
				colWidth = $(imgBoxes[0]).innerWidth(), // 列宽度
				cols = Math.floor(containerWidth / colWidth), // 列数
				spacing = (containerWidth - cols * colWidth) / (cols + 1), // 间距
				height = new Array(cols); // 数组，放置各列高度
			// 为数组每个元素赋值为0
			height.fill(0);

			// 循环为每个元素定位，按顺序从左向右定位
			/*for (var i = 0; i < imgBoxes.length; i++) {
				// 计算当前遍历到的元素是其所在行中的第几列
				var currColIndex = i % cols;
				// 定位
				imgBoxes[i].style.left = (currColIndex + 1) * spacing + currColIndex * colWidth + "px";
				imgBoxes[i].style.top = height[currColIndex] + 10 + "px";
				// 定位完元素，将当前定位元素的高度累加到列高度中
				height[currColIndex] += imgBoxes[i].offsetHeight + 10;
			}*/

			// 循环为每个元素定位，按最短列定位
			for (var i = 0, len = imgBoxes.length; i < len; i++) {
				// 求当前遍历元素应该放到的列索引
				var currColIndex = findShortestIndex(height);
				// 设置CSS样式，定位
				imgBoxes[i].style.left = (currColIndex + 1) * spacing + currColIndex * colWidth + "px";
				imgBoxes[i].style.top = height[currColIndex] + 10 + "px";
				// 定位完毕，累加列高度
				height[currColIndex] += imgBoxes[i].offsetHeight + 10;
			}
		}

		// 查找数组中最小值的下标
		function findShortestIndex(array) {
			var min = array[0], index = 0;

			for (var i = 1, len = array.length; i < len; i++) {
				if (array[i] < min) {
					min = array[i];
					index = i;
				}
			}

			return index;
		}
	</script>
```
###6.放大镜
```html
	<div class="middle">
		<img src="images/middle.jpg">
		<div class="len"></div>
	</div>
	<div class="big">
		<img src="images/big.jpg" id="big_img">
	</div>
```
```css
	<style type="text/css">
		.middle {
			width: 400px;
			height: 400px;
			position: absolute;
			top:100px;
			left:50px;
			border: 1px solid;
		}

		.middle img {
			width: 400px;
			height: 400px;
		}

		.len {
			width: 200px;
			height: 200px;
			background: #f00;
			position: absolute;
			top: 0;
			left: 0;
			opacity: 0.5;
			display: none;
		}

		.big {
			width: 400px;
			height: 400px;
			position: absolute;
			top : 100px;
			left : 500px;
			border:1px solid;
			overflow: hidden;
			display: none;
		}

		.big img {
			width: 800px;
			height: 800px;
			position: absolute;
			top: 0;
			left: 0;
		}
	</style>
```
	Be careful:
		offsetTop,offsetLeft分别对应jQuery中的offset().top,offset().left;
		在jQuery中,css,offset方法中的单位可以省略 。
```javascript
	<script>
		$(".middle").on("mouseenter",function(){
			$(".len").show();
			$(".big").show();
		}); 
		
		$(".middle").on("mouseleave",function(){
			$(".len").hide();
			$(".big").hide();
		});
			
		$(".middle").on("mousemove",function(e){
			e = e || event;
			// 设置镜头在文档中定位
			$(".len").offset({
				top : e.pageY - 100,
				left : e.pageX - 100
			});
			// 获取镜头在其有定位的父元素坐标系中的坐标
			console.log($(".len"))
			var _top = $(".len").offset().top,
				_left = $(".len").offset().left;
			console.log(_top);
			// 判断是否超出范围
			if (_top < 0)
				_top = 0;
			else if (_top > 200)
				_top = 200;
			if (_left < 0)
				_left = 0;
			else if (_left > 200)
				_left = 200
			$(".len").css({
				top : _top + "px",
				left : _left + "px"
			});
			// 移动放大图片
			$("#big_img").css({
				top : -2 * _top + "px",
				left : -2 * _left + "px"
			});
		})
		// e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)
	</script>		  
```
###7.限定范围内拖拽
```html
	<div class="big">
		<div id="box"></div>
	</div>
```
```css
	<style type="text/css">
		#box {
			width: 200px;
			height: 200px;
			background: #f00;
			position: absolute;
			top: 100px;
			left: 50px;
		}
		.big{
			height: 300px;
			width: 300px;
			border: 1px solid red;
			position: relative;
			display: none;
		}
	</style>
```
```javascript
	<script>

		// 求窗口的宽高、元素的宽高
		var winWidth = document.documentElement.clientWidth || document.body.clientWidth,
			winHeight = document.documentElement.clientHeight || document.body.clientHeight,
			boxWidth = $("#box").outerWidth(),
			boxHeight = $("#box").outerHeight();
//			winWidth = $(".big").outerWidth(),
//			winHeight = $(".big").outerHeight(),
		$("#box").on("mousedown",function(e){
			e = e || event;
			var _offsetX = e.offsetX,
				_offsetY = e.offsetY;
			document.onmousemove=function(e){
				e = e || event;
				// 计算定位位置
				var _top = e.clientY - _offsetY,
					_left = e.clientX - _offsetX;
				// 判断是否超出范围
				if (_top < 0)
					_top = 0;
				else if(_top > winHeight - boxHeight)
					_top = winHeight - boxHeight;

				if (_left < 0)
					_left = 0;
				else if (_left > winWidth - boxWidth)
					_left = winWidth - boxWidth;
				// 设置css
				$("#box").css({
					top : _top + "px",
					left : _left + "px"
				});
			}
			document.onmouseup = function(){
				document.onmousemove = null;
				document.onmouseup = null;
			}
		}) 
	</script>
```
###8.自定义右键菜单
```html
	<ul id="context-menu">
		<li>复制</li>
		<li>粘贴</li>
		<li>剪切</li>
	</ul>
```
```css
	<style type="text/css">
		#context-menu {
			width: 100px;
			height: 100px;
			margin: 0;
			padding: 0;
			border: 1px solid;
			overflow: hidden;
			display: none;
			position: absolute;
		}
		li {
			width: 100px;
			height: 30px;			
			line-height: 30px;
			margin: 3px 0;
			text-align: center;
			border-bottom: 1px solid;
		}
	</style>
```
```<script>
		document.oncontextmenu = function(e){
			e = e || event;
			// 阻止弹出浏览器自身的右键菜单
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			// 显示自定义的右键菜单
			$("#context-menu").show();
			// 设置元素定位位置
			$("#context-menu").css({
				top : e.clientY,
				left : e.clientX 
			});
		}
		document.onclick = function(){
			$("#context-menu").hide();
		}
	</script>
```
###9.jQuery淡入淡出轮播
```css
	<style type="text/css">
		* {margin: 0;padding: 0;}
		#container {
			width: 590px;
			height: 470px;
			position: relative;
			margin: 50px auto;
			overflow: visible;
		}

		ul {
			width: 590px;
			height: 470px;
			list-style: none;
		}

		li {
			width: 590px;
			height: 470px;
			position: absolute;
			top: 0;
			left: 0;
			display: none;
		}
		.pages {
			width: 590px;
			height: 30px;
			position: absolute;
			bottom: 0;
			background: #000;
		}
		.pages i {
			display: inline-block;
			width:20px;
			height: 20px;
			border-radius: 10px;
			background: #fff;
			margin:5px;
		}

		/*.pages i.current {
			background: #f00;
		}*/

		.prev, .next {
			width: 45px;
			height: 100px;
			background: #000;
			color: #fff;
			position: absolute;
			top:0;
			bottom: 0;
			margin:auto;
			text-align: center;
			line-height: 100px;
			font-size:40px;
			cursor: pointer;
		}
		.next {
			right: 0;
		}
	</style>
```
```html
	<div id="container">
		<!-- 图片 -->
		<ul>
			<li style="display: block;"><a href="#"><img src="images/1.jpg"></a></li>
			<li><a href="#"><img src="images/2.jpg"></a></li>
			<li><a href="#"><img src="images/3.jpg"></a></li>
			<li><a href="#"><img src="images/4.jpg"></a></li>
		</ul>
		<!-- 小圆点 -->
		<div class="pages">
			<i style="background: red;"></i>
			<i></i>
			<i></i>
			<i></i>
		</div>
		<!-- 向前/后 -->
		<div class="prev">&lt;</div>
		<div class="next">&gt;</div>
	</div>
```
```javascript
	<script>
		var lis = $("li"), // 所有待轮播切换的图片盒子
			len = lis.length, // 图片张数
			currentIndex = 0, // 当前正显示图片的索引
			nextIndex = 1, // 即将显示图片的索引
			circles = $("i"), // 所有小圆点
			timer = null; // 轮播计时器
		// 自动轮播
		timer = setInterval(move, 1000);

		// 轮播切换
		function move(){
			// 当前显示的图片淡出			
			$(lis[currentIndex]).fadeOut(400);
//			// 即将显示的图片淡入
			$(lis[nextIndex]).fadeIn(400);
//			// 修改小圆点样式
			$(circles[currentIndex]).css("background","white");
			$(circles[nextIndex]).css("background","red");
			// 修改待操作图片索引
			currentIndex = nextIndex;
			nextIndex++;
			if (nextIndex >= len)
				nextIndex = 0;
		}
		// 鼠标移入容器范围，停止自动轮播，移出容器范围，启动自动轮播
		$("#container").on("mouseenter",function(){
			clearInterval(timer);
		})
		$("#container").on("mouseleave",function(){
			timer = setInterval(move, 3000);
		})

		// 小圆点移入，切换对应图片，为每个小圆点绑定移入事件
		/*for (var i = 0; i < len; i++) {
			circles[i].index = i;
			circles[i].onmouseover = function(){
				// 获取当前移入小圆点的索引
				var index = this.index;
				if (currentIndex === index)
					return;
				// 设置即将显示图片的索引
				nextIndex = index;
				// 切换
				move();
			}
		}
		for (let i = 0; i < len; i++) {
			circles[i].onmouseover = function(){
				// 获取当前移入小圆点的索引
				if (currentIndex === i)
					return;
				// 设置即将显示图片的索引
				nextIndex = i;
				// 切换
				move();
			}
		}*/
		$(".pages").on("mouseover",function(e){
			e = e || event;
			var src = e.target || e.srcElement;
			if (src !== this) {
				// 获取 src 所表示小圆点在所有小圆点中的索引
				for (var i = 0; i < len; i++) {
					if (src === circles[i]) {
						nextIndex = i;
						move();
						break;
					}
				}
			}
		});

		// 向前/向后
		$(".prev").on("click",function(){
			nextIndex = currentIndex - 1;
			if (nextIndex < 0)
				nextIndex = len - 1;
			move();
		})
		$(".next").on("click",move);
	</script>
```
### 10.jQuery无缝轮播
```javascript
	注意append()是向A添加B
	<script>
		var lis = $("li"), // 所有轮播图片
			len = lis.length, // 图片张数
			liWidth = $(lis[0]).innerWidth(), // 图片盒子宽度
			currentIndex = 1,
			nextIndex = 2,
			timer = null,
			duration = 1000;
		// 克隆第一张与最后一张图片
		$("#box").append($(lis[0]).clone());
		$("#box").prepend($(lis[len-1]).clone());
		// 图片张数加上2;
		len += 2;
		// 动态设置ul#box宽度，定位
		$("#box").css({
			width: len * liWidth + "px",
			left: -liWidth + "px"
		});
		// 动态添加小圆点
		var html = "";
		for (let i = 0; i < len - 2; i++) {
			html += "<i></i>";
		}
		$(".pages").html(html);
		// 获取所有小圆点
		var circles = $("i");
		// 第一个小圆点设置背景
		$(circles[0]).addClass("current");
		// 自动轮播
		timer = setInterval(move, duration);
		// 切换
		function move() {
			// 计算定位
			var _left = -1 * nextIndex * liWidth;
			// 运动动画
			$("#box").animate( {left: _left}, 200, function(){
				// 运动结束后，继续判断
				if (nextIndex >= len) {
					currentIndex = 1;
					nextIndex = 2;
					$("#box").css("left",-liWidth);
				}
				if (currentIndex <= 0) {
					currentIndex = len - 2;
					nextIndex = len - 1;
					$("#box").css({
						left:-liWidth * (len-2)
					});
				}
			});
			/* 修改小圆点样式 */
			// 找出修改为红色背景的小圆点索引
			var circleIndex = nextIndex - 1;
			if (circleIndex >= len - 2)
				circleIndex = 0;
			else if (circleIndex <= -1) 
				circleIndex = len - 3;
			// 清除所有小圆点所使用类名
			for (let i = 0; i < len - 2; i++) {
				$(circles[i]).removeClass("current");
			}
			// 将circleIndex索引处小圆点添加上类名
			$(circles[circleIndex]).addClass("current");

			// 修改索引
			currentIndex = nextIndex;
			nextIndex++;
		}

		/* 移入/出容器 */
		$("#container").on("mouseenter",function(){
			clearInterval(timer);
		});
		$("#container").on("mouseleave",function(){
			timer = setInterval(move, duration);
		});

		/* 移入小圆点事件 */
		/*for (let i = 0; i < len - 2; i++) {
			circles[i].onmouseover = function(){
				nextIndex = i + 1;
				move();
			}
		}*/
		$(".pages").on("mouseover",function(e){
			var src = e.target;
			if (src !== this && src.nodeName === "I") {
				// 小圆点索引
				var index = Array.from(circles).indexOf(src);
				// 即将显示图片的索引
				nextIndex = index + 1;
				move();
			}
		});

		// 向前/后
		$(".prev").on("click",function(){
			nextIndex = currentIndex - 1;
			move();
		}); 

		$(".next").on("click",function(){
			move();
		}) 
	</script>
```
###11.jQuery购物车（新增部分功能,根据实际需求,仅供参考）
json 文件参考
`
{
	"res_code":"0",
	"res_error":"",
	"res_body":{
		"products":[
			{"pid":2, "title":"Bikroy Tshirt - Roundneck", "price":120, "img":"images/pic2.png"},
			{"pid":3, "title":"Park Tshirt - Partygrandd", "price":340, "img":"images/pic3.png"},
			{"pid":4, "title":"Gray Tshirt Roundneckdd", "price":250, "img":"images/pic4.png"},
			{"pid":5, "title":"Marivo Tshirt - Roundneck", "price":378, "img":"images/pic5.png"},
			{"pid":6, "title":"Strict TshirtSoft, Pure Cotton", "price":428, "img":"images/pic6.png"}
		]
	}
}
`
```html
	<ul class="grid_2">		
		<div class="clearfix"> </div>
	</ul>
	<!-- 创建模板：显示tshirt的数据 -->
	<script type="text/html" id="tshirt_template">
		{{each products as prod}}
		<a href="javascript:void(0)" class=""><li>
			<span style="display: none;" class="pid">{{prod.pid}}</span>
			<img src="{{prod.img}}" class="img-responsive img" alt=""/>
			<span class="btn5 price">{{prod.price}}</span>
			<p class="title">{{prod.title}}</p>
			<p class="a1">加入购物车</p>
		</li></a>
		{{/each}}
	</script>

	<div class="men cart cart_empty">
	    <h1>It appears that your cart is currently empty!</h1>
	    <h2>You can continue browsing <a href="javascript:void(0)">here</a>.</h2>
    </div>
		  <table  border=1 class="men cat cart_table" width="1000" cellpadding="0" cellspacing="0"  class="table">
    	<thead>
    		<tr>
    			<td><label><input type="checkbox" class="ck_all" >全选</label></td>
    			<td>编号</td>
    			<td>图片</td>
    			<td>标题</td>
    			<td>单价</td>
    			<td>数量</td>
    			<td>小计</td>
    			<td>操作</td>
    		</tr>
    	</thead>
    	<tbody>
    		
    	</tbody>
    	<tfoot>
    		<tr>
    			<td>合计</td>
    			<td colspan="7">0.00</td>
    		</tr>
    	</tfoot>
    	<button style="width: 100px;height: 30px;background: red;color: white;" class="clearAll">清空购物车</button>
    	<button style="width: 100px;height: 30px;background: green;color: white;" class="end">商品结算</button>
    </table>
     <script type="text/html" id="cart_template">
    	{{each products as prod}}
    	<tr>
    		<td><input type="checkbox" class="ck_prod"></td>
    		<td class="pid">{{prod.pid}}</td>
    		<td class="img"><img src="{{prod.img}}" style="width: 100px;height: 100px;"></td>
    		<td class="title">{{prod.title}}</td>
    		<td class="price">{{prod.price}}</td>
    		<td><button class="minus">-</button><input type="text" value="{{prod.amount}}" size="2" class="amount"><button class="add">+</button></td>
    		<td class="sub">{{(prod.amount*prod.price).toFixed(2)}}</td>
    		<td><a href="javascript:void(0);" class="del">删除</a></td>
    	</tr>
    	{{/each}}
    </script>
```
```css
<style type="text/css">
		*{
			margin: 0;
			padding: 0;
			box-sizing: border-box;
			list-style: none;
			text-decoration: none;
		}
		a{
			color: red;
		}
		ul{
			clear: both;
			overflow: hidden;
		}
		ul li{
			float: left;
			padding: 0 10px;
			border: 1px solid red;
			margin: 0 10px;
			text-align: center;
		}
		.a1{
			background: green;
			display: block;
			width: 100px;
			height: 20px;
			line-height: 20px;
		}
		table tr td{
			text-align: center;
		}
	</style>
```
```javascript
 <script type="text/javascript">
    /* 加载其它所有的tshirt */
	$.getJSON("mock/tshirts.json", function(data){
		// 渲染模板
		let rendData = { // 准备渲染的数据
			products : data.res_body.products
		}
		let html = template("tshirt_template", rendData); // 渲染
		// 显示
		$(".grid_2").prepend(html);
	});
	//加入购物车
	$(".grid_2").on("click", "a", function(){
		// 当前选购商品对象
		let product = {
			pid:$(this).find(".pid").text(),
			title:$(this).find(".title").text(),
			price:$(this).find(".price").text(),
			img:$(this).find(".img").attr("src"),
			amount:1
		};
		/* cookie */
		$.cookie.json = true;
		// 先查找cookie中是否已有保存购物车
		let _products = $.cookie("products") || [],
			index = exist(product.pid, _products);
		if (index === -1) { // 新添加商品
			_products.push(product);
		} else { // 原已有添加，则修改数量
			_products[index].amount++;
		}
		
		// 重新保存回 cookie中
		$.cookie("products", _products, {expires:7, path:"/"});
		alert("购买成功");

		/* 显示选购的所有商品总价 */
		let sum = 0;
		/*_products.forEach(function(prod){
			sum += Number(prod.price);
		});*/
		$.each(_products, function(index, element){
			// console.log(this === element);
			sum += Number(this.price);
		});
		$(".bag_right p").text(sum);

		return false;
	});

	// 查找指定id的商品在数组中的下标
	function exist(id, products) {
		for (let i = 0, len = products.length; i < len; i++) {
			if (products[i].pid === id)
				return i;
		}

		return -1;
	}
    /* 显示购物车数据 */
	$.cookie.json = true;
	// 读取cookie中保存的购物车数据
	let _products = $.cookie("products") || [];
	// 判断是否有购物车商品
	if (_products.length === 0) {
		$(".cart_empty").show().next(".cart_table").hide();
	//return;
	} else {
		$(".cart_empty").hide().next(".cart_table").show();
	}
	// 渲染模板
	let rendData = { products : _products },
		html = template("cart_template", rendData);
	$(".cart_table > tbody").html(html);

	// 将_products中每个元素缓存到行中
	$(".cart_table > tbody > tr").each(function(index, element){
		// 在当前遍历到的行中缓存与之对应的商品对象数据
		$(this).data("prod", _products[index]);
	});

	/*************************************************/
	/***********购物车操作****************************/
	/* 删除商品：事件委派 */
	$(".cart_table").on("click", ".del", function(){
		// 获取当前删除行中的商品对象
		let _prod = $(this).parents("tr").data("prod");
		// 查找其在_products数组中的索引
		let _index = $.inArray(_prod, _products);
		// 从数组中删除元素
		_products.splice(_index, 1);
		// 从cookie中删除(覆盖保存 _products 到 cookie 中)
		$.cookie("products", _products, {expires:7, path:"/"});
		// 从DOM中删除
		$(this).parents("tr").remove();
		
		// 计算合计
		calcTotal();
	});
	/* 数量+/- */
	$(".cart_table").on("click", ".add,.minus", function(){
		// 找出所在行中的商品对象
		let _prod = $(this).parents("tr").data("prod");
		// 数量+/-
		let _amount = Number(_prod.amount);
		if ($(this).is(".add")) { // 加
			_amount++;
		} else { // 减
			if (_amount <= 1)
				return;
			_amount--;
		}
		_prod.amount = _amount;
		// 保存cookie
		$.cookie("products", _products, {expires:7, path:"/"});
		// 页面渲染
		$(this).siblings(".amount").val(_amount);
		$(this).parents("tr").children(".sub").text((_prod.price * _amount).toFixed(2));

		// 计算合计
		calcTotal();
	});
	// 输入数量修改
	$(".cart_table").on("blur", ".amount", function(){
		let _prod = $(this).parents("tr").data("prod");
		_prod.amount = $(this).val();
		if(_prod.amount<=0){
			alert("不能为负数！")
			$(this).val(1);
			_prod.amount = $(this).val();
		}
		// 保存cookie
		$.cookie("products", _products, {expires:7, path:"/"});
		// 页面渲染
		$(this).parents("tr").children(".sub").text((_prod.price * _prod.amount).toFixed(2));

		// 计算合计
		calcTotal();
	});
	/* 全选 */
	$(".ck_all").click(function(){
		// 获取“全选”复选框选中状态
		let status = $(this).prop("checked");
		// 设置所有行前复选框选中状态与“全选”一致
		$(".ck_prod").prop("checked", status);
		// 计算合计
		calcTotal();
	});
	/* 部分选中 */
	$(".cart_table").on("click", ".ck_prod", function(){
		$(".ck_all").prop("checked", $(".ck_prod:checked").length === _products.length)
		/*if ($(".ck_prod:checked").legnth === _products.length)
			$(".ck_all").prop("checked", true);
		else
			$(".ck_all").prop("checked", false);*/

		// 计算合计
		calcTotal();
	});
	/* 计算合计金额 */
	function calcTotal() {
		let total = 0;
		$(".ck_prod:checked").each(function(){
			total += Number($(this).parents("tr").children(".sub").text())
		});
		$(".cart_table > tfoot td:last").text(total);
	}
	//清空购物车;
	$(".clearAll").on("click",function(){
		//清除DOM节点;
		$("tbody tr").remove();
		//清除cookie;
		_products = [];
		$.cookie("products", _products, {expires:-1, path:"/"});
	});
	//结算商品;
	//是否存在总价subs，可省略;
	function  ex(subs,pros){
		for (let i=0;i<pros.length;i++) {
			if(subs==pros[i].subs)
			return i 
		}
		return -1;
	}
	$(".end").on("click",function(){
		//定义结算的cookie;
		$.cookie.json = true;
		let pros= $.cookie("pros") || [];
		console.log(pros);
		let cks = $(".ck_prod:checked");
		for (let i = 0;i<cks.length;i++) {
			let pro = {
				pid:$(cks[i]).parents("tr").find(".pid").text(),
				title:$(cks[i]).parents("tr").find(".title").text(),
				price:$(cks[i]).parents("tr").find(".price").text(),
				img:$(cks[i]).parents("tr").find(".img").attr("src"),
				amount:Number($(cks[i]).parents("tr").find(".amount").val()),
				sub:Number($(cks[i]).parents("tr").find(".sub").text())
			}
		//业务逻辑，根据实际情况来操作
		index = exist(pro.pid, pros);
		if (index === -1) { // 新添加商品
			pros.push(pro);	
		} else { // 原已有添加，则修改相应数值;
			pros[index].amount += pro.amount;
			pros[index].sub += pro.sub;
		}	
		}	
		$.cookie("pros",pros,{expires:7,path:"/"});
	})
    </script>
```