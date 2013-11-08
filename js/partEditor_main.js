//Github Game Off 2013
//-----------------------------------------------------------------
//partEditor_main.js
//Part editor
//-----------------------------------------------------------------

var textArea;

var redrawTimeout = -1;
var redrawDelay = 100;

var gridSize = 10;

var part = new Part();

String.prototype.splice = function( i, r, s ) {
    return (this.slice(0,i) + s + this.slice(i + Math.abs(r)));
};

//Setup function
function setup () {
	graphicsSetup();
	
	textArea = document.getElementById("codeField");
	textArea.onkeydown = taOnKeyDown;
	
	document.onkeydown = docOnKeyDown;
	
	canvas.onclick = canvasClick;
	
	redraw();
}

//Function to handle keypresses on textarea
function taOnKeyDown (event) {
	var c = event.which || event.keyCode;
	
	if (c == 9){
		event.preventDefault();
	
		var i = textArea.selectionStart;
					
		textArea.value = textArea.value.splice ( textArea.selectionStart, textArea.selectionEnd - textArea.selectionStart, "\t" );
		textArea.selectionStart = i + 1;
		textArea.selectionEnd = i + 1;
	}
	
	if ( redrawTimeout != -1) clearTimeout ( redrawTimeout );
	redrawTimeout = setTimeout ( redraw, redrawDelay );
}

function docOnKeyDown (event){
	var c = event.which || event.keyCode;
	
	if (c == 8 && document.activeElement != textArea){
		part.vertices.pop();
		textArea.value = JSON.stringify ( part, 0, "   " );			
		redraw();
	}
}

function redraw () {
	context.fillStyle = "#000000";
	context.fillRect (0,0,canvas.width,canvas.height);
	
	context.strokeStyle = "#303030";
	for ( var i = 0; i < canvas.width; i += gridSize){
		context.beginPath();
		context.moveTo ( i, 0 );
		context.lineTo ( i, canvas.height );
		context.stroke();
	}
	
	for ( var i = 0; i < canvas.height; i += gridSize){
		context.beginPath();
		context.moveTo ( 0, i );
		context.lineTo ( canvas.width, i );
		context.stroke();
	}
	
	context.strokeStyle = "#404040";
	context.beginPath();
	context.moveTo ( canvas.width / 2, 0);
	context.lineTo ( canvas.width / 2, canvas.height);
	context.stroke();
	
	context.beginPath();
	context.moveTo ( 0, canvas.height / 2);
	context.lineTo ( canvas.width, canvas.height / 2);
	context.stroke();
	
	drawPart ( context, part, [canvas.width / 2, canvas.height / 2], undefined, [ "#C83737" ] );
	part = partFromJson ( JSON.parse ( textArea.value ) );
	drawPart ( context, part, [canvas.width / 2, canvas.height / 2], undefined, [ "#C83737" ] );
}

function canvasClick ( event ) {
	var x = (event.offsetX || event.layerX) - canvas.width / 2;
	var y = (event.offsetY || event.layerY) - canvas.height / 2;
	
	var x = gridSize * Math.round ( x / gridSize );
	var y = gridSize * Math.round ( y / gridSize );
	
	part.vertices.push ( [x,y] );
	textArea.value = JSON.stringify ( part, 0, "   " );	
	redraw();
}
