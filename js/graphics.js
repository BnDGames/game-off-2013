//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//graphics.js
//Graphics
//-----------------------------------------------------------------

//Canvas and drawing context for the game
var canvas, context;
var minimapCanvas, minimapContext;
var statsCanvas, statsContext;

var sceneScale = fx_sceneScaleBase;

//Function to center the canvas on screen
function centerCanvas () {
	canvas.style.left = (window.innerWidth - canvas.width) / 2 + "px";
	canvas.style.top = (window.innerHeight - canvas.height) / 2 + "px";
	
	statsCanvas.style.left = (window.innerWidth - canvas.width) / 2 - minimapCanvas.width - 16 + "px";
	statsCanvas.style.top = (window.innerHeight + canvas.height) / 2 - statsCanvas.height - 16 + "px";
	
	minimapCanvas.style.left = (window.innerWidth - canvas.width) / 2 - minimapCanvas.width - 16 + "px";
	minimapCanvas.style.top = (window.innerHeight + canvas.height) / 2 - statsCanvas.height - minimapCanvas.height - 32 + "px";
}

//Function to set fill style according to settings array
function setFill ( context, settings, colorset ) {
	if (settings[0] == "plain"){
		if (settings[1].charAt(0) == "$") context.fillStyle = colorset[ settings[1].substring(1) ];
		else context.fillStyle = settings[1];
	}
		
	if (settings[0] == "gradient"){
		if (fx_level < 1) return false;
		
		var gradient = context.createLinearGradient ( 0, 0, settings[1], settings[2] );
		
		if (colorset && settings[3].charAt(0) == "$") gradient.addColorStop ( 0, colorset[ settings[3].substring(1) ] );
		else gradient.addColorStop ( 0, settings[3] );
		
		if (colorset && settings[4].charAt(0) == "$") gradient.addColorStop ( 1, colorset[ settings[4].substring(1) ] );
		else gradient.addColorStop ( 1, settings[4] );
		
		context.fillStyle = gradient;
	}
	
	return true;
}

//Function to draw a primitive according to array
function drawPrimitive ( context, prim, colorset ) {
	if ( prim[0] == "circle" ){
		context.save();
		context.translate ( prim[1], prim[2] );
		
		context.beginPath();
		context.arc ( 0, 0, prim[3], 0, Math.PI * 2 );
		if (setFill ( context, prim[4], colorset ))
			context.fill();
		
		context.restore();
	}
	
	if ( prim[0] == "rect" ) {
		context.save();
		context.translate ( prim[1], prim[2] );
		
		if (setFill ( context, prim[5], colorset ))
			context.fillRect ( 0, 0, prim[3], prim[4] );
		
		context.restore();
	}
	
	if ( prim[0] == "poly" ) {
		context.beginPath ();
		
		context.moveTo ( prim[1][0], prim[1][1] );
		for ( var i = 2; i < prim.length - 1; i++ )
			context.lineTo ( prim[i][0], prim[i][1] );
		
		if (setFill ( context, prim[i], colorset ))		
			context.fill();
	}
}

//Graphics setup function
function graphicsSetup () {
	canvas = document.getElementById("gameCanvas");
	context = canvas.getContext("2d");
	
	minimapCanvas = document.getElementById("minimapCanvas");
	minimapContext = minimapCanvas.getContext("2d");
	
	statsCanvas = document.getElementById("statsCanvas");
	statsContext = statsCanvas.getContext("2d");
	
	$("#minimapCanvas").hide();
	$("#statsCanvas").hide();
	
	centerCanvas();

	setInterval ( blinkMmap, 1000 / fx_minimapBlinkRate );
}

//Function to draw a part on drawing context
//Offset is a vector 
function drawPart ( context, part, offset, modifiers, colorset, deco ) {
	if (part.vertices.length == 0) return;
	
	offset = vSum ( offset, part.position );

	context.save();

	//Transforms canvas
	context.translate ( offset[0], offset[1] );
	
	if (part.mirrorX) context.scale ( -1, 1 );
	if (part.mirrorY) context.scale ( 1, -1 );
	
	context.rotate ( part.angle );
	
	//Basic drawing
	context.beginPath();
	
	context.moveTo ( part.vertices[0][0], part.vertices[0][1] );
	
	for (var i = 0; i < part.vertices.length; i++)
		context.lineTo ( part.vertices[i][0], part.vertices[i][1] );

	context.closePath();
	
	context.fillStyle = part.fill;
	context.fill();

	//Draws primitives
	if ( part.draw != undefined && (deco == undefined || deco) )
		for ( var i = 0; i < part.draw.length; i++ )
			drawPrimitive(context, part.draw[i], colorset);
	
	//Draws possible status-related primitives
	if ( modifiers != undefined && part.modifiers != undefined ) 
		for ( var i = 0; i < part.modifiers.length; i++ ) 
			if ( modifiers[part.modifiers[i].which] )
				drawPrimitive ( context, part.modifiers[i].draw, colorset );
				
	if ( part.parent.printOpacity < 1 && fx_level > 0){
		context.beginPath();
	
		context.moveTo ( part.vertices[0][0], part.vertices[0][1] );
	
		for (var i = 0; i < part.vertices.length; i++)
			context.lineTo ( part.vertices[i][0], part.vertices[i][1] );
	
		context.closePath();
	
		context.fillStyle = canvas.style.backgroundColor;
		context.globalAlpha = 1 - part.parent.printOpacity;
		context.lineWidth = 2;
		context.strokeStyle = canvas.style.backgroundColor;
		context.stroke();
		context.lineWidth = 1;
		context.fill();
		context.globalAlpha = 1;
	}
	
	//Resets canvas status
	context.restore();
}

//Function to draw an unit
function drawUnit ( context, unit, offset ) {
	offset = vSum ( offset, unit.position );
	
	context.save();
	context.translate ( offset[0], offset[1] );
	context.rotate ( unit.angle );
	
	for (var i = 0; i < unit.putOff.length; i++)
		drawPart ( context, unit.putOff[i], [0, 0], [], unit.colors );
	
	for (var i = 0; i < unit.parts.length; i++)
		drawPart ( context, unit.parts[i], [0, 0], unit.gfxModifiers, unit.colors );
		
	context.restore();
}

//Function to draw a projectile
function drawProjectile ( context, projectile, offset ) {
	offset = vSum ( offset, projectile.position );
	
	context.save();
	context.translate ( offset[0], offset[1] );
	context.rotate ( vAngle ( projectile.speed ) );
	
	for ( var i = 0; i < projectile.draw.length; i++)
		drawPrimitive ( context, projectile.draw[i] );
		
	context.restore();
}

//Function to draw a scene
function drawScene ( context, scene, offset, grid, gridInfo ) {
	if (grid != undefined && grid && fx_grid){		
		var oX = (offset[0]) % (gridInfo.squareSize);
		var oY = (offset[1]) % (gridInfo.squareSize);
				
		context.save();
		context.scale ( sceneScale, sceneScale );
				
		for (var i = -gridInfo.squareSize * 2; i <= canvas.height + gridInfo.squareSize * 2; i += gridInfo.squareSize / gridInfo.divisions){
			if ((i / gridInfo.squareSize * gridInfo.divisions) % gridInfo.divisions == 0) context.strokeStyle = "#202020";
			else context.strokeStyle = "#101010";
			
			context.beginPath();
			context.moveTo ( 0, oY + i );
			context.lineTo ( canvas.width / sceneScale, oY + i );
			context.stroke();
		}
		
		for (var i = -gridInfo.squareSize * 2; i <= canvas.width + gridInfo.squareSize * 2; i += gridInfo.squareSize / gridInfo.divisions){
			if ((i / gridInfo.squareSize * gridInfo.divisions) % gridInfo.divisions == 0) context.strokeStyle = "#202020";
			else context.strokeStyle = "#101010";
			
			context.beginPath();
			context.moveTo ( oX + i, 0 );
			context.lineTo ( oX + i, canvas.height / sceneScale );
			context.stroke();
		}
		
		context.restore();
	}
	
	if ( fx_level > 0 ){
		var g = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 250, canvas.width / 2, canvas.height / 2, canvas.width * 0.75)
		g.addColorStop ( 0, 'rgba(0,0,0,0)' );
		g.addColorStop ( 1, 'rgba(0,0,0,1)' );
		context.fillStyle = g;
		context.fillRect ( 0,0,canvas.width, canvas.height);
	}
	
	context.save();
	context.scale ( sceneScale, sceneScale );
	context.translate ( offset[0], offset[1] );
	
	for ( var i = 0; i < scene.projectiles.length; i++)
		drawProjectile ( context, scene.projectiles[i], [0, 0] );
	
	for ( var i = 0; i < scene.units.length; i++)
		if (scene.units[i].loaded && scene.units[i].destroying)
			drawUnit ( context, scene.units[i], [0, 0] );
	
	for ( var i = 0; i < scene.units.length; i++)
		if (scene.units[i].loaded && !scene.units[i].destroying)
			drawUnit ( context, scene.units[i], [0, 0] );
	
	context.restore();
}

//Function to draw indicators for enemy units
function drawArrows ( scene, unit, viewport ) {
	for ( var i = 0; i < scene.units.length; i++ ){
		if ( scene.units[i] == unit || scene.units[i].destroying ) continue;
		
		var distance = vSubt ( scene.units[i].position, unit.position );
		
		var dX = vMult ( distance, (viewport[2] / 2) / Math.abs(distance[0]) );
		var dY = vMult ( distance, (viewport[3] / 2) / Math.abs(distance[1]) );
		
		var d = vModule(dX) < vModule(dY) ? dX : dY;
		
		if (Math.abs(distance[0]) < viewport[2] / 2 / sceneScale && Math.abs(distance[1]) < viewport[3] / 2 / sceneScale) continue;

		context.fillStyle = scene.units[i].colors[0];
			
		context.save();
		context.translate ( viewport[0] + viewport[2] / 2 + d[0], viewport[1] + viewport[3] / 2 + d[1] );
		context.rotate ( vAngle(d) );
	
		context.beginPath();
		context.moveTo ( 0, 0 );
		context.lineTo ( -20, 8 );
		context.lineTo ( -20, -8 );
		context.lineTo ( 0, 0 );
		context.fill();
		
		context.restore();
	}
}

var minimapBlink = 0;

//Function to blink minimap
function blinkMmap () {
	if (fx_minimapBlink)
		minimapBlink = !minimapBlink;
	else minimapBlink = 1;
}

//Function to draw minimap
function drawMinimap ( scene, unit, scale, grid, gridInfo ) {
	$("#minimapCanvas").fadeIn(400, "swing");
	
	minimapContext.fillStyle = minimapCanvas.style.backgroundColor;
	minimapContext.fillRect ( 0, 0, minimapCanvas.width, minimapCanvas.height );
	
	if (grid != undefined && grid){
		var oX = ((-unit.position[0] * scale)) % (gridInfo.squareSize);
		var oY = ((-unit.position[1] * scale)) % (gridInfo.squareSize);
				
		for (var i = -gridInfo.squareSize * 2; i <= minimapCanvas.height + gridInfo.squareSize * 2; i += gridInfo.squareSize / gridInfo.divisions){
			if ((i / gridInfo.squareSize * gridInfo.divisions) % gridInfo.divisions == 0) minimapContext.strokeStyle = "#202020";
			else minimapContext.strokeStyle = "#101010";
			
			minimapContext.beginPath();
			minimapContext.moveTo ( 0, oY + i );
			minimapContext.lineTo ( canvas.width, oY + i );
			minimapContext.stroke();
		}
		
		for (var i = -gridInfo.squareSize * 2; i <= minimapCanvas.width + gridInfo.squareSize * 2; i += gridInfo.squareSize / gridInfo.divisions){
			if ((i / gridInfo.squareSize * gridInfo.divisions) % gridInfo.divisions == 0) minimapContext.strokeStyle = "#202020";
			else minimapContext.strokeStyle = "#101010";
			
			minimapContext.beginPath();
			minimapContext.moveTo ( oX + i, 0 );
			minimapContext.lineTo ( oX + i, canvas.height );
			minimapContext.stroke();
		}
	}
	
	for (var i = 0; i < scene.units.length; i++){
		if (scene.units[i].destroying) continue;
		
		var centre = vSum ( vMult ( vSubt ( scene.units[i].position, unit.position ), scale ), [ minimapCanvas.width / 2, minimapCanvas.height / 2 ] );
		
		minimapContext.beginPath();
		minimapContext.arc ( centre[0], centre[1], fx_minimapRadius, 0, 2 * Math.PI );
		minimapContext.fillStyle = scene.units[i].colors[ minimapBlink ? 0 : 1 ];
		minimapContext.fill();
	}
	
	var p = minimapContext.createImageData(1,1);
	p.data[0] = 0x60; p.data[1] = 0x60; p.data[2] = 0x60; p.data[3] = 255;
	for (var i = 0; i < scene.projectiles.length; i++){
		var centre = vSum ( vMult ( vSubt ( scene.projectiles[i].position, unit.position ), scale ), [ minimapCanvas.width / 2, minimapCanvas.height / 2 ] );
		minimapContext.putImageData ( p, centre[0], centre[1] );
	}
}

//Function to draw stats
function drawStats ( unit ) {
	$("#statsCanvas").fadeIn(400, "swing");
	
	var text = [
		["HP", Math.ceil(unit.health / game_playerDamageFactor) + "/" + Math.ceil(unit.maxHealth / game_playerDamageFactor)],
		["REGEN", Math.ceil ( getStat (unit, stat_regen) * 1000 ) / 10],
		["",""],
		["ARMOR", Math.ceil(unit.armor * 10) / 10],
		["",""],
		["MASS", Math.ceil(unit.mass * 10) / 10],
		["",""],
		["ENGINE", getStat ( unit, stat_engine )],
		["SPEED", Math.round(unit.maxSpeed * 10) / 10],
		["ACCEL", Math.ceil( getStat (unit, stat_engine) / unit.mass * 100 )]
	];
	
	var h = 20;
	for ( var i = 0; i < text.length; i++ ){
		if (text[i][0] != "" || text[i][1] != "") h += 24;
		else h += 10;
	}
	statsCanvas.height = h;
	centerCanvas();

	statsContext.fillStyle = statsCanvas.style.backgroundColor;
	statsContext.fillRect ( 0, 0, statsCanvas.width, statsCanvas.height );
	
	statsContext.font = "20px League Gothic";
	statsContext.textBaseline = "top";
	statsContext.fillStyle = "#FFFFFF";
	
	var y = 10;
	for ( var i = 0; i < text.length; i++ ){
		statsContext.textAlign = "left";
		statsContext.fillText ( text[i][0], 10, y );
		
		statsContext.textAlign = "right";
		statsContext.fillText ( text[i][1], statsCanvas.width - 10, y );
		
		if (text[i][0] != "" || text[i][1] != "") y += 24;
		else y += 10;
	}
}

//Function to draw the current game state
function draw () {
	context.fillStyle = canvas.style.backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	if (state_current == state_game){
		drawScene ( context, gameScene, [-inputBoundUnit.position[0] + canvas.width / 2 / sceneScale, -inputBoundUnit.position[1] + canvas.height / 2 / sceneScale], true, { divisions: 20, squareSize: 640 } );
		drawArrows ( gameScene, inputBoundUnit, [10, 40, canvas.width - 20 ,canvas.height - 80] );
		drawMinimap ( gameScene, inputBoundUnit, 0.025, true, { divisions: 1, squareSize: 16 } );
	}
	
	else $("#minimapCanvas").fadeOut(400, "swing");
	
	if (currentUI){
		printControl ( context, currentUI, [0,0] );
		printAfterControl ( context, currentUI, [0,0] );
	}
	
	if (state_current != state_shipedit && state_current != state_game)
		$("#statsCanvas").fadeOut(400, "swing");
	else drawStats ( playerShip );
	
	context.beginPath();
	context.rect ( 0, 0, canvas.width, canvas.height );
	context.lineWidth = 8;
	context.strokeStyle = "#FFFFFF";
	context.stroke();
	context.lineWidth = 1;
}
