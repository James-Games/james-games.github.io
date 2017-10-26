const BUILD = "102517c",
	VERSION = "1.00_b3";

const canvas = document.createElement('canvas'),
	context = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;

canvas.style.border = 'solid 2pt black';

document.body.appendChild(canvas);

let entities = [];

function CollisionBlock(x = 0, y = 0, w = 4, h = 4){
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.check = function(x,y,w,h){
		var colliding = {
			x: (this.x>x-((this.w)/2))&&(this.x<x+((this.w)/2)),
			y: (this.y>y-((this.h)/2))&&(this.y<y+((this.h)/2))
		};
		return colliding;
	};
};
function DrawableBlock(x = 0, y = 0, w = 4, h = 4, colour = '#09F'){
	this.cb = new CollisionBlock(x, y, w, h);
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.falling = false;
	this.velY = 0;
	this.colour = colour;
	this.show = function(Context){
		Context.fillStyle = this.colour;
		Context.fillRect(this.x-this.w/2, this.y-this.h/2, this.w, this.h);
	};
	this.check = this.cb.check;
	this.update = function(){
		if(!this.falling) return 1;
		this.y += this.velY;
		this.cb.y += this.velY;
		this.velY += 0.1;
		return 0;
	};
};
function Player(x = 96, y = 320, w = 24, h = 32, data = {'color': '#06A'}){
	this.x = x;
	this.lastHit = 0;
	this.y = y;
	this.w = w;
	this.h = h;
	this.onGround = false;
	this.velX = 0;
	this.velY = 0;
	if('image' in data) {
		this.image = new Image();
		this.image.src = data.image;
	} else if('colour' in data) {
		this.colour = data.colour;
	} else {
		this.colour = '#06A';
	}
	this.show = function(Context){
		Context.fillStyle = this.colour;
		Context.fillRect(this.x-this.w/2, this.y-this.h/2, this.w, this.h)
	};
	this.check = function(){
		return;
	}
	this.percentage = 0;
	this.hit = function(){
		this.flyBack();
		this.percentage += Math.floor(Math.random()*4)+6;
	}
	this.flyBack = function(){
		this.velX = (Math.random()>0.5?-this.percentage:this.percentage) * 0.5;
		this.velY = -this.percentage * 0.75;
	};
	this.update = function(){
		let canMove = {
			x: true, 
			y: true 
		};
		if(Math.abs(this.velX) != Math.abs(Math.floor(this.velX))) this.velX *= 0.98;
		for(let i in entities) {
			let c;
			try{
				c = entities[i].check(this.x+this.velX, this.h/2+this.y-4, this.w, this.h);
			} catch(e) {
				console.log(i + '\n' + e);
			}
			if(c) {
				if(c.x&&c.y) canMove.x = false;
			}
			let c2;
			try{
				c2 = entities[i].check(this.x, this.h/2+this.y+this.velY+2, this.w, this.h);
			} catch(e) {
				console.log(i + '\n' + e);
			}
			if(c2) {
				if(c2.x&&c2.y) canMove.y = false;
			}
		}
		if(canMove.x) {
			this.x+=this.velX;
		} else {
			this.velX = 0;
		}
		if(canMove.y) {
			this.y += this.velY += 0.275;
			this.onGround = false;
		} else {
			this.velY = 0;
			this.onGround = true;
		}
		if(this.y>480||this.y<0||this.x<0||this.x>640){
			this.die();
		}
	}
	this.lose = function(){
		var playAgain = confirm("You lose. Play again?");
		if(!playAgain) history.back();
		else location.reload();
	};
	this.die = function(){
		this.lose();
		this.y = 64;
		this.x = 96;
		this.w++;
		this.h++;
	};
};
function Draw(e){
	context.clearRect(0, 0, 640, 480);
	for(var i in entities) entities[i].show(context);
	for(var i in entities) entities[i].update();
	setTimeout(Draw, 1000/20);
};
window.onload = function(){
	console.log("Loading...");
	entities.push(new DrawableBlock(320,400,520,60));
	entities.push(ai);
	entities.push(new Player());
	setTimeout(Draw, 250);
};
window.onkeydown = function(e){
	if(e.keyCode!=82 && e.keyCode!=17 && e.keyCode!=116) e.preventDefault();
	let d = {
		65: 'left',
		37: 'left',
		68: 'right',
		39: 'right',
		87: 'up',
		38: 'up',
		32: 'attack',
		16: 'attack',
		83: 'down',
		40: 'down'
	};
	function undefined(){sa
		console.log(e.keyCode);
	}
	function left(){
		entities[entities.length-1].velX = -4;
	}
	function right(){
		entities[entities.length-1].velX = 4;
	}
	function up(){
		if(entities[entities.length-1].onGround)
		entities[entities.length-1].velY = -6;
	}
	function down(){
		entities[entities.length-1].velY = 4;
	}
	function attack(){
		let p = entities[entities.length-1],
			e = entities[entities.length-2];
		let t = new CollisionBlock(e.x, e.y, e.w, e.h);
		if(t.check(p.x,p.y,p.w,p.h)&&p.lastHit<new Date().getTime()-1280) {
			e.p.hit();
			p.lastHit = new Date().getTime();
		}
	}
	let direction = d[e.keyCode||e.which];
	eval(direction+'()');
};
window.onkeyup = function(e){
	if(e.keyCode!=82 && e.keyCode!=17 && e.keyCode!=116) e.preventDefault();
	let d = {
		65: 'left',
		37: 'left',
		68: 'right',
		39: 'right',
		87: 'up',
		38: 'up',
		32: 'attack',
		16: 'attack',
		83: 'down',
		40: 'down'
	};
	function undefined(){}
	function left(){
		entities[entities.length-1].velX = -0;
	}
	function right(){
		entities[entities.length-1].velX = 0;
	}
	function up(){
		//
	}
	function down(){
		entities[entities.length-1].velY = 0;
	}
	function attack(){}
	let direction = d[e.keyCode||e.which];
	eval(direction+'()');
};
AIPlayer = function(){
	this.p = new Player(544);
	this.p.colour = '#093'
	this.p.lose = function(){
		var playAgain = confirm("You win! Play again?");
		if(!playAgain) history.back();
		else location.reload();
	};
	this.p.x = 544;
	this.p.y = 128;
	this.p.velX = this.p.velY = 0;
	this.show = this.p.show.bind(this.p);
	this.check = this.p.check.bind(this.p);
	this.p.lh = 0;
	this.p.update = function(){
		let target = entities[entities.length-1];
		if(target.x < this.x + this.w && this.x < target.x + target.w)
			if(target.y < this.y + this.h && this.y < target.y + target.h)
				if(this.lh < new Date().getTime()-2799) {
					target.hit();
					this.lh = new Date().getTime();
				}
		let canMove = {
			x: true, 
			y: true 
		};
		for(let i in entities) {
			let c;
			try{
				c = entities[i].check(this.x+this.velX, this.h/2+this.y-4, this.w, this.h);
			} catch(e) {
				console.log(i + '\n' + e);
			}
			if(c) {
				if(c.x&&c.y) canMove.x = false;
			}
			let c2;
			try{
				c2 = entities[i].check(this.x, this.h/2+this.y+this.velY+2, this.w, this.h);
			} catch(e) {
				console.log(i + '\n' + e);
			}
			if(c2) {
				if(c2.x&&c2.y) canMove.y = false;
			}
		}
		if(canMove.x) {
			this.x+=this.velX;
		} else {
			this.velX = 0;
		}
		if(canMove.y) {
			this.y += this.velY += 0.275;
			this.onGround = false;
		} else {
			this.velY = 0;
			this.onGround = true;
		}
		if(this.y>480||this.y<0||this.x<0||this.x>640){
			this.die();
		}
		if(!this.canJump&&this.velY<0) return;
		if(target.x < this.x) {
			this.velX -= 0.2;
			if(this.velX < -2.9) this.velX = -3;;
			// this.onkeydown({preventDefault: function(){}, keyCode: 37});
		}
		if(target.x > this.x) {
			this.velX += 0.2;
			if(this.velX > 2.9) this.velX = 3;
			// this.onkeydown({preventDefault: function(){}, keyCode: 39});
		}
		if(Math.floor(target.y) < Math.floor(this.y) || Math.random()<0.02) {
			if(this.onGround) this.velY =- 6
			// this.onkeydown({preventDefault: function(){}, keyCode: 38});
		}
	}
	this.update = this.p.update.bind(this.p);
};
let ai = new AIPlayer();
let touchButtons = {
	"up": document.createElement('div'),
	"down": document.createElement('div'),
	"left": document.createElement('div'),
	"right": document.createElement('div'),
	"a": document.createElement('div'),
};
for(var i in touchButtons){
	touchButtons[i].id = i;
	touchButtons[i].ontouchstart = function(e){
		e.preventDefault();
		function undefined(){
			console.log(e.keyCode);
		}
		function left(){
			entities[entities.length-1].velX = -4;
		}
		function right(){
			entities[entities.length-1].velX = 4;
		}
		function up(){
			if(entities[entities.length-1].onGround)
			entities[entities.length-1].velY = -6;
		}
		function down(){
			entities[entities.length-1].velY = 4;
		}
		function a(){
			let p = entities[entities.length-1],
				e = entities[entities.length-2];
			let t = new CollisionBlock(e.x, e.y, e.w, e.h);
			if(t.check(p.x,p.y,p.w,p.h)&&p.lastHit<new Date().getTime()-1280) {
				e.p.hit();
				p.lastHit = new Date().getTime();
			}
		}
		eval(this.id+'()');
	};
	document.body.appendChild(touchButtons[i]);
	if(i=='a') {
		touchButtons[i].style['right'] = 16+'px';
		touchButtons[i].style['position'] = 'absolute';
	}
		touchButtons[i].style['position'] = 'absolute';
		touchButtons[i].style.padding = '32px'
		touchButtons[i].style.background = 'rgba(0, 55, 0, 0.5)';
	touchButtons[i].innerHTML = i;
	let left = {
		'left': 16,
		'right': 192,
		'up': 96,
		'down': 48
	}
	if(i=='down') touchButtons[i].style.bottom = '0px'
	touchButtons[i].style.left=left[i]+'px'
	touchButtons[i].ontouchend = function(e){
		e.preventDefault();
		function undefined(){
			console.log(e.keyCode);
		}
		function left(){
			entities[entities.length-1].velX = -0;
		}
		function right(){
			entities[entities.length-1].velX = 0;
		}
		function up(){
			//if(entities[entities.length-1].onGround)
			//entities[entities.length-1].velY = -6;
		}
		function down(){
			//entities[entities.length-1].velY = 0;
		}
		function a(){
			//
		}
		eval(this.id+'()');
	};
}
