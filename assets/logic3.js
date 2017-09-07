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
  var player1Ref = database.ref("/players/1");
  var player2Ref = database.ref("/players/2");
  var turnRef = database.ref("turn");

  var playerData = {};
  var playersarr = [];
  var playersNum = 0;
  var sessionPlayerData;
  var choice1 = "";
  var choice2 = ""; 

  var rpsArr = ["Rock", "Paper", "Scissors"];

//When the player hits start button this function executes
$("#start-btn").on("click", function(event){

 	var name = $("#player-name").val().trim();
 	var playerData = {"name": name, "wins": 0, "losses": 0};
 	playersRef.child(playersNum+1).set(playerData);
 	sessionStorage.setItem("playerKey", JSON.stringify(playersNum));
 	sessionStorage.setItem("playerData", JSON.stringify(playerData));
 	var playerId = JSON.parse(sessionStorage.getItem("playerKey"));
 	sessionPlayerData = JSON.parse(sessionStorage.getItem("playerData"));
 	console.log(sessionPlayerData);

 	$("#input").hide();
 	$("#player-greeting").html("Hi "+sessionPlayerData.name+" You player "+playerId);
 	   
});

//when the playrers are added or updated
playersRef.on("value", function(snapshot){

	playersNum = snapshot.numChildren();

	if(playersNum>=2){
		var playerTurn = JSON.parse(sessionStorage.getItem("playerKey"));
		console.log(playerTurn);
		database.ref().update({turn: playerTurn});

	}
	else{
		database.ref().child("turn").remove();
	}




});

/// when player one values change 
player1Ref.on("value", function(snap1){
	if(snap1.child("name").exists()){
		$("#display1").html(snap1.val().name);
		$("#display2").html("Waiting for player 2");
		$("#wins-losses1").html("Wins: "+snap1.val().wins+" Losses: "+snap1.val().losses);
	}

	if(snap1.child("choice").exists()){
		choice1 = snap1.val().choice;
	}
});

/// When player two values changes
player2Ref.on("value", function(snap2){
	if(snap2.child("name").exists()){
		$("#display2").html(snap2.val().name);
		$("#wins-losses2").html("Wins: "+snap2.val().wins+" Losses: "+snap2.val().losses);
	}
	if(snap2.child("choice").exists()){
		choice2 = snap2.val().choice;
	}

})


//When the turn changes
turnRef.on("value", function(turnSnap){
	console.log(turnSnap.val());
	console.log(JSON.parse(sessionStorage.getItem("playerKey")));
	
	var currentTurn = turnSnap.val();
	var currentPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
	if(currentTurn && currentPlayer ){
		if (currentPlayer === currentTurn){
			$("#turn").html("It is your turn");
			displayChoices(currentPlayer);
		}	
		else 
			$("#turn").html("Waiting for the other player to choose");
	}
})

///function to display the choices to the player whose turn to play
var displayChoices = function(num){

	var choices = $("<ul>");
	choices.css("list-style-type", "none");
	for(var i = 0; i<rpsArr.length; i++){
		var choice = $("<li>"+rpsArr[i]+"</li>");
		choice.addClass("choiceItem");
		choices.append(choice);
	}
	$("#choices-list"+num).html(choices);
}

///when the user cliclks on the choice it is updated in the database
$(document.body).on("click", ".choiceItem", function(){
	var userChoice = $(this).text();
	var currentPlayer = JSON.parse(sessionStorage.getItem("playerKey"));
	playersRef.child(currentPlayer).update({choice: userChoice});
	if(currentPlayer == 1)
		choice1 = userChoice;
	if(currentPlayer == 2)
		choice2 = userChoice;

});


////when the window unloads this function is excuted
window.onunload = function(event){
 
	var player = JSON.parse(sessionStorage.getItem("playerKey"));
	if(player){
 		playersRef.child(player).remove();
 		
	}	
 	sessionStorage.clear();


}






















