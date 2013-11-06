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
	
	//Unit physics
	//Unit physics depend on unit parts
	//Thus, they should be recalculated any time parts are changed
	this.inertia = 1;
	this.mass = 1;
	
	//Graphical modifiers
	this.gfxModifiers = new Array();
	for (var i = 0; i < gfxMod_total; i++) this.gfxModifiers[i] = false;
	
	//Function to apply an impulse to the unit
	this.applyImpulse = function ( point, impulse ) {
		this.speed = vSum ( this.speed, vMult ( impulse, 1 / this.mass ) );
		this.omega += vCross ( vSubt ( this.position, point ), impulse ) / this.inertia;
	}
	
	//Function to apply a force to the unit
	this.applyForce = function ( point, force ) {
		this.force = vSum ( this.force, force );
		this.momentum += vCross ( vSubt ( this.position, point ), force );
	}
	
	//Function to apply a momentum to the unit
	//Gives rotation but no translation
	this.applyMomentum = function ( momentum ) {
		this.momentum += momentum;
	}
	
	//Shooting action
	this.shoot = function () {
		if (!this.parent) return;
		
		for ( var i = 0; i < this.parts.length; i++ ) {
			for ( var l = 0; l < this.parts[i].actions.length; l++ ) {
				var action = this.parts[i].actions[l];
				
				if (action.ready == false) continue;
				
				if (action.type == "shoot"){
					for ( var m = 0; m < action.projectiles.length; m++){
						var projectile = new Projectile();
					
						projectile.position = vSum ( this.position, vRotate ( vSum ( this.parts[i].position, action.projectiles[m].position ), this.angle ) );
						
						projectile.speed = vSum ( this.speed, vRotate ( action.projectiles[m].speed, this.angle ) );
						projectile.range = action.projectiles[m].range;
						projectile.mass = action.projectiles[m].mass;
						
						projectile.draw = action.projectiles[m].draw;
						
						addProjToScene ( projectile, this.parent );
						
						if (game_enableRecoil)
							this.applyImpulse ( this.position, vMult ( projectile.speed, -projectile.mass ) );
					}
					
					action.ready = false;
					setTimeout ( function () { action.ready = true; }, action.reload );
				}
			}
		}
	}
	
	//Function to calc physics
	this.calcPhysics = function () {
		this.mass = getStat ( this, stat_mass );
		
		//Calculates inertia summing the inertia values of all parts
		this.inertia = 0;
		for ( var i = 0; i < this.parts.length; i++ ) {
			var v = new Array();
			
			for ( var n = 0; n < this.parts[i].vertices.length; n++ ) {
				v.push ( vCopy ( this.parts[i].vertices[n] ) );
				
				if ( this.parts[i].mirrorX ) v[n][0] *= -1;
				if ( this.parts[i].mirrorY ) v[n][1] *= -1;
				
				v[n] = vRotate ( v[n], this.parts[i].angle );
				v[n] = vSum ( v[n], this.parts[i].position );
			}
			
			this.inertia += polyInertia ( v, this.parts[i].stats[stat_mass] );
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
					
					unit.calcPhysics();
					unit.loaded = true;
				}
	);
	
	return unit;
}

//Function to move a unit for given time
function moveUnit ( unit, time ) {	
	//If unit has parent, applies damping
	if (unit.parent){
		unit.force = vSubt ( unit.force, vMult ( unit.speed, unit.parent.dTr ) );
		unit.momentum -= unit.omega * unit.parent.dRot;
	}
	
	unit.position = vSum ( unit.position, vSum ( vMult ( unit.speed, time), vMult ( unit.acceleration, 0.5 * time * time ) ) );
	unit.speed = vSum ( unit.speed, vMult ( unit.acceleration, time ) );
	unit.acceleration = vMult ( unit.force, 1 / unit.mass );
	
	unit.angle += unit.omega * time + unit.alpha * 0.5 * time * time;
	unit.omega += unit.alpha * time;
	unit.alpha = unit.momentum / unit.inertia;
	
	unit.force = [0,0];
	unit.momentum = 0;
}

//Function to get the value of a stat of an unit
function getStat ( unit, stat ) {
	var result = 0;
	
	for ( var i = 0; i < unit.parts.length; i++ )
		result += unit.parts[i].stats[stat];
	
	return result;
}

//Function to check collision between units
function unitsCollide ( a, b ) {
	for (var i = 0; i < a.parts.length; i++ ) {
		for (var l = 0; l < b.parts.length; l++ ) {
			var v1 = new Array(), v2 = new Array();
			
			for (var n = 0; n < a.parts[i].vertices.length; n++){
				v1.push ( vCopy ( a.parts[i].vertices[n] ) );
				
				if ( a.parts[i].mirrorX ) v1[n][0] *= -1;
				if ( a.parts[i].mirrorY ) v1[n][1] *= -1;
				
				v1[n] = vRotate ( v1[n], a.parts[i].angle );
				v1[n] = vSum ( v1[n], a.parts[i].position );
				v1[n] = vRotate ( v1[n], a.angle );
				v1[n] = vSum ( v1[n], a.position );
			}
				
			for (var n = 0; n < b.parts[l].vertices.length; n++){
				v2.push ( vCopy ( b.parts[l].vertices[n] ) );
				
				if ( b.parts[l].mirrorX ) v2[n][0] *= -1;
				if ( b.parts[l].mirrorY ) v2[n][1] *= -1;
				
				v2[n] = vRotate ( v2[n], b.parts[l].angle );
				v2[n] = vSum ( v2[n], b.parts[l].position );
				v2[n] = vRotate ( v2[n], b.angle );
				v2[n] = vSum ( v2[n], b.position );
			}
			
			var collision = polyCollide ( v1, v2 );
			if ( collision ) return collision;
		}
	}
	
	return false;
}

//Function to handle collision between two units
function handleUnitCollision ( a, b, collision ) {
	//Collision normal
	//For collision handling the two units are approximated
	//to circles for simplicity (physical realism is not our
	//aim)
	var normal = vSetModule ( vSubt ( a.position, b.position ), 1 );
	
	//Collision point (average between colliding points in array collision)
	var cPoint = [0,0];
	for (var i = 0; i < collision.length; i++) cPoint = vSum ( cPoint, collision[i] );
	cPoint = vMult ( cPoint, 1 / collision.length );
	
	//Linear speeds at cPoint on a and b units, relative to normal
	var cSpeedA = vDot ( vSum ( a.speed, vMult ( vPerp ( vSubt ( cPoint, a.position ) ), a.omega ) ), normal);
	var cSpeedB = vDot ( vSum ( b.speed, vMult ( vPerp ( vSubt ( cPoint, b.position ) ), b.omega ) ), normal);
	
	//Relative speed at cPoint
	var cSpeed = cSpeedA - cSpeedB;
	
	//Perpendicular radiuses
	var rA = vDot ( vPerp ( vSubt ( cPoint , a.position ) ), normal );
	var rB = vDot ( vPerp ( vSubt ( cPoint , b.position ) ), normal );
	
	//If units are bumping
	if ( cSpeed < 0 ){
		//Calculates impulse
		var j = -0.05 * cSpeed / (vDot ( normal, vMult ( normal, 1 / a.mass + 1 / b.mass ) ) + Math.pow ( rA, 2 ) / a.inertia + Math.pow( rB, 2 ) / b.inertia );
		
		//Impulse vector
		var impulse = vSetModule ( normal, j * 100 );
		
		//Applies impulse
		a.applyImpulse ( cPoint, impulse );
		b.applyImpulse ( cPoint, vMult ( impulse, -1 ) );
	}
}
