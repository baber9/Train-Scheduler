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

        // Grab frequency
        var tFrequency = snapshot.child("frequency").val();

        // Grab firstTrain (time)
        var firstTrainTime = snapshot.child("firstTrain").val();

        // Calc minutes until arrival (call Method)
        var timeUntilArrival = TrainStation.tMinutesUntilArrival(firstTrainTime, tFrequency);

        // Calc next train arrival (call Method)
        var nextTrainTime = TrainStation.nextTrainArrivalTime(timeUntilArrival);

        // Update next train arrival and minutes until arrival
        snapshot.ref.update ({
            nextArrival: nextTrainTime,
            nextArrivalMins: timeUntilArrival
        })

        // create TR and TD for Key only
        var trDiv = $("<tr>");
        var tdDivKey = $("<td>");

        // Add key (train name)
        tdDivKey.append(snapshot.key);
        trDiv.append(tdDivKey);


        // Add remaining train details in ForEach Loop, except for firstTrain
        snapshot.forEach(function(childSnapshot) {
            if (childSnapshot.key != "firstTrain") {
                var tdDiv = $("<td>");
                tdDiv.append(childSnapshot.val());
                trDiv.append(tdDiv);

                // If Minutes to Arrival < 10, highlight in red
                if(childSnapshot.key === "nextArrivalMins" && childSnapshot.val() < 10) {
                    trDiv.addClass("danger");
                } else {
                    trDiv.removeClass("danger");
                }
            }
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

    // ONLY ADD TRAIN, CALCULATIONS IN CHILD_ADDED
    addTrain: function (trainName, destination, firstTrainTime, tFrequency) {
        
        var validTrainTime = this.validateTrainTime(firstTrainTime);
        var validFrequency = this.validateFrequency(tFrequency);
        if (validTrainTime && validFrequency) {

            // SHOULD MOVE THIS TO CHILD_ADDED--------

            // Call method tMinutes Until Arrival
            var timeUntilArrival = this.tMinutesUntilArrival(firstTrainTime, tFrequency);
            // Calls method next Train Arrival Time
            var nextTrainTime = this.nextTrainArrivalTime(timeUntilArrival);

            // --------------------------------------

            // Firebase Add
            this.database.ref("trains/" + trainName).set ({
                destination: destination,
                frequency: tFrequency,
                firstTrain: firstTrainTime,
                nextArrival: nextTrainTime,
                nextArrivalMins: timeUntilArrival
            })
            this.clearFields();
        }
    },

    // METHOD to clear fields after train added
    clearFields: function () {
        $("#train-name-input").val(""),
        $("#destination-input").val(""),
        $("#first-train-time-input").val(""),
        $("#frequency-input").val("")
    },

    // METHOD to validate FirstTrainTime form entry
    validateTrainTime: function (ftrain) {
        var ftrainHours = ftrain.substr(0, ftrain.indexOf(":"));
        var ftrainMins = ftrain.slice(-2);
        if (ftrain === "" 
          || ftrain.length > 5 
          || ftrain.length < 4
          // ':' doesn't exist 
          || ftrain.indexOf(":") === -1
          // the 3rd char from the last is not a ':' 
          || ftrain.slice(-3, -2) != ":" 
          // the hours is NaN
          || isNaN(ftrainHours)
          // the mins is NaN 
          || isNaN(ftrainMins) 
          || ftrainHours > 23 
          || ftrainHours < 0 
          || ftrainMins > 59 
          || ftrainMins < 0) {
            $("#first-train").addClass("has-error");
            return false;
        } else {
            $("#first-train").removeClass("has-error");
            return true;
        }
    },

    // METHOD to validate Frequency form entry
    validateFrequency: function (freq) {
        if (isNaN (freq) 
          || freq < 1 
          || freq > 10080) {
            $("#frequency").addClass("has-error");
            return false;
        } else {
            $("#frequency").removeClass("has-error");
            return true;
        }
    }
}

// This on-click function will start the addTrain method from the TrainStation Object
$("#add-train").on("click", function(e) {
    e.preventDefault();
    TrainStation.addTrain(
        $("#train-name-input").val(),
        $("#destination-input").val(),
        $("#first-train-time-input").val(),
        $("#frequency-input").val())
});

// ONLOAD UPDATE TRAIN TIMES, CONTINUE EVERY MIN???
    // CREATE A NEW METHOD CALLED UPDATE TIMES
// USER INTERVALS FROM DAY 9 ACTIVITIES
// MAKE TR A DIFF COLOR WHEN LESS THAN 10 MINS

// MOVE CALCULATIONS INTO 'CHILD-ADDED'













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

