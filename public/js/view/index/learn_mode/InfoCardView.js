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

  // the scroll percentage which is necesary to center the middle card;
  var centeredScroll = height + margin + height * .90;

  var infoCards = [];

  var initializationList = [1, 2, 3];

  // initialize the 3 displayable cards
  $.each(initializationList, function(index, n) {
    var cardEl = generateInfoCard(margin, height)
    var destroyFunc = renderNextNote(cardEl);

    $(infoCardsContainer).append(cardEl);
    infoCards.push({cardEl: cardEl, destroy: destroyFunc});
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
      var destroyFunc = renderPreviousNote(cardToMoveDown.cardEl);

      console.log("destroy func is ", destroyFunc);

      if (destroyFunc) {
        cardToMoveDown.destroy && cardToMoveDown.destroy();
        infoCardsContainer.scrollTop(currentScroll);
        cardToMoveDown.destroy = destroyFunc;

        var cardIndex = infoCards.indexOf(cardToMoveDown);
        infoCards.splice(cardIndex, 0);
        infoCards.push(cardToMoveDown);

        cardToMoveDown.cardEl.detach();
        placeHolderBottom.before(cardToMoveDown.cardEl);
        infoCardsContainer.scrollTop(newScrollPos);
      }
    }

    if (cardToMoveUp) {
      var newScrollPos = currentScroll + ((margin + height) / 100) * infoCardsContainer.height();
      var destroyFunc = renderNextNote(cardToMoveUp.cardEl);

      // if the renderer returns false, this is the end of the list, do nothing
      if (destroyFunc) {
        cardToMoveUp.destroy && cardToMoveUp.destroy();
        infoCardsContainer.scrollTop(currentScroll);
        cardToMoveUp.destroy = destroyFunc;

        var cardIndex = infoCards.indexOf(cardToMoveUp);
        infoCards.splice(cardIndex, 0);
        infoCards.push(cardToMoveUp);

        cardToMoveUp.cardEl.detach();
        placeHolderTop.after(cardToMoveUp.cardEl);
        infoCardsContainer.scrollTop(newScrollPos);
      }
    }
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

