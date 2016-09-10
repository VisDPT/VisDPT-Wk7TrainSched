// 1. Create Firebase link
// 2. Create form & button for adding new trains to schedule  - then update the html + update the database
// 3. Create a way to retrieve trains from the  database.
// 4. Create a way to calculate the next arrival and minutes away- moment.js formatting 

//Firebase - initialize, Set,

//=================== Initialize Firebase ========================//
  var config = {
    apiKey: "AIzaSyA8vgqpOYD2uK0lLtWmKLpgAM9c4IPzmmQ",
    authDomain: "train-schedule-wk7-2bbfb.firebaseapp.com",
    databaseURL: "https://train-schedule-wk7-2bbfb.firebaseio.com",
    storageBucket: "train-schedule-wk7-2bbfb.appspot.com",
  };
  firebase.initializeApp(config);

  var database = firebase.database();

//=================== ON CLICK FUNCTION ========================//
$('#addTrainBtn').on("click", function(){
	//Grabbing the input info & testing
	var trainName = $('#trainNameInput').val().trim();
	var dest = $('#destinationInput').val().trim();
	var firstTrain = $('#firstTrainInput').val().trim();
	var freq = $('#frequencyInput').val().trim();

	// First Time (pushed back 1 year to make sure it comes before current time)
		var firstTrainConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
		console.log(firstTrainConverted);
	// Current Time
		var currentTime = moment();
		console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

	// Difference between the times
		var diffTime = moment().diff(moment(firstTrainConverted), "minutes");
		console.log("DIFFERENCE IN TIME: " + diffTime);

	// Time apart (remainder)
		var timeApart = diffTime % freq;
		console.log("TIME APART: " +timeApart);

	// Minute Until Train
		var minsAway = freq - timeApart;
		console.log("MINUTES TILL TRAIN: " + minsAway);

	// Next Train
		var nextArrival = moment().add(minsAway, "minutes")
		console.log("ARRIVAL TIME: " + moment(nextArrival).format("HH:mm"))

       
	//object
	var newTrain = {
		name: trainName,
		destination: dest,
		frequency: freq,
		next: nextArrival.format('HH:mm'), 
		mins: minsAway
	} 
	//added a .format to make it a string since firebase doesn't like properties being moment objects!
	//this fixed the push issue I was having before! But Firebase has a restriction where they don’t allow functions to be the value of objects getting put into the database. 
	//This is because Firebase just stores a bunch of JSON objects and functions are not valid JSON
	console.log(newTrain);

	// Uploads data to the database
	database.ref().push(newTrain);
	alert("Train successfully added");
	

	// Clears all of the text-boxes
	$("#trainNameInput").val("");
	$("#destinationInput").val("");
	$("#frequencyInput").val("");
	$("#firstTrainInput").val("");

	// Prevents moving to new page
	return false;

});

//======Firebase event: adds trains FB ; creates a row in the html for new entries==========//
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	console.log(childSnapshot.val());

	// Store everything into a variable.
	var trainName = childSnapshot.val().name;
	var dest = childSnapshot.val().destination;
	var freq = childSnapshot.val().frequency;
	var nextArrival = childSnapshot.val().next;
	var minsAway = childSnapshot.val().mins;

	// train Info
	console.log(trainName);
	console.log(dest);
	console.log(freq);
	console.log(nextArrival);
	console.log(minsAway);


	// Add each train's data into the table
$("#trainTable > tbody").append("<tr><td>" + trainName + 
									"</td><td>" + dest + 
									"</td><td>" + freq + 
									"</td><td>" + nextArrival + 
									"</td><td>" + minsAway + 
									"</td></tr>");

}, function (errorObject) {

		// consoles out the error
	  	console.log("The read failed: " + errorObject.code);
	
	});



