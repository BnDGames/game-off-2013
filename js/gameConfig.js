//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//gameConfig.js
//Some values to tweak
//-----------------------------------------------------------------

//Recoil flag
//If true, shooting will cause recoil basing on shooter mass
//and projectile mass and speed
var game_enableRecoil = false;

//Player damage factor
var game_playerDamageFactor = 0.2;

//Destruction speed
//The module speed the individual parts gain when the unit gets destroyed
var fx_destructionSpeed = 1;

//Damping factors
var phys_dampingTr = 0.45;
var phys_dampingRot = 1500;

//Optimal momentum
//Turn momentum won't get higher than this
var phys_optimalMomentum = 0.008;

//Maneuvrability coefficient
var phys_manCoefficient = 1.5;
