//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//gameConfig.js
//Some values to tweak
//-----------------------------------------------------------------

//Recoil flag
//If true, shooting will cause recoil basing on shooter mass
//and projectile mass and speed
var game_enableRecoil = false;

//Destruction speed
//The module speed the individual parts gain when the unit gets destroyed
var fx_destructionSpeed = 1;

//Damping factors
var phys_dampingTr = 0.45;
var phys_dampingRot = 1500;

//Optimal momentum
//Turn momentum won't get higher than this
var phys_optimalMomentum = 0.009;

//Maneuvrability coefficient
var phys_manCoefficient = 1;
