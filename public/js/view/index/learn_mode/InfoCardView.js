InfoCardView = function(infoCardsContainer, renderNextNote, renderPreviousNote) {
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

  var previousScroll = 0;

  var focusedCard;

  var infoCards = [];

  var initializationList = [1, 2, 3];

  // initialize the 3 displayable cards
  $.each(initializationList, function(index, n) {
    var cardEl = generateInfoCard(margin, height)
    $(infoCardsContainer).append(cardEl);
    infoCards.push({cardEl: cardEl, n: n});
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
    var scrollUp = previousScroll < currentScroll;
    previousScroll = currentScroll;

    var cardToMoveUp =  false;
    var cardToMoveDown = false;

    var upperLimit = -1 * topBuffer - 5;
    var lowerLimit = bottomBuffer + 5;

    $.each(infoCards, function(i, cardData) {
      var cardTop = ((cardData.cardEl.position().top / infoCardsContainer.height()) * 100)

      if (cardTop < upperLimit) {
        cardToMoveDown = cardData.cardEl;
        cardToMoveDown.destroy && cardToMoveDown.destroy()
      } else if(cardTop > lowerLimit) {
        cardToMoveUp = cardData.cardEl;
        cardToMoveUp.destroy && cardToMoveUp.destroy()
      } else if(focusedCard !== cardData.n) {
        focusedCard = cardData.n;

        var destroyFunc;

        if (scrollUp) {
          destroyFunc = renderNextNote(cardData.cardEl);
        } else {
          destroyFunc = renderPreviousNote(cardData.cardEl);
        }
        // make sure that the scroll didn't change when we rendered the note. If the renderer focused anything the
        // scroll will change.
        infoCardsContainer.scrollTop(currentScroll);

        cardData.destroy = destroyFunc;
      }
    });

    if (cardToMoveDown) {
      var newScrollPos = currentScroll - ((margin + height) / 100)  * infoCardsContainer.height();
      cardToMoveDown.detach();
      placeHolderBottom.before(cardToMoveDown);
      infoCardsContainer.scrollTop(newScrollPos);
    }

    if (cardToMoveUp) {
      var newScrollPos = currentScroll + ((margin + height) / 100) * infoCardsContainer.height();
      cardToMoveUp.detach();
      placeHolderTop.after(cardToMoveUp);
      infoCardsContainer.scrollTop(newScrollPos);
    }
  }

  infoCardsContainer.scroll(checkForNextOrPreviousNote)

  var startingScroll = (height + margin + height * .90)/100;
  infoCardsContainer.scrollTop(startingScroll *  infoCardsContainer.height());
}

