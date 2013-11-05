//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//scene.js
//Game scene definition
//-----------------------------------------------------------------

//Scene object
var Scene = function () {
	//Scene units
	this.units = new Array();
	
	//Scene projectiles
	this.projectiles = new Array();
	
	//Scene damping factor
	this.dRot = 0.2;
	this.dTr = 0.15;
}

//Function to add an unit to a scene
//Returns the added unit
function addUnitToScene ( unit, scene ) {
	unit.parent = scene;
	scene.units.push ( unit );
	
	return unit;
}

//Function to add a projectile to scene
//Returns the added projectile
function addProjToScene ( proj, scene ) {
	proj.parent = scene;
	scene.projectiles.push ( proj );
	
	return proj;
}

//Function to move the scene
function moveScene ( scene, time ) {
	for ( var i = 0; i < scene.units.length; i++ )
		if (scene.units[i].loaded)
			moveUnit ( scene.units[i], time );
			
	for ( var i = 0; i < scene.projectiles.length; i++ )
		moveProjectile ( scene.projectiles[i], time );
}
