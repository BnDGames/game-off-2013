//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//main.js
//Main game flow
//-----------------------------------------------------------------

var gameScene = new Scene();
var playerShip = 0;

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
var gameoverOverlay = false;

//Loop function
function loop () {
	if (state_current == state_game){
		if (!pause){
			applyInput();
			moveScene ( gameScene, speed );
			sceneAi ( gameScene, inputBoundUnit );
			
			updateHud( inputBoundUnit );
			
			if (inputBoundUnit.health <= 0){
				if (!hud.overlayText && !gameoverOverlay){
					setTimeout ( function() {
						hud.overlay ( "GAME OVER", 4000, function () { state_current = state_menu; currentUI = menu; gameoverOverlay = false; }, inputBoundUnit.score + " POINTS" )
						}, 300 ) ;
					gameoverOverlay = true;
				}
			}
			
			else if (gameScene.units.length == 1 && hud.blinkingTextContent == ""){
				hud.blinkText ( "WAVE CLEARED", 3, function () { hud.blinkText ( "NEXT WAVE", 3, function () { spawnWave ( gameScene, inputBoundUnit, canvas.width / sceneScale, canvas.width * 5 / sceneScale, 3, colors_enemy ); } ); } );
			}
		}
	}
	
	if (state_current == state_loading){
		updateLoading ();
		
		if (partsCount > 0 && partsLoaded >= partsCount && unitsLoaded >= unitsCount && loading.children.progressBar.shownFill > 0.99) {
			if (localStorage && localStorage.playerShip){
				playerShip = new Unit();
				try { loadUnitFromJSON ( JSON.parse(localStorage.playerShip), playerShip ); }
				catch (e) {	playerShip = loadUnit ( "data/units/default.json", function (data) { localStorage.playerShip = JSON.stringify(data)	} ); }
			}
			
			else
				playerShip = loadUnit ( "data/units/default.json", function (data) { localStorage.playerShip = JSON.stringify(data)	} );
			
			state_current = state_menu;
			currentUI = menu;
		}
	}
	
	if (currentUI) animateControl ( currentUI, speed );
}
