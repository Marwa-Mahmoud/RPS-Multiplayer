  
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

//Initailizing variables
  var database = firebase.database();

  var playersRef = database.ref("/players");

  var playersNum = 0;
  
  var player = {name: "", wins: 0, losses: 0};
 
  var playersarr = [];
  var choices = ["Rock", "Paper", "Scissors"];

  var playersChoices = [];
  var playersDatabaseNames = [];


// When a child is added to the players folder in the database this function executes  
playersRef.on("child_added", function(snapshot, prevChildName){

  playersarr.push(snapshot.val());

  console.log(playersarr);
  playersNum = playersarr.length;

  $("#display1").html(playersarr[0].name);
   if(playersNum === 1)
          $("#display2").html("Waiting for player 2");
    else if(playersNum === 2)
          $("#display2").html(playersarr[1].name);
      
          
});

playersRef.on("child_changed", function(snapshot, prevChildName){

  console.log("child changed");
  console.log(prevChildName);
  console.log(snapshot.val().choice);
  var whoWon = 0;
  playersChoices.push(snapshot.val().choice);
  playersDatabaseNames.push(snapshot.val().name);
  if (playersChoices.length === 2){
      whoWon = checkAnswer(playersChoices);
      var winnerName = playersDatabaseNames[whoWon-1];
      console.log(winnerName);
      $("#display-result").html(winnerName+" Wins!");
  }




});

///When the player hits start button this function executes
 $("#start-btn").on("click", function(event){

  event.preventDefault();

  $("#input").hide();

 	      player.name = $("#name").val().trim();
        playersRef.child((playersNum+1).toString()).set(player);


        if(playersNum === 2)
          database.ref().update({turn: 1});

        $("#turn").data("value", playersNum);

        console.log($("#turn").data("value"));
        console.log(player.name);

        $("#player-greeting").html("Hi "+player.name+" You are player"+playersNum);

    
 });


//To determine whos turn is it, turn value is called from the database
  database.ref().on("value", function(snap){

    if (snap.child("turn").exists()){

        var turn  = snap.val().turn;

        console.log(turn);

        displayTurns(turn);

    }

  });

  //A function to display each players turn and which one we are waiting for 
  var displayTurns = function(turn){


        var whichPlayer= $("#turn").data("value");

        console.log(whichPlayer);

      if(turn === 1){
            if(whichPlayer === 1){
              $("#turn").html("It is your turn");
              
            }
            else
               $("#turn").html("waiting for the other player");
      }
      
      else{
          if(whichPlayer === 1)
            $("#turn").html("waiting for the other player");
          else
            $("#turn").html("It is your turn");


      }  

      displayChoices(whichPlayer);     

  }

//This is a function that displays the choices for the specific chosen player
  var displayChoices = function(pNum){

    console.log(pNum);
    for(var i=0; i<choices.length; i++){
      $("#choices-list"+pNum).children().eq(i).html(choices[i]);
    }


  }
///clicking on the choice updates the display for the player who made the choice
//the other player doesn't see the choice
//the database is updated with the specific user's choice
//a function is called to compare results
   $("li").click(function(){


        var userChoice = $(this).text();
      
        $(this).parent().replaceWith("<p>"+userChoice+"</p>");

        var whichPlayer= $("#turn").data("value");

        playersRef.child((whichPlayer).toString()).update({choice: userChoice}); 

        database.ref().update({turn: 2});
    });

   ///compare players choices and determine wins and losses
   //update relative wins and losses for each player in the database
   // Returns the number of the winner
   var checkAnswer = function(choicesArr){

        var wins1 = 0;
        var wins2 = 0;
        var losses1 = 0;
        var losses2 = 0;
        var ties = 0;
        var winner = 0;
        var choice1 = choicesArr[0];
        var choice2 = choicesArr[1];

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
        }

        playersRef.child("1").update({wins: wins1});
        playersRef.child("1").update({losses: losses1});
        playersRef.child("2").update({wins: wins2});
        playersRef.child("2").update({losses: losses2});
        return winner;

   }












