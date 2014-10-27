InfoCardView = function(infoCardsContainer, getNextNote, getPreviousNote) {
  function generateInfoCard(margin, height) {
    var infoCard = $("#info-card-model").clone().removeAttr("id")
    infoCard.css({
      "margin-bottom": margin + "vh",
      "height": height + "vh"
    });

    return infoCard
  }

  // info card display constants in percentage of view port height
  var margin = 20;
  var height = 50;

  // the scroll percentage which is necesary to center the middle card;
  var centeredScroll = height + margin + height * .90;

  var infoCards = [];

  var initializationList = [1, 2, 3];

  var focusedCard;

  // initialize the 3 displayable cards
  $.each(initializationList, function(index, n) {
    var cardEl = generateInfoCard(margin, height);
    var card = getNextNote(cardEl);

    $(infoCardsContainer).append(cardEl);
    infoCards.push({cardEl: cardEl, card: card});
  })

  var placeHolderBottom = generateInfoCard(margin, height).css("visibility", "hidden");
  var placeHolderTop = generateInfoCard(margin, height).css("visibility", "hidden");

  infoCardsContainer.append(placeHolderBottom);
  infoCardsContainer.prepend(placeHolderTop);

  var numberOfCards = initializationList.length;

  // if the top of a info card passes either of these two limits, we hide it.
  var topBuffer = margin + height + 10; // accounts for the placeholder
  var bottomBuffer = 100 + 10;

  function checkForNextOrPreviousNote(e) {
    var currentScroll = infoCardsContainer.scrollTop();
    var cardToMoveUp =  false;
    var cardToMoveDown = false;

    var upperLimit = -1 * topBuffer - 5;
    var lowerLimit = bottomBuffer + 5;

    $.each(infoCards, function(i, cardData) {
      var cardEl = cardData.cardEl;

      var cardTop = ((cardEl.position().top / infoCardsContainer.height()) * 100)

      if (cardTop < upperLimit) {
        cardToMoveDown = cardData;
      } else if(cardTop > lowerLimit) {
        cardToMoveUp = cardData;
      }
    });

    if (cardToMoveDown) {
      var newScrollPos = currentScroll - ((margin + height) / 100)  * infoCardsContainer.height();
      var newNoteCard = getPreviousNote(cardToMoveDown.cardEl);
      var previousNoteCard = cardToMoveDown.card;

      if (newNoteCard) {
        previousNoteCard && previousNoteCard.destroy();
        cardToMoveDown.card = newNoteCard;

        // rearrange the note list
        var cardIndex = infoCards.indexOf(cardToMoveDown);
        infoCards.splice(cardIndex, 0);
        infoCards.push(cardToMoveDown);

        // rearrange the note elements in the dom
        cardToMoveDown.cardEl.detach();
        placeHolderBottom.before(cardToMoveDown.cardEl);

        // render the new note
        newNoteCard.render();
        switchFocusIfNecessary();

        // scroll to compensate for the element changes, and focus change from rendering.
        infoCardsContainer.scrollTop(newScrollPos);
      }
    }

    if (cardToMoveUp) {
      var newScrollPos = currentScroll + ((margin + height) / 100) * infoCardsContainer.height();
      var newNoteCard = getNextNote(cardToMoveUp.cardEl);
      var previousNoteCard = cardToMoveUp.card;

      if (newNoteCard) {
        previousNoteCard && previousNoteCard.destroy();
        cardToMoveUp.card = newNoteCard;

        // rearrange the note list
        var cardIndex = infoCards.indexOf(cardToMoveUp);
        infoCards.splice(cardIndex, 0);
        infoCards.unshift(cardToMoveUp);

        // rearrange the note elements in the dom
        cardToMoveUp.cardEl.detach();
        placeHolderTop.after(cardToMoveUp.cardEl);

        // render the new note
        newNoteCard.render();
        switchFocusIfNecessary();

        // scroll to compensate for the element changes.
        infoCardsContainer.scrollTop(newScrollPos);
      }
    }
  }

  function switchFocusIfNecessary() {
    $.each(infoCards, function(i, card) {
      // switch to the last card which should focus, and doesn't have focus
      if (card.card.shouldSwitchFocus(infoCardsContainer) && (card !== focusedCard || !focusedCard)) {
        card.card.focus();
      } else {
        card.card.focus();
      }
    })

  }

  this.scrollToNext = function() {
    var nextScroll = (centeredScroll + margin + height)
    infoCardsContainer.scrollTop(nextScroll/100 *  infoCardsContainer.height());
  }

  this.scrollToPrevious = function() {
    var nextScroll = (centeredScroll - margin - height)
    infoCardsContainer.scrollTop(nextScroll/100 *  infoCardsContainer.height());
  }

  function centerCard() {
    infoCardsContainer.scrollTop(centeredScroll/100 *  infoCardsContainer.height());
  }

  infoCardsContainer.scroll(checkForNextOrPreviousNote);
  centerCard()
}

