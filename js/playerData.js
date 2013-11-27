//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//playerData.js
//Player progress data
//-----------------------------------------------------------------

var playerShip = 0;
var playerParts = new Array ();
var playerScore = 0;

var playerPartsCount = [5,6,7];

//Function to load player data from local storage
function loadPlayerData () {
	if (localStorage && localStorage.playerShip){
		playerShip = new Unit();
		try { loadUnitFromJSON ( JSON.parse(localStorage.playerShip), playerShip ); playerShip.colors.push(colors_player) }
		catch (e) {	playerShip = loadUnit ( "data/units/default.json", function (data) { localStorage.playerShip = JSON.stringify(data); playerShip.colors.push ( colors_player ) } ); }
	}
	
	else {
		playerShip = loadUnit ( "data/units/default.json", function (data) { localStorage.playerShip = JSON.stringify(data); playerShip.colors.push ( colors_player )	} );
		playerShip.colors.push(colors_player);
	}
	
	if (localStorage) {
		if (localStorage.playerScore) playerScore = localStorage.playerScore;
		if (localStorage.playerPartsCount) playerPartsCount = JSON.parse ( localStorage.playerPartsCount );
	}
	
	playerParts = parts;
}

//Function to save player data to local storage
function savePlayerData () {
	if (localStorage){
		localStorage.playerShip = JSON.stringify(unitToJSON(playerShip), 0, " ");
		localStorage.playerScore = playerScore;
		localStorage.playerPartsCount = JSON.stringify(playerPartsCount);
	}
}

//Function to reset player data (debug)
function resetPlayerData () {
	if ( confirm ( "Are you sure you want to reset player data?" ) ) {
		playerPartsCount = [5,6,7];
		playerParts = parts;
		playerScore = 0;
		playerShip = loadUnit ( "data/units/default.json", function (data) { savePlayerData(); playerShip.colors.push ( colors_player ) } );
	}
}
