//Github Game Off 2013
//-----------------------------------------------------------------
//gameUI.js
//Game-specific user interface
//-----------------------------------------------------------------

//Hud control
var hud = 0;

//Current UI root control
var currentUI = 0;

//Function to initialize user interface
function initUI () {
	hud = new Control();
	
	var hpFillbar = new Fillbar();
	hpFillbar.area = [12, 563, 300, 12];
	hpFillbar.innerColor = "#C83737";
	hud.children.hpFillbar = hpFillbar;
	
	var armorFillbar = new Fillbar();
	armorFillbar.area = [hpFillbar.area[0], hpFillbar.area[1] + 13, hpFillbar.area[2], hpFillbar.area[3]];
	armorFillbar.innerColor = "#3771C8";
	hud.children.armorFillbar = armorFillbar;
	
	currentUI = hud;
}

//Function to update UI with unit data
function updateUI ( unit ) {
	hud.children.hpFillbar.fill = unit.health / unit.maxHealth;
	hud.children.armorFillbar.fill = unit.armor / unit.maxArmor;
}
