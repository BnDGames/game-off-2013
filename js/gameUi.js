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
	hpFillbar.area = [12, 564, 500, 12];
	hpFillbar.innerColor = "#C83737";
	
	var scoreLabel = new NumLabel();
	scoreLabel.area = [ 508, 554, 100, 32 ];
	scoreLabel.content = "00000";
	
	var waveLabel = new Label();
	waveLabel.area = [ 628, 554, 160, 32 ];
	waveLabel.content = "WAVE 1";
	
	hud.children.waveLabel = waveLabel;
	hud.children.scoreLabel = scoreLabel;
	hud.children.hpFillbar = hpFillbar;
	
	hud.print = function () {
		context.fillStyle = "#FFFFFF";
		context.fillRect ( 0, 568, 800, 4 );
		
		context.fillStyle = "#404040";
		context.fillRect ( 0, 572, 800, 28 );
	}
	
	currentUI = hud;
}

//Function to update UI with unit data
function updateUI ( unit ) {
	hud.children.hpFillbar.fill = unit.health / unit.maxHealth;
	hud.children.scoreLabel.value = unit.score;
}
