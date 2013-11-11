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
	
	canvas.onmousedown = uiCheckEvents;
	canvas.onmouseup = uiCheckEvents;
	canvas.onmousemove = uiCheckEvents;
	
	loadParts ( 0 );
	
	setInterval ( loop, 15 );
	setInterval ( draw, 0 );
}

var speed = 1;
var pause = false;

//Loop function
function loop () {
	if (state_current == state_game){
		if (!pause){
			applyInput();	
			moveScene ( s, speed );
			
			updateHud( inputBoundUnit );
		}
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
			
			state_current = state_menu;
			currentUI = menu;
		}
	}
	
	if (currentUI && !pause) animateControl ( currentUI, speed );
}
