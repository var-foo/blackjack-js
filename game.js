var BlackJack = function (){

};

/** @constructor */
var Card = function (suit, number){
    /** @returns {Number} The number of the card in the deck. (1-52) */
    this.getNumber = function (){
        return number;  
    };
    /** @returns {String} The name of the suit. "Hearts","Clubs","Spades", or "Diamonds." */
    this.getSuit = function (){
        var suitName = '';
        switch (suit){
            case 1:
                suitName = "Hearts";
                break;
            case 2:
                suitName = "Clubs";
                break; 
            case 3:
                suitName = "Spades";
                break; 
            case 4:
                suitName = "Diamonds";
                break;                
        }
        return suitName;
    };
    /** @returns {Number} The value of the card for scoring. */
    this.getValue = function (){
        var value = number;
        if (number >= 10){
            value = 10;
        }
        if(number === 1) {
            value = 11;
        }
        return value;
    };
    /** @returns {String} The full name of the card. "Ace of Spades" */
    this.getName = function (){
        var cardName = '';
        switch (number){
            case 1:
                cardName = "Ace";
                break;
            case 13:
                cardName = "King";
                break;
            case 12:
               cardName = "Queen";
                break;
            case 11:
                cardName = "Jack";
                break;
            default:
                cardName = number;
                break;
        }
        return cardName + " of " + this.getSuit();
    };
};

var Deck = function (){
    var i;
    var deckArray = [];
    var suit;
    var number;
    for (i=0;i<52;i++){
        suit = i%4+1;
        number = i%13+1;
        deckArray.push(new Card(suit,number));
    }
    /** @returns {Array} An array of Cards representing the shuffled version of the deck. Modifies the private instance of the array. */
    this.shuffle = function (){
        var o = deckArray;
        for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        deckArray = o;
        return this.getCards();
    };
    /** @returns {Array} Ann array of cards representing the Deck. */
    this.getCards = function (){
        return deckArray;
    };
    /** @returns {Card} Deals the top card off the deck. Removes it from the Deck. */
    this.deal = function (){
        return deckArray.pop();
    };
};

var Hand = function (){
    var cards = [];
    cards.push( gameDeck.deal(), gameDeck.deal());
    /** @returns {Array} The array of cards representing the hand. */
    this.getHand = function (){
        return cards;
    };
    /** @returns {Number} The score of the hand. */
    this.score = function (){
        var i;
        var score = 0;
        var cardVal = 0;
        var aces = 0;
        for (i=0;i<cards.length;i++){
            cardVal = cards[i].getValue();
            if (cardVal == 11) {
                aces += 1;
            }
            score += cardVal;
        }
        while (score > 21 && aces > 0){
            score -= 10;
            aces -=1;
        }
        return score;
    };
    /** @returns {String} Comma separated list of card names in the hand. */
    this.printHand = function (){
        var hand = [];
        var i;
        for (i=0;i<cards.length;i++){
            hand.push(cards[i].getName());
        }
        return hand.join();
    };
    /** Adds a card from the Deck into the Hand. */
    this.hitMe = function (){
        cards.push(gameDeck.deal());
    };
};

/** That bastard, the dealer */
var gameDealer = function (){
    var hand = new Hand();
    while (hand.score() < 17){
        hand.hitMe();
    }
    return hand;
};
/** The player */
var gameUser = function (){
    var hand = new Hand();
    while (hand.score() <= 21 && confirm(hand.printHand()+ " ("+ hand.score() +") Would you like to hit?")){
        hand.hitMe();
    }
    return hand;
};
/** Run the game and tally the score to determine the outcome. */
var declareWinner = function (userHand, dealerHand){
    var outcome = '';
    var dealerScore = dealerHand.score();
    var userScore = userHand.score();
    if (userScore > 21 || dealerScore === 21){
        outcome = "You lose!";
    }else if (dealerScore > 21 || userScore === 21 || userScore > dealerHand.score()){
        outcome = "You win!";
    }else if (dealerScore > userScore){
        outcome = "You lose!";
    }else if (dealerScore === userScore){
        outcome = "You tied!";
    }
    return outcome+"<br />Dealer: "+dealerHand.score()+"<br />You: "+userScore;
};
/* Set up our Game's Deck */
var gameDeck = new Deck();
/** Play BLACKJACK! */
(function (deck, dealer, player){
    /* make sure to shuffle. */
    deck.shuffle();
    /* kick off the dealing and output the winner. */
    document.write(
        declareWinner(player(), dealer())
    );
}(gameDeck, gameDealer, gameUser));