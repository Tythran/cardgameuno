
const player_deck = document.getElementById("player_deck") // Player Hand Div
const cpu_deck = document.getElementById("cpu_deck") // CPU Hand div
const discard_pile = document.getElementById("discard") // Discard Pile
const main_deck = document.getElementById("deck") // Main Draw Dick
const alert = document.getElementById('inner_alert') // Alert Text
const alertDiv = document.getElementById('alert') // Alert Div

const SUITS = ['Red', 'Blue', 'Green', 'Yellow']
const VALUES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
let player_Hand = []
let cpu_Hand = []
let discardPile = []
let last_suit // Suit of Card on top of Discard
let last_value // Value of Card on top of Discard
let clickedSuit // Suit of card that was clicked
let clickedValue // Value of Card that was Clicked

// Checks if anyone has won and does the appropriate action
function checkWin(){

    if (player_Hand.length <= 0){
        alertDiv.classList.remove("hide")
        alert.innerHTML = "YOU WIN"
    }
    else if (cpu_Hand.length <= 0){
        alertDiv.classList.remove("hide")
        alert.innerHTML = "YOU LOSE"
    }
}

// Initializes a deck class and actions that can be performed on the deck
class Deck {
    constructor(cards = newDeck()) {
        this.cards = cards
    }

    // Pops a card off the top of the deck and if it is the first card it sets the variables
    draw() {

        if (this.deckSize() === 62) {

            last_suit = this.cards[0].suit
            last_value = this.cards[0].value

        }
        return this.cards.shift()

    }

    // Gets the Current Deck Size
    deckSize(){

        return this.cards.length

    }

    // Shuffles Deck
    shuffle() {

        for (let i = this.deckSize() - 1; i > 0; i--) {

            const newIndex = Math.floor(Math.random() * (i + 1))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }
}

class Card {
    constructor(suit, value, visibility) {
        this.value = value
        this.suit = suit
        this.visibility = visibility
    }
    get cardColor() {

        if (this.visibility === false) {
            return 'black'
        }
        else if (this.suit === 'Red'){
            return 'red'
        }
        else if (this.suit === 'Green'){
            return 'green'
        }
        else if ( this.suit === 'Blue'){
            return 'blue'
        }
        else if (this.suit === 'Yellow') {
            return 'yellow'
        }

    }

    // Uno Card Template for the Discard Pile
    discardHTML(){

        //<div class="card-panel small red">
//                 <div class="upper_left">
//                     9
//                 </div>
//                 <div class="circle white">
//                     <div class="inner_text">
//                         9
//                     </div>
//                 </div>
//             </div>

        const cardDiv = document.createElement('div')
        const cardDivUpperLeft = document.createElement('div')
        const cardDivCircle = document.createElement('div')
        const cardDivCircleText = document.createElement('div')

        cardDiv.classList.add("card-panel", this.cardColor, "discard")
        cardDiv.onclick = this.playCard()

        if (this.visibility === true) {
            cardDiv.append(cardDivUpperLeft)
            cardDivUpperLeft.classList.add("upper_left")
            cardDivUpperLeft.innerHTML = this.value
        }

        cardDiv.append(cardDivCircle)
        cardDivCircle.classList.add("circle", "white")
        cardDivCircle.append(cardDivCircleText)

        if (this.visibility === true) {
            cardDivCircleText.classList.add("inner_text")
            cardDivCircleText.innerHTML = this.value
        }

        return cardDiv

    }

    // If a Card is clicked it will call this Mouse Event
    playCard() {
        return (MouseEvent) => {

            // Checks if anyone has won
            checkWin()

            // Sets the Clicked Values
            clickedValue = this.value
            clickedSuit = this.suit

            // Checks to see if it is a valid play for the current discard top card
            if ((clickedSuit === last_suit || this.value === last_value) || ((this.value === last_value) && (this.suit === last_suit))) {

                console.log(this.suit)
                console.log(this.value)

                // Finds the card that matches what you have clicked
                let find = player_Hand.find(this.CallBackToFindCard)
                console.log(find)

                // Stores the index of the clicked card for removal
                const index = player_Hand.indexOf(find)

                // Pushes the clicked card to the discard pile and displays on top
                discardPile.push(find)
                discard_pile.append(find.discardHTML())

                // Sets the new discard top card values
                last_suit = discardPile[discardPile.length - 1].suit
                last_value = discardPile[discardPile.length - 1].value

                // Debug Code
                console.log(discardPile)
                console.log(last_suit)
                console.log(last_value)
                console.log(index)

                // CPU Play Delayed by 1000ms
                window.setTimeout(() => {

                    console.log("CPU")

                    // Finds a card that matches the top of the discard pile
                    let findCPU = cpu_Hand.find(this.CallBackToFindCardCPU)
                    const indexCPU = cpu_Hand.indexOf(findCPU)

                    // If a card is found in the CPU deck then play it
                    if (findCPU != undefined) {

                        // Debug
                        console.log(last_value, last_suit)
                        console.log(findCPU)

                        // Flips Card and places on top of the Discard Pile
                        cpu_Hand[indexCPU].visibility = true
                        discardPile.push(findCPU)
                        discard_pile.append(findCPU.discardHTML())

                        // Sets new top of the Discard Pile Values
                        last_suit = discardPile[discardPile.length - 1].suit
                        last_value = discardPile[discardPile.length - 1].value

                        // Re-Renders the CPU hand to show a card gone
                        cpu_Hand.splice(indexCPU, 1);
                        cpu_deck.innerHTML = " "
                        for (let i = 0; i <= cpu_Hand.length; i++) {

                            cpu_deck.append(cpu_Hand[i].getHTML())

                        }
                    }
                    else {

                        // If a card not found then it automatically pulls a card from the discard pile
                        deck.cards[0].visibility = false
                        cpu_Hand.push(deck.draw())
                        cpu_deck.innerHTML = " "
                        for (let i = 0; i <= cpu_Hand.length; i++) {

                            cpu_deck.append(cpu_Hand[i].getHTML())

                        }

                    }
                // Waits 1000ms before playing so it isn't instant
                }, 1000)

                // Re-Renders Player Hand to show removal of cards
                player_Hand.splice(index, 1);
                player_deck.innerHTML = " "
                for (let i = 0; i <= player_Hand.length; i++) {

                    player_deck.append(player_Hand[i].getHTML())

                }

                // If player tries to play a card that doesn't match the suit, or color, or both then it will alert
            } else {

                console.log(alertDiv)
                alertDiv.classList.remove("hide")
                alert.innerHTML = "Invalid Play"
                window.setTimeout(() => {
                    alertDiv.classList.add("hide")
                }, 1500)

            }

        };
    }

    // Finds the card that matches what you have clicked (CallBack Func for Mouse Event)
    CallBackToFindCard(card){

        return card.suit === clickedSuit && card.value === clickedValue

    }
    // Finds the first card that matches either the suit or color from the CPU deck to be played
    CallBackToFindCardCPU(card){

        return card.suit === last_suit || card.value === last_value

    }
    // Card Template for CPU and Player Cards
    getHTML(){

        //<div class="card-panel small red">
//                 <div class="upper_left">
//                     9
//                 </div>
//                 <div class="circle white">
//                     <div class="inner_text">
//                         9
//                     </div>
//                 </div>
//             </div>

        const cardDiv = document.createElement('div')
        const cardDivUpperLeft = document.createElement('div')
        const cardDivCircle = document.createElement('div')
        const cardDivCircleText = document.createElement('div')

        cardDiv.classList.add("card-panel", this.cardColor, "small")
        cardDiv.onclick = this.playCard()

        if (this.visibility === true) {
            cardDiv.append(cardDivUpperLeft)
            cardDivUpperLeft.classList.add("upper_left")
            cardDivUpperLeft.innerHTML = this.value
        }

        cardDiv.append(cardDivCircle)
        cardDivCircle.classList.add("circle", "white")
        cardDivCircle.append(cardDivCircleText)

        if (this.visibility === true) {
            cardDivCircleText.classList.add("inner_text")
            cardDivCircleText.innerHTML = this.value
        }

        return cardDiv

    }
}

// Maps the SUITS and VALUES together to create the Card Objects
function newDeck() {
    return SUITS.flatMap(suit => {
        return VALUES.map(value => {
            return new Card(suit, value, true)
        })
    })
}

// Add's Event Listener to the Draw Pile
let drawDeck = document.getElementById('drawDeck');
    drawDeck.addEventListener("click", drawFromDeck);

    // The function to draw from the draw pile
function drawFromDeck(){

        // Checks if anyone has won
        checkWin()

        // pushes draw pile top card to player hand
        player_deck.innerHTML = " "
        player_Hand.push(deck.draw())
        console.log(deck.cards)

    // CPU Then plays their turn
    window.setTimeout(() => {

        console.log("CPU")

        let findCPU = cpu_Hand.find(CallBackToFindCardCPU)
        const indexCPU = cpu_Hand.indexOf(findCPU)

        if (findCPU != undefined) {

            console.log(last_value, last_suit)
            console.log(findCPU)

            cpu_Hand[indexCPU].visibility = true
            discardPile.push(findCPU)
            discard_pile.append(findCPU.discardHTML())

            last_suit = discardPile[discardPile.length - 1].suit
            last_value = discardPile[discardPile.length - 1].value

            cpu_Hand.splice(indexCPU, 1);
            cpu_deck.innerHTML = " "
            for (let i = 0; i <= cpu_Hand.length; i++) {

                cpu_deck.append(cpu_Hand[i].getHTML())

            }
        }
        else {
            
            deck.cards[0].visibility = false
            cpu_Hand.push(deck.draw())
            cpu_deck.innerHTML = " "
            for (let i = 0; i <= cpu_Hand.length; i++) {

                cpu_deck.append(cpu_Hand[i].getHTML())

            }

        }

    }, 1000)

        // re-renders player hand to show new card
        for (let i = 0; i <= player_Hand.length; i++) {

            player_deck.append(player_Hand[i].getHTML())

        }

}

// Call Back Function to find a playable card for CPU
function CallBackToFindCardCPU(card){

    return card.suit === last_suit || card.value === last_value

}

// Creates new Deck Instance
const deck = new Deck()
deck.shuffle() // Shuffles the Deck
console.log(deck.cards);

// Gives out the first 15 cards in the Deck
// Sets CPU Cards to be flipped so the Player Can't see them
for (let i = 0; i < 14; i = i + 2){

    deck.cards[i].visibility = false

}

// Player and CPU Decks Initialized
for (let i = 0; i < 7; i++){

    cpu_Hand.push(deck.draw())
    cpu_deck.append(cpu_Hand[i].getHTML())

    player_Hand.push(deck.draw())
    player_deck.append(player_Hand[i].getHTML())

}

// Draws first card from draw pile and places on the discard pile
discard_pile.append(deck.draw().getHTML())
