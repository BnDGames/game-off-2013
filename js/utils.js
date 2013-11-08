//Github Game Off 2013
//-----------------------------------------------------------------
//utils.js
//Various utilities
//-----------------------------------------------------------------

//Function to pad left a string to desired length
function pad ( str, char, length ) {
	var s = str;
	
	while ( s.length < length ) s = char + s;
	
	return s;
}
