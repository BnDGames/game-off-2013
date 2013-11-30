//Buch415
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
	this.dRot = phys_dampingRot;
	this.dTr = phys_dampingTr;
	
	//Scene damping factors applied to debris
	this.debrisDRot = 600;
	this.debrisDTr = 0.15;
	
	//Wave counter
	this.wave = 0;
}

//Function to add an unit to a scene
//Returns the added unit
function addUnitToScene ( unit, scene ) {
	unit.parent = scene;
	scene.units.push ( unit );
	
	if (unit.loaded) unit.calcStats();
	
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
		
	sceneCheckProj ( scene );
	sceneCheckCollisions ( scene );
	sceneCheckDead ( scene );
}

//Function to check for dead projectiles and projectile collisions in scene
function sceneCheckProj ( scene ) {
	for ( var i = 0; i < scene.projectiles.length; i++ ){
		for ( var j = 0; j < scene.units.length; j++ ){
			if ( scene.projectiles[i].owner == scene.units[j] ) continue;
			if ( scene.units[j].dead || scene.units[j].destroying || scene.projectiles[i].owner.team == scene.units[j].team ) continue;
			
			var dist = vSubt ( scene.units[j].position, scene.projectiles[i].position );
			if ( vModule ( dist ) > scene.units[j].r) continue;
			
			if ( pointInUnit ( scene.projectiles[i].position, scene.units[j] ) ) {
				var impulse = vMult ( scene.projectiles[i].speed, scene.projectiles[i].mass);
				if ( scene.units[j] != inputBoundUnit ) impulse = vMult ( impulse, game_projectileBumpFactorEnemy );
				else impulse = vMult ( impulse, game_projectileBumpFactorPlayer );
				
				scene.units[j].applyImpulse ( scene.projectiles[i].position, impulse );
				scene.units[j].damage ( scene.projectiles[i].mass * (scene.units[j] == inputBoundUnit ? game_playerDamageFactor : game_enemyDamageFactor) );
				scene.projectiles[i].dead = true;
				
				if (scene.units[j] == inputBoundUnit){
					hud.blinkRed ( 0.25 + scene.projectiles[i].mass / 10 );
				}
				
				else if (scene.units[j].destroying){
					scene.projectiles[i].owner.score += scene.units[j].scoreValue;
					
					hud.blinkWhite ( 0.75 );
				}
			}
		}
	}

	for ( var i = 0; i < scene.projectiles.length; i++ )
		if (scene.projectiles[i].dead) scene.projectiles.splice ( i--, 1 );
}

//Function to check for collisions in scene
function sceneCheckCollisions ( scene ) {
	for ( var i = 0; i + 1 < scene.units.length; i++ ){
		if ( scene.units[i].dead || scene.units[i].destroying ) continue;
		
		for ( var j = i + 1; j < scene.units.length; j++ ){
			if ( scene.units[j].dead || scene.units[j].destroying ) continue;
			if ( vModule ( vSubt ( scene.units[j].position, scene.units[i].position ) ) > scene.units[j].r + scene.units[i].r ) continue;
			
			var collision = unitsCollide ( scene.units[i], scene.units[j] );
			
			if (collision) handleUnitCollision ( scene.units[i], scene.units[j], collision );
		}
	}
}

//Function to check for dead units
function sceneCheckDead ( scene ) {
	for ( var i = 0; i < scene.units.length; i++ )
		if ( scene.units[i].dead && scene.units[i] != inputBoundUnit ) scene.units.splice ( i--, 1 );
}

//Function to spawn a wave in scene
function spawnWave ( scene, unit, minDistance, maxDistance, colors ) {
	var cls = 1 + Math.round(Math.random() * 2);	
	var count = 0;
	
	scene.wave++;
	
	while (true) {
		var index = Math.floor(Math.random() * units.length);
		while ( units[index].cls != cls ) index = Math.floor ( Math.random() * units.length );
		
		var u = new Unit(); loadUnitFromJSON ( units[ index ], u );
		addUnitToScene ( u, scene );
		u.position = vSum ( unit.position, [- maxDistance / 1.414 + Math.random() * maxDistance / 1.414 * 2, - maxDistance / 1.414 + Math.random() * maxDistance / 1.414 * 2] );
		u.colors = colors.slice ( 0 );
		
		var d = vModule ( vSubt ( u.position, unit.position ) );
		while ( d < minDistance ){
			u.position = vSum ( unit.position, [- maxDistance / 1.414 + Math.random() * maxDistance / 1.414 * 2, - maxDistance / 1.414 + Math.random() * maxDistance / 1.414 * 2] );
			d = vModule ( vSubt ( u.position, unit.position ) )
		}
		
		u.angle = vAngle(vSubt(u.position, unit.position));
		u.ai = true;
		u.team = "ai";
		
		count++;
		
		if ( (Math.random() * (100 + scene.wave * 10) > u.amountFactor || count >= game_enemiesAmountMaxFactor * scene.wave) && count > game_enemiesAmountMinFactor * scene.wave) break;
	}
	
	scene.spawnCount = count;
}

//Function to control all AI units in scene
function sceneAi ( scene, target ) {
	for ( var i = 0; i < scene.units.length; i++ )
		if (scene.units[i].ai) ai ( scene.units[i], target );
}

//Function to reset a scene
function resetScene ( scene ) {
	scene.units.splice (0, scene.units.length );
	scene.projectiles.splice (0, scene.projectiles.length );
	scene.wave = 0;
}
