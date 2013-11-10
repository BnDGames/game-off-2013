//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//vector.js
//Vectorial math
//-----------------------------------------------------------------

//Vectors are represented by arrays of two elements
//First element stands for x coordinate, second for y
//Any other element will be ignored

//Vector operations
function vSum ( a, b ) { return [ a[0] + b[0], a[1] + b[1] ]; }
function vSubt ( a, b ) { return [ a[0] - b[0], a[1] - b[1] ]; }
function vMult ( a, b ) { return [ a[0] * b, a[1] * b ]; }
function vDot ( a, b ) { return a[0] * b[0] + a[1] * b[1]; }
function vCross ( a, b ) { return -a[0] * b[1] + a[1] * b[0]; }

function vCopy ( a ) { return [ a[0], a[1] ]; }

function vRotate ( a, b ) { return [ a[0] * Math.cos ( b ) - a[1] * Math.sin ( b ), a[0] * Math.sin ( b ) + a[1] * Math.cos ( b ) ]; }

function vAngle ( a ) { return Math.atan2 ( a[1], a[0] ); }
function vModule ( a ) { return Math.sqrt ( a[0] * a[0] + a[1] * a[1] ); }
function vSetModule ( a, module ) { if ( a[0] != 0 || a[1] != 0) return vMult ( a, module / vModule ( a ) ); else return [0,0]; }

function vPerp ( a ) { return [ -a[0], a[1] ]; }
