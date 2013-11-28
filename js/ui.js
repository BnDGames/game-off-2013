//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//ui.js
//User interface objects
//-----------------------------------------------------------------

//Generic control object
var Control = function () {
	//Control rectangle
	this.area = [0, 0, 60, 20];
	
	//Control parent
	this.parent = 0;
	
	//Control children
	this.children = new Object();
	
	//Control drawing function
	//with prototype function ( context )
	//offset is set before calling function
	this.print = 0;
	this.printAfter = 0;
	
	this.visible = true;
	
	//Animate function
	//with prototype function ( time )
	this.animate = 0;
	
	//Status (0 = normal, 1 = hover, 2 = pressed)
	this.status = 0;
	
	//Standard events
	this.onmousein = 0;
	this.onmouseout = 0;
	this.onmousedown = 0;
	this.onmouseup = 0;
}

//Function to print control and its children
function printControl ( context, control, offset ) {
	if (!control.visible) return;

	context.save();
	context.translate ( offset[0], offset[1] );
	
	if (control.print) control.print ( context );
	
	for (c in control.children)
		printControl ( context, control.children[c], control.area );
	
	context.restore();
}

//Printafter for controls
function printAfterControl ( context, control, offset ) {
	if (!control.visible) return;
	
	context.save();
	context.translate ( offset[0], offset[1] );
	
	for (c in control.children)
		printAfterControl ( context, control.children[c], control.area );
		
	if (control.printAfter) control.printAfter ( context );
	
	context.restore();
}

//Function to animate control
//Calls the animate function for all the controls
function animateControl ( control, time ) {
	if ( control.animate ) control.animate ( time );
	
	for (c in control.children)
		animateControl ( control.children[c], time );
}

//Function to check mouse state
function checkMouse ( control, event, offset ) {
	if (!control.visible) return;
	
	var mX = event.clientX - offset[0];
	var mY = event.clientY - offset[1];
	
	for (c in control.children)
		checkMouse (control.children[c], event, vSum ( offset, control.area ) );
	
	var oldstatus = control.status;
	
	if (mX > control.area[0] && mX < control.area[0] + control.area[2] && mY > control.area[1] && mY < control.area[1] + control.area[3]){
		if (event.type == "mousedown") control.status = 2;
		else if (event.type == "mouseup" && control.status == 2) control.status = 1;
		else if (control.status != 2) control.status = 1;
	}
	
	else control.status = 0;
	
	if (oldstatus != 2 && control.status == 2 && control.onmousedown) control.onmousedown (mX - control.area[0], mY - control.area[1]);
	if (oldstatus == 2 && control.status == 1 && control.onmouseup) control.onmouseup (mX - control.area[0], mY - control.area[1]);
	if (oldstatus == 0 && control.status == 1 && control.onmousein) control.onmousein (mX - control.area[0], mY - control.area[1]);
	if ((oldstatus == 1 || oldstatus == 2) && control.status == 0 && control.onmouseout) control.onmouseout ( mX - control.area[0], mY - control.area[1]);
}

//Fillbar control
var Fillbar = function () {
	this.children = new Object();
	
	//Fillbar data
	this.fill = 0;
	this.shownFill = 0;
	
	//Graphical data
	this.outerColor = "#404040";
	this.innerColor = "#808080";
	
	this.borderSize = 4;
	this.borderColor = "#FFFFFF";
	
	//Drawing function
	this.print = function ( context ) {
		if ( this.borderSize > 0 ){
			context.fillStyle = this.borderColor;
			context.fillRect ( this.area[0] - this.borderSize, this.area[1] - this.borderSize, this.area[2] + 2 * this.borderSize, this.area[3] + 2 * this.borderSize );
		}
		
		context.fillStyle = this.outerColor;
		context.fillRect ( this.area[0], this.area[1], this.area[2], this.area[3] );
		
		context.fillStyle = this.innerColor;
		context.fillRect ( this.area[0], this.area[1], this.area[2] * this.shownFill, this.area[3] );
	}
	
	//Animate function
	this.animate = function ( time ) {
		var d = this.fill - this.shownFill;
		
		this.shownFill += d * time / 10;
		
		if (this.shownFill > 1) this.shownFill = 1;
	}
}
Fillbar.prototype = new Control();

//Label control
var Label = function () {
	this.children = new Object();
	
	//Label data
	this.content = "";
	
	//Graphical data
	this.innerColor = "#606060";
	this.borderSize = 4;
	
	this.textColor = "#FFFFFF";
	
	this.borderColor = "#FFFFFF";
	
	this.printFrame = true;
	
	this.fontStyle = "24px League Gothic";
	
	this.cornerFactor = 0.5;//EXPERIMENTAL
	
	//Drawing function
	this.print = function ( context ) {
		if ( this.printFrame ){
			if ( this.borderSize > 0 ){
				context.fillStyle = this.borderColor;
				context.beginPath();
				context.moveTo ( this.area[0] - this.borderSize * (1 + this.cornerFactor), this.area[1] + this.area[3] / 2 );
				context.lineTo ( this.area[0] + this.area[3] * this.cornerFactor, this.area[1] - this.borderSize );
				context.lineTo ( this.area[0] + this.area[2] - this.area[3] * this.cornerFactor, this.area[1] - this.borderSize );
				context.lineTo ( this.area[0] + this.area[2] + this.borderSize * (1 + this.cornerFactor), this.area[1] + this.area[3] / 2 );
				context.lineTo ( this.area[0] + this.area[2] - this.area[3]  * this.cornerFactor, this.area[1] + this.area[3] + this.borderSize );
				context.lineTo ( this.area[0] + this.area[3]  * this.cornerFactor, this.area[1] + this.area[3] + this.borderSize );
				context.closePath();		
				context.fill();				
			}
		
			context.fillStyle = this.innerColor;
			context.beginPath();
			context.moveTo ( this.area[0] , this.area[1] + this.area[3] / 2 );
			context.lineTo ( this.area[0] + this.area[3]  * this.cornerFactor, this.area[1] );
			context.lineTo ( this.area[0] + this.area[2] - this.area[3] * this.cornerFactor, this.area[1] );
			context.lineTo ( this.area[0] + this.area[2], this.area[1] + this.area[3] / 2 );
			context.lineTo ( this.area[0] + this.area[2] - this.area[3] * this.cornerFactor, this.area[1] + this.area[3] );
			context.lineTo ( this.area[0] + this.area[3]  * this.cornerFactor, this.area[1] + this.area[3] );
			context.closePath();
			context.fill();
			
			if (this.blinkingRed){
				context.globalAlpha = (this.blinkingRedOpacity < this.blinkingRedTarget ? this.blinkingRedOpacity : -this.blinkingRedOpacity + 2 * this.blinkingRedTarget);
				context.fillStyle = colors_enemy;
				context.fill();
				context.globalAlpha = 1;
			}
		}
		
		context.font = this.fontStyle;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = this.textColor;
		context.fillText ( this.content, this.area[0] + this.area[2] / 2, this.area[1] + this.area[3] / 2);
	}
	
	//Red blink function
	this.blinkingRedOpacity = 0;
	this.blinkRed = function (target) {
		if ( fx_level < 1 ) return;
		
		this.blinkingRed = true;
		this.blinkingRedTarget = target;
	}
	
	this.animate = function ( time ) {
		if ( this.blinkingRed ){
			this.blinkingRedOpacity += 0.2;
			
			if (this.blinkingRedOpacity > 2 * this.blinkingRedTarget){
				this.blinkingRedOpacity = 0;
				this.blinkingRed = false;
			}
		}
	}
}
Label.prototype = new Control();

//Numeric label
var NumLabel = function () {
	this.children = new Object();
	
	//Label data
	this.value = 0;
	this.shownValue = 0;
	
	//Graphical data
	this.innerColor = "#606060";
	this.borderSize = 4;
	
	this.textColor = "#FFFFFF";
	
	this.borderColor = "#FFFFFF";
	
	this.digits = 5;
	
	this.fontStyle = "24px League Gothic";
	
	this.caption = "";
	
	//Drawing function
	this.print = function ( context ) {
		if ( this.borderSize > 0 ){
			context.fillStyle = this.borderColor;
			context.beginPath();
			context.moveTo ( this.area[0] - this.borderSize * 1.414, this.area[1] + this.area[3] / 2 );
			context.lineTo ( this.area[0] + this.area[3] / 2, this.area[1] - this.borderSize );
			context.lineTo ( this.area[0] + this.area[2] - this.area[3] / 2, this.area[1] - this.borderSize );
			context.lineTo ( this.area[0] + this.area[2] + this.borderSize * 1.414, this.area[1] + this.area[3] / 2 );
			context.lineTo ( this.area[0] + this.area[2] - this.area[3] / 2, this.area[1] + this.area[3] + this.borderSize );
			context.lineTo ( this.area[0] + this.area[3] / 2, this.area[1] + this.area[3] + this.borderSize );
			context.closePath();		
			context.fill();
		}
		
		context.fillStyle = this.innerColor;
		context.beginPath();
		context.moveTo ( this.area[0] , this.area[1] + this.area[3] / 2 );
		context.lineTo ( this.area[0] + this.area[3] / 2, this.area[1] );
		context.lineTo ( this.area[0] + this.area[2] - this.area[3] / 2, this.area[1] );
		context.lineTo ( this.area[0] + this.area[2], this.area[1] + this.area[3] / 2 );
		context.lineTo ( this.area[0] + this.area[2] - this.area[3] / 2, this.area[1] + this.area[3] );
		context.lineTo ( this.area[0] + this.area[3] / 2, this.area[1] + this.area[3] );
		context.closePath();
		context.fill();
			
		if (this.blinkingRed){
			context.globalAlpha = (this.blinkingRedOpacity < this.blinkingRedTarget ? this.blinkingRedOpacity : -this.blinkingRedOpacity + 2 * this.blinkingRedTarget);
			context.fillStyle = colors_enemy;
			context.fill();
			context.globalAlpha = 1;
		}
		
		context.font = this.fontStyle;
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = this.textColor;
		context.fillText ( this.caption + Math.ceil(this.shownValue).toString(), this.area[0] + this.area[2] / 2, this.area[1] + this.area[3] / 2);
	}
	
	//Animate function
	this.animate = function ( time ) {
		if (this.value != this.shownValue){
			var increment = (this.value - this.shownValue) / 10;
			
			if ((this.shownValue + increment - this.value < 0.5) == (this.shownValue - this.value < 0.5))
				this.shownValue += increment;
			else this.shownValue = this.value;
		}
		
		if ( this.blinkingRed ){
			this.blinkingRedOpacity += 0.2;
			
			if (this.blinkingRedOpacity > 2 * this.blinkingRedTarget){
				this.blinkingRedOpacity = 0;
				this.blinkingRed = false;
			}
		}
	}
	
	//Red blink function
	this.blinkingRedOpacity = 0;
	this.blinkRed = function (target) {
		if ( fx_level < 1 ) return;
		
		this.blinkingRed = true;
		this.blinkingRedTarget = target;
	}
}
NumLabel.prototype = new Control();

//Checkbox list
var CheckBoxList = function () {
	this.children = new Object();
	
	//Checkbox list data
	this.length = 3;
	this.checked = 0;
	
	//Graphical data
	this.innerColor = "#606060";
	this.checkedColor = "#909090";
	this.borderSize = 4;
	
	this.borderColor = "#FFFFFF";
	
	this.checkedOffset = 0;
	
	//Drawing function
	this.print = function ( context ) {
		if ( this.borderSize > 0 ){
			context.fillStyle = this.borderColor;
			context.beginPath();
			context.moveTo ( this.area[0] - this.borderSize * 1.414, this.area[1] + this.area[3] / 2 );
			context.lineTo ( this.area[0] + this.area[3] / 2, this.area[1] - this.borderSize );
			context.lineTo ( this.area[0] + this.area[2] - this.area[3] / 2, this.area[1] - this.borderSize );
			context.lineTo ( this.area[0] + this.area[2] + this.borderSize * 1.414, this.area[1] + this.area[3] / 2 );
			context.lineTo ( this.area[0] + this.area[2] - this.area[3] / 2, this.area[1] + this.area[3] + this.borderSize );
			context.lineTo ( this.area[0] + this.area[3] / 2, this.area[1] + this.area[3] + this.borderSize );
			context.closePath();
			context.fill();
		}
		
		context.fillStyle = this.innerColor;
		context.beginPath();
		context.moveTo ( this.area[0] , this.area[1] + this.area[3] / 2 );
		context.lineTo ( this.area[0] + this.area[3] / 2, this.area[1] );
		context.lineTo ( this.area[0] + this.area[2] - this.area[3] / 2, this.area[1] );
		context.lineTo ( this.area[0] + this.area[2], this.area[1] + this.area[3] / 2 );
		context.lineTo ( this.area[0] + this.area[2] - this.area[3] / 2, this.area[1] + this.area[3] );
		context.lineTo ( this.area[0] + this.area[3] / 2, this.area[1] + this.area[3] );
		context.closePath();
		context.fill();
		
		if ( this.checked == 0 ) {
			context.fillStyle = this.checkedColor;
			context.beginPath();
			context.moveTo ( this.checkedOffset + this.area[0] , this.area[1] + this.area[3] / 2 );
			context.lineTo ( this.checkedOffset + this.area[0] + this.area[3] / 2, this.area[1] );
			context.lineTo ( this.checkedOffset + this.area[0] + this.area[2] / this.length, this.area[1] );
			context.lineTo ( this.checkedOffset + this.area[0] + this.area[2] / this.length, this.area[1] + this.area[3] );
			context.lineTo ( this.checkedOffset + this.area[0] + this.area[3] / 2, this.area[1] + this.area[3] );
			context.closePath();
			context.fill();
		}
		
		else if ( this.checked == this.length - 1 ) {
			context.fillStyle = this.checkedColor;
			context.beginPath();
			context.moveTo ( this.checkedOffset + this.area[0] , this.area[1]);
			context.lineTo ( this.checkedOffset + this.area[0] + this.area[2] / this.length - this.area[3] / 2, this.area[1]);
			context.lineTo ( this.checkedOffset + this.area[0] + this.area[2] / this.length, this.area[1] + this.area[3] / 2 );
			context.lineTo ( this.checkedOffset + this.area[0] + this.area[2] / this.length - this.area[3] / 2, this.area[1] + this.area[3] );
			context.lineTo ( this.checkedOffset + this.area[0], this.area[1] + this.area[3] );
			context.closePath();
			context.fill();
		}
		
		else {
			context.fillStyle = this.checkedColor;
			context.fillRect ( this.checkedOffset + this.area[0], this.area[1], this.area[2] / this.length, this.area[3] );
		}
		
		if ( this.borderSize > 0 ){
			context.fillStyle = this.borderColor;
			
			for ( var i = 0; i < this.length - 1; i++ )
				context.fillRect ( this.area[0] + (1 + i) * this.area[2] / this.length - this.borderSize / 2, this.area[1], this.borderSize, this.area[3] );
		}
		
		for ( var i = 0; i < this.length; i++ ) {
			context.translate ( this.area[0] + (i + 0.5) * this.area[2] / this.length + (i == 0 ? this.area[2] / this.length * 0.07 : 0) + (i == this.length - 1 ? -this.area[2] / this.length * 0.07 : 0), this.area[1] + this.area[3] / 2 );
			if ( this.prints[i] ) this.prints[i](context);
			context.translate ( -this.area[0] - (i + 0.5) * this.area[2] / this.length - (i == 0 ? this.area[2] / this.length * 0.07 : 0) - (i == this.length - 1 ? -this.area[2] / this.length * 0.07 : 0), -this.area[1] - this.area[3] / 2 );
		}
	}
	
	//Individual drawing functions
	this.prints = new Array();
	
	//Function to check element
	this.check = function ( i ) {
		this.checked = i;
		if (this.oncheck) this.oncheck(i);
	}
	
	//Animation
	this.animate = function ( time ) {
		var d = this.checkedOffset - this.checked * this.area[2] / this.length;
		
		this.checkedOffset -= d * time / 10;
	}
	
	//Click handler
	this.onmouseup = function ( x, y ) {
		for ( var i = 0; i < this.length; i++ ){
			if ( x > (this.area[2] / this.length) * i && x < (this.area[2] / this.length) * (i + 1)){
				this.check(i);
				break;
			}
		}
	}
	
	//Function to handle check
	this.oncheck = 0;
}
CheckBoxList.prototype = new Control();

//Part viewer control
var PartViewer = function () {
	this.children = new Object();
	
	//Shown part
	this.part = 0;
	
	//Behaviour
	this.disabled = false;
	
	//Graphics
	this.innerColor = "#000410";
	this.disabledColor = "#303030";
	this.borderSize = 4;
	this.borderColor = "#FFFFFF";
	
	this.scale = 1;
	this.angle = 0;
	
	this.corner = 16;
	
	this.infoControl = 0;
	
	//Print function
	this.print = function ( context ) {
		context.beginPath();
		context.moveTo(this.area[0] + this.corner, this.area[1]);
		context.lineTo(this.area[0] + this.area[2] - this.corner, this.area[1]);
		context.lineTo(this.area[0] + this.area[2], this.area[1] + this.corner);
		context.lineTo(this.area[0] + this.area[2], this.area[1] + this.area[3] - this.corner);
		context.lineTo(this.area[0] + this.area[2] - this.corner, this.area[1] + this.area[3]);
		context.lineTo(this.area[0] + this.corner, this.area[1] + this.area[3]);
		context.lineTo(this.area[0], this.area[1] + this.area[3] - this.corner);
		context.lineTo(this.area[0], this.area[1] + this.corner);
		context.closePath();
		
		context.fillStyle = this.innerColor;
		context.fill();
		
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderSize;
		context.stroke();
		context.lineWidth = 1;
	}
	
	//Print after
	this.printAfter = function ( context ) {
		if (this.part != 0){
			context.save();
			
			if (this.part != window.draggedPart) context.scale (this.scale, this.scale);
			context.translate((this.area[2] / 2 + this.area[0]) / (this.part == window.draggedPart ? 1 : this.scale), (this.area[3] / 2 + this.area[1]) / (this.part == window.draggedPart ? 1 : this.scale));
			if (this.part != window.draggedPart) context.rotate(this.angle);
			
			drawPart ( context, this.part, [0,0], [false], [colors_player], true );
			
			context.restore();
		}
		
		
		if (this.disabled){
			context.beginPath();
			context.moveTo(this.area[0] + this.corner, this.area[1]);
			context.lineTo(this.area[0] + this.area[2] - this.corner, this.area[1]);
			context.lineTo(this.area[0] + this.area[2], this.area[1] + this.corner);
			context.lineTo(this.area[0] + this.area[2], this.area[1] + this.area[3] - this.corner);
			context.lineTo(this.area[0] + this.area[2] - this.corner, this.area[1] + this.area[3]);
			context.lineTo(this.area[0] + this.corner, this.area[1] + this.area[3]);
			context.lineTo(this.area[0], this.area[1] + this.area[3] - this.corner);
			context.lineTo(this.area[0], this.area[1] + this.corner);
			context.closePath();
			
			context.globalAlpha = 0.5;
			context.fillStyle = this.disabledColor;
			context.fill();
			context.globalAlpha = 1;
			
			context.strokeStyle = this.borderColor;
			context.lineWidth = this.borderSize;
			context.stroke();
			context.lineWidth = 1;
		}
	}
	
	//Animate
	this.animate = function ( time ){
		if (this.part.r / (this.area[2] - this.corner) > 1) this.scale = (this.area[2] - this.corner) / this.part.r 
		
		if (this.rotate && this.part != window.draggedPart)
			this.angle += 0.03;
	}
	
	//Onclick
	this.onmousedown = function () {
		if (this.disabled || !this.part) return;
		
		window.draggedPart = this.part;
		window.draggedSource = this;
		window.draggedSourcePos = [ this.area[0] + this.area[2] / 2, this.area[1] + this.area[3] / 2 ];
		
		window.onmouseup = function () {
			if (this.onpartdrop)
				this.onpartdrop ( this.draggedPart, vSum(this.draggedPart.position, this.draggedSourcePos) );
				
			this.onmouseup = 0;
			this.onmousemove = 0;
			
			this.draggedSource.innerColor = "#000410";
			
			this.draggedPart.position = [0,0];
			this.draggedPart = 0;
			this.draggedSource = 0;
			this.draggedSourcePos = 0;
		}
		
		window.onmousemove = function (event) {
			var offset = document.getElementById("gameCanvas").getBoundingClientRect();
			var point = [event.clientX - offset.left, event.clientY - offset.top];
			
			point = vSubt ( point, this.draggedSourcePos );
			
			this.draggedPart.position = point.slice(0);
		}
	}
	
	this.onmousein = function () {
		if (window.draggedPart){ this.status = 0; return; }
		
		if (!this.disabled) this.innerColor = "#001230";
		
		this.rotate = true;
		
		if (this.part && this.infoControl){
			this.infoControl.stats = this.part.stats;
			this.infoControl.info = this.part.info;
		}
	}
	
	this.onmouseout = function () {
		if (!this.disabled && (!this.part || this.part != window.draggedPart)) this.innerColor = "#000410";
		this.rotate = false;
	}
}
PartViewer.prototype = new Control();

//Stats viewer
var StatViewer = function () {
	this.children = new Object();
	
	this.stats = [0,0,0,0,0];
	this.info = new Array();
	
	//Graphics
	this.innerColor = "#000410";
	this.disabledColor = "#303030";
	this.borderSize = 4;
	this.borderColor = "#FFFFFF";
	
	this.corner = 16;
	
	this.bigFontStyle = "32px League Gothic";
	this.fontStyle = "20px League Gothic";
	
	//Print function
	this.print = function ( context ) {
		context.beginPath();
		context.moveTo(this.area[0] + this.corner, this.area[1]);
		context.lineTo(this.area[0] + this.area[2] - this.corner, this.area[1]);
		context.lineTo(this.area[0] + this.area[2], this.area[1] + this.corner);
		context.lineTo(this.area[0] + this.area[2], this.area[1] + this.area[3] - this.corner);
		context.lineTo(this.area[0] + this.area[2] - this.corner, this.area[1] + this.area[3]);
		context.lineTo(this.area[0] + this.corner, this.area[1] + this.area[3]);
		context.lineTo(this.area[0], this.area[1] + this.area[3] - this.corner);
		context.lineTo(this.area[0], this.area[1] + this.corner);
		context.closePath();
		
		context.fillStyle = this.innerColor;
		context.fill();
		
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderSize;
		context.stroke();
		context.lineWidth = 1;
		
		context.font = this.fontStyle;
		context.fillStyle = "#FFFFFF";
		context.textAlign = "left";
		context.textBaseline = "top";
		
		context.beginPath();
		context.rect ( this.area[0] + this.area[2] - 200, this.area[1] + 15, 4, this.area[3] - 30 );
		context.fill();
		
		var statText = [ "HEALTH", "ARMOR", "MASS", "ENGINE" ];
		var x = 20;
		var y = 15;
		
		for (var i = 0; i < 4; i++ ){
			context.fillText ( statText[i] + ": " + this.stats[i], this.area[0] + this.area[2] - 200 + x, this.area[1] + y );
			context.textBaseline = "bottom";
			y = this.area[3] - 15;
			
			if ( i == 1 ){
				context.textAlign = "right";
				context.textBaseline = "top";
				x = 180;
				y = 15;
			}
		}
		
		context.textBaseline = "top";
		context.textAlign = "left";
		context.font = this.bigFontStyle;
		
		if (this.info){
			if (this.info[0])
				context.fillText ( this.info[0].toUpperCase(), this.area[0] + 20, this.area[1] + 10 );
		
			context.font = this.fontStyle;
			
			if (this.info[1])
				context.fillText ( this.info[1].toUpperCase(), this.area[0] + 20, this.area[1] + 42 );
		}
	}
}
StatViewer.prototype = new Control();

//Scrollbar
var Scrollbar = function () {
	this.children = new Object();
	
	this.value = 0;
	this.length = 2;
	
	this.arrowSize = 30;
	
	this.innerColor = "#303030";
	this.arrowColor_up = "#606060";
	this.arrowColor_down = "#606060";
	
	this.cursorColor = "#606060";
	
	this.arrowActive = colors_player;
	this.arrowNormal = "#606060";
	
	this.borderSize = 4;
	this.borderColor = "#FFFFFF";
	
	this.onchange = 0;
	
	//Print
	this.print = function () {
		context.beginPath();
		context.moveTo ( this.area[0] + this.area[2] / 2, this.area[1] );
		context.lineTo ( this.area[0], this.area[1] + this.area[2] / 2 );
		context.lineTo ( this.area[0], this.area[1] + this.area[2] / 2 + this.arrowSize);
		context.lineTo ( this.area[0] + this.area[2], this.area[1] + this.area[2] / 2 + this.arrowSize);
		context.lineTo ( this.area[0] + this.area[2], this.area[1] + this.area[2] / 2);
		context.closePath();
		
		context.fillStyle = this.arrowColor_up;
		context.fill();
		
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderSize;
		context.stroke();
		
		context.beginPath();
		context.moveTo ( this.area[0] + this.area[2] / 2, this.area[1] + this.area[3] );
		context.lineTo ( this.area[0], this.area[1] + this.area[3] - this.area[2] / 2 );
		context.lineTo ( this.area[0], this.area[1] + this.area[3] - this.area[2] / 2 - this.arrowSize);
		context.lineTo ( this.area[0] + this.area[2], this.area[1] + this.area[3] - this.area[2] / 2 - this.arrowSize);
		context.lineTo ( this.area[0] + this.area[2], this.area[1] + this.area[3] - this.area[2] / 2);
		context.closePath();
		
		context.fillStyle = this.arrowColor_down;
		context.fill();
		
		context.strokeStyle = this.borderColor;
		context.lineWidth = this.borderSize;
		context.stroke();
		
		context.beginPath();
		context.rect ( this.area[0] + 8, this.area[1] + this.area[2] / 2 + this.arrowSize, this.area[2] - 16, this.area[3] - 2 * (this.area[2] / 2 + this.arrowSize) );
		context.fillStyle = this.innerColor;
		context.fill();
		
		context.stroke();
		
		context.beginPath();
		context.rect ( 	this.area[0] + 6,
						this.area[1] + this.area[2] / 2 + this.arrowSize + (this.area[3] - 2 * (this.area[2] / 2 + this.arrowSize) ) * this.value / this.length,
						this.area[2] - 12,
						(this.area[3] - 2 * (this.area[2] / 2 + this.arrowSize) ) / this.length );
						
		context.fillStyle = this.cursorColor;
		context.fill();
		context.stroke();
		
		context.lineWidth = 1;
	}
	
	//On mouse down
	this.onmousedown = function ( x, y ) {
		var arrowUp = [
			[ this.area[0] + this.area[2] / 2, this.area[1] ],
			[ this.area[0], this.area[1] + this.area[2] / 2 ],
			[ this.area[0], this.area[1] + this.area[2] / 2 + this.arrowSize ],
			[ this.area[0] + this.area[2], this.area[1] + this.area[2] / 2 + this.arrowSize ],
			[ this.area[0] + this.area[2], this.area[1] + this.area[2] / 2 ]
		];
		
		var arrowDown = [
			[ this.area[0] + this.area[2] / 2, this.area[1] + this.area[3] ],
			[ this.area[0], this.area[1] + this.area[3] - this.area[2] / 2 ],
			[ this.area[0], this.area[1] + this.area[3] - this.area[2] / 2 - this.arrowSize ],
			[ this.area[0] + this.area[2], this.area[1] + this.area[3] - this.area[2] / 2 - this.arrowSize ],
			[ this.area[0] + this.area[2], this.area[1] + this.area[3] - this.area[2] / 2 ]
		];
		
		if (pointInsidePoly ( [x + this.area[0],y + this.area[1]], arrowUp ) ){
			this.arrowColor_up = this.arrowActive;
		}
		
		if (pointInsidePoly ( [x + this.area[0],y + this.area[1]], arrowDown ) ) {
			this.arrowColor_down = this.arrowActive;
		}
	}
	
	//On mouse up
	this.onmouseup = function ( x, y ) {
		var arrowUp = [
			[ this.area[0] + this.area[2] / 2, this.area[1] ],
			[ this.area[0], this.area[1] + this.area[2] / 2 ],
			[ this.area[0], this.area[1] + this.area[2] / 2 + this.arrowSize ],
			[ this.area[0] + this.area[2], this.area[1] + this.area[2] / 2 + this.arrowSize ],
			[ this.area[0] + this.area[2], this.area[1] + this.area[2] / 2 ]
		];
		
		var arrowDown = [
			[ this.area[0] + this.area[2] / 2, this.area[1] + this.area[3] ],
			[ this.area[0], this.area[1] + this.area[3] - this.area[2] / 2 ],
			[ this.area[0], this.area[1] + this.area[3] - this.area[2] / 2 - this.arrowSize ],
			[ this.area[0] + this.area[2], this.area[1] + this.area[3] - this.area[2] / 2 - this.arrowSize ],
			[ this.area[0] + this.area[2], this.area[1] + this.area[3] - this.area[2] / 2 ]
		];
		
		if (pointInsidePoly ( [x + this.area[0],y + this.area[1]], arrowUp ) ){
			this.value--;
			if (this.value < 0) this.value = 0;
			
			if (this.onchange) this.onchange ( this.value );
		}
		
		if (pointInsidePoly ( [x + this.area[0],y + this.area[1]], arrowDown ) ) {
			this.value++;
			if (this.value > this.length - 1) this.value = this.length - 1;
			
			if (this.onchange) this.onchange ( this.value );
		}
		
		this.arrowColor_up = this.arrowNormal;
		this.arrowColor_down = this.arrowNormal;
	}
	
	this.onmouseout = function ( ) {
		this.arrowColor_up = this.arrowNormal;
		this.arrowColor_down = this.arrowNormal;
	}
}
Scrollbar.prototype = new Control();

//Upgrade viewer
var UpgradeViewer = function () {
	this.children = new Object();
	
	this.upgrade = new Upgrade();
	
	//Graphics
	this.innerColor = "#606060";
	
	this.completeColor = "#303030";
	this.completeFgColor = "#A0A0A0";
	this.completeBorderColor = "#A0A0A0";
	
	this.disabledColor = "#303030";
	this.borderSize = 4;
	this.borderColor = "#FFFFFF";
	
	this.corner = 16;
	
	this.bigFontStyle = "32px League Gothic";
	this.fontStyle = "20px League Gothic";
	
	this.children.upgradeButton = new Label();
	this.children.upgradeButton.parent = this;
	this.children.cost = new Label();
	this.children.progress = new Fillbar();
	this.children.part = new PartViewer();
	
	this.scoreControl = 0;
	
	//Setup function
	this.setup = function (anim) {
		this.children.upgradeButton.area = [ this.area[2] - 176 - this.corner, this.area[3] - 16, 160, 32 ];
		if (this.upgrade && this.upgrade.value < this.upgrade.max ){
			this.children.upgradeButton.content = "BUY UPGRADE";
			this.children.upgradeButton.onmousein = labelOnMouseIn;
			this.children.upgradeButton.onmouseout = labelOnMouseOut;
			this.children.upgradeButton.onmousedown = function () {
				if (playerScore >= this.parent.upgrade.cost + (this.parent.upgrade.costFactor ? this.parent.upgrade.costFactor * this.parent.upgrade.value : 0))
					this.innerColor = colors_player;
				else {
					this.innerColor = colors_enemy;
					if (this.parent.scoreControl) this.parent.scoreControl.blinkRed ( 1 );
				}
			};
			this.children.upgradeButton.onmouseup = function () {
				this.innerColor = colors_buttonHover;
				
				if (playerScore >= this.parent.upgrade.cost + (this.parent.upgrade.costFactor ? this.parent.upgrade.costFactor * this.parent.upgrade.value : 0)){
					playerScore -= this.parent.upgrade.cost + (this.parent.upgrade.costFactor ? this.parent.upgrade.costFactor * this.parent.upgrade.value : 0);
					
					applyUpgrade ( this.parent.upgrade );
					this.parent.setup(true);
				}
			}
			
			this.children.upgradeButton.borderColor = this.borderColor;
			this.children.upgradeButton.innerColor = this.innerColor;
			this.children.upgradeButton.textColor = "#FFFFFF";
			
			this.children.cost.borderColor = this.borderColor;
			this.children.cost.innerColor = this.innerColor;
			this.children.cost.textColor = "#FFFFFF";
			
			this.children.progress.borderColor = this.borderColor;
			this.children.progress.innerColor = colors_player;
			
			this.children.part.disabled = false;
			this.children.part.rotate = true;
		}
		
		else if (this.upgrade) {
			this.children.upgradeButton.content = "PURCHASED";
			this.children.upgradeButton.borderColor = this.completeBorderColor;
			this.children.upgradeButton.innerColor = this.completeColor;
			this.children.upgradeButton.textColor = this.completeFgColor;
			
			this.children.upgradeButton.onmousein = 0;
			this.children.upgradeButton.onmouseout = 0;
			this.children.upgradeButton.onmousedown = 0;
			this.children.upgradeButton.onmouseup = 0;
			
			this.children.cost.borderColor = this.completeBorderColor;
			this.children.cost.innerColor = this.completeColor;
			this.children.cost.textColor = this.completeFgColor;
			
			this.children.progress.borderColor = this.completeBorderColor;
			this.children.progress.innerColor = this.completeColor;
			
			this.children.progress.borderColor = this.completeBorderColor;
			this.children.progress.innerColor = colors[8];
			
			this.children.part.borderColor = this.completeBorderColor;
			this.children.part.disabled = true;
			this.children.part.rotate = false;
		}
		
		this.children.cost.area = this.children.upgradeButton.area.slice(0);
		this.children.cost.area[3] = 26;
		this.children.cost.area[2] = 160;
		this.children.cost.area[1] += 3;
		this.children.cost.area[0] = 16 + this.corner;
		
		if ( this.upgrade ) this.children.cost.content = "$ " + (this.upgrade.cost + (this.upgrade.costFactor ? this.upgrade.costFactor * this.upgrade.value : 0));
		else this.children.cost.content = "-";
		
		this.visible = true;
		if ( !this.upgrade ) this.visible = false;
		
		if ( this.upgrade && this.upgrade.max > 1 ) {
			this.children.progress.visible = true;
			this.children.progress.area = [ this.corner, this.area[3] - 48, this.area[2] - 2 * this.corner, 16 ];
			this.children.progress.fill = this.upgrade.value / this.upgrade.max;
			if (!anim) this.children.progress.shownFill = this.children.progress.fill;
		}
		else this.children.progress.visible = false;
		
		if ( this.upgrade && this.upgrade.data.action == "unlockPart" ) {
			this.children.part.part = getPart ( this.upgrade.data.part );
			
			this.children.part.area = [ this.area[2] - 102, 12, 90, 90 ];
			this.children.part.innerColor = "#404040";
			this.children.part.onmousein = 0;
			this.children.part.onmouseout = 0;
			this.children.part.onmousedown = 0;
			this.children.part.onmouseup = 0;
			this.children.part.rotate = true;
			
			this.children.part.visible = true;
			
		}
		
		else 
			this.children.part.visible = false;
	}
	
	//Print function
	this.print = function ( context ) {
		if (!this.upgrade) return;
		
		if (this.children.progress)
			this.children.progress.fill = this.upgrade.value / this.upgrade.max;
		
		context.beginPath();
		context.moveTo(this.area[0] + this.corner, this.area[1]);
		context.lineTo(this.area[0] + this.area[2] - this.corner, this.area[1]);
		context.lineTo(this.area[0] + this.area[2], this.area[1] + this.corner);
		context.lineTo(this.area[0] + this.area[2], this.area[1] + this.area[3] - this.corner);
		context.lineTo(this.area[0] + this.area[2] - this.corner, this.area[1] + this.area[3]);
		context.lineTo(this.area[0] + this.corner, this.area[1] + this.area[3]);
		context.lineTo(this.area[0], this.area[1] + this.area[3] - this.corner);
		context.lineTo(this.area[0], this.area[1] + this.corner);
		context.closePath();
		
		context.fillStyle = this.upgrade.value < this.upgrade.max ? this.innerColor : this.completeColor;
		context.fill();
		
		context.strokeStyle = this.upgrade.value < this.upgrade.max ? this.borderColor : this.completeBorderColor;
		context.lineWidth = this.borderSize;
		context.stroke();
		context.lineWidth = 1;
		
		context.font = this.fontStyle;
		context.fillStyle = this.upgrade.value < this.upgrade.max ? "#FFFFFF" : this.completeFgColor;
		context.textAlign = "left";
		context.textBaseline = "top";
		
		context.textBaseline = "top";
		context.textAlign = "left";
		context.font = this.bigFontStyle;
		
		if (this.upgrade.info){
			if (this.upgrade.info[0])
				context.fillText ( this.upgrade.info[0].toUpperCase() + (this.upgrade.max > 1 ? "  (" + this.upgrade.value + "/" + this.upgrade.max + ")" : ""), this.area[0] + 20, this.area[1] + 20 );
		
			context.font = this.fontStyle;
			
			if (this.upgrade.info[1])
				context.fillText ( this.upgrade.info[1].toUpperCase(), this.area[0] + 20, this.area[1] + 52 );
		}
	}
}
UpgradeViewer.prototype = new Control();

//Label standard event functions
function labelOnMouseIn () { this.innerColor = colors_buttonHover; }
function labelOnMouseOut () { this.innerColor = colors_buttonStd; }
function labelOnMouseDown () { this.innerColor = colors_buttonActive; }
