//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//parts.js
//Unit parts definition
//-----------------------------------------------------------------

//Unit part object
var Part = function () {
	//Part identifier
	this.id = "";
	
	//Part parent unit
	this.parent = 0;
	
	//Part vertices
	//Part is composed by an array of vectors, each representing a vertex
	this.vertices = new Array();
	
	//Unit positional data
	this.position = [ 0, 0 ];
	this.speed = [ 0, 0 ];
	this.acceleration = [ 0, 0 ];
	this.force = [ 0, 0 ];
	
	//Unit rotational data
	this.angle = 0;
	this.omega = 0;
	this.alpha = 0;
	this.momentum = 0;
	
	//Mirroring
	this.mirrorX = false;
	this.mirrorY = false;
	
	//Actions
	this.actions = new Array();
	
	//Part graphics
	this.fill = "#808080";
	
	this.borderWidth = 0;
	this.border = "#FFFFFF";
	
	this.draw = new Array();
	this.modifiers = new Array();

	//Construction rules

	//Part anchors (used for ship building)
	this.anchors_plus = new Array();
	this.anchors_minus = new Array();
	
	this.allowMiddle = true;
	
	this.symmetric = 0;

	//Unit statistics belong to its parts
	//and are calculated summing the stats
	//of all the parts; a value of 0 for any
	//of the below variables will mean the part
	//doesn't affect the stat
	//Statistics are contained in an array
	//Indexes for stats are contained in the file
	//units.js
	
	this.stats = new Array();
	for (var i = 0; i < stats_total; i++) this.stats[i] = 0;
	
	//Physics
	this.mass = 1;
	this.inertia = 1;
	
	this.target = [0,0];
	this.moveToTarget = false;
}

//Function to get a part from json
function partFromJson ( json ) {
	var p = new Part();
	
	for (prop in p)
		if ( json[prop] ) p[prop] = json[prop];
		
	return p;
}

//Parts array
//All parts are loaded at the beginning of the execution
var partsCount = 0;
var partsLoaded = 0;
var parts = new Array();

//Function to load parts
//Automatically loads all parts listed inside data/parts/list.json
//All parts MUST have the property 'type' set to 'unit_part'
//or they will be discarded
function loadParts () {
	$.getJSON ( "data/parts/list.json?" + Date.now(),
	
				function (data) {
					partsCount = data.length;//Stores parts count (needed to know if all parts have been loaded)
					
					for (var i = 0; i < data.length; i++){
						$.getJSON ( data[i],
									function ( d ) {
										d.mass = d.stats[stat_mass];
										d.inertia = polyInertia ( d.vertices, d.mass );
										
										parts.push ( d );
										partsLoaded++;
									}
						);
					}
				}
	);
}

//Function to get a copy of requested part
function getPart ( id ) {
	for (var i = 0; i < parts.length; i++){
		if (parts[i].id == id){
			var result = new Part();
			
			result.id = parts[i].id;
			
			for ( var l = 0; l < parts[i].vertices.length; l++)
				result.vertices.push ( parts[i].vertices[l].slice (0) );
			
			if (parts[i].position != undefined)	
				result.position = parts[i].position.slice(0);
				
			if (parts[i].angle != undefined)
				result.angle = parts[i].angle;
				
			if (parts[i].fill != undefined)
				result.fill = parts[i].fill;
				
			if (parts[i].borderWidth != undefined)
				result.borderWidth = parts[i].borderWidth;
				
			if (parts[i].border != undefined)
				result.border = parts[i].border;
			
			for ( var l = 0; l < stats_total; l++)
				result.stats[l] = parts[i].stats[l];
			
			if (parts[i].draw != undefined)	
				for ( var l = 0; l < parts[i].draw.length; l++ ) 
					result.draw.push ( parts[i].draw[l].slice (0) );
					
			if (parts[i].modifiers != undefined)
				result.modifiers = parts[i].modifiers;
				
			if (parts[i].actions != undefined)
				for ( var l = 0; l < parts[i].actions.length; l++ ){
					var action = { type:0,reload:0,projectiles:0 };					
					for (p in parts[i].actions[l]) action[p] = parts[i].actions[l][p];
					
					result.actions.push(action);
				}
			
			if (parts[i].anchors_plus != undefined)
				for ( var l = 0; l < parts[i].anchors_plus.length; l++ )
					result.anchors_plus.push ( parts[i].anchors_plus[l].slice(0) );
					
			if (parts[i].anchors_minus != undefined)
				for ( var l = 0; l < parts[i].anchors_minus.length; l++ )
					result.anchors_minus.push ( parts[i].anchors_minus[l].slice(0) );
					
			if (parts[i].allowMiddle != undefined)
				result.allowMiddle = parts[i].allowMiddle;
			
			return result;
		}
	}
	
	return 0;
}

//Function to move a part for given time
function movePart ( part, time ) {
	//If part has target, sets force
	if (part.moveToTarget){
		var d = vSubt ( part.target, part.position );
		part.force = vSum ( part.force, vMult ( d, 1 / 100 ) );
	}

	//If part has parent, applies damping
	if (part.parent && part.parent.parent && part.parent.health > 0){
		part.force = vSubt ( part.force, vMult ( part.speed, part.parent.parent.debrisDTr ) );
		part.momentum -= part.omega * part.parent.parent.debrisDRot;
	}
	
	part.position = vSum ( part.position, vSum ( vMult ( part.speed, time), vMult ( part.acceleration, 0.5 * time * time ) ) );
	part.speed = vSum ( part.speed, vMult ( part.acceleration, time ) );
	part.acceleration = vMult ( part.force, 1 / part.mass );
	
	part.angle += part.omega * time + part.alpha * 0.5 * time * time;
	part.omega += part.alpha * time;
	part.alpha = part.momentum / part.inertia;
	
	part.force = [0,0];
	part.momentum = 0;
}

//Function to attach a part to an anchor on another part
//Positions the part if anchor is free
function attachPart ( to, toIndex, what, whatIndex ) {
	what.mirrorX = to.anchors_plus [ toIndex ] [3];
	what.mirrorY = to.anchors_plus [ toIndex ] [4];	
	what.angle =   to.anchors_plus [ toIndex ] [2] * Math.PI;	
	
	if (what.mirrorX) what.angle = Math.PI - what.angle;
	if (what.mirrorY) what.angle = -what.angle;
	
	what.angle += to.angle;

	var plus = to.anchors_plus [ toIndex ];
	plus = vRotate ( plus, to.angle );
	if (to.mirrorX){ plus[0] *= -1; what.mirrorX = !what.mirrorX; }
	if (to.mirrorY){ plus[1] *= -1; what.mirrorY = !what.mirrorY; }
	plus = vSum (plus, to.position);
	
	var minus = what.anchors_minus [ whatIndex ];
	minus = vRotate ( minus, what.angle );
	if (what.mirrorX) minus[0] *= -1; if (what.mirrorY) minus[1] *= -1;
	minus = vSum (minus, what.position);	
	
	var dist = vSubt ( plus, minus );
	
	what.position = vSum ( what.position, dist );
}
