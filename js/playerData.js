//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//playerData.js
//Player progress data
//-----------------------------------------------------------------

var playerShip = 0;
var playerParts = new Array ();

//Function to load player data from local storage
function loadPlayerData () {
	if (localStorage && localStorage.playerShip){
		playerShip = new Unit();
		try { loadUnitFromJSON ( JSON.parse(localStorage.playerShip), playerShip ); playerShip.colors.push(colors_player) }
		catch (e) {	playerShip = loadUnit ( "data/units/default.json", function (data) { localStorage.playerShip = JSON.stringify(data)	} ); }
	}
	
	else {
		playerShip = loadUnit ( "data/units/default.json", function (data) { localStorage.playerShip = JSON.stringify(data)	} );
		playerShip.colors.push(colors_player);
	}
	
	playerParts = parts;
}

//Function to save player data to local storage
function savePlayerData () {
	if (localStorage)
		localStorage.playerShip = JSON.stringify(unitToJSON(playerShip), 0, " ");
}
