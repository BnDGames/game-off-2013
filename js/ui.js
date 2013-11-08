//BnDGames
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
	
	//Animate function
	//with prototype function ( time )
	this.animate = 0;
}

//Function to print control and its children
function printControl ( context, control, offset ) {
	context.translate ( offset[0], offset[1] );
	
	if (control.print) control.print ( context );
	
	for (c in control.children)
		printControl ( context, control.children[c], control.area );
		
	context.translate ( -offset[0], -offset[1] );
}

//Function to animate control
//Calls the animate function for all the controls
function animateControl ( control, time ) {
	if ( control.animate ) control.animate ( time );
	
	for (c in control.children)
		animateControl ( control.children[c], time );
}

//Fillbar control
var Fillbar = function () {
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
	}
}
Fillbar.prototype = new Control();

//Label control
var Label = function () {
	//Label data
	this.content = "";
	
	//Graphical data
	this.innerColor = "#606060";
	this.borderSize = 4;
	
	this.textColor = "#FFFFFF";
	
	this.borderColor = "#FFFFFF";
	
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
		
		context.font = "20px Verdana";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = this.textColor;
		context.fillText ( this.content, this.area[0] + this.area[2] / 2, this.area[1] + this.area[3] / 2);
	}
	
}
Label.prototype = new Control();

//Numeric label
var NumLabel = function () {
	//Label data
	this.value = 0;
	this.shownValue = 0;
	
	//Graphical data
	this.innerColor = "#606060";
	this.borderSize = 4;
	
	this.textColor = "#FFFFFF";
	
	this.borderColor = "#FFFFFF";
	
	this.digits = 5;
	
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
		
		context.font = "20px Verdana";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = this.textColor;
		context.fillText ( pad ( this.shownValue.toString(), "0", 5 ), this.area[0] + this.area[2] / 2, this.area[1] + this.area[3] / 2);
	}
	
	//Animate function
	this.animate = function ( time ) {
		if (this.value != this.shownValue)
			this.shownValue += this.value > this.shownValue ? 1 : -1;
	}
}
NumLabel.prototype = new Control();
