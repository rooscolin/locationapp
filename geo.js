//made use of open source code found online
//this is a modification for our purposes.
//The program will get the current location of the user and display that position in coordinates. 
//The program will then calculate using haversines formula the distance between surrent location, and oshawa ottawa and the cn tower.
function getPosition(params)
{
	try
	{
		clearOutput();
		
		//First test to verify that the browser supports the Geolocation API
		if (navigator.geolocation !== null)
		{
			//Configure optional parameters
			var options;
			if (params)
			{
				options = eval("options = " + params + ";");
			} 
			else {
				// Uncomment the following line to retrieve the most accurate coordinates available
				// options = { enableHighAccuracy : true, timeout : 60000, maximumAge : 0 };
			}
			navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, options);
		} 
		else {
			errorMessage("HTML5 geolocation is not supported.");
		}
	} 
	catch (e) {
		errorMessage("exception (getPosition): " + e);
	}
}

/**
 * Calculates the  distance between two location coordinates.  There are various ways 
 * of implementing proximity detection.  This method uses trigonometry and the 
 * Haversine formula to calculate the distance between two points 
 * (current & target location) on a spehere (Earth).
 *
 * @param current_lat - horizontal position (negative = South) of current location
 * @param current_lon - vertical position (negative = West) of current location
 * @param target_lat  - horizontal position (negative = South) of destination location
 * @param target_lat  - vertical position (negative = West) of destination location
 */
function distanceBetweenPoints(current_lat, current_lon, target_lat, target_lon)
{
	var distance = 0;
	try
	{
		//Radius of the earth in meters:
		var earth_radius = 6378137;
		
		//Calculate the distance, in radians, between each of the points of latitude/longitude:
		var distance_lat = (target_lat - current_lat) * Math.PI / 180;
		var distance_lon = (target_lon - current_lon) * Math.PI / 180;


		var a = Math.pow(Math.sin(distance_lat / 2), 2) + (Math.cos(current_lat * Math.PI / 180) * Math.cos(target_lat * Math.PI / 180) * Math.pow(Math.sin(distance_lon / 2), 2));
		var b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		distance = Math.floor(earth_radius * b);
	} 
	catch (e) {
		errorMessage("exception (distanceBetweenPoints): " + e);
	}
	return distance;
}


/**
 * Displays the location information retrieved from the geolocation service.
 *
 */
function displayLocationInfo(coordinates)
{
	try
	{
		var lat = coordinates.latitude;
		var lon = coordinates.longitude;
		var alt = coordinates.altitude;
	
		var locationInfo = "<h3>My current location:</h3>";
		locationInfo += "<b>Latitude:</b> " + coordinates.latitude + "<br/>";
		locationInfo += "<b>Longitude:</b> " + coordinates.longitude + "<br/>";
		locationInfo += "<b>Altitude:</b> " + coordinates.altitude + "<br/>";
	
	    clearOutput();
		displayOutput("<p>" + locationInfo + "</p>");
	} 
	catch (e) {
		errorMessage("exception (displayLocationInfo): " + e);
	}
}

/**
 * Display info about the give users proximity to three cities: Ottawa, Oshawa, Cn tower
 *
 * @param coords (Coordinates) - geographic information returned from geolocation service
 *     
 */
function displayContentForLocation(coordinates)
{
	try
	{
		var locationSpecificContent = "<h3>Location-specific info:</h3>";
		
		var latitude = coordinates.latitude;
		var longitude = coordinates.longitude;
		var accuracy = coordinates.accuracy;

		//If a user is within 25km of Dallas, they are assumed to be in Oshawa, Canada:
		//Oshawa is located at (43.8720421, -78.8961338)
		var oshawa = distanceBetweenPoints(latitude, longitude, 43.8720421, -78.8961338);
		if (oshawa <= (accuracy + 25000))
		{
			locationSpecificContent += "<div>You are in Oshawa Ontario.</div>";
		} 
		else {
			oshawa = (oshawa/1000).toFixed(2);
			locationSpecificContent += "<div>You are " + oshawa + " km from Oshawa Ontario.</div>";
		}
		
		//If a user is within 25km of CNtower, they are assumed to be in CN towe
		//CN Tower  is located at (43.6429, -79.3865)
		var cn = distanceBetweenPoints(latitude, longitude, 43.6429, -79.3865);
		if (cn <= (accuracy + 25000))
		{
			locationSpecificContent += "<div>You are at the CN Tower.</div>";
		} 
		else {
			cn = (cn/1000).toFixed(2);
			locationSpecificContent += "<div>You are " + cn + " km from CN Tower.</div>";
		}
		
		//If a user is within 25km of Ottawa, they are assumed to be in Ottawa, Ontario:
		//Ottawa is located at (45.4214,-75.6919)
		var ottawa = distanceBetweenPoints(latitude, longitude, 45.4214,-75.6919);
		if (ottawa <= (accuracy + 25000))
		{
			
			locationSpecificContent += "<div>You are in Ottawa</div>";
		} 
		else {
			ottawa = (ottawa/1000).toFixed(2);
			locationSpecificContent += "<div>You are " + ottawa + " km from Ottawa Ontario</div>";
		}
		
		displayOutput("<p>" + locationSpecificContent + "</p>");
	} 
	catch (e) {
		errorMessage("exception (displayContentForLocation): " + e);
	}
}

/**
 * Call back function used to process the Position object returned by the Geolocation service
 *
 * @params position (Position) - contains geographic information acquired by the geolocation service.
 */

function geolocationSuccess(position) 
{
	try
	{
		var coordinates = position.coords;
				
		displayLocationInfo(coordinates);
		
		displayContentForLocation(coordinates);
			
	} 
	catch (e) {
		errorMessage("exception (geolocationSuccess): " + e);
	}
}

/**
 * Call back function raised by the Geolocation service when an error occurs
 *

 */
function geolocationError(posError)
{
	try
	{
		if (posError)
		{
			switch(posError.code)
			{
				case posError.TIMEOUT:
					errorMessage("TIMEOUT: " + posError.message);
					break;
				case posError.PERMISSION_DENIED:
					errorMessage("PERMISSION DENIED: " + posError.message);
					break;
				case posError.POSITION_UNAVAILABLE:
					errorMessage("POSITION UNAVAILABLE: " + posError.message);
					break;
				default:
					errorMessage("UNHANDLED MESSAGE CODE (" + posError.code + "): " + posError.message);
					break;
			}
		}
	} 
	catch (e) {
		errorMessage("Exception (geolocationError): " + e);
	}
}

/**
 * Helper methods to display text on the screen
 */
function clearOutput()
{
	var ele = document.getElementById("geolocationInfo");
	if (ele)
	{
		ele.innerHTML = "";
	}
}
function displayOutput(output)
{
	var ele = document.getElementById("geolocationInfo");
	if (ele)
	{
		ele.innerHTML += "<div>" + output + "</div>";
	}
}

function errorMessage(msg)
{
	displayOutput("<span class='color:red'><b>Error</b>:" + msg + "</span>");
}


