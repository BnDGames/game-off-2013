//Buch415
//Github Game Off 2013
//-----------------------------------------------------------------
//parts.js
//Unit parts definition
//-----------------------------------------------------------------

var totParts = 0;
//Unit part object
var Part = function () {
	//Part identifier
	this.id = "";
	this.uid = totParts;
	totParts++;
	
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
	
	this.symmetric = -1;

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
	
	this.r = 1;
	
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
						$.getJSON ( data[i] + "?" + Date.now(),
									function ( d ) {
										d.mass = d.stats[stat_mass];
										d.inertia = polyInertia ( d.vertices, d.mass );
										
										d.r = 0;
										for (var i = 0; i < d.vertices.length; i++)
											if (vModule(d.vertices[i]) > d.r) d.r = vModule(d.vertices[i]);
										
										if (d.angle != undefined)
											d.angle *= Math.PI;
										
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
			result.uid;
			
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
				if (parts[i].stats[l])
					result.stats[l] = parts[i].stats[l];
				else result.stats[l] = 0;
			
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
				
			if (parts[i].info != undefined)
				result.info = parts[i].info;
			
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
function attachPart ( to, toIndex, what, whatIndex, force ) {
	console.log("TRYING TO ATTACH PART " + what.uid + " TO " + to.uid);
	
	if ( to.anchors_plus[toIndex].attachedPart && to.anchors_plus[toIndex].attachedPart[to.parent.status] != undefined && to.anchors_plus[toIndex].attachedPart[to.parent.status] >= 0 ){
		console.warn("ATTACH REFUSED: anchor already in use (" + to.anchors_plus[toIndex].attachedPart[to.parent.status] + ")");
		return false;
	};
	
	if ( to.anchors_plus[toIndex][6] > 0 && to.anchors_plus[toIndex][6] < what.anchors_minus[whatIndex][2] ) {
		console.warn("ATTACH REFUSED: part too big");
		return false;
	}
	
	
	if ( to.anchors_plus[toIndex].attachedPart == undefined ){
		to.anchors_plus[toIndex].attachedPart = new Object();
		to.anchors_plus[toIndex].attachedAnchor = new Object();
	}
	
	if ( what.anchors_minus[whatIndex].attachedPart == undefined ){
		what.anchors_minus[whatIndex].attachedPart = new Object();
		what.anchors_minus[whatIndex].attachedAnchor = new Object();
	}
	
	var plus = to.anchors_plus[toIndex];
	var minus = what.anchors_minus[whatIndex];
	
	what.angle = plus[2] * Math.PI / 2;
	what.mirrorX = plus[3];
	what.mirrorY = plus[4];
	
	var wAngle = what.angle;
	if (what.mirrorX) wAngle = Math.PI - wAngle;
	if (what.mirrorY) wAngle = -wAngle;
	minus = vRotate ( minus, wAngle );
	if (what.mirrorX) minus[0] *= -1;
	if (what.mirrorY) minus[1] *= -1;
	
	what.position = vSum ( what.position, vSubt ( plus, minus ) );
	
	what.position = vRotateC ( what.position, to.angle, [0,0] );
	what.angle += to.angle;
	
	if ((to.angle * 2 / Math.PI) % 2 == 0){
		what.mirrorX ^= to.mirrorX;
		what.mirrorY ^= to.mirrorY;
	}
	
	else {
		var swap = what.mirrorX;
		what.mirrorX = what.mirrorY;
		what.mirrorY = swap;

		what.mirrorX ^= to.mirrorX;
		what.mirrorY ^= to.mirrorY;
	}
	
	if (to.mirrorX) what.position[0] *= -1;
	if (to.mirrorY) what.position[1] *= -1;
	
	what.position = vSum ( what.position, to.position );
	
	//Checks for possible collisions with other parts
	for (var i = 0; i < to.parent.parts.length; i++){
		if (to.parent.parts[i] == to) continue;
		
		var v1 = new Array();
		var v2 = new Array();
		
		for (var n = 0; n < what.vertices.length; n++ ){
			v1.push ( vCopy ( what.vertices[n] ) );
			
			var angle = what.angle;
			if (what.mirrorX) angle = Math.PI - angle;
			if (what.mirrorY) angle = -angle;
			
			v1[n] = vRotate ( v1[n], angle );
			
			if ( what.mirrorX ) v1[n][0] *= -1;
			if ( what.mirrorY ) v1[n][1] *= -1;
		
			v1[n] = vSum ( v1[n], what.position );
		}
		
		for (var n = 0; n < to.parent.parts[i].vertices.length; n++ ){
			v2.push ( vCopy ( to.parent.parts[i].vertices[n] ) );
			
			var angle = to.parent.parts[i].angle;
			if (to.parent.parts[i].mirrorX) angle = Math.PI - angle;
			if (to.parent.parts[i].mirrorY) angle = -angle;
			
			v2[n] = vRotate ( v2[n], angle );
			
			if ( to.parent.parts[i].mirrorX ) v2[n][0] *= -1;
			if ( to.parent.parts[i].mirrorY ) v2[n][1] *= -1;
			
			v2[n] = vSum ( v2[n], to.parent.parts[i].position );
		}
		
		if ( polyCollide ( v1, v2 ) ) {
			console.warn("ATTACH REFUSED: another part is occupying space (" + to.parent.parts[i].uid + ")");		
			return { error:"occupied", part:to.parent.parts[i].uid };
		}
	}
	
	what.parent = to.parent;
	
	if (to.attachedStatus) to.parent["parts_" + to.attachedStatus].push ( what );
	else to.parent["parts_" + to.parent.status].push ( what );
	
	to.anchors_plus [ toIndex ].attachedPart[to.parent.status] = what.uid;
	to.anchors_plus [ toIndex ].attachedAnchor[to.parent.status] = whatIndex;
	
	what.anchors_minus [ whatIndex ].attachedPart[to.parent.status] = to.uid;
	what.anchors_minus [ whatIndex ].attachedAnchor[to.parent.status] = toIndex;
	
	what.attachedStatus = to.parent.status;
	
	console.log("ATTACH SUCCESSFUL (" + what.uid + ")");
	return true;
}

//Function to detatch a part
function detatchPart ( part ) {	
	if ( part.symmetric >= 0 ){
		var p = part.parent.getPart(part.symmetric);
		if (p){
			p.symmetric = -1;
			detatchPart ( p );
		}
		
		part.symmetric = -1;
	}
	
	for ( var i = 0; i < part.parent.parts.length; i++ ){
		if ( part.parent.parts[i] == part ){
			part.parent.parts.splice ( i, 1 );
			break;
		}
	}
	
	for ( var i = 0; i < part.parent.parts_light.length; i++ ){
		if ( part.parent.parts_light[i] == part ){
			part.parent.parts_light.splice ( i, 1 );
			break;
		}
	}
	
	for ( var i = 0; i < part.parent.parts_mid.length; i++ ){
		if ( part.parent.parts_mid[i] == part ){
			part.parent.parts_mid.splice ( i, 1 );
			break;
		}
	}
	
	for ( var i = 0; i < part.parent.parts_heavy.length; i++ ){
		if ( part.parent.parts_heavy[i] == part ){
			part.parent.parts_heavy.splice ( i, 1 );
			break;
		}
	}

	for ( var i = 0; i < part.anchors_minus.length; i++ ){
		if (part.anchors_minus[i].attachedPart[part.attachedStatus] != undefined && part.anchors_minus[i].attachedPart[part.attachedStatus] >= 0){
			var attachedPartIndex = part.anchors_minus[i].attachedPart[part.attachedStatus];
			var attachedPart = part.parent.getPart(attachedPartIndex);
			
			if (!attachedPart){ console.error("ERROR: trying to detatch an invalid part (" + attachedPartIndex + ")"); continue; }
			
			var attachedAnchor = attachedPart.anchors_plus[part.anchors_minus[i].attachedAnchor[part.attachedStatus]];
			
			attachedAnchor.attachedPart[part.attachedStatus] = -2;
			attachedAnchor.attachedAnchor[part.attachedStatus] = -2;
		}
	}
	
	for ( var i = 0; i < part.anchors_plus.length; i++ ){
		if (!part.anchors_plus[i].attachedPart) continue;
		
		if (part.anchors_plus[i].attachedPart[part.attachedStatus] != undefined && part.anchors_plus[i].attachedPart[part.attachedStatus] >= 0){
			var attachedPartIndex = part.anchors_plus[i].attachedPart[part.attachedStatus];
			var attachedPart = part.parent.getPart(attachedPartIndex);
			
			if (!attachedPart){ console.error("ERROR: trying to detatch an invalid part (" + attachedPartIndex + ")"); continue; }
			
			var attachedAnchor = attachedPart.anchors_minus[part.anchors_plus[i].attachedAnchor[part.attachedStatus]];
			
			attachedAnchor.attachedPart[part.attachedStatus] = -2;
			attachedAnchor.attachedAnchor[part.attachedStatus] = -2;

			detatchPart ( attachedPart );
			
			part.anchors_plus[i].attachedPart[part.attachedStatus] = -2;
			part.anchors_plus[i].attachedAnchor[part.attachedStatus] = -2;
		}
	}
}

//Function to convert a part to json
function partToJSON ( part ) {
	var result = new Object();
	
	result.source = part.id;
	result.translate = part.position.slice(0);
	result.angle = part.angle;
	result.mirrorX = part.mirrorX;
	result.mirrorY = part.mirrorY;
	result.uid = part.uid;
	result.symmetric = part.symmetric;
	
	if (part.attachedStatus)
		result.attachedStatus = part.attachedStatus;
	
	result.anchors_plus = new Array();
	for ( var i = 0; i < part.anchors_plus.length; i++ ){
		result.anchors_plus[i] = new Object();
		
		result.anchors_plus[i].attachedPart = new Object();
		result.anchors_plus[i].attachedAnchor = new Object();
		
		for (p in part.anchors_plus[i].attachedPart){
			result.anchors_plus[i].attachedPart[p] = part.anchors_plus[i].attachedPart[p];
			result.anchors_plus[i].attachedAnchor[p] = part.anchors_plus[i].attachedAnchor[p];
		}
	}
	
	result.anchors_minus = new Array();
	for ( var i = 0; i < part.anchors_minus.length; i++ ){
		result.anchors_minus[i] = new Object();
		
		result.anchors_minus[i].attachedPart = new Object();
		result.anchors_minus[i].attachedAnchor = new Object();
		
		for (p in part.anchors_minus[i].attachedPart){
			result.anchors_minus[i].attachedPart[p] = part.anchors_minus[i].attachedPart[p];
			result.anchors_minus[i].attachedAnchor[p] = part.anchors_minus[i].attachedAnchor[p];
		}
	}

	return result;	
}

//Function to load a part from JSON
function partFromJSON ( data ) {
	var result = getPart ( data.source );
	if (!result) return false;
	
	result.position = vSum ( result.position, data.translate );
	result.angle = data.angle;
	result.mirrorX = data.mirrorX;
	result.mirrorY = data.mirrorY;
	result.symmetric = data.symmetric;
	
	if (data.uid != undefined){
		result.uid = data.uid;
		if (totParts <= result.uid) totParts = result.uid + 1;
	}
	
	if (data.attachedStatus)
		result.attachedStatus = data.attachedStatus;
	
	if (data.anchors_plus) for ( var i = 0; i < data.anchors_plus.length; i++ ) {
		var old = result.anchors_plus[i].slice(0);
		
		result.anchors_plus[i] = data.anchors_plus[i];
		for ( var l = 0; l < old.length; l++) result.anchors_plus[i][l] = old[l];
	}
	
	if (data.anchors_minus) for ( var i = 0; i < data.anchors_minus.length; i++ ) {
		var old = result.anchors_minus[i].slice(0);
		
		result.anchors_minus[i] = data.anchors_minus[i];
		for ( var l = 0; l < old.length; l++) result.anchors_minus[i][l] = old[l];
	}
	
	return result;
}
