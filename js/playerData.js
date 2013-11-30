//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//playerData.js
//Player progress data
//-----------------------------------------------------------------

var loadingPlayerData = 0;
var loadedPlayerData = 0;

var playerShip = 0;
var playerPartsIds = [ "light_engine_0", "light_machinegun_0", "mid_engine_0", "mid_cannon_0", "heavy_engine_0", "heavy_cannon_0" ];
var playerParts = new Array ();
var playerScore = 0;

var playerPartsCount = [5,6,7];

//Function to load player data from local storage
function loadPlayerData () {
	loadingPlayerData = 1;
	
	if (localStorage && localStorage.playerShip){
		playerShip = new Unit();
		try { loadUnitFromJSON ( JSON.parse(localStorage.playerShip), playerShip ); playerShip.colors.push(colors_player); playerShip.colors.push ( colors_player_dark ) }
		catch (e) {	playerShip = loadUnit ( "data/units/default.json", function (data) { localStorage.playerShip = JSON.stringify(data); playerShip.colors.push ( colors_player ); playerShip.colors.push ( colors_player_dark ) } ); }
	}
	
	else {
		playerShip = loadUnit ( "data/units/default.json", function (data) { localStorage.playerShip = JSON.stringify(data); playerShip.colors.push ( colors_player ); playerShip.colors.push ( colors_player_dark )	} );
		playerShip.colors.push(colors_player);
	}
	
	if (localStorage) {
		if (localStorage.playerScore) playerScore = parseInt(localStorage.playerScore);
		if (localStorage.playerPartsCount) playerPartsCount = JSON.parse ( localStorage.playerPartsCount );
		if (localStorage.fx_level) fx_level = parseInt(localStorage.fx_level);
	}
	
	if (localStorage) {		
		if ( localStorage.playerPartsIds )
			playerPartsIds = JSON.parse ( localStorage.playerPartsIds );
		else localStorage.playerPartsIds = JSON.stringify(playerPartsIds);
		
		playerParts.splice(0, playerParts.length);
		
		for ( var i = 0; i < playerPartsIds.length; i++ ) {
			var p = getPart ( playerPartsIds[i] );
			if ( p ) playerParts.push ( p );
		}
	}
	
	loadedPlayerData = 1;
}

//Function to save player data to local storage
function savePlayerData () {
	if (localStorage){
		playerShip.reset();
		
		localStorage.playerShip = JSON.stringify(unitToJSON(playerShip), 0, " ");
		localStorage.playerScore = playerScore;
		localStorage.playerPartsCount = JSON.stringify(playerPartsCount);
		
		for ( var i = 0; i < upgrades.length; i++ )
			localStorage["upg_" + upgrades[i].id] = upgrades[i].value;
			
		localStorage.playerPartsIds = JSON.stringify ( playerPartsIds );
		localStorage.fx_level = fx_level;
	}
}

//Function to reset player data (debug)
function resetPlayerData () {
	if ( confirm ( "Are you sure you want to reset player data?\n\nThis will reset your settings, your ship, your score and the uprades and parts you have unlocked." ) ) {
		playerPartsCount = [5,6,7];
		playerPartsIds = [ "light_engine_0", "light_machinegun_0", "mid_engine_0", "mid_cannon_0", "heavy_engine_0", "heavy_cannon_0" ];
		playerScore = 0;
		fx_level = 1;
		
		for (var i = 0; i < upgrades.length; i++)
			if ( upgrades[i].data.action == "unlockPart" && playerPartsIds.indexOf ( upgrades[i].data.part ) >= 0 ) upgrades[i].value = 1;
			else upgrades[i].value = 0;
			
		for ( p in localStorage )
			if ( p.substr ( 0, 4 ) == "upg_" ) delete localStorage[p];
			
		playerShip = loadUnit ( "data/units/default.json", function (data) { savePlayerData(); playerShip.colors.push ( colors_player ); playerShip.colors.push ( colors_player_dark ); location.reload() } );
	}
}
