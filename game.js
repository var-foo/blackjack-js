// Game object
window.Game = {}


//List of players
Game.table = [];

Game.card = function(){
	// Suit - string
	this.suit;
	// Face value - string or number.
	//Put check here to see if it's a facecard.
	this.faceValue;
}

Game.Player = function(type, username){
	this.type = type;
	this.username = username;
	var totalMoney = 100;
	// dealer limit
	this.limit;
	//var that = this;
	var handValue;
	this.hand = [];
		
	if (this.type == "dealer"){
		//Set dealer specific properties and methods here
		this.limit = 16;
	}
	
	
	
	function getTotalMoney(){
		return totalMoney;
	}
	
	this.placeBet = function (amt){
		this.transact("subtract", amt);
		return "Bet of $" + amt + " placed.";
	}
	
	this.transact = function(action, amt){
		this.action = action;
		this.amt = amt;
		if(this.action == "add"){
			totalMoney = totalMoney + amt;
		} else{
			totalMoney = totalMoney - amt;
		}
	}
	
	
	this.getPlayerType = function(){
		return this.type;
	}
	
	this.getTotalMoney = function(){
		return totalMoney;
	}
	
	this.calculateTotalHand = function(){
		var value;
		
		return value;
	}
	
	this.init = function(){
		this.addToGame();
		
	}
	
	
	//Initialize here
	this.init();
	
}
Game.Player.prototype.getPlayerName = function(){
	return this.username;
};
Game.Player.prototype.addToGame = function(){
	var playername = this.getPlayerName();
	Game.table.push(this);
};

Game.Player.prototype.calculateHandValue = function(){
	var values = [];
	var totalHand = 0;
	for(var i = 0; i < this.hand.length; i++){
		values[i] = Game.calculateCardValue(this.hand[i]);
		totalHand = totalHand + values[i];
	}
	return totalHand;
	
}

Game.Deck = {
		
	cards : [],
	
	fullDeck : ['1-s', '1-c', '1-h', '1-d', '2-s', '2-c', '2-h', '2-d', '3-s', '3-c', '3-h', '3-d', '4-s', '4-c', '4-h', '4-d', '5-s', '5-c', '5-h', '5-d', '6-s', '6-c', '6-h', '6-d', '7-s', '7-c', '7-h', '7-d', '8-s', '8-c', '8-h', '8-d', '9-s', '9-c', '9-h', '9-d', '10-s', '10-c', '10-h', '10-d', '11-s', '11-c', '11-h', '11-d', '12-s', '12-c', '12-h', '12-d', '13-s', '13-c', '13-h', '13-d'],
	
	
	hitPlayer : function(player){
		this.player = player;
		var deck = Game.Deck;
		// Pop a card off the cards array and pass the value to the player
		var numCards = deck.getNumCards() - 1;
		var topCard = deck.cards[numCards];
		this.player.receiveCard(topCard);
		deck.cards.pop();
	},
	
	initialDeal : function(){
		//Pop two cards off the stack and pass the value of each to the player.
		for(var i = 0; i < Game.table.length; i++){
			var deck = Game.Deck;
			var currPlayer = Game.table[i];
			var currPlayerName = currPlayer.getPlayerName();
			var currPlayerType = currPlayer.getPlayerType();
			
			for(var j = 0; j < 2; j++){
				deck.hitPlayer(currPlayer);
				
			}
			var handValue = currPlayer.calculateHandValue();
			console.log(currPlayer.limit);
			if(currPlayerType == "dealer"){
				console.log("in dealer if");
				console.log(typeof(handValue));
				console.log(typeof(currPlayer.limit));
				/*while(handValue < currPlayer.limit){
					deck.hitPlayer(currPlayer);
					console.log("Hit dealer additionally");
				}*/
				
			}
			
		}
		
		

		console.log("cards are dealt");
	},
	
	fillDeck : function(){
		Game.Deck.cards = Game.Deck.fullDeck;
		return Game.Deck.cards;
	},
	
	shuffle : function(){
		Game.Deck.fillDeck();
		Game.Deck.cards.sort(function() { return 0.5 - Math.random() });
		return "cards are shuffled";
	},
	
	getNumCards : function(){
		return Game.Deck.cards.length;
	},
	
	init : function(){
		Game.Deck.shuffle();
	}
	
		
}

Game.calculateCardValue = function(cardId){
	this.cardId = cardId;
	var cardSplit = cardId.split("-");
	var cardNum = parseInt(cardSplit[0]);
	if(cardNum < 11){
		return cardNum;
	} else {
		return 10;
	}
}

Game.calculateWinner = function(){
	var i,
		j,
		player,
		playerName,
		playerTotal;
	this.playerTotals = [];
	
	for(i = 0; i < Game.table.length; i++ ){
		player = Game.table[i];
		console.log(player);
		playerName = player.getPlayerName();
		console.log("Player: " + playerName);
		playerTotal = player.calculateHandValue();
		console.log("PlayerTotal: " + playerTotal);
		if(playerTotal < 22){
			this.playerTotals.push(playerTotal);
		}
		
	}
	
	this.highestValue = Math.max.apply( Math, this.playerTotals );
	for(j = 0; j < this.playerTotals.length; j++){
		if(this.playerTotals[j] == this.highestValue){
			return Game.table[j].getPlayerName() + " is the winner.";
		}
	}
	Game.end();
	//return Game.table[this.highestValue].getPlayerName() + " is the winner.";
	
}

Game.end = function(){
	return "Game over.";
}

Game.Pot = {
	value : 0,
	add : function(amt){
		Game.Pot.value += amt;
	},
	
	awardPlayer : function(username){
		this.username = username;
		this.username.transact("add", Game.Pot.value);
		Game.Pot.value = 0;
	},
	
	getPotValue : function(){
		return Game.Pot.value;
	}
	
}

Game.Player.prototype.receiveCard = function(card){
	this.card = card;
	this.hand.push(this.card);
}


//Set up Players
var Dealer = new Game.Player('dealer', 'Dealer');
var Jim = new Game.Player('player', 'Jim');


//Initializers
Game.Deck.init();
Game.Deck.initialDeal();
