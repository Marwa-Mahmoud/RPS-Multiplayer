# RPS-Multiplayer

- When a player connects to the loads the website, the database is updated by the new connection

- The first player enters his name and press start:
	. Check from the database if this is the first or the second user.
	. A welocme statement apears to player one
	. The name of the player is displayed in the first player box to both users
	. The database is updated with the player's info

- The second player enters his name then press start:
	. The same previous steps are added for the second player

- When it is the first player turn then
the first player box is highlighted and  the options are displayed only for him

- The first player chooses 
- Then the second player box is highlighted and the options are displayed for the second player only
- The second player chooses

- The computer identifies the winner and displayes him in the middle box

- The wins and losses for each player is updated.
- The round resets with the new scores
- If there is a tie then the Game tie is displayed and the losses and wins are not updated.

- A player can send text to the other player and it is displayed to both of them.



*Questions:
1. How to delete the data of the disconnected player from the database?
2. What to do to limit the players to 2 only?


//check for navigation time API support
if (window.performance) {
  console.info("window.performance work's fine on this browser");
}
  if (performance.navigation.type == 1) {
    console.info( "This page is reloaded" );
  } else {
    console.info( "This page is not reloaded");
  }

//////////
sessionStorage 
if (sessionStorage.getItem("is_reloaded")) alert('Reloaded!');
sessionStorage.setItem("is_reloaded", true);


