//Github Game Off 2013
//-----------------------------------------------------------------
//gameUI.js
//Game-specific user interface
//-----------------------------------------------------------------

//Loading screen
var loading = 0;

//Main menu screen
var menu = 0;

//Hud control
var hud = 0;

//Current UI root control
var currentUI = 0;

//Function to initialize user interface
function initUI () {
	hud = new Control();
	
	hud.children.scoreLabel = new NumLabel();
	hud.children.scoreLabel.area = [ 308, 554, 100, 32 ];
	hud.children.scoreLabel.content = "00000";
	
	hud.children.hpFillbar = new Fillbar();
	hud.children.hpFillbar.area = [12, 562, 300, 16];
	hud.children.hpFillbar.innerColor = colors_barFill1;
	
	hud.children.speedFillbar = new Fillbar();
	hud.children.speedFillbar.area = [12, 571, 300, 7];
	hud.children.speedFillbar.borderSize = 2;
	hud.children.speedFillbar.innerColor = colors_barFill2;	
	
	hud.children.stateCheck = new CheckBoxList();
	hud.children.stateCheck.area = [ 600, 554, 188, 32 ];
	hud.children.stateCheck.prints[0] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo ( 10, 0 ); ctx.lineTo ( -10, -10 ); ctx.lineTo ( -10, 10 ); ctx.fill(); }
	hud.children.stateCheck.prints[1] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc ( 0,0,10, 0, Math.PI * 2 ); ctx.fill(); }
	hud.children.stateCheck.prints[2] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-10, -10, 20, 20); }
	hud.children.stateCheck.checkedColor = colors_buttonActive;
	
	hud.children.waveLabel = new Label();
	hud.children.waveLabel.area = [ 628, 14, 160, 32 ];
	hud.children.waveLabel.content = "WAVE 1";
	
	hud.children.enemies = new Label();
	hud.children.enemies.area = [ 516, 18, 100, 24 ];
	
	hud.children.pause = new Label();
	hud.children.pause.area = [ 12, 14, 48, 32 ];
	hud.children.pause.content = "II";
	hud.children.pause.cornerFactor = 0.5;
	hud.children.pause.onmousein = labelOnMouseIn;
	hud.children.pause.onmouseout = labelOnMouseOut;
	hud.children.pause.onmousedown = function() {
		if (!pause){ pause = true; this.innerColor = colors_buttonActive; this.onmouseout = 0; this.onmousein = 0; }
		else {
			pause = false;
			this.innerColor = colors_buttonHover;
			this.onmouseout = labelOnMouseOut;this.onmousein = labelOnMouseIn;
		}
	}
	
	hud.print = function () {
		context.fillStyle = "#FFFFFF";
		context.fillRect ( -1, 568, canvas.width + 2, 4 );
		context.fillRect ( -1, 28, canvas.width + 2, 4 );
		
		context.fillStyle = colors[0];
		context.fillRect ( -1, 572, canvas.width + 2, 29 );
		context.fillRect ( -1, -1, canvas.width + 2, 29 );
		
		if ( this.blinkingText ) {
			context.fillStyle = "#FFFFFF";
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.font = "160px League Gothic";
			context.fillText ( this.blinkingTextContent, canvas.width / 2, canvas.height / 2 );
		}
	}
	
	hud.blinkingTextContent = "";
	hud.blinkText = function ( text, times, done, update ) {
		this.blinkingText = true;
		this.blinkingTextContent = text;
		this.blinkingTextTimes = times;
		this.blinkingTextTime = Date.now();
		this.blinkingTextDone = done;
		this.blinkingTextUpdate = update;
	}
	
	hud.animate = function ( time ) {
		if (this.blinkingTextContent != "" && Date.now() - this.blinkingTextTime > 300){
			if (this.blinkingTextTimes > 0.5){
				this.blinkingText = !this.blinkingText;
				this.blinkingTextTimes -= 0.5;
				this.blinkingTextTime = Date.now();
				
				if (this.blinkingText && this.blinkingTextUpdate)
					this.blinkingTextUpdate();
			}
			
			else {
				this.blinkingTextContent = "";
				if (this.blinkingTextDone) this.blinkingTextDone();
			}
		}
	}
	
	
	
	loading = new Control();
	
	loading.children.progressBar = new Fillbar();
	loading.children.progressBar.area = [ 150, 284, 500, 32 ];
	loading.children.progressBar.innerColor = colors_barFill1;
	
	loading.children.label = new Label();
	loading.children.label.area = [ 150, 284, 500, 32 ];
	loading.children.label.text = "0%";
	loading.children.label.printFrame = false;
	
	
	
	menu = new Control();
	
	menu.children.title = new Label();
	menu.children.title.area = [0, 60, 800, 72];
	menu.children.title.fontStyle = "72px League Gothic";
	menu.children.title.content = "THE UNNAMED BULLETHELL GAME";
	menu.children.title.printFrame = false;
	
	menu.children.subtitle = new Label();
	menu.children.subtitle.area = [0, 120, 800, 32];
	menu.children.subtitle.content = "MADE BY BnDGAMES for GITHUB GAME OFF 2013";
	menu.children.subtitle.printFrame = false;
	
	menu.children.play = new Label();
	menu.children.play.area = [280, 234, 240, 48];
	menu.children.play.content = "P L A Y";
	menu.children.play.fontStyle = "36px League Gothic";
	menu.children.play.onmousein = labelOnMouseIn;
	menu.children.play.onmouseout = labelOnMouseOut;
	menu.children.play.onmousedown = function () { this.innerColor = colors_buttonActive; }
	menu.children.play.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		state_current = state_game;
		currentUI = hud;
	}
	
	menu.children.editship = new Label();
	menu.children.editship.area = [300, 300, 200, 32];
	menu.children.editship.content = "EDIT SHIP";
	menu.children.editship.onmousein = labelOnMouseIn;
	menu.children.editship.onmouseout = labelOnMouseOut;
	
	menu.children.store = new Label();
	menu.children.store.area = [300, 350, 200, 32];
	menu.children.store.content = "STORE";
	menu.children.store.onmousein = labelOnMouseIn;
	menu.children.store.onmouseout = labelOnMouseOut;
	
	currentUI = loading;
}

//Function to update UI with unit data
function updateHud ( unit ) {
	hud.children.hpFillbar.fill = unit.health / unit.maxHealth;
	
	if (unit.maxSpeed > 0) hud.children.speedFillbar.fill = vModule(unit.speed) / unit.maxSpeed;
	else hud.children.speedFillbar.fill = 0;
	
	hud.children.scoreLabel.value = unit.score;
	
	hud.children.enemies.content = (unit.parent.units.length - 1) + "/" + unit.parent.spawnCount;
	
	hud.children.waveLabel.content = "WAVE " + unit.parent.wave;
	
	if (unit.status == "light") hud.children.stateCheck.checked = 0;
	if (unit.status == "mid") hud.children.stateCheck.checked = 1;
	if (unit.status == "heavy") hud.children.stateCheck.checked = 2;
}

//Function to update loading screen
function updateLoading () {
	var progressTot = partsCount + unitsCount;
	var progressVal = partsLoaded + unitsLoaded;
	
	if (progressTot > 0) loading.children.progressBar.fill = progressVal / progressTot;
	else loading.children.progressBar.fill = 0;
	
	loading.children.label.content = Math.round(loading.children.progressBar.shownFill * 100) + "%";
}

//Function to check UI events
function uiCheckEvents ( event ) {
	var rect = canvas.getBoundingClientRect();
	if (currentUI) checkMouse ( currentUI, event, [rect.left, rect.top] );
}

//Label standard event functions
function labelOnMouseIn () { this.innerColor = colors_buttonHover; }
function labelOnMouseOut () { this.innerColor = colors_buttonStd; }
