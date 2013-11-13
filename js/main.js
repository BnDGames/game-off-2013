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
	
	loadParts ();
	loadUnits ();
	
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
			sceneAi ( s, inputBoundUnit );
			
			updateHud( inputBoundUnit );
			
			if (s.units.length == 1 && hud.blinkingTextContent == ""){
				hud.blinkText ( "WAVE CLEARED", 3, function () { hud.blinkText ( "NEXT WAVE", 3, function () { spawnWave ( s, inputBoundUnit, canvas.width, canvas.width * 5, 3, colors_enemy ); } ); } );
			}
		}
	}
	
	if (state_current == state_loading){
		updateLoading ();
		
		if (partsCount > 0 && partsLoaded >= partsCount && unitsLoaded >= unitsCount && loading.children.progressBar.shownFill > 0.99) {
			inputBoundUnit = addUnitToScene(getUnit("test"),s);
			inputBoundUnit.position = [ 500, 500 ];
			inputBoundUnit.colors.push ( colors_player );
		
			spawnWave ( s, inputBoundUnit, canvas.width, canvas.width * 5, 3, colors_enemy );
			
			state_current = state_menu;
			currentUI = menu;
		}
	}
	
	if (currentUI) animateControl ( currentUI, speed );
}
