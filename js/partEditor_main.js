//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//partEditor_main.js
//Part editor
//-----------------------------------------------------------------

var part = new Part();

var state_shape = 0;
var shapeCanvas, shapeContext;
var shape_showGrid = true;
var shape_snapToGrid = true;
var shape_showHandles = true;
var shape_selectedNodeIndex = -1;

var state_draw = 1;
var drawCanvas, drawContext;
var draw_showGrid = true;
var draw_snapToGrid = true;
var draw_showHandles = true;

var state_stats = 2;

var state = state_shape;

var handleSize = 4;
var gridSize = 10;

//Setup function
function setup () {
	shapeCanvas = document.getElementById("shapeCanvas");
	shapeContext = shapeCanvas.getContext("2d");
	
	drawCanvas = document.getElementById("drawCanvas");
	drawContext = drawCanvas.getContext("2d");
	
	uiSetup();
	
	setInterval ( draw, 15 );
}

//UI setup function
function uiSetup() {
	$("#tabs").tabs();
	
	$("#tabtitle-shape").click( function () { state = state_shape; } );
	$("#tabtitle-draw").click( function () { state = state_draw; } );
	$("#tabtitle-stats").click( function () { state = state_stats; } );
	
	$("#shape_showGrid").click ( function () { shape_showGrid = !shape_showGrid; } );
	$("#shape_snapToGrid").click ( function () { shape_snapToGrid = !shape_snapToGrid; } );
	$("#shape_showHandles").click ( function () { shape_showHandles = !shape_showHandles; } );
	
	$(".button").button();
	
	$("#shape_addPoint").click ( function() {
		if (part.vertices.length <= 1)
			part.vertices.push( [0,0] );
		
		else part.vertices.push ( vMult ( vSum (part.vertices[part.vertices.length - 1], part.vertices[0]) , 0.5) );
	});
	
	$("#shape_removePoint").click ( function() {
		if (shape_selectedNodeIndex > 0){
			part.vertices.splice(shape_selectedNodeIndex, 1);
			shape_selectedNodeIndex = -1;
		}
	});
	
	$("#shapeCanvas").mousedown ( function(event) {
		event.preventDefault();
		
		var offset = this.getBoundingClientRect();
		var point = [event.clientX - offset.left - this.width / 2, event.clientY - offset.top - this.height / 2];
		
		for (var i = 0; i < part.vertices.length; i++){
			if ( vModule ( vSubt ( point, part.vertices[i] ) ) < 2 * handleSize ){
				this.selectedNode = part.vertices[i];
				shape_selectedNodeIndex = i;
				return;
			}
		}
		
		shape_selectedNodeIndex = -1;
	})
	.mousemove ( function(event) {
		var offset = this.getBoundingClientRect();
		var point = [event.clientX - offset.left - this.width / 2, event.clientY - offset.top - this.height / 2];
		
		if (shape_snapToGrid){
			point[0] = gridSize * Math.floor(point[0] / gridSize);
			point[1] = gridSize * Math.floor(point[1] / gridSize);
		}
		
		if ( this.selectedNode ){ this.selectedNode[0] = point[0]; this.selectedNode[1] = point[1]; }
	})
	.mouseup ( function(event) {
		this.selectedNode = 0;
	});
	
	$("#shape_moveUp").button ( { text:false, icons: { primary: "ui-icon-triangle-1-n" } } )
	.click ( function() { for (var i = 0; i < part.vertices.length; i++) part.vertices[i][1] -= 10; } );
	
	$("#shape_moveDown").button ( { text:false, icons: { primary: "ui-icon-triangle-1-s" } } )
	.click ( function() { for (var i = 0; i < part.vertices.length; i++) part.vertices[i][1] += 10; } );
	
	$("#shape_moveRight").button ( { text:false, icons: { primary: "ui-icon-triangle-1-e" } } )
	.click ( function() { for (var i = 0; i < part.vertices.length; i++) part.vertices[i][0] += 10; } );
	
	$("#shape_moveLeft").button ( { text:false, icons: { primary: "ui-icon-triangle-1-w" } } )
	.click ( function() { for (var i = 0; i < part.vertices.length; i++) part.vertices[i][0] -= 10; } );
	
	$("#shapeMove").buttonset();
	
	var tArea = document.getElementById("primitivesInput");
	tArea.onkeydown = reloadPrims;
	tArea.onkeyup = reloadPrims;
	tArea.onchange = reloadPrims;
	
	$(".stat").keydown ( reloadStats )
			.keyup ( reloadStats )
			.change ( reloadStats );
	
	
	$("#save").click ( function () { 
		var id = document.getElementById("partId");
		part.id = id.value;
		
		var pom = document.createElement('a');
		pom.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(part)));
		pom.setAttribute('download', part.id);
		pom.click();
    });
}

//Function to reload primitives from text area
function reloadPrims () {
	var tArea = document.getElementById("primitivesInput");
	part.draw = JSON.parse ( "[" + tArea.value + "]" );
}

//Function to reload stats
function reloadStats () {
	var i = document.getElementById("health");
	part.stats[stat_health] = parseInt(i.value);
	
	i = document.getElementById("armor");
	part.stats[stat_armor] = parseInt(i.value);
	
	i = document.getElementById("mass");
	part.stats[stat_mass] = parseInt(i.value);
	
	i = document.getElementById("engine");
	part.stats[stat_engine] = parseInt(i.value);
	
	i = document.getElementById("man");
	part.stats[stat_maneuvrability] = parseInt(i.value);
	
	i = document.getElementById("class");
	part.cls = parseInt(i.value);
}

//Function to draw part node handles
function drawHandles (context, part, offset, index){
	offset = vSum (offset, part.position);
	
	context.save();
	context.translate(offset[0], offset[1]);
	
	var vAve = [0,0];
	
	for (var i = 0; i < part.vertices.length; i++){
		if (i == index){
			context.beginPath();
			context.arc(part.vertices[i][0], part.vertices[i][1], 1.5 * handleSize, 0, 2 * Math.PI);
			context.fillStyle = "#FFCC00";
			context.fill();
		}
		
		context.beginPath();
		context.arc(part.vertices[i][0], part.vertices[i][1], handleSize, 0, 2 * Math.PI);
		context.fillStyle = "#FFFFFF";
		context.fill();
		
		context.strokeStyle = "#000000";
		context.stroke();
		
		vAve = vSum ( vAve, part.vertices[i] );
	}
	
	vAve = vMult ( vAve, 1 / part.vertices.length );
	
	context.beginPath();
	context.arc (vAve[0], vAve[1], 1, 0, 2 * Math.PI);
	context.fillStyle = "#FFFFFF";
	context.fill();
	
	context.restore();
}

//Canvas update function
function draw () {
	if (state == state_shape){
		shapeContext.fillStyle = "#000000";
		shapeContext.fillRect ( 0, 0, shapeCanvas.width, shapeCanvas.height );
		
		if ( shape_showGrid ) {
			shapeContext.strokeStyle = "#404040";
			
			for (var i = shapeCanvas.width / 2; i < shapeCanvas.width; i += gridSize ){
				shapeContext.beginPath();
				shapeContext.moveTo (i, 0); shapeContext.lineTo(i, shapeCanvas.height);
				shapeContext.stroke ();
			}
				
			for (var i = shapeCanvas.width / 2; i > 0; i -= gridSize ){
				shapeContext.beginPath();
				shapeContext.moveTo (i, 0); shapeContext.lineTo(i, shapeCanvas.height);
				shapeContext.stroke ();
			}
			
			for ( var i = shapeCanvas.height / 2; i < shapeCanvas.height; i += gridSize ){
				shapeContext.beginPath();
				shapeContext.moveTo (0, i); shapeContext.lineTo ( shapeCanvas.width, i);
				shapeContext.stroke();
			}
			
			for ( var i = shapeCanvas.height / 2; i > 0; i -= gridSize ){
				shapeContext.beginPath();
				shapeContext.moveTo (0, i); shapeContext.lineTo ( shapeCanvas.width, i);
				shapeContext.stroke();
			}
		}
		
		drawPart (shapeContext, part, [shapeCanvas.width / 2, shapeCanvas.height / 2], [false], [ "#C83737" ], false);
		
		if (shape_showHandles)
			drawHandles ( shapeContext, part, [shapeCanvas.width / 2, shapeCanvas.height / 2], shape_selectedNodeIndex );
	}
	
	if (state == state_draw){
		drawContext.fillStyle = "#000000";
		drawContext.fillRect ( 0, 0, drawCanvas.width, drawCanvas.height );
		
		if ( draw_showGrid ) {
			drawContext.strokeStyle = "#404040";
			
			for (var i = drawCanvas.width / 2; i < drawCanvas.width; i += gridSize ){
				drawContext.beginPath();
				drawContext.moveTo (i, 0); drawContext.lineTo(i, drawCanvas.height);
				drawContext.stroke ();
			}
				
			for (var i = drawCanvas.width / 2; i > 0; i -= gridSize ){
				drawContext.beginPath();
				drawContext.moveTo (i, 0); drawContext.lineTo(i, drawCanvas.height);
				drawContext.stroke ();
			}
			
			for ( var i = drawCanvas.height / 2; i < drawCanvas.height; i += gridSize ){
				drawContext.beginPath();
				drawContext.moveTo (0, i); drawContext.lineTo ( drawCanvas.width, i);
				drawContext.stroke();
			}
			
			for ( var i = drawCanvas.height / 2; i > 0; i -= gridSize ){
				drawContext.beginPath();
				drawContext.moveTo (0, i); drawContext.lineTo ( drawCanvas.width, i);
				drawContext.stroke();
			}
		}
		
		drawPart (drawContext, part, [drawCanvas.width / 2, drawCanvas.height / 2], [false], [ "#C83737" ], true);
	}
}
