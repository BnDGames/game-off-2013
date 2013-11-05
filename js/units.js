//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//units.js
//Game units definitions
//-----------------------------------------------------------------

//Unit stat indexes
const stat_health = 0;
const stat_armor = 1;
const stat_mass = 2;
const stat_engine = 3;
const stat_maneuvrability = 4;

const stats_total = 5;

//Unit graphical modifiers
const gfxMod_engineOn = 0;

const gfxMod_total = 1;

//Unit object
var Unit = function () {
	//Parent scene
	this.parent = 0;
	
	//Parts composing the unit
	this.parts = new Array();
	
	//Unit positional data
	this.position = [ 0, 0 ];
	this.speed = [ 0, 0 ];
	this.acceleration = [ 0, 0 ];
	this.force = [ 0, 0 ];
	
	//Unit rotational data
	this.angle = 0;
	this.omega = 0;
	this.alpha = 0;
	this.momentum = 0;
	
	//Graphical modifiers
	this.gfxModifiers = new Array();
	for (var i = 0; i < gfxMod_total; i++) this.gfxModifiers[i] = false;
	
	//Shooting action
	this.shoot = function () {
		for ( var i = 0; i < this.parts.length; i++ ) {
			if ( this.parts[i].actions ) { }
		}
	}
}

//Function to load a unit from JSON file
function loadUnit ( sourcefile ) {
	var unit = new Unit();
	
	$.getJSON ( sourcefile, 
				function ( data ) {
					while ( partsLoaded < partsCount ) { };
					
					for ( var i = 0; i < data.parts.length; i++){
						var p = getPart ( data.parts[i].source );
						
						p.position = vSum ( p.position, data.parts[i].translate );
						p.angle += data.parts[i].angle * Math.PI;
						
						p.mirrorX = data.parts[i].mirrorX;
						p.mirrorY = data.parts[i].mirrorY;
						
						unit.parts.push ( p );
					}
					
					unit.loaded = true;
				}
	);
	
	return unit;
}

//Function to move a unit for given time
function moveUnit ( unit, time ) {
	var mass = getStat ( unit, stat_mass );
	
	//If unit has parent, applies damping
	if (unit.parent){
		unit.force = vSubt ( unit.force, vMult ( unit.speed, unit.parent.dTr ) );
		unit.momentum -= unit.omega * unit.parent.dRot;
	}
	
	unit.position = vSum ( unit.position, vSum ( vMult ( unit.speed, time), vMult ( unit.acceleration, 0.5 * time * time ) ) );
	unit.speed = vSum ( unit.speed, vMult ( unit.acceleration, time ) );
	unit.acceleration = vMult ( unit.force, 1 / mass );
	
	unit.angle += unit.omega * time + unit.alpha * 0.5 * time * time;
	unit.omega += unit.alpha * time;
	unit.alpha = unit.momentum / mass;
}

//Function to get the value of a stat of an unit
function getStat ( unit, stat ) {
	var result = 0;
	
	for ( var i = 0; i < unit.parts.length; i++ )
		result += unit.parts[i].stats[stat];
	
	return result;
}
