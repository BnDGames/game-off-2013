//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//parts.js
//Unit parts definition
//-----------------------------------------------------------------

//Unit part object
var Part = function () {
	//Part vertices
	//Part is composed by an array of vectors, each representing a vertex
	this.vertices = new Array();
	
	//Position and rotation are relative to the unit
	//owning the part
	this.position = [0, 0];
	this.angle = 0;
	
	//Mirroring
	this.mirrorX = false;
	this.mirrorY = false;
	
	//Part graphics
	this.fill = "#808080";
	
	this.borderWidth = 0;
	this.border = "#FFFFFF";
	
	this.draw = new Array();

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
//Once all parts have been loaded, the function done is called
function loadParts ( done ) {
	$.getJSON ( "data/parts/list.json?" + Date.now(),
	
				function (data) {
					partsCount = data.length;//Stores parts count (needed to know if all parts have been loaded)
					
					for (var i = 0; i < data.length; i++){
						$.getJSON ( data[i],
									function ( d ) {
										parts.push ( d );
										partsLoaded++;
										
										if (partsLoaded >= partsCount) done();//Calls done function when done
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
			
			return result;
		}
	}
	
	return 0;
}
