/**
 * 产生随机整数，包含下限值，但不包括上限值
 * @param {Number} lower 下限
 * @param {Number} upper 上限
 * @return {Number} 返回在下限到上限之间的一个随机整数
 */
function random(lower, upper) {
	return Math.floor(Math.random() * (upper - lower)) + lower;
}

/**
 * 产生一个随机的rgb颜色
 * @return {String}  返回颜色rgb值字符串内容，如：rgb(201, 57, 96)
 */
function randomColor() {
	// 随机生成 rgb 值，每个颜色值在 0 - 255 之间
	var r = random(0, 256),
		g = random(0, 256),
		b = random(0, 256);
	// 连接字符串的结果
	var result = "rgb("+ r +","+ g +","+ b +")";
	// 返回结果
	return result;
}

/**
 * 找出数组中元素第一次出现的索引
 * @param value 待查找元素
 * @param array 数组
 * @return 返回数组中待查找元素第一次出现的下标，不存在则返回-1
 */
function inArray(value, array) {	
	if (Array.prototype.indexOf) // 浏览器支持使用数组的 indexOf() 方法
		return array.indexOf(value);

	/* 浏览器不支持使用数组的 indexOf() 方法 */
	for (var i = 0, len = array.length; i < len; i++) {
		if (value === array[i])
			return i;
	}
	return -1;
}

/**
 * 生成验证码
 * @param length 可选参数，验证码长度（位数），不传递默认4位
 * @return 返回生成后的随机验证码字符串
 */
function generateValidateCode(length) {
	// 判断是否传递参数
	if (typeof length === "undefined")
		length = 4;
	// 定义变量保存生成后的验证码字符串
	var code = "";
	// 循环生成验证码
	while (code.length < length) {
		// 在字母数字编码范围内生成随机数
		var rand = random(48, 123);
		if (rand >= 48 && rand <= 57
			|| rand >= 65 && rand <= 90
			|| rand >= 97 && rand <= 122) {
			code += String.fromCharCode(rand)
		}
	}
	// 返回生成后的验证码字符串
	return code;
}

/**
 * 格式化日期时间
 * @param datetime 日期时间对象
 * @return 返回格式化后的字符串：yyyy-MM-dd HH:mm:ss
 */
function formateDate(datetime) {
	// 获取年月日时分秒值
	var year = datetime.getFullYear(),
		month = ("0" + (datetime.getMonth() + 1)).slice(-2),
		date = ("0" + datetime.getDate()).slice(-2),
		hour = ("0" + datetime.getHours()).slice(-2),
		minute = ("0" + datetime.getMinutes()).slice(-2),
		second = ("0" + datetime.getSeconds()).slice(-2);
	// 连接
	var result = year + "-"+ month +"-"+ date +" "+ hour +":"+ minute +":" + second;
	// 返回
	return result;
}

/**
 * 根据id、类名或标签名查找元素
 * @param selector 选择器(字符串)，如： #id / .className / tag
 * @param context 查找上下文DOM对象，可选，默认使用 document
 * @return 返回查找到的DOM元素或 HTMLCollection 集合
 */
function $(selector, context) {
	// 默认值为 document
	context = context || document;

	if(selector.indexOf("#") === 0) // id选择器
		return document.getElementById(selector.slice(1));
	if(selector.indexOf(".") === 0) // 类选择器
		return getElementsByClassName(selector.slice(1), context);
	// 标签
	return context.getElementsByTagName(selector);
}

/**
 * 解决 getElementsByClassName() 兼容问题
 * @param className 待查找的类名
 * @param context 查找上下文DOM对象，可选，默认使用 document
 * @return 返回查找到的满足条件的DOM元素集合
 */
function getElementsByClassName(className, context) {
	context = context || document;

	if (context.getElementsByClassName) // 支持使用 getElementsByClassName() 方法
		return context.getElementsByClassName(className);

	/* 不支持使用 getElementsByClassName() 方法 */
	// 保存查找结果的数组
	var result = [];
	// 查找出上下文后代中所有元素
	var tags = context.getElementsByTagName("*");
	// 遍历所有元素
	for (var i = 0, len = tags.length; i < len; i++) {
		// 判断当前遍历到元素是否有使用过待查找的类名
		var classNames = tags[i].className.split(" ");
		if (inArray(className, classNames) !== -1) // 当前遍历到的元素使用过待查找的类名
			result.push(tags[i]);
	}

	// 返回查找结果
	return result;
}

/**
 * 注册事件监听
 */
function on(element, type, callback) {
	if (element.addEventListener) { // 支持 addEventListener() 方法
		if (type.indexOf("on") === 0) // 事件类型字符串以 on 开头
			type = type.slice(2);
		element.addEventListener(type, callback);
	} else { // 不支持 addEventListener() 方法
		if (type.indexOf("on") !== 0) // 事件类型字符串不以 on 开头
			type = "on" + type;
		element.attachEvent(type, callback);
	}
}

/**
 * 移除事件监听
 */
function off(element, type, callback) {
	if (element.removeEventListener) { // 支持 removeEventListener() 方法
		if (type.indexOf("on") === 0) // 事件类型字符串以 on 开头
			type = type.slice(2);
		element.removeEventListener(type, callback);
	} else { // 不支持 removeEventListener() 方法
		if (type.indexOf("on") !== 0) // 事件类型字符串不以 on 开头
			type = "on" + type;
		element.detachEvent(type, callback);
	}
}

/**
 * 获取/设置指定元素的CSS属性值
 * @param element DOM对象
 * @param attr 属性名字符串，或设置属性用到的对象
 * @param value 属性值，可选
 * @return 返回查找到指定CSS属性的值
 */
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

/**
 * 显示元素
 */
function show(element) {
	element.style.display = "block";
}

/**
 * 隐藏元素
 */
function hide(element) {
	element.style.display = "none";
}

/**
 * 获取/设置指定元素在文档中的坐标
 * @param element 元素
 * @param coordinates 可选参数，待设置的文档中定位坐标 {top, left}
 * @return 返回坐标对象 {top, left}
 */
function offset(element, coordinates) {
	// 获取
	if (typeof coordinates === "undefined") {
		var _top = 0, _left = 0;
		while (element !== null) {
			_top += element.offsetTop;
			_left += element.offsetLeft;
			element = element.offsetParent;
		}

		return {
			top : _top,
			left : _left
		};
	}
	
	/* 设置 */
	var parent = element.offsetParent,
		_top = 0,
		_left = 0;
	// 计算父元素在文档中的坐标
	while (parent !== null) {
		_top += parent.offsetTop;
		_left += parent.offsetLeft;
		parent = parent.offsetParent;
	}
	// 计算子元素在其父元素坐标系中的坐标定位
	_top = coordinates.top - _top;
	_left = coordinates.left - _left;
	// 设置CSS
	css(element, {
		top : _top + "px",
		left : _left + "px"
	});
}

/** 
 * 获取/保存cookie
 * @param key cookie名
 * @param value cookie值
 * @param options 可选配置参数 {expires:7, path:"/", domain:"", secure:true}
 */
function cookie(key, value, options) {
	/* writing */
	if (typeof value !== "undefined") {		
		options = options || {};
		// 连接cookie字符串
		var cookie = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		// 判断是否有失效时间
		if (options.expires) {
			var date = new Date();
			date.setDate(date.getDate() + options.expires);
			cookie += ";expires=" + date.toUTCString();
		}
		// 判断是否有路径
		if (options.path) 
			cookie += ";path=" + options.path;
		// 判断是否有域设置
		if (options.domain)
			cookie += ";domain=" + options.domain;
		// 判断是否安全链接
		if (options.secure)
			cookie += ";secure";
		// 保存 cookie
		document.cookie = cookie;

		return;
	}

	/* reading */
	// 将所有cookie的 "key=value" 结构分割出来保存到数组中
	var cookies = document.cookie.split("; ");
	// 遍历数组中每条cookie
	for (var i = 0, len = cookies.length; i < len; i++) {
		// 使用 = 号将 "key=value" 的结构分割
		var parts = cookies[i].split("=");
		// 获取当前遍历到 cookie 的名称
		var name = decodeURIComponent(parts.shift());
		// 比较是否和待查找的 key 一致
		if (name === key) {
			return decodeURIComponent(parts.join("="));
		}
	}

	return undefined;
}

/** 
 * cookie删除
 * @param key cookie名
 * @param options 可选配置参数 {expires:7, path:"/", domain:"", secure:true}
 */
function removeCookie(key, options) {
	options = options || {};
	options.expires = -1;
	cookie(key, "", options);
}

/**
 * 将字符串中特殊字符转换为HTML特殊符号，如 将 < 转换为 &lt;     将 > 转换为 &gt;
 */
function encode(str) {
	return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * 去掉指定字符串前后空白
 */
function trim(str) {
	if (String.prototype.trim) // 支持使用字符串ES5新增的 trim() 方法
		return str.trim();

	// 不支持使用字符串ES5中的 trim() 方法
	return str.replace(/^\s+|\s+$/g, "");
}

/**
 * 运动框架
 * 参数：
 *		element: 待添加运动动画效果的元素
 *		options: 多属性运动终值对象  {left:1000, top:500, width:1000}
 *		speed: 运动总时间
 *		fn: 运动运动执行结束后需要继续执行的函数
 */
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

/**
 * 淡入
 */
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