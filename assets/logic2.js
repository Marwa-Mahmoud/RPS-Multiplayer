 
///Database preparations  

  var config = {
    apiKey: "AIzaSyASluNVb_ZrdB8MsWcu7EVsla7W6lz8hEk",
    authDomain: "rps-multiplayer-9e95a.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-9e95a.firebaseio.com",
    projectId: "rps-multiplayer-9e95a",
    storageBucket: "",
    messagingSenderId: "209832979344"
  };
  firebase.initializeApp(config);

  var database = firebase.database();
  var playersRef = database.ref("/players");

  var player = {name: "", wins: 0, losses: 0};
  var playersarr = [];
  var playersWithChoices = [];

  var turn = 0;

  var playersNum = 0;
  var choices = ["Rock", "Paper", "Scissors"];


var user = database.auth().currentUser;
console.log(user);

var restartRound = function(){

	turn = 1;
	//whichPlayer = 1;
	$("#display-result").html("");
	$("#choice1").html("");
	$("#choice2").html("");
	playersWithChoices = [];

	database.ref().update({turn: turn});

	//displayTurns(turn);

	//displayChoices(whichPlayer);

}


//When the player hits start button this function executes
$("#start-btn").on("click", function(event){

  	event.preventDefault();

  	

 	player.name = $("#name").val().trim();

    playersRef.child((playersNum+1).toString()).set(player);


    $("#turn").data("value", playersNum);

    console.log(playersNum);

    $("#input").hide();

	$("#player-greeting").html("Hi "+player.name+" You are player"+playersNum);

    
});




playersRef.on("child_added", function(snapshot, prevChildName){

  playersarr.push(snapshot.val());

  console.log(playersarr);

  playersNum = playersarr.length;

  $("#display1").html(playersarr[0].name);
   if(playersNum === 1){
          $("#display2").html("Waiting for player 2");
          $("#wins-losses1").html("Wins: 0 Losses: 0");
    }      
    else if(playersNum === 2){
          $("#display2").html(playersarr[1].name);
          $("#wins-losses2").html("Wins: 0 Losses: 0");

          restartRound();
          console.log("round restarted");
           
      } 

      
});

// When any child or sub-child changes under the players folder in the database, this function executes
playersRef.on("child_changed", function(snapshot, prevChildName){

	console.log("players child changed");
	var whoWon = 0;
	playersWithChoices.push(snapshot.val());
	console.log(playersWithChoices);

	if (playersWithChoices.length === 2){

	whoWon = checkAnswer(playersWithChoices[0].choice, playersWithChoices[1].choice);

	showResult(whoWon);

	 //$("#wins-losses1").html("Wins: "+playersWithChoices[2].wins+" Losses: "+playersWithChoices[2].losses);
     //$("#wins-losses2").html("Wins: "+playersWithChoices[3].wins+" Losses: "+playersWithChoices[3].losses);
     setTimeout(restartRound, 3000);

	}	


});	

database.ref().on("child_changed", function(snap){
	console.log(snap.val());

	if(snap.child("1").exists()){
		$("#wins-losses1").html("Wins: "+snap.val()[1].wins+" Losses: "+snap.val()[1].losses);

	}

	if(snap.child("2").exists()){
		$("#wins-losses2").html("Wins: "+snap.val()[2].wins+" Losses: "+snap.val()[2].losses);

	}
});


///A function to display who won
var showResult = function(winnerNum){

	if(winnerNum === 0){
         $("#display-result").html("It's a tie!");
         setTimeout(restartRound, 3000);
		}
      else{ 
        var winnerName = playersarr[winnerNum-1].name;
        console.log(winnerName);
        $("#display-result").html(winnerName+" Wins!");
	}
}



  //A function to display each players turn and which one we are waiting for 
var displayTurns = function(turn){

	var whichPlayer= $("#turn").data("value");

	if(turn === 1){
            if(whichPlayer === 1){
              $("#turn").html("It is your turn");
              //$("#choices-list1").show();
              
            }
            else
               $("#turn").html("waiting for the other player");
      }
      
      else if (turn === 2){
          if(whichPlayer === 1)
            $("#turn").html("waiting for the other player");
          else{
           $("#turn").html("It is your turn");
           //$("#choices-list2").show(); 
         }


      }  

    
};

var displayChoices = function(pNum){

	if($("#turn").data("value")=== pNum){
    	for(var i=0; i<choices.length; i++){
    		var choice = $("<p class='choice'>"+choices[i]+"</p>");
      		$("#choices-list"+pNum).append(choice);
    	}
    	//$("#choices-list"+pNum).show();
 	}
}


$(document.body).on("click", ".choice", function() {

    var userChoice = $(this).text();
      
   
    $(this).parent().next().html(userChoice);
     $(this).parent().empty();

    var whichPlayer= $("#turn").data("value");
	//$("#choice"+whichPlayer).html(userChoice);

        //$("#choice"+whichPlayer).show();

    playersRef.child((whichPlayer).toString()).update({choice: userChoice}); 

    
    	 turn++
     	database.ref().update({turn: turn});

  
    });


//To determine whos turn is it, turn value is called from the database
  database.ref("/turn").on("value", function(snap){

  	console.log("turn is updated");

  	var turn = snap.val();
  	console.log(turn);

  	if(turn){
		var whichPlayer = 0;

  		if (turn === 1){
  			whichPlayer = 1;
  			displayTurns(turn);
  		displayChoices(whichPlayer);
  		}
  		else if(turn === 2){
  			whichPlayer = 2;
  			displayTurns(turn);
  			displayChoices(whichPlayer);
  			
  		}
  		

  	}
  });

///compare players choices and determine wins and losses
//update relative wins and losses for each player in the database
// Returns the number of the winner
  var wins1 = 0;
        var wins2 = 0;
        var losses1 = 0;
        var losses2 = 0;
        var ties = 0;
var checkAnswer = function(choice1, choice2){

      
        var winner = 0;
       

        console.log(choice1, choice2)

        if ((choice1 === "Rock") && (choice2 === "Scissors")) {

          wins1++;
         losses2++
         winner = 1; 

        } else if ((choice1 === "Rock") && (choice2 === "Paper")) {

          wins2++;
          losses1++;
          winner = 2;

        } else if ((choice1 === "Scissors") && (choice2 === "Rock")) {

          wins2++;
          losses1++;
          winner = 2;

        } else if ((choice1 === "Scissors") && (choice2 === "Paper")) {

           wins1++;
           losses2++;
           winner = 1;

        } else if ((choice1 === "Paper") && (choice2 === "Rock")) {

           wins1++;
           losses2++;
           winner = 1;

        } else if ((choice1 === "Paper") && (choice2 === "Scissors")) {

           wins2++;
           losses1++;
           winner = 2;

        } else if (choice1 === choice2) {
          ties++;
          winner = 0;
        }

        playersRef.child("1").update({wins: wins1});
        playersRef.child("1").update({losses: losses1});
        playersRef.child("2").update({wins: wins2});
        playersRef.child("2").update({losses: losses2});
        return winner;

   }
/*
   var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated
// every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);
    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

*/






















