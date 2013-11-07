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
function setFill ( settings, colorset ) {
	if (settings[0] == "plain"){
		if (settings[1].charAt(0) == "$") context.fillStyle = colorset[ settings[1].substring(1) ];
		else context.fillStyle = settings[1];
	}
		
	if (settings[0] == "gradient"){
		var gradient = context.createLinearGradient ( 0, 0, settings[1], settings[2] );
		
		if (colorset && settings[3].charAt(0) == "$") gradient.addColorStop ( 0, colorset[ settings[3].substring(1) ] );
		else gradient.addColorStop ( 0, settings[3] );
		
		if (colorset && settings[4].charAt(0) == "$") gradient.addColorStop ( 1, colorset[ settings[4].substring(1) ] );
		else gradient.addColorStop ( 1, settings[4] );
		
		context.fillStyle = gradient;
	}
		
}

//Function to draw a primitive according to array
function drawPrimitive ( prim, colorset ) {
	if ( prim[0] == "circle" ){
		context.translate ( prim[1], prim[2] );
		
		context.beginPath();
		context.arc ( 0, 0, prim[3], 0, Math.PI * 2 );
		setFill ( prim[4], colorset );
		context.fill();
		
		context.translate ( -prim[1], -prim[2] );
	}
	
	if ( prim[0] == "rect" ) {
		context.translate ( prim[1], prim[2] );
		
		setFill ( prim[5], colorset );
		context.fillRect ( 0, 0, prim[3], prim[4] );
		
		context.translate ( -prim[1], -prim[2] );
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
function drawPart ( context, part, offset, modifiers, colorset ) {
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
			drawPrimitive(part.draw[i], colorset);
	
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
				drawPrimitive ( part.modifiers[i].draw, colorset );
	
	//Resets canvas status
	if (part.mirrorY) context.scale ( 1, -1 );
	if (part.mirrorX) context.scale ( -1, 1 );
	
	context.rotate ( -part.angle );
	context.translate ( -offset[0], -offset[1] );
}

//Function to draw an unit
function drawUnit ( context, unit, offset ) {
	context.globalAlpha = unit.printOpacity;
	offset = vSum ( offset, unit.position );
	
	context.translate ( offset[0], offset[1] );
	context.rotate ( unit.angle );
	
	for (var i = 0; i < unit.parts.length; i++)
		drawPart ( context, unit.parts[i], [0, 0], unit.gfxModifiers, unit.colors );
		
	context.rotate ( -unit.angle );
	context.translate ( -offset[0], -offset[1] );
	context.globalAlpha = 1;
}

//Function to draw a projectile
function drawProjectile ( context, projectile, offset ) {
	offset = vSum ( offset, projectile.position );
	
	context.translate ( offset[0], offset[1] );
	context.rotate ( vAngle ( projectile.speed ) );
	
	for ( var i = 0; i < projectile.draw.length; i++)
		drawPrimitive ( projectile.draw[i] );
		
	context.rotate ( -vAngle ( projectile.speed ) );
	context.translate ( -offset[0], -offset[1] );
}

//Function to draw a scene
function drawScene ( context, scene, offset, grid, gridInfo ) {
	if (grid != undefined && grid){
		
		for (var i = 0; i <= gridInfo.squareSize * gridInfo.gridSize; i += gridInfo.squareSize / gridInfo.divisions){
			if ((i / gridInfo.squareSize * gridInfo.divisions) % gridInfo.divisions == 0) context.strokeStyle = "#202020";
			else context.strokeStyle = "#101010";
			
			context.beginPath();
			context.moveTo ( 0, i );
			context.lineTo ( gridInfo.squareSize * gridInfo.gridSize, i );
			context.stroke();
			
			context.beginPath();
			context.moveTo ( i, 0 );
			context.lineTo ( i, gridInfo.squareSize * gridInfo.gridSize );
			context.stroke();
		}
	}
	
	context.translate ( offset[0], offset[1] );
	
	for ( var i = 0; i < scene.projectiles.length; i++)
		drawProjectile ( context, scene.projectiles[i], [0, 0] );
	
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
	
	context.translate ( -inputBoundUnit.position[0] + canvas.width / 2, -inputBoundUnit.position[1] + canvas.height / 2 );
	drawScene ( context, s, [0,0], true, { gridSize: 30, divisions: 4, squareSize: 64 } );
	context.translate ( inputBoundUnit.position[0] - canvas.width / 2, inputBoundUnit.position[1] - canvas.height / 2 );
	
	if (currentUI) printControl ( context, currentUI, [0,0] );
}
