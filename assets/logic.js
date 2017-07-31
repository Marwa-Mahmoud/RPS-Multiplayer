  
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

  var playersNum = 0;
  //var turn = 0;
  var player = {name: "", wins: 0, losses: 0};
 
  var playersarr = [];

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


 $("#start-btn").on("click", function(event){

  event.preventDefault();

  $("#input").hide();

 	      player.name = $("#name").val().trim();
        playersRef.child((playersNum+1).toString()).set(player);


        if(playersNum === 2)
          database.ref().update({turn: 1});

        $("#turn").data("value", playersNum);
        console.log($("#turn").data("value"));
        $("#player-greeting").html("Hi "+player.name+" You are player"+playersNum);

    
 });

/*

if(playersNum === 0){ 
       playersRef.child((playersNum+1).toString()).set(player);
         //$("#player-greeting").html("Hi "+snapshot.val().name+" You are player"+playersNum);
        
     }  

        // else if(playersNum === 1){
else{
      player.name = $("#name").val().trim();

        //playersNum = 0;

        playersRef.child((playersNum+1).toString()).set(player);

        database.ref().update({turn: 1});
         //$("#player-greeting").html("Hi "+snapshot.val().name+" You are player"+playersNum);

    }

*/

  database.ref().on("value", function(snap){

    if (snap.child("turn").exists()){

        var turn  = snap.val().turn;

        console.log(turn);

        displayTurns(turn);

    }

  });

  //A function to display each players turn and the 
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

  }











