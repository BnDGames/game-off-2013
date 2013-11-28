//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//gameConfig.js
//Some values to tweak
//-----------------------------------------------------------------

//GAMEPLAY///////////////////////////////////////////////

//Recoil flag
//If true, shooting will cause recoil basing on shooter mass
//and projectile mass and speed
var game_enableRecoil = false;

//Projectile bump factor
//Impulse of projectile collision on unit is multiplied by this
var game_projectileBumpFactor = 1;
var game_projectileBumpFactorEnemy = 3;

//Player damage factor
var game_playerDamageFactor = 0.2;

//Game speed
var game_speed = 2;

//GRAPHICS and EFFECTS///////////////////////////////////

//Effects level
//0: only basic - plain colors, no gradients, no blinks
//1: gradients, blinks
var fx_level = 1;

//Destruction speed
//The module speed the individual parts gain when the unit gets destroyed
var fx_destructionSpeed = 1;

//Minimap unit radius
var fx_minimapRadius = 2;

//Minimap blink
var fx_minimapBlink = false;
var fx_minimapBlinkRate = 4;
var fx_minimapBlinkSpeed = 1;

//Scene scaling
var fx_sceneScaleBase = 0.5;
var fx_sceneScaleFactor = 0.1;

//Damage alert blink
var fx_damageAlert = false;
var fx_damageAlertThreshold = 0.2;

//Grid
var fx_grid = 1;

//PHYSICS////////////////////////////////////////////////

//Damping factors
var phys_dampingTr = 0.60;
var phys_dampingRot = 1500;

//Optimal momentum
//Turn momentum won't get higher than this
var phys_optimalMomentum = 0.007;

//Maneuvrability coefficient
var phys_manCoefficient = 1;

//AI/////////////////////////////////////////////////////

//Angle tolerance
var ai_angleTolerance = Math.PI / 8;
