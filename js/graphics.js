//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//graphics.js
//Graphics
//-----------------------------------------------------------------

//Canvas and drawing context for the game
var canvas, context;

//Function to center the canvas on screen
function centerCanvas () {
	canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
	canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
}

//Function to set fill style according to settings array
function setFill ( settings ) {
	if (settings[0] == "plain")
		context.fillStyle = settings[1];
		
	if (settings[0] == "gradient"){
		var gradient = context.createLinearGradient ( 0, 0, settings[1], settings[2] );
		gradient.addColorStop ( 0, settings[3] );
		gradient.addColorStop ( 1, settings[4] );
		context.fillStyle = gradient;
	}
		
}

//Function to draw a primitive according to array
function drawPrimitive ( prim ) {
	if ( prim[0] == "circle" ){
		context.beginPath();
		context.arc ( prim[1], prim[2], prim[3], 0, Math.PI * 2 );
		setFill ( prim[4] );
		context.fill();
	}
	
	if ( prim[0] == "rect" ) {
		setFill ( prim[5] );
		context.fillRect ( prim[1], prim[2], prim[3], prim[4] );
	}
}

//Graphics setup function
function graphicsSetup () {
	canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	
	context.lineCap = "round";
	context.lineJoin = "round";
	
	centerCanvas();
}

//Function to draw a part on drawing context
//Offset is a vector 
function drawPart ( context, part, offset, modifiers ) {
	if (part.vertices.length == 0) return;
	
	offset = vSum ( offset, part.position );

	//Transforms canvas
	context.translate ( offset[0], offset[1] );
	context.rotate ( part.angle );
	
	if (part.mirrorX) context.scale ( -1, 1 );
	if (part.mirrorY) context.scale ( 1, -1 );
	
	//Basic drawing
	context.beginPath();
	
	context.moveTo ( part.vertices[0][0], part.vertices[0][1] );
	
	for (var i = 0; i < part.vertices.length; i++)
		context.lineTo ( part.vertices[i][0], part.vertices[i][1] );
	
	context.closePath();
	
	context.fillStyle = part.fill;
	context.fill();
	
	//Draws primitives
	if ( part.draw != undefined )
		for ( var i = 0; i < part.draw.length; i++ )
			drawPrimitive(part.draw[i]);
	
	//Draws border
	if (part.borderWidth > 0){
		context.strokeStyle = part.border;
		context.lineWidth = part.borderWidth;
		context.stroke();
	}
	
	//Draws possible status-related primitives
	if ( modifiers != undefined && part.modifiers != undefined ) 
		for ( var i = 0; i < part.modifiers.length; i++ ) 
			if ( modifiers[part.modifiers[i].which] )
				drawPrimitive ( part.modifiers[i].draw );
	
	//Resets canvas status
	if (part.mirrorY) context.scale ( 1, -1 );
	if (part.mirrorX) context.scale ( -1, 1 );
	
	context.rotate ( -part.angle );
	context.translate ( -offset[0], -offset[1] );
}

//Function to draw an unit
function drawUnit ( context, unit, offset ) {
	offset = vSum ( offset, unit.position );
	
	context.translate ( offset[0], offset[1] );
	context.rotate ( unit.angle );
	
	for (var i = 0; i < unit.parts.length; i++)
		drawPart ( context, unit.parts[i], [0, 0], unit.gfxModifiers );
		
	context.rotate ( -unit.angle );
	context.translate ( -offset[0], -offset[1] );
}

//Function to draw a scene
function drawScene ( context, scene, offset, grid, gridSize ) {
	if (grid != undefined && grid){
		context.strokeStyle = "#101010";
		for (var i = 0; i < 4 * canvas.width / gridSize + 1; i++){
			context.beginPath ();
			context.moveTo ( gridSize / 4 * i, 0 );
			context.lineTo ( gridSize / 4 * i, canvas.height );
			context.stroke ();
		}
		
		for (var i = 0; i < 4 * canvas.height / gridSize + 1; i++){
			context.beginPath ();
			context.moveTo ( 0, gridSize * i / 4 );
			context.lineTo ( canvas.width, gridSize * i / 4 );
			context.stroke ();
		}
		
		context.strokeStyle = "#202020";	
		for (var i = 0; i < canvas.width / gridSize + 1; i++){
			context.beginPath ();
			context.moveTo ( gridSize * i, 0 );
			context.lineTo ( gridSize * i, canvas.height );
			context.stroke ();
		}
		
		for (var i = 0; i < canvas.height / gridSize + 1; i++){
			context.beginPath ();
			context.moveTo ( 0, gridSize * i);
			context.lineTo ( canvas.width, gridSize * i);
			context.stroke ();
		}
	}
	
	context.translate ( offset[0], offset[1] );
	
	for ( var i = 0; i < scene.units.length; i++)
		if (scene.units[i].loaded)
			drawUnit ( context, scene.units[i], [0, 0] );
		
	context.translate ( -offset[0], -offset[1] );
}

//Function to draw the current game state
function draw () {
	context.globalAlpha = 1;
	context.fillStyle = canvas.style.backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.globalAlpha = 1;
	
	/*context.translate ( -u.position[0] + canvas.width / 2, -u.position[1] + canvas.height / 2 );
	context.rotate ( -u.angle );*/
	
	drawScene ( context, s, [400,300], true, 64 );
	
	/*context.rotate ( u.angle );
	context.translate ( u.position[0] - canvas.width / 2, u.position[1] - canvas.height / 2 );*/
}
