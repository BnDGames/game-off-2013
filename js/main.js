//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//main.js
//Main game flow
//-----------------------------------------------------------------

var gameScene = new Scene();

//Setup function
function setup () {
	graphicsSetup();
	initUI();
	
	canvas.onmousedown = uiCheckEvents;
	canvas.onmouseup = uiCheckEvents;
	canvas.onmousemove = uiCheckEvents;
	
	loadParts ();
	loadUnits ();
	
	setInterval ( loop, 30 );
	setInterval ( draw, 0 );
}

var speed = 1.5;
var pause = false;
var gameoverOverlay = false;

var alert = false;

//Loop function
function loop () {
	if (state_current == state_game){
		if (!pause){
			applyInput();
			
			var targetScale = fx_sceneScaleBase - ( inputBoundUnit.gfxModifiers[gfxMod_engineOn] && getStat(inputBoundUnit, stat_engine) ? fx_sceneScaleFactor : 0 );
			if (targetScale - sceneScale > 0.01) sceneScale += 0.01;
			else if ( sceneScale - targetScale > 0.01) sceneScale -= 0.01;
			else sceneScale = targetScale;
			
			moveScene ( gameScene, speed );
			sceneAi ( gameScene, inputBoundUnit );
			
			updateHud( inputBoundUnit );
			
			if (inputBoundUnit.health <= 0){
				if (!hud.overlayText && !gameoverOverlay){
					setTimeout ( function() {
						hud.overlay ( "GAME OVER", 4000, function () { state_current = state_menu; currentUI = menu; gameoverOverlay = false; playerShip.reset(); playerScore += playerShip.score; playerShip.score = 0; savePlayerData(); }, inputBoundUnit.score + " POINTS" )
					}, 300 ) ;
					
					gameoverOverlay = true;
				}
			}
			
			else if (gameScene.units.length == 1 && hud.blinkingTextContent == ""){
				hud.blinkText ( "WAVE CLEARED", 3, function () { hud.blinkText ( "NEXT WAVE", 3, function () { spawnWave ( gameScene, inputBoundUnit, canvas.width / sceneScale, canvas.width * 2 / sceneScale, [colors_enemy, colors_enemy_dark] ); hud.children.waveLabel.blinkRed(1) } ) } );
			}
			
			if ( fx_damageAlert && inputBoundUnit.health / inputBoundUnit.maxHealth < fx_damageAlertThreshold && fx_level > 0 && !alert){
				alert = true;
				var interval = 3 / (fx_damageAlertThreshold - inputBoundUnit.health / inputBoundUnit.maxHealth) / fx_damageAlertThreshold;
				setTimeout ( function () { hud.blinkRed ( 0.75 ); alert = false }, interval );
			}
		}
	}
	
	if (state_current == state_loading){
		updateLoading ();
		
		if (partsCount > 0 && partsLoaded >= partsCount && !loadingPlayerData)
			loadPlayerData();
		
		if (partsCount > 0 && partsLoaded >= partsCount && !loadingUpgrades && loadedPlayerData)
			loadUpgrades();
		
		if (partsCount > 0 && partsLoaded >= partsCount && unitsLoaded >= unitsCount && upgradesLoaded >= upgradesCount && loading.children.progressBar.shownFill > 0.99) {
			loadPlayerData();
			
			state_current = state_menu;
			currentUI = menu;
		}
	}
	
	if (currentUI) animateControl ( currentUI, speed );
}
