  
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

  var playersWithChoices = [];

  var turn = 0;

  var restartRound = function(){

    console.log("round restarted");
      $("#display-result").html("");
      $("#choice1").html("");
       $("#choice2").html("");
      $("#choices-list1").hide();
      $("#choices-list2").hide();

      var playersWithChoices = [];

      console.log($("#turn").data("value"));

displayChoices(turn);

      database.ref().update({turn: 1});
      

  }


// When a child is added to the players folder in the database this function executes  
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
           database.ref().update({turn: 1});
      } 

      
});

// When any child or sub-child changes under the players folder in the database, this function executes
playersRef.on("child_changed", function(snapshot, prevChildName){

  console.log("child changed");
  console.log(prevChildName);
  console.log(snapshot.val().choice);

  var whoWon = 0;

  playersWithChoices.push(snapshot.val());
  if (playersWithChoices.length === 2){

      whoWon = checkAnswer(playersWithChoices[0].choice, playersWithChoices[1].choice);
      if(whoWon === 0)
         $("#display-result").html("It's a tie!");

      else{ 
        var winnerName = playersWithChoices[whoWon-1].name;
        console.log(winnerName);
        $("#display-result").html(winnerName+" Wins!");
         console.log(playersWithChoices);

      $("#wins-losses1").html("Wins: "+playersWithChoices[2].wins+" Losses: "+playersWithChoices[2].losses);
      $("#wins-losses2").html("Wins: "+playersWithChoices[3].wins+" Losses: "+playersWithChoices[3].losses);
      }
     

         setTimeout(restartRound, 3000);
         

  }





});

///When the player hits start button this function executes
 $("#start-btn").on("click", function(event){

  event.preventDefault();

  $("#input").hide();

 	      player.name = $("#name").val().trim();
        playersRef.child((playersNum+1).toString()).set(player);

        $("#turn").data("value", playersNum);

        console.log($("#turn").data("value"));
        console.log(player.name);

        $("#player-greeting").html("Hi "+player.name+" You are player"+playersNum);

    
 });


//To determine whos turn is it, turn value is called from the database
  database.ref().on("value", function(snap, prevChild){

    if (snap.child("turn").exists()){

        turn  = snap.val().turn;

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
              $("#choices-list1").show();
              
            }
            else
               $("#turn").html("waiting for the other player");
      }
      
      else{
          if(whichPlayer === 1)
            $("#turn").html("waiting for the other player");
          else{
           $("#turn").html("It is your turn");
           $("#choices-list2").show(); 
         }


      }  

      displayChoices(whichPlayer); 
      

  }

//This is a function that displays the choices for the specific chosen player
  var displayChoices = function(pNum){

/* 
    if($("#turn").data("value") === "1"){
        $("#choice")("<ul id='choices-list1'><li>Rock</li><li>Paper</li><li>Scissors</li></ul>");
  */     
    console.log(pNum);
    console.log($("#choices-list"+pNum));

    

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
      
        $(this).parent().hide();

        

        var whichPlayer= $("#turn").data("value");

        $("#choice"+whichPlayer).html(userChoice);
        $("#choice"+whichPlayer).show();

        playersRef.child((whichPlayer).toString()).update({choice: userChoice}); 


        database.ref().update({turn: 2});
    });

   ///compare players choices and determine wins and losses
   //update relative wins and losses for each player in the database
   // Returns the number of the winner
   var checkAnswer = function(choice1, choice2){

        var wins1 = 0;
        var wins2 = 0;
        var losses1 = 0;
        var losses2 = 0;
        var ties = 0;
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












