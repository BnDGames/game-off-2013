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
	hpFillbar.area = [12, 564, 300, 12];
	hpFillbar.innerColor = "#C83737";
	
	var scoreLabel = new NumLabel();
	scoreLabel.area = [ hpFillbar.area[0] + hpFillbar.area[2] - 4, hpFillbar.area[1] - 10, 100, 32 ];
	scoreLabel.content = "00000";
	
	var stateCheck = new CheckBoxList();
	stateCheck.area = [ scoreLabel.area[0] + scoreLabel.area[2] + 16, scoreLabel.area[1], 188, 32 ];
	stateCheck.prints[0] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo ( 10, 0 ); ctx.lineTo ( -10, -10 ); ctx.lineTo ( -10, 10 ); ctx.fill(); }
	stateCheck.prints[1] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc ( 0,0,10, 0, Math.PI * 2 ); ctx.fill(); }
	stateCheck.prints[2] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-10, -10, 20, 20); }
	
	var waveLabel = new Label();
	waveLabel.area = [ 628, 554, 160, 32 ];
	waveLabel.content = "WAVE 1";
	
	hud.children.stateCheck = stateCheck;
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
	
	if (unit.status == "light") hud.children.stateCheck.checked = 0;
	if (unit.status == "middle") hud.children.stateCheck.checked = 1;
	if (unit.status == "heavy") hud.children.stateCheck.checked = 2;
}
