var _time = 60;//时间
var gameover = true;//游戏是否结束
var time = $('#time');
var startGame = $('#startGame');
var game = $('#game');
var sideLength;//显示框总边长
var divsideLength;//每一个格子的边长
var pass = 0;//通过了多少关
var targetEl = null;//用于记录目标格子
var sideNum = 2;//从边为2开始
var maxpass = 100;//100关，第100的时候透明度为1
var borderWidth = 5;//格子之间的距离
var maxsideNum = 15;//格子一边的最大数量
//初始化
function init(){
	_time = $('#_time').value;
	borderWidth = $('#borderWidth').value;
	maxsideNum = $('#maxsideNum').value;
	console.log('时间'+_time+'\n格子之间的距离'+borderWidth+'\n格子的最大边数'+maxsideNum);
	gameover = false;
	pass = 0;
	sideNum = 2;
	targetEl = null;
	divsideLength = (sideLength-(sideNum+1)*borderWidth)/sideNum;
	timeChange();
	showDiv();
}
//屏幕适配
(function ScreenAdaptation(){
	var w = window.screen.availWidth;
	var h = window.screen.availHeight;
	if(w > h){
		sideLength = h*0.8;
	}else{
		sideLength = w*0.8;
	}
	game.style.width = sideLength+'px';
	game.style.height = sideLength+'px';
})();
//requestAnimationFrame的兼容操作
var requestAnimationFrame = (function(){
	return window.requestAnimationFrame || 
		   window.webkitRequestAnimationFrame ||
		   window.mozRequestAnimationFrame ||
		   window.oRequestAnimationFrame;
})();
//获取单个DOM元素
function $(str){
	return document.querySelector(str);
}
//获取DOM集合
function $all(str){
	return document.querySelectorAll(str);
}
//时间进度条的变化已经控制游戏结束
function timeChange(){
	var startTime = new Date().getTime();
	//时间记录
	setTimeout(function(){
		gameover = true;
		$('#mark').style.display = 'block';
		startGame.innerHTML = pass+'&nbsp;'+'重来？';
	}, _time*1000);
	//绘制进度条
	function draw(){
		if(gameover){
			return;
		}
		var t = new Date().getTime() - startTime;
		time.innerHTML = Math.ceil(t/1000);
		time.style.width = parseFloat(t/(_time*1000)*100)+'vw';
		requestAnimationFrame(draw);
	};
	requestAnimationFrame(draw);
}
//显示所有格子
function showDiv(){
	var html = '';
	var c = 'rgba('+createNumber255()+','+createNumber255()+','+createNumber255()+', ';
	for(var i = 1; i <= sideNum; i++){
		for(var j = 1; j <= sideNum; j++){
			var p = getPos(i, j, divsideLength);
			html += '<div style="width:'+divsideLength+'px;height:'+divsideLength+'px;left:'+p.x+';top:'+p.y+';background-color:'+c+'1)"></div>'
		}
	}
	game.innerHTML = html;
	//显示目标格子
	var all = $all('#game div');
	targetEl = all[createNumberN(sideNum*sideNum)];
	var f = pass/maxpass;
	targetEl.style.backgroundColor = c + f +')';
}
//获取格子的绝对位置，s是每一个格子的边长
function getPos(m, n, s){
	return {
		x : m*borderWidth+(m-1)*s+'px',
		y : n*borderWidth+(n-1)*s+'px'
	};
}
//产生0-255的随机数
function createNumber255(){
	return parseInt(Math.random()*255);
}
//产生0-n的随机数
function createNumberN(n){
	return parseInt(Math.floor(Math.random()*n));
}
//使用事件委托监听目标元素的点击
game.addEventListener('click', function(e){
	if(e.target === targetEl){
		pass++;
		if(pass >= maxpass){
			alert('透明度都是 1 了你还能点到，真色狼');
			gameover = true;
			$('#mark').style.display = 'block';
			return;
		}
		if(sideNum < maxsideNum){
			sideNum++;
		}
		divsideLength = (sideLength-(sideNum+1)*borderWidth)/sideNum;
		showDiv();
	}
});

startGame.addEventListener('click', function(){
	$('#mark').style.display = 'none';
	init();
	game.style.display = 'block';
});
