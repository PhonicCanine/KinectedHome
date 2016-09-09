console.log("It kinda doesn't not work")
var variable = "ayy lmao"
var Kinect2 = require('kinect2');
 
var kinect = new Kinect2();

var currentGestureDone = [] 

var currentBodyFrames

if(kinect.open()) {
    console.log("Kinect Opened");
    //listen for body frames
    kinect.on('bodyFrame', function(bodyFrame){
        //for(var i = 0;  i < bodyFrame.bodies.length; i++) {
            //if(bodyFrame.bodies[i].tracked) {
                //console.log(bodyFrame.bodies[i].joints[11]);
				currentBodyFrames = bodyFrame
            //}
        //}
		for(var i = 0;  i < bodyFrame.bodies.length; i++) {
            if(bodyFrame.bodies[i].tracked) {
                //console.log(bodyFrame.bodies[i].joints[11]);
				//currentBodyFrames = bodyFrame
				console.log("BODY IS TRACKED")
            }
        }
    });
 
    //request body frames
    kinect.openBodyReader();
 
    //close the kinect after 5 seconds
    setTimeout(function(){
        kinect.close();
        console.log("Kinect Closed");
    }, 50000);
}

setInterval(function(){
	console.log("1/2 Second")
	if (currentBodyFrames != undefined){
		if (currentGestureDone.length < 100){
			currentGestureDone.unshift(currentBodyFrames.bodies)
			//console.log("ADDED BODYFRAME")
				if (currentGestureDone.length == 9){
					console.log("10 frames recorded")
				}
			}else{
				currentGestureDone.pop()
				currentGestureDone.unshift(currentBodyFrames.bodies)
				checkForAllGestures(currentGestureDone)
			}
		}
},30)


function checkForAllGestures(currentGestureInfo){
	var arrayOfRightHandLocations = [[],[],[],[],[],[]]
	for (var i = 0; i < currentGestureInfo.length; i++){
		//console.log("IN FUNCTION")
		for (var body = 0; body < currentGestureInfo[i].length; body++){
			//console.log("LOOPING THROUGH BODIES")
			if (currentGestureInfo[i][body].tracked == true){
				arrayOfRightHandLocations[body].push([currentGestureInfo[i][body].joints[11].cameraX,currentGestureInfo[i][body].joints[11].cameraY])
				//console.log("APPENDED")
			}
		}
	}
	
	//console.log(arrayOfRightHandLocations)
	for (var i = 0; i < arrayOfRightHandLocations.length; i++){
		if (arrayOfRightHandLocations[i].length > 0){
			checkGesture(arrayOfRightHandLocations[i])
		}
	}
	
	//console.log("This function completed? How? It is like O(N^3)")
}

function checkGesture(liveData){
	
	firstdistance = returnDistanceBetweenPoints(liveData[0],liveData[1])
	
	var consecutiveMatches = 0
	
	var arrayOfVals = []
	
	for (var i = 0; i<liveData.length-1; i++) {

		var d = returnDistanceBetweenPoints(liveData[i], liveData[i+1])
		if (d != null){
			var dAsPercentage = d/firstdistance
			var angle = (270 - returnAngleBetweenPoints(liveData[i], liveData[i+1])) % 360
			//console.log((270 - angle) % 360)
			
			arrayOfVals.push([dAsPercentage,angle])
			
		}
	}
	console.log(arrayOfVals)
	
}

function returnAngleBetweenPoints(p1,p2){
	return Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180 / Math.PI;
}

function returnDistanceBetweenPoints(p1,p2){
	if (p1 != undefined && p2 != undefined){
		var x1 = p1[0]
		var y1 = p1[1]
	
		var x2 = p2[0]
		var y2 = p2[1]
	
		var d1 = Math.abs(x1-x2)
		var d2 = Math.abs(y1-y2)
	
		return Math.sqrt(Math.pow(d1,2) + Math.pow(d2,2))
	}else{
		return null
	}
}