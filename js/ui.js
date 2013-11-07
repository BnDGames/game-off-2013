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
}

//Function to print control and its children
function printControl ( context, control, offset ) {
	context.translate ( offset[0], offset[1] );
	
	if (control.print) control.print ( context );
	
	for (c in control.children)
		printControl ( context, control.children[c], control.area );
		
	context.translate ( -offset[0], -offset[1] );
}

//Fillbar control
var Fillbar = function () {
	//Fillbar data
	this.fill = 0;	
	
	//Graphical data
	this.outerColor = "#505050";
	this.innerColor = "#808080";
	
	//Drawing function
	this.print = function ( context ) {
		context.fillStyle = this.outerColor;
		context.fillRect ( this.area[0], this.area[1], this.area[2], this.area[3] );
		
		context.fillStyle = this.innerColor;
		context.fillRect ( this.area[0], this.area[1], this.area[2] * this.fill, this.area[3] );
	}
}
Fillbar.prototype = new Control();
