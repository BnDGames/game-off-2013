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
	initUI();
	graphicsSetup();
	
	loadParts ( 0 );
	
	setInterval ( loop, 15 );
	setInterval ( draw, 0 );
}

var speed = 1;

//Loop function
function loop () {
	if (state_current == state_game){
		applyInput();	
		moveScene ( s, speed );
		
		updateHud( inputBoundUnit );
	}
	
	if (state_current == state_loading){
		updateLoading ();
		
		if (partsCount > 0 && partsLoaded >= partsCount && loading.children.progressBar.shownFill > 0.99) {
			inputBoundUnit = addUnitToScene ( loadUnit ( "data/units/test.json" ), s );
			inputBoundUnit.position = [ 500, 500 ];
			inputBoundUnit.colors.push ( "#C83737" );
		
			u = addUnitToScene ( loadUnit ( "data/units/test.json" ), s );
			u.position = [ 1000, 800 ];
			u.colors.push ( "#3771C8" );
			
			state_current = state_game;
			currentUI = hud;
		}
	}
	
	if (currentUI) animateControl ( currentUI, speed );
}
