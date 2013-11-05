//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//main.js
//Main game flow
//-----------------------------------------------------------------

var s = new Scene();

//Setup function
function setup () {
	graphicsSetup();
	
	loadParts( function() {
		inputBoundUnit = addUnitToScene ( loadUnit ( "data/units/test.json" ), s );
		inputBoundUnit.position = [ 500, 500 ];
		
		setInterval ( loop, 15 );
		setInterval ( draw, 15 );
	});
}

//Loop function
function loop () {
	applyInput();
	
	moveScene ( s, 1 );
}
