//BnDGames
//Github Game Off 2013
//-----------------------------------------------------------------
//polygons.js
//Utils to handle polygons
//-----------------------------------------------------------------

//Given the representation of vectors as arrays of two values,
//polygons are arrays of vectors

//Function to determine if a point is inside a polygon
//Sums the angles made by the point and adiacent vertices
//If the sum is 2PI, then the point is inside; else it is outside
//(algorithm found on http://paulbourke.net/geometry/polygonmesh)
function pointInsidePoly ( point, polygon ) {
	var tot = 0;//Total angle
	
	//Iterates through pairs of vertices
	for (var i = 0; i < polygon.length; i++){		
		var angle = vAngle ( vSubt ( polygon[i], point ) ) - vAngle ( vSubt ( polygon[(i + 1) % polygon.length], point ) );
		
		while (angle > Math.PI) angle -= Math.PI * 2;
		while (angle < -Math.PI) angle += Math.PI * 2;
		
		tot += angle;
	}
		
	if (Math.abs(tot) < Math.PI) return false;
	else return true;
}

//Function to check collision between two polygons
//Two polygons collide if at least one vertex of any of the two
//is inside the other.
function polyCollide ( a, b ) {
	var result = new Array();
	
	for ( var i = 0; i < a.length; i++)
		if (pointInsidePoly ( a[i], b )) result.push ( a[i] );
		
	for ( var i = 0; i < b.length; i++)
		if (pointInsidePoly ( b[i], a )) result.push ( b[i] );
		
	if (result.length > 0) return result;
	return false;
}

//Function to calculate the inertia moment of a polygon
function polyInertia ( poly, mass ) {
	var num = 0;//Fraction numerator
	var den = 0;//Fraction denominator
	
	for ( var i = 0; i + 1 < poly.length; i++){
		num += vCross ( poly[i + 1], poly[i] ) * ( vDot ( poly[i + 1], poly[i + 1] ) + vDot ( poly[i + 1], poly[i] ) + vDot ( poly[i], poly[i] ) );
		den += vCross ( poly[i + 1], poly[i] );
	}
	
	return (mass / 6) * (num / den);
}
