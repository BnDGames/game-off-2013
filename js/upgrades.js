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

var loadingUpgrades = 0;

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
	
	if (upgrade.data.action == "unlockPart"){
		playerPartsIds.push ( upgrade.data.part );
		playerParts.push ( getPart ( upgrade.data.part ) );
		
		savePlayerData();
	}
}

//Function to load upgrades
function loadUpgrades () {
	loadingUpgrades = 1;
	
	$.getJSON ( "data/upgrades.json", function ( data ) {
		for ( var i = 0; i < data.length; i++ )
			upgrades.push ( data[i] );
		
		while ( partsLoaded < partsCount || partsCount == 0 ) { }
		
		for ( var i = 0; i < parts.length; i++ ) {
			if ( playerPartsIds.indexOf ( parts[i].id ) < 0 && parts[i].id.substr(0,5) != "base_"){
				var u = new Upgrade();
				u.id = "unlock_" + parts[i].id;
				u.info = parts[i].info.slice(0);
				if (parts[i].unlockCost) u.cost = parts[i].unlockCost;
				else u.cost = 100;
				u.data.action = "unlockPart";
				u.data.part = parts[i].id;
				u.value = 0;
				u.max = 1;
				
				upgrades.push(u);
			}
		}
		
		if (localStorage){
			for ( var i = 0; i < upgrades.length; i++ ){
				if ( localStorage["upg_" + upgrades[i].id] )
					upgrades[i].value = localStorage["upg_" + upgrades[i].id];
			}
		}
		
		upgradesLoaded = 1;
	} );
}
