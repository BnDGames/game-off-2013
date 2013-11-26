//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//units.js
//Projectiles
//-----------------------------------------------------------------

//Projectile object
//Projectiles are single entities moving with constant speed
//and constant direction until a certain distance
//Reaching that distance or hitting an unit destroys the projectile
var Projectile = function () {
	//Projectile owner
	//Used to assign score
	this.owner = 0;
	
	//Projectile parent scene
	this.parent = 0;

	//Projectile mass
	this.mass = 0;

	//Projectile positional data
	this.distance = 0;
	this.position = [0,0];
	this.speed = [0,0];
	
	//Projectile statistics
	this.damage = 0;//Damage dealt by projectile
	this.range = 0;//Projectile range (when distance > range, projectile is destroyed)
	
	this.dead = false;//Set to true when reaching max distance or unit
	
	//Projectile graphics, given as an array of primitives
	this.draw = new Array();
}

//Function to move a projectile
function moveProjectile ( projectile, time ) {
	projectile.position = vSum ( projectile.position, vMult ( projectile.speed, time ) );
	projectile.distance += time;
	
	if (projectile.distance > projectile.range) projectile.dead = true;
}
