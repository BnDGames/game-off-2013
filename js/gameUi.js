//Github Game Off 2013
//-----------------------------------------------------------------
//gameUI.js
//Game-specific user interface
//-----------------------------------------------------------------

//Hud control
var hud = 0;

//Loading screen
var loading = 0;

//Current UI root control
var currentUI = 0;

//Function to initialize user interface
function initUI () {
	hud = new Control();
	
	var hpFillbar = new Fillbar();
	hpFillbar.area = [12, 562, 300, 16];
	hpFillbar.innerColor = "#C83737";
	
	var speedFillbar = new Fillbar();
	speedFillbar.area = [12, 571, 300, 7];
	speedFillbar.borderSize = 2;
	speedFillbar.innerColor = "#71C837";
	
	
	var scoreLabel = new NumLabel();
	scoreLabel.area = [ hpFillbar.area[0] + hpFillbar.area[2] - 4, hpFillbar.area[1] - 8, 100, 32 ];
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
	hud.children.speedFillbar = speedFillbar;
	
	hud.print = function () {
		context.fillStyle = "#FFFFFF";
		context.fillRect ( 0, 568, 800, 4 );
		
		context.fillStyle = "#202020";
		context.fillRect ( 0, 572, 800, 28 );
	}
	
	loading = new Control();
	
	var progressBar = new Fillbar();
	progressBar.area = [ 150, 284, 500, 32 ];
	progressBar.innerColor = "#C83737";
	
	loading.children.progressBar = progressBar;
	
	currentUI = loading;
}

//Function to update UI with unit data
function updateHud ( unit ) {
	hud.children.hpFillbar.fill = unit.health / unit.maxHealth;
	
	if (unit.maxSpeed > 0) hud.children.speedFillbar.fill = vModule(unit.speed) / unit.maxSpeed;
	else hud.children.speedFillbar.fill = 0;
	
	hud.children.scoreLabel.value = unit.score;
	
	if (unit.status == "light") hud.children.stateCheck.checked = 0;
	if (unit.status == "mid") hud.children.stateCheck.checked = 1;
	if (unit.status == "heavy") hud.children.stateCheck.checked = 2;
}

//Function to update loading screen
function updateLoading () {
	if (partsCount > 0) loading.children.progressBar.fill = partsLoaded / partsCount;
	else loading.children.progressBar.fill = 0;
}
