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
	hpFillbar.area = [0, 588, 800, 12];
	hpFillbar.innerColor = "#C83737";
	hud.children.hpFillbar = hpFillbar;
	
	currentUI = hud;
}

//Function to update UI with unit data
function updateUI ( unit ) {
	hud.children.hpFillbar.fill = unit.health / unit.maxHealth;
}
