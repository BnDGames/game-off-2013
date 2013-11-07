//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//main.js
//Main game flow
//-----------------------------------------------------------------

var s = new Scene();
var u = 0;

//Setup function
function setup () {
	graphicsSetup();
	
	loadParts( function() {
		inputBoundUnit = addUnitToScene ( loadUnit ( "data/units/test.json" ), s );
		inputBoundUnit.position = [ 500, 500 ];
		inputBoundUnit.colors.push ( "#C83737" );
		
		u = addUnitToScene ( loadUnit ( "data/units/test.json" ), s );
		u.position = [ 1000, 800 ];
		u.colors.push ( "#3771C8" );
		
		setInterval ( loop, 15 );
		setInterval ( draw, 15 );
	});
}

var speed = 1;

//Loop function
function loop () {
	applyInput();	
	moveScene ( s, speed );
}
