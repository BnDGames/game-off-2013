//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//upgrades.js
//Upgrades definitions
//-----------------------------------------------------------------

//Upgrade object
var Upgrade = function () {
	this.id = "";
	this.info = [ "", "" ];
	
	this.cost = 0;
	
	this.data = new Object();
	
	this.value = 0;
	this.max = 1;
}

var upgradesCount = 1;
var upgradesLoaded = 0;
var upgrades = new Array();

//Function to apply an upgrade
function applyUpgrade ( upgrade ) {
	upgrade.value++;
	
	if (upgrade.data.action == "partSlot"){
		playerPartsCount[upgrade.data.cls - 1]++;		
		savePlayerData();
	}
}

//Function to load upgrades
function loadUpgrades () {
	$.getJSON ( "data/upgrades.json", function ( data ) {
		for ( var i = 0; i < data.length; i++ )
			upgrades.push ( data[i] );
		
		upgradesLoaded = 1;
	} );
}
