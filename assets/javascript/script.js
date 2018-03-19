// Initialize Firebase
var config = {
    apiKey: "AIzaSyBMPYFMjZvyC4C1jQ1ulUlfJB14xMGj424",
    authDomain: "train-scheduler-baber.firebaseapp.com",
    databaseURL: "https://train-scheduler-baber.firebaseio.com",
    projectId: "train-scheduler-baber",
    storageBucket: "train-scheduler-baber.appspot.com",
    messagingSenderId: "923465663899"
  };

var TrainStation = {
    
    // firebase.initializeApp(config);
    firebase: firebase.initializeApp(config),
    // Set ref to firebase
    database: firebase.database(),

    // METHOD - adds new trains to index.html schedule
    trainAdded: firebase.database().ref("trains/").on("child_added", function (snapshot) {

        // create TR and TD for Key only
        var trDiv = $("<tr>");
        var tdDivKey = $("<td>");

        // Add key (train name)
        tdDivKey.append(snapshot.key);
        trDiv.append(tdDivKey);

        // Add remaining train details in ForEach Loop
        snapshot.forEach(function(childSnapshot) {
            var tdDiv = $("<td>");
            tdDiv.append(childSnapshot.val());
            trDiv.append(tdDiv);
        })
        // Append new train to table#train-info
        $("#train-info").append(trDiv);
    }),

    // METHOD calculates time until arrival of next train (in mins)
    tMinutesUntilArrival: function (timeOfFirstTrain) {
        // Convert timeofFirstTrain (subtract 1 year)
        var convertedTime = moment(timeOfFirstTrain, "HH:mm").subtract(1, "years");
        // Calc difference between time of first train and now
        var diffTime = moment().diff(moment(convertedTime), "minutes");
        // Calc time apart
        var tRemainder = diffTime % tFrequency;
        // Return minutes until next train
        return tFrequency - tRemainder;
    },

    // METHOD calculates time until arrival of next train (in mins)
    tMinutesUntilArrival: function (timeOfFirstTrain, tFrequency) {
        // Convert timeofFirstTrain (subtract 1 year)
        var convertedTime = moment(timeOfFirstTrain, "HH:mm").subtract(1, "years");
        // Calc difference between time of first train and now
        var diffTime = moment().diff(moment(convertedTime), "minutes");
        // Calc time apart
        var tRemainder = diffTime % tFrequency;
        // Return minutes until next train
        return tFrequency - tRemainder;
    },

    // METHOD calculates the arrival time of next train 
    nextTrainArrivalTime: function (tMinutesUntilArrival) {
        return moment().add(tMinutesUntilArrival, "minutes").format("hh:mm A");
    },

    // METHOD to add train to index.html and firebase
    addTrain: function (trainName, destination, firstTrainTime, tFrequency) {
        
        // Call method tMinutes Until Arrival
        var timeUntilArrival = this.tMinutesUntilArrival(firstTrainTime, tFrequency);
        // Calls method next Train Arrival Time
        var nextTrainTime = this.nextTrainArrivalTime(timeUntilArrival);

        // Firebase Add
        this.database.ref("trains/" + trainName).set ({
            destination: destination,
            frequency: tFrequency,
            nextArrival: nextTrainTime,
            nextArrivalMins: timeUntilArrival
        })
    },

    // METHOD to clear fields after train added
    clearFields: function () {
        $("#train-name-input").val(""),
        $("#destination-input").val(""),
        $("#first-train-time-input").val(""),
        $("#frequency-input").val("")
    }
}


$("#add-train").on("click", function(e) {
    TrainStation.addTrain(
        $("#train-name-input").val(),
        $("#destination-input").val(),
        $("#first-train-time-input").val(),
        $("#frequency-input").val())
    TrainStation.clearFields();
});


















// // FUNCTION calculates time until arrival of next train (in mins)
// function tMinutesUntilArrival (timeOfFirstTrain) {
//     // Convert timeofFirstTrain (subtract 1 year)
//     var convertedTime = moment(timeOfFirstTrain, "HH:mm").subtract(1, "years");
//     // Calc difference between time of first train and now
//     var diffTime = moment().diff(moment(convertedTime), "minutes");
//     // Calc time apart
//     var tRemainder = diffTime % tFrequency;
//     // Return minutes until next train
//     return tFrequency - tRemainder;
// }

// // FUNCTION calculates the arrival time of next train 
// function nextTrainArrivalTime (tMinutesUntilArrival) {
//     return moment().add(tMinutesUntilArrival, "minutes").format("hh:mm");
// }


// // FUNCTION to add train to index.html and firebase
// function addTrain(trainName, destination, timeofFirstTrain, tFrequency) {
//     var timeUntilArrival = tMinutesUntilArrival(timeOfFirstTrain);
//     var nextTrainTime = nextTrainArrivalTime(timeUntilArrival);
//     console.log(trainName, destination, timeUntilArrival, nextTrainTime);
// }

