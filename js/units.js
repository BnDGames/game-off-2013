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
	this.parts_static = new Array();
	this.parts_current = 0;
	
	this.parts_heavy = new Array();
	this.parts_mid = new Array();
	this.parts_light = new Array();
	
	this.parts = new Array();
	this.putOff = new Array();
	
	this.status = "light";
	
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
	
	//Unit statistics
	//Unit stats depend on unit parts
	//Thus, they should be recalculated any time parts are changed
	this.inertia = 1;
	this.mass = 1;
	
	this.health = 1;
	this.maxHealth = 1;
	this.armor = 1;
	this.maxArmor = 1;
	
	this.maxSpeed = 1;

	this.dead = false;
	
	//Player specific information
	this.score = 0;
	
	//Misc
	this.scoreValue = 0;//Score given when destroying
	
	//Unit graphics
	this.colors = new Array();
	this.printOpacity = 1;
	
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
				
				if (Date.now() - action.time < action.reload) continue;
				
				if (action.type == "shoot"){
					for ( var m = 0; m < action.projectiles.length; m++){
						var projectile = new Projectile();
					
						projectile.owner = this;
						
						projectile.position = vSum ( this.position, vRotate ( vSum ( this.parts[i].position, action.projectiles[m].position ), this.angle + this.parts[i].angle ) );
						
						var pS = vRotate ( action.projectiles[m].speed, this.angle + this.parts[i].angle );
						var speedComponent = vDot ( this.speed, vSetModule (pS, 1 ) );
						
						projectile.speed = vSum ( speedComponent > 0 ? vSetModule ( this.speed, speedComponent ) : [0,0], pS );
						projectile.range = action.projectiles[m].range;
						projectile.mass = action.projectiles[m].mass;
						
						projectile.draw = action.projectiles[m].draw;
						
						addProjToScene ( projectile, this.parent );
						
						if (game_enableRecoil)
							this.applyImpulse ( this.position, vMult ( projectile.speed, -projectile.mass ) );
					}
					
					action.time = Date.now();
				}
			}
		}
	}
	
	//Function to calc physics
	this.calcStats = function () {
		this.parts.splice (0, this.parts.length);
		
		for ( var i = 0; i < this.parts_current.length; i++ ) this.parts.push ( this.parts_current[i] );
		for ( var i = 0; i < this.parts_static.length; i++ ) this.parts.push ( this.parts_static[i] );
		
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
		
		//Calculates health and max health
		var n = this.maxHealth;
		
		this.maxHealth = getStat ( this, stat_health );
		this.health = this.maxHealth * this.health / n;
		
		//Calculates armor
		this.armor = 1 + getStat ( this, stat_armor );
		
		//Finds the furthest vertex
		this.r = 0;
		for ( var i = 0; i < this.parts.length; i++ ) {
			for ( var l = 0; l < this.parts[i].vertices.length; l++ ) {
				var v = vSum ( this.parts[i].position, this.parts[i].vertices[l] );
				var d = vModule ( v );
				
				if ( d > this.r ) this.r = d;
			}
		}
		
		//Calculates max speed
		if ( this.parent )
			this.maxSpeed = getStat ( this, stat_engine ) / this.parent.dTr;
	}
	
	//Function to damage the unit
	this.damage = function ( damage ) {
		this.health -= damage / this.armor;
		if (this.health <= 0) this.destroy();
	}
	
	//Function to destroy the unit
	this.destroy = function () {
		this.health = 0;
		
		for ( var i = 0; i < this.parts.length; i++ ) {
			this.parts[i].omega = 0;
			this.parts[i].speed = vSetModule ( this.parts[i].position, fx_destructionSpeed );
		}
	}
	
	//Function to put off parts
	this.putOffParts = function ( which ) {		
		//this.putOff.splice ( 0, this.putOff.length );
	
		if ( which == "heavy" ) this.putOff = this.parts_heavy;
		if ( which == "mid" ) this.putOff = this.parts_mid;
		if ( which == "light" ) this.putOff = this.parts_light;
		
		for ( var i = 0; i < this.putOff.length; i++ ) {
			if (this.putOff[i].target[0] == 0 && this.putOff[i].target[1] == 0) this.putOff[i].oldPos = this.putOff[i].position.slice(0);
			else this.putOff[i].oldPos = this.putOff[i].target.slice(0);
			
			this.putOff[i].target = [0,0];
			this.putOff[i].moveToTarget = true;
		}
	}
	
	//Function to put out parts
	this.putOutParts = function ( which ) {
		var p;
		
		if ( which == "heavy" ) p = this.parts_heavy;
		if ( which == "mid" ) p = this.parts_mid;
		if ( which == "light" ) p = this.parts_light;
		
		for ( var i = 0; i < p.length; i++ ){
			if ( p[i].oldPos == undefined ) p[i].oldPos = p[i].position.slice(0);
			
			p[i].target = p[i].oldPos.slice(0);
			if ( p[i].position[0] == p[i].oldPos[0] && p[i].position[1] == p[i].oldPos[1]) p[i].position = [0,0];
			p[i].moveToTarget = true;
		}
	}
	
	//Function to change parts
	this.changeParts = function ( to ) {
		if (to != this.status) this.putOffParts ( this.status );
		
		if ( to == "heavy" ) this.parts_current = this.parts_heavy;
		else if (to == "mid" ) this.parts_current = this.parts_mid;
		else if ( to == "light" ) this.parts_current = this.parts_light;
		
		if (to != this.status) this.putOutParts ( to );
		
		this.status = to;
		this.calcStats();
	}
}

var units = new Array();
var unitsLoaded = 0;
var unitsCount = 0;

//Function to load a unit from json data
function loadUnitFromJSON ( data, unit ) {	
	while ( partsLoaded < partsCount ) { };
					
	for ( var i = 0; i < data.parts_static.length; i++){
		var p = getPart ( data.parts_static[i].source );
		
		p.parent = unit;
		
		p.position = vSum ( p.position, data.parts_static[i].translate );
		p.angle += data.parts_static[i].angle * Math.PI;
		
		p.mirrorX = data.parts_static[i].mirrorX;
		p.mirrorY = data.parts_static[i].mirrorY;
		
		unit.parts_static.push ( p );
	}
	
	if ( data.parts_light ) for ( var i = 0; i < data.parts_light.length; i++){
		var p = getPart ( data.parts_light[i].source );
		
		p.parent = unit;
		
		p.position = vSum ( p.position, data.parts_light[i].translate );
		p.angle += data.parts_light[i].angle * Math.PI;
		
		p.mirrorX = data.parts_light[i].mirrorX;
		p.mirrorY = data.parts_light[i].mirrorY;
		
		unit.parts_light.push ( p );
	}
	
	if ( data.parts_mid ) for ( var i = 0; i < data.parts_mid.length; i++){
		var p = getPart ( data.parts_mid[i].source );
		
		p.parent = unit;
		
		p.position = vSum ( p.position, data.parts_mid[i].translate );
		p.angle += data.parts_mid[i].angle * Math.PI;
		
		p.mirrorX = data.parts_mid[i].mirrorX;
		p.mirrorY = data.parts_mid[i].mirrorY;
		
		unit.parts_mid.push ( p );
	}
	
	if ( data.parts_heavy ) for ( var i = 0; i < data.parts_heavy.length; i++){
		var p = getPart ( data.parts_heavy[i].source );
		
		p.parent = unit;
		
		p.position = vSum ( p.position, data.parts_heavy[i].translate );
		p.angle += data.parts_heavy[i].angle * Math.PI;
		
		p.mirrorX = data.parts_heavy[i].mirrorX;
		p.mirrorY = data.parts_heavy[i].mirrorY;
		
		unit.parts_heavy.push ( p );
	}
	
	unit.scoreValue = data.scoreValue;
	
	unit.parts_current = unit.parts_light;
	
	unit.calcStats();
	unit.loaded = true;
}

//Function to load a unit from JSON file
function loadUnit ( sourcefile ) {
	var unit = new Unit();
	
	$.getJSON ( sourcefile, function (data) { loadUnitFromJSON(data, unit); } );
	
	return unit;
}

//Function to load all units listed in data/units/list.json
function loadUnits () {
	$.getJSON ( "data/units/list.json", function (data) {
		unitsCount = data.length;
		
		for (var i = 0; i < data.length; i++){
			$.getJSON ( data[i], function (data) { units.push(data); unitsLoaded++; } );
		}
	});
}

//Function to get a loaded unit by id
function getUnit ( id ) {
	for ( var i = 0; i < units.length; i++ )
		if ( units[i].id == id ){
			var u = new Unit();
			loadUnitFromJSON ( units[i], u );
			return u;
		}
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
	
	//Moves individual parts
	for ( var i = 0; i < unit.parts.length; i++ )
		movePart ( unit.parts[i], time );
		
	for ( var i = 0; i < unit.putOff.length; i++ )
		movePart ( unit.putOff[i], time );
		
	if ( unit.health <= 0 ) unit.printOpacity -= 0.01;
	if ( unit.printOpacity <= 0){ unit.dead = true; unit.printOpacity = 0; }
}

//Function to get the value of a stat of an unit
function getStat ( unit, stat ) {
	var result = 0;
	
	for ( var i = 0; i < unit.parts.length; i++ )
		result += unit.parts[i].stats[stat];
	
	return result;
}

//Function to check if a point is inside an unit
function pointInUnit ( point, a ) {
	for (var i = 0; i < a.parts.length; i++ ){
		var v1 = new Array();
			
		for (var n = 0; n < a.parts[i].vertices.length; n++){
			v1.push ( vCopy ( a.parts[i].vertices[n] ) );
			
			if ( a.parts[i].mirrorX ) v1[n][0] *= -1;
			if ( a.parts[i].mirrorY ) v1[n][1] *= -1;
			
			v1[n] = vRotate ( v1[n], a.parts[i].angle );
			v1[n] = vSum ( v1[n], a.parts[i].position );
			v1[n] = vRotate ( v1[n], a.angle );
			v1[n] = vSum ( v1[n], a.position );
		}
		
		if (pointInsidePoly ( point, v1 ) ) return true;
	}
	
	return false;
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
	var normal = vSetModule(vSubt ( a.position, b.position ),1);
	
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
	
	//Calculates impulse
	var j = -2 * cSpeed / (vDot ( normal, vMult ( normal, 1 / a.mass + 1 / b.mass ) ) + Math.pow ( rA, 2 ) / a.inertia + Math.pow( rB, 2 ) / b.inertia );
		
	//Impulse vector
	var impulse = vMult ( normal, j );
	
	if (cSpeed < 0){
		//Applies impulse
		a.applyImpulse ( cPoint, impulse );
		b.applyImpulse ( cPoint, vMult ( impulse, -1 ) );
	}
}
