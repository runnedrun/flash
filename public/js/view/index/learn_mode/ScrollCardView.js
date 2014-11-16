/*
  This view allows an infinite list of cards, rendered just in time. The view manages three cards. When
  the user is about to scroll to a point where another card needs to show up at the bottom, the view moves the top
  card to the bottom. Same for when a card needs to rendered at the top. When a card is moved the content in the card
  is changed, so that it appears that the user is actually scrolling through a list with cards containing different
  content. The rendering occurs by calling one of the two functions passed as arguments, fillNextCard or
  fillPreviousCard. fillNextCard is called when moving a card from the bottom to the  top, to prepare for the user
  seeing the next card. The opposite is true for fillPreviousCard. The methods are passed the jquery element for the
  card container being moved. These methods should return an object with at least 4 methods, render,
  shouldSwitchFocus, focus and destroy.

  render: called after a card is moved. render should insert the correct content into the card.

  shouldSwitchFocus: called every time a user scrolls, passing the parent container for the scrollCardView.
  shouldSwitchFocus should return true if a card needs to be focused at that time.

  focus: perform any logic necessary to focus the card.

  destroy: called when the card is being moved, before the next or previous is rendered. destroy should perform any
  tear down actions (unbinding callbacks etc.). it is the last call that is made to the object.
 */

ScrollCardView = function(parentContainer, fillNextCard, fillPreviousCard) {
  function generateCard(margin, height) {
    var card = $("#info-card-model").clone().removeAttr("id")
    card.css({
      "margin-bottom": margin + "vh",
      "height": height + "vh"
    });

    return card
  }

  // info card display constants in percentage of view port height
  var margin = 20;
  var height = 50;

  // the scroll percentage which is necesary to center the middle card;
  var centeredScroll = height + margin + height * .90;

  var cards = [];

  var initializationList = [1, 2, 3];

  var focusedCard;

  // initialize the 3 displayable cards
  $.each(initializationList, function(index, n) {
    var cardEl = generateCard(margin, height);
    var card = fillNextCard(cardEl);

    $(parentContainer).append(cardEl);
    cards.push({cardEl: cardEl, card: card});
  })

  var placeHolderBottom = generateCard(margin, height).css("visibility", "hidden");
  var placeHolderTop = generateCard(margin, height).css("visibility", "hidden");

  parentContainer.append(placeHolderBottom);
  parentContainer.prepend(placeHolderTop);

  // if the top of a info card passes either of these two limits, we hide it.
  var topBuffer = margin + height + 10; // accounts for the placeholder
  var bottomBuffer = 100 + 10;

  function fillNextOrPreviousCardIfNecessary(e) {
    var currentScroll = parentContainer.scrollTop();
    var cardToMoveUp =  false;
    var cardToMoveDown = false;

    var upperLimit = -1 * topBuffer - 5;
    var lowerLimit = bottomBuffer + 5;

    $.each(cards, function(i, cardData) {
      var cardEl = cardData.cardEl;

      var cardTop = ((cardEl.position().top / parentContainer.height()) * 100)

      if (cardTop < upperLimit) {
        cardToMoveDown = cardData;
      } else if(cardTop > lowerLimit) {
        cardToMoveUp = cardData;
      }
    });

    if (cardToMoveDown) {
      var newScrollPos = currentScroll - ((margin + height) / 100)  * parentContainer.height();
      var newNoteCard = fillPreviousCard(cardToMoveDown.cardEl);
      var previousNoteCard = cardToMoveDown.card;

      if (newNoteCard) {
        previousNoteCard && previousNoteCard.destroy();
        cardToMoveDown.card = newNoteCard;

        // rearrange the note list
        var cardIndex = cards.indexOf(cardToMoveDown);
        cards.splice(cardIndex, 0);
        cards.push(cardToMoveDown);

        // rearrange the note elements in the dom
        cardToMoveDown.cardEl.detach();
        placeHolderBottom.before(cardToMoveDown.cardEl);

        // render the new note
        newNoteCard.render();
        switchFocusIfNecessary();

        // scroll to compensate for the element changes, and focus change from rendering.
        parentContainer.scrollTop(newScrollPos);
      }
    }

    if (cardToMoveUp) {
      var newScrollPos = currentScroll + ((margin + height) / 100) * parentContainer.height();
      var newNoteCard = fillNextCard(cardToMoveUp.cardEl);
      var previousNoteCard = cardToMoveUp.card;

      if (newNoteCard) {
        previousNoteCard && previousNoteCard.destroy();
        cardToMoveUp.card = newNoteCard;

        // rearrange the note list
        var cardIndex = cards.indexOf(cardToMoveUp);
        cards.splice(cardIndex, 0);
        cards.unshift(cardToMoveUp);

        // rearrange the note elements in the dom
        cardToMoveUp.cardEl.detach();
        placeHolderTop.after(cardToMoveUp.cardEl);

        // render the new note
        newNoteCard.render();
        switchFocusIfNecessary();

        // scroll to compensate for the element changes.
        parentContainer.scrollTop(newScrollPos);
      }
    }
  }

  function switchFocusIfNecessary() {
    $.each(cards, function(i, card) {
      // switch to the last card which should focus, and doesn't have focus
      if (card.card.shouldSwitchFocus(parentContainer) && (card !== focusedCard || !focusedCard)) {
        card.card.focus();
      } else {
        card.card.focus();
      }
    })

  }

  this.scrollToNext = function() {
    var nextScroll = (centeredScroll + margin + height)
    parentContainer.scrollTop(nextScroll/100 *  parentContainer.height());
  }

  this.scrollToPrevious = function() {
    var nextScroll = (centeredScroll - margin - height)
    parentContainer.scrollTop(nextScroll/100 *  parentContainer.height());
  }

  function centerCard() {
    parentContainer.scrollTop(centeredScroll/100 *  parentContainer.height());
  }

  parentContainer.scroll(fillNextOrPreviousCardIfNecessary);
  centerCard()
}

