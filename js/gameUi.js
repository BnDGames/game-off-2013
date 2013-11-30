//Buch415
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

//Ship editor control
var shipEditor = 0;

//Store control
var store = 0;

//Settings
var settings = 0;

//Credits
var credits = 0;

//Current UI root control
var currentUI = 0;

//Function to initialize user interface
function initUI () {
	hud = new Control();
	
	hud.children.scoreLabel = new NumLabel();
	hud.children.scoreLabel.area = [ 308, 554, 100, 32 ];
	hud.children.scoreLabel.caption = "$ ";
	
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
	hud.children.stateCheck.oncheck = function ( i ){
		if (i == 0) inputBoundUnit.changeParts("light");
		if (i == 1) inputBoundUnit.changeParts("mid");
		if (i == 2) inputBoundUnit.changeParts("heavy");
	}
	
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
	hud.children.pause.onmousedown = labelOnMouseDown;
	hud.children.pause.onmouseup = function() {
		if (inputBoundUnit.health <= 0){ this.innerColor = colors_buttonHover; return; }
		
		pause = true;
		this.innerColor = colors_buttonActive;
		this.onmouseout = 0;
		this.onmousein = 0;
		hud.children.pausemenu.visible = true;
	}
	
	hud.print = function ( context ) {
		if (this.blinkingRed){
			context.fillStyle = colors_enemy;
			context.globalAlpha = (this.blinkingRedOpacity < this.blinkingRedTarget ? this.blinkingRedOpacity : -this.blinkingRedOpacity + 2 * this.blinkingRedTarget);
			context.fillRect ( 0, 0, canvas.width, canvas.height );
			context.globalAlpha = 1;
		}
		
		if (this.blinkingWhite){
			context.fillStyle = colors_player;
			context.globalAlpha = (this.blinkingWhiteOpacity < this.blinkingWhiteTarget ? this.blinkingWhiteOpacity : -this.blinkingWhiteOpacity + 2 * this.blinkingWhiteTarget);
			context.fillRect ( 0, 0, canvas.width, canvas.height );
			context.globalAlpha = 1;
		}
		
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
		
		if ( this.overlayText ) {
			if ( fx_level > 0 ) {
			context.globalAlpha = 0.75;
		
				var g = context.createLinearGradient ( 0, canvas.height / 2 - 100, 0, canvas.height / 2 + 100 );
				g.addColorStop ( 0, "transparent" );
				g.addColorStop (0.3, "#000000" );
				g.addColorStop (0.7, "#000000" );
				g.addColorStop ( 1, "transparent" );
			
				context.fillStyle = g;
				context.fillRect ( 0, canvas.height / 2 - 100, canvas.width, 200 );
				context.globalAlpha = 1;
			
			}
						
			context.fillStyle = "#FFFFFF";
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.font = "160px League Gothic";
			context.fillText ( this.overlayTextContent, canvas.width / 2, canvas.height / 2 );		
			
			if ( this.overlaySubtitle ) {
				context.font = "24px League Gothic";
				context.fillText ( this.overlaySubtitle, canvas.width / 2, canvas.height / 2 + 72 );	
			}
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
	
	hud.overlayText = false;
	hud.overlayTextContent = "";
	hud.overlay = function ( text, time, done, subtitle ) {
		this.overlayText = true;
		this.overlayTextContent = text;
		this.overlayTextTime = time;
		this.overlayTextBegin = Date.now();
		this.overlayTextDone = done;		
		this.overlaySubtitle = subtitle;
	}
	
	hud.blinkingRedOpacity = 0;
	hud.blinkRed = function (target) {
		if ( fx_level < 1 ) return;
		
		this.blinkingRed = true;
		this.blinkingRedTarget = target;
	}
	
	hud.blinkingWhiteOpacity = 0;
	hud.blinkWhite = function (target) {
		if ( fx_level < 1 ) return;
		
		this.blinkingWhite = true;
		this.blinkingWhiteTarget = target;
	}
	
	hud.animate = function ( time ) {
		if (pause) return;
		
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
		
		if ( this.overlayText && Date.now() - this.overlayTextBegin > this.overlayTextTime ){
			this.overlayText = false;
			if ( this.overlayTextDone ) this.overlayTextDone();
		}
		
		if ( this.blinkingRed ){
			this.blinkingRedOpacity += 0.2;
			
			if (this.blinkingRedOpacity > 2 * this.blinkingRedTarget){
				this.blinkingRedOpacity = 0;
				this.blinkingRed = false;
			}
		}
		
		if ( this.blinkingWhite ){
			this.blinkingWhiteOpacity += 0.2;
			
			if (this.blinkingWhiteOpacity > 2 * this.blinkingWhiteTarget){
				this.blinkingWhiteOpacity = 0;
				this.blinkingWhite = false;
			}
		}
	}
	
	hud.children.pausemenu = new Control();
	hud.children.pausemenu.visible = false;
	
	hud.children.pausemenu.print = function ( context ) {
		if ( fx_level < 1 ) return;
		
		context.globalAlpha = 0.75;
			
		var g = context.createLinearGradient ( 0, canvas.height / 2 - 200, 0, canvas.height / 2 + 200 );
		g.addColorStop ( 0, "transparent" );
		g.addColorStop (0.3, "#000000" );
		g.addColorStop (0.7, "#000000" );
		g.addColorStop ( 1, "transparent" );
		
		context.fillStyle = g;
		context.fillRect ( 0, canvas.height / 2 - 200, canvas.width, 400 );
		context.globalAlpha = 1;
	}
	
	hud.children.pausemenu.children.title = new Label();
	hud.children.pausemenu.children.title.area = [0,120,800,72];
	hud.children.pausemenu.children.title.fontStyle = "72px League Gothic";
	hud.children.pausemenu.children.title.content = "PAUSE";
	hud.children.pausemenu.children.title.printFrame = false;
	
	hud.children.pausemenu.children.resume = new Label();
	hud.children.pausemenu.children.resume.area = [280, 234, 240, 48];
	hud.children.pausemenu.children.resume.content = "RESUME";
	hud.children.pausemenu.children.resume.fontStyle = "36px League Gothic";
	hud.children.pausemenu.children.resume.onmousein = labelOnMouseIn;
	hud.children.pausemenu.children.resume.onmouseout = labelOnMouseOut;
	hud.children.pausemenu.children.resume.onmousedown = labelOnMouseDown;
	hud.children.pausemenu.children.resume.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		hud.children.pausemenu.visible = false;
		
		hud.children.pause.innerColor = colors_buttonStd;
		hud.children.pause.onmousein = labelOnMouseIn;
		hud.children.pause.onmouseout = labelOnMouseOut;
		pause = false;
	}
	
	hud.children.pausemenu.children.quit = new Label();
	hud.children.pausemenu.children.quit.area = [300,300,200,32];
	hud.children.pausemenu.children.quit.content = "QUIT";
	hud.children.pausemenu.children.quit.onmousein = labelOnMouseIn;
	hud.children.pausemenu.children.quit.onmouseout = labelOnMouseOut;
	hud.children.pausemenu.children.quit.onmousedown = labelOnMouseDown;
	hud.children.pausemenu.children.quit.onmouseup = function () {
		this.innerColor = colors.buttonHover;
		hud.children.pausemenu.visible = false;
		
		hud.children.pause.innerColor = colors_buttonStd;
		hud.children.pause.onmousein = labelOnMouseIn;
		hud.children.pause.onmouseout = labelOnMouseOut;
		pause = false;
		
		playerShip.score = 0;
		
		currentUI = menu;
		state_current = state_menu;
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
	menu.children.title.content = "SWAPSHOOTER  ARENA";
	menu.children.title.printFrame = false;
	
	menu.children.subtitle = new Label();
	menu.children.subtitle.area = [0, 120, 800, 32];
	menu.children.subtitle.content = "MADE BY BUCH for GITHUB GAME OFF 2013";
	menu.children.subtitle.printFrame = false;
	
	menu.children.play = new Label();
	menu.children.play.area = [280, 234, 240, 48];
	menu.children.play.content = "P L A Y";
	menu.children.play.fontStyle = "36px League Gothic";
	menu.children.play.onmousein = labelOnMouseIn;
	menu.children.play.onmouseout = labelOnMouseOut;
	menu.children.play.onmousedown = labelOnMouseDown;
	menu.children.play.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		state_current = state_game;
		currentUI = hud;
		
		resetScene ( gameScene );
		
		playerShip.reset();
		playerShip.team = "player";
		
		sceneScale = fx_sceneScaleBase;
		
		inputBoundUnit = addUnitToScene(playerShip, gameScene);
		inputBoundUnit.position = [ 500, 500 ];
	
		hud.overlayText = "";
		hud.blinkingTextContent = "";
	
		spawnWave ( gameScene, inputBoundUnit, canvas.width / sceneScale, canvas.width * 2 / sceneScale, [colors_enemy, colors_enemy_dark] );
	}
	
	menu.children.editship = new Label();
	menu.children.editship.area = [300, 300, 200, 32];
	menu.children.editship.content = "EDIT SHIP";
	menu.children.editship.onmousein = labelOnMouseIn;
	menu.children.editship.onmouseout = labelOnMouseOut;
	menu.children.editship.onmousedown = labelOnMouseDown;
	menu.children.editship.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		
		state_current = state_shipedit;
		currentUI = shipEditor;
		
		playerShip.reset();
		
		shipEditor.drawAvailableParts(shipEditor.children.stateCheck.checked + 1);
		playerShip.changeParts ( ["light", "mid", "heavy"][shipEditor.children.stateCheck.checked], true );
		
		window.onpartdrop = function ( part, position ) {
			
			
			if ( position[0] > shipEditor.shipArea[0] && position[1] > shipEditor.shipArea[1] && position[0] < shipEditor.shipArea[0] + shipEditor.shipArea[2] && position[1] < shipEditor.shipArea[1] + shipEditor.shipArea[3]){
				for ( var i = 0; i < playerShip.parts.length; i++ ){
					for ( var l = 0; l < playerShip.parts[i].anchors_plus.length; l++ ){
						var anchor = playerShip.parts[i].anchors_plus[l];
						
						if (!anchor.attachedPart || !anchor.attachedPart[playerShip.status] || anchor.attachedPart[playerShip.status] < 0){
							var aPoint = vCopy(anchor);
							var partAngle = playerShip.parts[i].angle;
						
							if (playerShip.parts[i].mirrorX){ partAngle = Math.PI - partAngle;}
							if (playerShip.parts[i].mirrorY){ partAngle = -partAngle;}
						
							aPoint = vRotate ( aPoint, playerShip.parts[i].angle );
						
							if (playerShip.parts[i].mirrorX){ aPoint[0] *= -1; }
							if (playerShip.parts[i].mirrorY){ aPoint[1] *= -1; }
						
							aPoint = vSum ( aPoint, playerShip.parts[i].position );
						
							aPoint = vSum ( aPoint, [shipEditor.shipArea[0] + shipEditor.shipArea[2] / 2, shipEditor.shipArea[1] + shipEditor.shipArea[3] / 2] );
						
							if (vModule ( vSubt ( vSum ( window.draggedPart.position, window.draggedSourcePos ), aPoint ) ) < 8){
								if (playerShip.parts.length >= playerPartsCount [ shipEditor.children.stateCheck.checked]){
									shipEditor.children.partsCount.blinkRed ( 1 );
									return;
								}
								
								var result = attachPart ( playerShip.parts[i], l, getPart ( window.draggedPart.id ), 0 );
								
								if (result.error && result.error == "occupied"){
								}
								
								playerShip.calcStats();
								shipEditor.children.partsCount.content = playerShip.parts.length + "/" + playerPartsCount[shipEditor.children.stateCheck.checked];
								
								return;
							}
						}
					}
				}
			}
		}
		
		shipEditor.children.partsCount.content = playerShip.parts.length + "/" + playerPartsCount[shipEditor.children.stateCheck.checked];
	}
	
	menu.children.store = new Label();
	menu.children.store.area = [300, 350, 200, 32];
	menu.children.store.content = "STORE";
	menu.children.store.onmousein = labelOnMouseIn;
	menu.children.store.onmouseout = labelOnMouseOut;
	menu.children.store.onmousedown = labelOnMouseDown;
	menu.children.store.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		
		currentUI = store;
		state_current = state_store;
		
		store.drawUpgrades(0);
		store.children.scroll.value = 0;
		store.children.scroll.length = upgrades.length - 1;
	}
	
	menu.children.settings = new Label();
	menu.children.settings.area = [300, 400, 200, 32];
	menu.children.settings.content = "SETTINGS";
	menu.children.settings.onmousein = labelOnMouseIn;
	menu.children.settings.onmouseout = labelOnMouseOut;
	menu.children.settings.onmousedown = labelOnMouseDown;
	menu.children.settings.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		
		currentUI = settings;
		state_current = state_settings;
		
		settings.children.fxLevelCheck.checked = fx_level;
		settings.children.fxLevelCheck.checkedOffset = fx_level * settings.children.fxLevelCheck.area[2] / 2;
	}
	
	menu.children.credits = new Label();
	menu.children.credits.area = [300, 450, 200, 32];
	menu.children.credits.content = "CREDITS";
	menu.children.credits.onmousein = labelOnMouseIn;
	menu.children.credits.onmouseout = labelOnMouseOut;
	menu.children.credits.onmousedown = labelOnMouseDown;
	menu.children.credits.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		
		currentUI = credits;
		state_current = state_credits;
	}
	
	shipEditor = new Control();
	shipEditor.area = [0,0, canvas.width, canvas.height];
	shipEditor.shipArea = [ 30, 100, 380, 350 ];
	shipEditor.print = function (context) {		
		context.fillStyle = "#000410";
		context.beginPath();
		context.rect ( this.shipArea[0], this.shipArea[1], this.shipArea[2], this.shipArea[3] );
		context.fill();
		context.strokeStyle = "#FFFFFF";
		context.lineWidth = 4;
		context.stroke();
		context.lineWidth = 1;
		
		drawUnit ( context, playerShip, [this.shipArea[0] + this.shipArea[2] / 2, this.shipArea[1] + this.shipArea[3] / 2] );		
	}
	
	shipEditor.printAfter = function (context){
		if (window.draggedPart){
			for (var i = 0; i < playerShip.parts.length; i++){
				for (var l = 0; l < playerShip.parts[i].anchors_plus.length; l++){
					var anchor = playerShip.parts[i].anchors_plus[l];
					
					if ((!anchor.attachedPart || !anchor.attachedPart[playerShip.status] || anchor.attachedPart[playerShip.status] < 0) && anchor[6] >= window.draggedPart.anchors_minus[0][2]){
						var aPoint = vCopy(anchor);
						var partAngle = playerShip.parts[i].angle;
						
						if (playerShip.parts[i].mirrorX){ partAngle = Math.PI - partAngle;}
						if (playerShip.parts[i].mirrorY){ partAngle = -partAngle;}
						
						aPoint = vRotate ( aPoint, playerShip.parts[i].angle );
						
						if (playerShip.parts[i].mirrorX){ aPoint[0] *= -1; }
						if (playerShip.parts[i].mirrorY){ aPoint[1] *= -1; }
						
						aPoint = vSum ( aPoint, playerShip.parts[i].position );
						
						aPoint = vSum ( aPoint, [this.shipArea[0] + this.shipArea[2] / 2, this.shipArea[1] + this.shipArea[3] / 2] );
						
						context.globalAlpha = 0.5;
						
						if (vModule ( vSubt ( vSum ( window.draggedPart.position, window.draggedSourcePos ), aPoint ) ) < 8) context.fillStyle = colors_enemy;
						else context.fillStyle = colors_player;
						
						context.beginPath();
						context.arc ( aPoint[0], aPoint[1], 8, 0, 2 * Math.PI );
						context.fill();						
						context.globalAlpha = 1;
						
						context.strokeStyle = "#FFFFFF";
						context.lineWidth = 2;
						context.stroke();
						context.lineWidth = 1;
					}
				}
			}
		}
	}
	
	shipEditor.onmouseup = function (mX, mY){
		if (window.draggedPart) return;
		
		if (mX > this.shipArea[0] && mX < this.shipArea[0] + this.shipArea[2] && mY > this.shipArea[1] && mY < this.shipArea[1] + this.shipArea[3]){
			var p = vSubt ( [mX, mY], [this.shipArea[0] + this.shipArea[2] / 2, this.shipArea[1] + this.shipArea[3] / 2] );
			
			for ( var i = playerShip.parts.length - 1; i >= 0; i-- ) {
				var v = new Array();
				for (var l = 0; l < playerShip.parts[i].vertices.length; l++)
					v.push ( vSum (playerShip.parts[i].vertices[l], playerShip.parts[i].position) );
					
				if ( pointInsidePoly ( p, v ) ){					
					if ( playerShip.parts[i].id.substr(0,5) != "base_" )
						detatchPart ( playerShip.parts[i] );
						
					shipEditor.children.partsCount.content = playerShip.parts.length + "/" + playerPartsCount[shipEditor.children.stateCheck.checked];
					
					playerShip.calcStats();
					
					return;
				}
			}
		}
	}
	
	shipEditor.drawAvailableParts = function ( cls ) {
		var n = 0;
		
		for (c in this.children){
			if (c.substr(0,9) == "partSlot_")
				this.children[c].part = 0;
		}
		
		for (var i = 0; i < playerParts.length; i++){
			if (playerParts[i].cls == cls){ this.children["partSlot_" + n].part = getPart(playerParts[i].id); n++; }
			else this.children["partSlot_" + n].part = 0;
		}
	}
	
	shipEditor.children.title = new Label();
	shipEditor.children.title.area = [40, 40, 200, 48];
	shipEditor.children.title.content = "EDIT YOUR SHIP";
	shipEditor.children.title.printFrame = false;
	shipEditor.children.title.fontStyle = "48px League Gothic";
	
	shipEditor.children.info = new StatViewer();
	shipEditor.children.info.area = [ 32, 488, 738, 80 ];
	
	for (var i = 0; i < 12; i += 3){
		var vName_1 = "partSlot_" + i;
		var vName_2 = "partSlot_" + (i + 1);
		var vName_3 = "partSlot_" + (i + 2);
		
		shipEditor.children[vName_1] = new PartViewer();
		shipEditor.children[vName_1].area = [ 448, 32 + 106 * i / 3, 96, 96 ];
		shipEditor.children[vName_1].infoControl = shipEditor.children.info;
		
		shipEditor.children[vName_2] = new PartViewer();
		shipEditor.children[vName_2].area = [ 554, 32 + 106 * i / 3, 96, 96 ];
		shipEditor.children[vName_2].infoControl = shipEditor.children.info;
		
		shipEditor.children[vName_3] = new PartViewer();
		shipEditor.children[vName_3].area = [ 660, 32 + 106 * i / 3, 96, 96 ];
		shipEditor.children[vName_3].infoControl = shipEditor.children.info;
	}
	
	shipEditor.children.stateCheck = new CheckBoxList();
	shipEditor.children.stateCheck.area = [ 200, 434, 188, 32 ];
	shipEditor.children.stateCheck.prints[0] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.moveTo ( 10, 0 ); ctx.lineTo ( -10, -10 ); ctx.lineTo ( -10, 10 ); ctx.fill(); }
	shipEditor.children.stateCheck.prints[1] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc ( 0,0,10, 0, Math.PI * 2 ); ctx.fill(); }
	shipEditor.children.stateCheck.prints[2] = function (ctx) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(-10, -10, 20, 20); }
	shipEditor.children.stateCheck.checkedColor = colors_buttonActive;
	shipEditor.children.stateCheck.oncheck = function ( i ){
		if (i == 0) playerShip.changeParts("light", true);
		if (i == 1) playerShip.changeParts("mid", true);
		if (i == 2) playerShip.changeParts("heavy", true);
		
		shipEditor.drawAvailableParts(i + 1);
		
		shipEditor.children.partsCount.content = playerShip.parts.length + "/" + playerPartsCount[i];
	}
	
	shipEditor.children.ok = new Label();
	shipEditor.children.ok.area = [ 50, 434, 72, 32 ];
	shipEditor.children.ok.content = "OK";
	shipEditor.children.ok.onmousein = labelOnMouseIn;
	shipEditor.children.ok.onmouseout = labelOnMouseOut;
	shipEditor.children.ok.onmousedown = function () { this.innerColor = colors_buttonActive; }
	shipEditor.children.ok.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		
		currentUI = menu;
		state_current = state_menu;
		
		savePlayerData();
		
		window.onpartdrop = 0;
	}
	
	shipEditor.children.partsCount = new Label();
	shipEditor.children.partsCount.area = [ 292, 84, 96, 32];
	
	shipEditor.exportShip = function (id, score, cls) {
		var u = new Unit();
		u.id = id;
		u.scoreValue = score;
		u.cls = cls;
		
		for ( var i = 0; i < playerShip.parts.length; i++ ){
			u.parts_static.push ( playerShip.parts[i] );
		}
		
		var json = unitToJSON(u);
		
		var a = document.createElement('a');
		a.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(json, 0, " ")));
		a.setAttribute('download', id + ".json");
		a.click();
	}
	
	store = new Control();
	
	store.children.title = new Label();
	store.children.title.area = [40, 34, 300, 48];
	store.children.title.content = "UPGRADES STORE";
	store.children.title.printFrame = true;
	store.children.title.fontStyle = "48px League Gothic";
	
	store.children.scoreLabel = new NumLabel();
	store.children.scoreLabel.area = [ 568, 42, 192, 32 ];
	store.children.scoreLabel.caption = "$ ";
	
	store.children.scroll = new Scrollbar();
	store.children.scroll.area = [ canvas.width - 72, 110, 32, canvas.height - 130 ];
	store.children.scroll.onchange = function ( val ) {
		store.drawUpgrades ( val );
	}
	
	for ( var i = 0; i < 3; i++ ){
		store.children["slot_" + i] = new UpgradeViewer();
		store.children["slot_" + i].area = [ 40,  store.children.scroll.area[1] + i * 160, canvas.width - 100 - store.children.scroll.area[2], 130 ];
		
		store.children["slot_" + i].scoreControl = store.children.scoreLabel;
		
		store.children["slot_" + i].setup();
	}
	
	store.print = function ( context ) {
		store.children.scoreLabel.value = playerScore;
		
		context.fillStyle = "#FFFFFF";
		context.fillRect ( store.children.title.area[0] + 2, store.children.title.area[1] + store.children.title.area[3] / 2 - 2, store.children.scoreLabel.area[0] - store.children.title.area[0], 4 );
	}
	
	store.drawUpgrades = function ( offset ) {
		store.children.slot_0.upgrade = upgrades[offset]; store.children.slot_0.setup();
		store.children.slot_1.upgrade = upgrades[offset + 1]; store.children.slot_1.setup();
		store.children.slot_2.upgrade = upgrades[offset + 2]; store.children.slot_2.setup();
	}
	
	store.children.back = new Label();
	store.children.back.area = [ 442, 42, 100, 32 ];
	store.children.back.content = "BACK";
	store.children.back.onmousein = labelOnMouseIn;
	store.children.back.onmouseout = labelOnMouseOut;
	store.children.back.onmousedown = labelOnMouseDown;
	store.children.back.onmouseup = function () {
		state_current = state_menu;
		currentUI = menu;
	}
	
	settings = new Control ();
	
	settings.print = function ( context ) {		
		context.fillStyle = "#FFFFFF";
		context.fillRect ( settings.children.title.area[0] + 2, settings.children.title.area[1] + settings.children.title.area[3] / 2 - 2, settings.children.back.area[0] - settings.children.title.area[0], 4 );
	}
	
	settings.children.title = new Label();
	settings.children.title.area = [40, 34, 300, 48];
	settings.children.title.content = "SETTINGS";
	settings.children.title.printFrame = true;
	settings.children.title.fontStyle = "48px League Gothic";
	
	settings.children.back = new Label();
	settings.children.back.area = [ 660, 42, 100, 32 ];
	settings.children.back.content = "BACK";
	settings.children.back.onmousein = labelOnMouseIn;
	settings.children.back.onmouseout = labelOnMouseOut;
	settings.children.back.onmousedown = labelOnMouseDown;
	settings.children.back.onmouseup = function () {
		state_current = state_menu;
		currentUI = menu;
	}
	
	settings.children.fxLevelLabel = new Label();
	settings.children.fxLevelLabel.area = [ 224, 228, 224, 24 ];
	settings.children.fxLevelLabel.content = "GRAPHIC EFFECTS:";
	settings.children.fxLevelLabel.printFrame = true;
	
	settings.children.fxLevelCheck = new CheckBoxList();
	settings.children.fxLevelCheck.length = 2;
	settings.children.fxLevelCheck.area = [ 424, 224, 160, 32 ];
	settings.children.fxLevelCheck.checkedColor = colors_player;
	settings.children.fxLevelCheck.prints [0] = function ( context ) {
		context.font = "24px League Gothic";
		context.fillStyle = "#FFFFFF";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText ( "OFF", 0, 0 );
	}
	settings.children.fxLevelCheck.prints [1] = function ( context ) {
		context.font = "24px League Gothic";
		context.fillStyle = "#FFFFFF";
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillText ( "ON", 0, 0 );
	}
	settings.children.fxLevelCheck.oncheck = function ( n ) { fx_level = n; savePlayerData() }
	
	settings.children.reset = new Label();
	settings.children.reset.area = [ 272, 280, 256, 32 ];
	settings.children.reset.content = "RESET GAME DATA";
	settings.children.reset.onmousein = labelOnMouseIn;
	settings.children.reset.onmouseout = labelOnMouseOut;
	settings.children.reset.onmousedown = labelOnMouseDown;
	settings.children.reset.onmouseup = function () {
		this.innerColor = colors_buttonHover;
		resetPlayerData();
	}
	
	credits = new Control();
	
	credits.children.title = new Label();
	credits.children.title.area = [40, 34, 300, 48];
	credits.children.title.content = "CREDITS";
	credits.children.title.printFrame = true;
	credits.children.title.fontStyle = "48px League Gothic";
	
	credits.children.back = new Label();
	credits.children.back.area = [ 660, 42, 100, 32 ];
	credits.children.back.content = "BACK";
	credits.children.back.onmousein = labelOnMouseIn;
	credits.children.back.onmouseout = labelOnMouseOut;
	credits.children.back.onmousedown = labelOnMouseDown;
	credits.children.back.onmouseup = function () {
		state_current = state_menu;
		currentUI = menu;
	}
	
	credits.print = function ( context ) {		
		context.fillStyle = "#FFFFFF";
		context.fillRect ( credits.children.title.area[0] + 2, credits.children.title.area[1] + credits.children.title.area[3] / 2 - 2, credits.children.back.area[0] - credits.children.title.area[0], 4 );
	}
	
	credits.children.buch = new Label();
	credits.children.buch.area = [ 144, 264, 512, 32];
	credits.children.buch.content = 'design and code :  MICHELE "BUCH" BUCELLI';
	credits.children.buch.printFrame = false;
	credits.children.buch.onmousein = function () { this.textColor = colors_player; }
	credits.children.buch.onmouseout = function () { this.textColor = "#FFFFFF"; }
	credits.children.buch.onmousedown = function () { this.textColor = colors_player_dark; }
	credits.children.buch.onmouseup = function () {
		this.textColor = colors_player;
		
		var a = document.createElement("a");
		a.href = "http://blog-buch.rhcloud.com";
		a.target = "_blank";
		a.click();
	}
	
	credits.children.font = new Label();
	credits.children.font.area = [ 144, 312, 512, 32];
	credits.children.font.content = 'font "League Gothic" :  THE LEAGUE OF MOVEABLE TYPE';
	credits.children.font.printFrame = false;
	credits.children.font.onmousein = function () { this.textColor = colors_player; }
	credits.children.font.onmouseout = function () { this.textColor = "#FFFFFF"; }
	credits.children.font.onmousedown = function () { this.textColor = colors_player_dark; }
	credits.children.font.onmouseup = function () {
		this.textColor = colors_player;
		
		var a = document.createElement("a");
		a.href = "https://www.theleagueofmoveabletype.com/league-gothic";
		a.target = "_blank";
		a.click();
	}
	
	currentUI = loading;
}

//Function to update UI with unit data
function updateHud ( unit ) {
	hud.children.hpFillbar.fill = unit.health / unit.maxHealth;
	
	if (unit.maxSpeed > 0) hud.children.speedFillbar.fill = vModule(unit.speed) / unit.maxSpeed;
	else hud.children.speedFillbar.fill = 0;
	
	hud.children.scoreLabel.value = unit.score;
	
	var uCount = 0;
	for (var i = 0; i < unit.parent.units.length; i++ )
		if (unit.parent.units[i] != unit && unit.parent.units[i].health > 0) uCount++;
		
	hud.children.enemies.content = uCount + "/" + unit.parent.spawnCount;
	
	hud.children.waveLabel.content = "WAVE " + unit.parent.wave;
}

//Function to update loading screen
function updateLoading () {
	var progressTot = partsCount + unitsCount + upgradesCount;
	var progressVal = partsLoaded + unitsLoaded + upgradesLoaded;
	
	if (progressTot > 0) loading.children.progressBar.fill = progressVal / progressTot;
	else loading.children.progressBar.fill = 0;
	
	loading.children.label.content = Math.round(loading.children.progressBar.shownFill * 100) + "%";
}

//Function to check UI events
function uiCheckEvents ( event ) {
	var rect = canvas.getBoundingClientRect();
	if (currentUI) checkMouse ( currentUI, event, [rect.left, rect.top] );
}
