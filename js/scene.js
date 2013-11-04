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

//Function to move the scene
function moveScene ( scene, time ) {
	for ( var i = 0; i < scene.units.length; i++)
		if (scene.units[i].loaded)
			moveUnit ( scene.units[i], 1 );
}
