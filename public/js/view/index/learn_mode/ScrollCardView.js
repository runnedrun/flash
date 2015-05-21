/*
  This view allows an infinite list of cards, rendered just in time. The view manages three cards. When
  the user is about to scroll to a point where another card needs to show up at the bottom, the view moves the top
  card to the bottom. Same for when a card needs to rendered at the top. When a card is moved the content in the card
  is changed, so that it appears that the user is actually scrolling through a list with cards containing different
  content. The rendering occurs by calling one of the two functions passed as arguments, fillNextCard or
  fillPreviousCard. fillNextCard is called when moving a card from the bottom to the  top, to prepare for the user
  seeing the next card. The opposite is true for fillPreviousCard. The methods are passed the jquery element for the
  card container being moved. These methods should return an object with at least 4 methods, render,
  shouldSwitchFocus, focus and destroy. centerOn should be 1 of 2 options: 0, 1. Where 1 is first card, and -1 is last.

  render: called after a card is moved. render should insert the correct content into the card.

  shouldSwitchFocus: called every time a user scrolls, passing the parent container for the scrollCardView.
  shouldSwitchFocus should return true if a card needs to be focused at that time.

  focus: perform any logic necessary to focus the card.

  destroy: called when the card is being moved, before the next or previous is rendered. destroy should perform any
  tear down actions (unbinding callbacks etc.). it is the last call that is made to the object.
 */

ScrollCardView = function(fillCardAbove, fillCardBelow, centerOn) {
  var self = this
  var parentContainer;

  var topBumper;
  var bottomBumper;
  var lastScrollTime = 0;

  var cardsToDestroy = [];

  // we need to wait until after scrolling is complete to completely destroy old card content, otherwise, we kill
  // scroll momentum.
  function enqueueCardDestroy(card) {
    cardsToDestroy.push(card);
    triggerCardDestroyCheck();
  }

  function triggerCardDestroyCheck() {
    setTimeout(function() {
      !destroyCardsIfNotScrolling() && triggerCardDestroyCheck();
    }, 100);
  }

  function destroyCardsIfNotScrolling() {
    var d = new Date();
    var currentTime = d.getTime();

    // if it's been more than a second since the last scroll, then destroy the cards in the queue
    if ((currentTime - lastScrollTime) > 1000) {
      $.each(cardsToDestroy, function(i, card) {
        card.destroy();
      });
      cardsToDestroy = [];

      return true
    } else {
      return false
    }
  }

  self.render = function(parentContainerArg) {
    parentContainer = parentContainerArg;

    bottomBumper = generateCardEl(bottomBumperMargin, bottomBumperHeight).css("visibility", "hidden");
    topBumper = generateCardEl(topBumperMargin, topBumperHeight).css("visibility", "hidden");

    parentContainer.append(bottomBumper);
    parentContainer.prepend(topBumper);

    parentContainer.scroll(function(e) {
      var d = new Date();
      lastScrollTime = d.getTime();
      addNewCardsIfNecessary();
    });
  }

  function generateCardEl(margin, height) {
    var card = $("#info-card-model").clone().removeAttr("id")
    card.css({
      "margin-bottom": margin + "vh",
      "height": height + "vh"
    });

    return card
  }

  // the number of times a card has been moved from the bottom to the top, and vice versa, used for scrolling
  var transposeUpPx = 0
  var transposeDownPx = 0

  // info card display constants in percentage of view port height
  var margin = 5;

  // the top bumper needs to be high enough such that the top card is centered when all the way scrolled
  var topBumperMargin = 0
  var topBumperHeight = 25

  var bottomBumperMargin = 0
  var bottomBumperHeight = 25

  var cardDatas = [];

  var focusedCard;
  var focusableCards = [];


  function getCardHeightPx(card) {
    return (card.height / 100) * parentContainer.height();
  }

  function getMarginPx() {
    return margin / 100 * parentContainer.height()
  }

  function getCardOffsetPx(card) {
    return (margin + card.height)/100 * parentContainer.height();
  }

  function getMarginHeightToCenterCard(card){
    return (parentContainer.height() - getCardHeightPx(card)) / 2
  }

  function generateCardData() {
    return { cardEl: generateCardEl(0, 0) }
  }

  function destroyCardData(cardData) {
    var cardIndex = cardDatas.indexOf(cardData);
    (cardIndex > -1) && cardDatas.splice(cardIndex, 1);
    cardData.cardEl.remove();
  }

  // this should be called if there is a possibility that there is now a new card amongst the currently visible
  // ones
  function destroyOutOfDateCards() {
    var newCardCursors = [];

    // we look at the card that would be rendered below each card, and check if it's the same as the current
    // card rendered below. So we don't need to use the final card currently rendered.
    $.each(cardDatas.slice(0, cardDatas.length - 1), function(i, cardData) {
      var card = cardData.card;
      var cardEl = cardData.cardEl;
      var cursor = card && card.getCursor();
      var newCardBelow = fillCardBelow(cardEl, cursor);
      var newCardBelowCursor = newCardBelow && newCardBelow.getCursor();
      newCardCursors.push(newCardBelowCursor);
    })

    var cardDatasToCheck = cardDatas.slice(1, cardDatas.length);
    var cardCursorsToCheck = cardDatasToCheck.map(function(cardData) { return cardData.card && cardData.card.getCursor() });

    if (!Util.arraysEqual(cardCursorsToCheck, newCardCursors)) {
      // destroy all the cards except for the first cards, which we're using as an "anchor", based off which we
      // will render all new cards
      $.each(cardDatasToCheck, function(i, cardData) {
        destroyCardData(cardData);
      })
    }
  }

  function addNewCardsIfNecessary(noCardsToStart) {
    var noCardsToStart = noCardsToStart || (cardDatas.length == 0);

    var viewPortHeight = parentContainer.height();

    var offscreenCardsTop = [];
    var offscreenCardsBottom = [];
    $.each(cardDatas, function(cardNumber, cardData) {
      var cardEl = cardData.cardEl;

      if((cardEl.position().top + getCardOffsetPx(cardData.card)) < 0) {
        offscreenCardsTop.push(cardData);
      } else if (cardEl.position().top > viewPortHeight) {
        offscreenCardsBottom.push(cardData);
      }
    });

    var lessThanOneOffscreenTop = offscreenCardsTop.length === 0;
    var lessThanOneOffscreenBottom = offscreenCardsBottom.length === 0;

    // the first element offscreen should stay as a buffer. All other offscreen cards cards are reclaimable
    offscreenCardsTop = offscreenCardsTop.slice(0, offscreenCardsTop.length - 1);;
    offscreenCardsBottom = offscreenCardsBottom.slice(1, offscreenCardsBottom.length);

    var offScreenTopCardToMove = offscreenCardsTop[0];
    var offScreenBottomCardToMove = offscreenCardsBottom[offscreenCardsBottom.length - 1];

    var cardToAddToTop;
    var cardToAddToBottom;
    var newCardTop;
    var newCardBottom;

    if (lessThanOneOffscreenTop) {
      if (offScreenBottomCardToMove) {
        newCardTop = addCardToTop(offScreenBottomCardToMove);
      } else {
        newCardTop = addCardToTop(generateCardData());
      }
    }

    if (lessThanOneOffscreenBottom) {
      if (offScreenTopCardToMove) {
        var currentScroll = parentContainer.scrollTop();
        var newScrollOffset = getCardOffsetPx(offScreenTopCardToMove.card);

        newCardBottom = addCardToBottom(offScreenTopCardToMove);

        transposeDownPx += newScrollOffset;
        var newScrollPos = currentScroll - newScrollOffset;

        // scroll to compensate for the change in scroll which occurred when the old top card was removed.

        newCardBottom && parentContainer.scrollTop(newScrollPos);
      } else {
        newCardBottom = addCardToBottom(generateCardData());
      }
    }

    // if we had add to new cards, now we should check again to see if we should add new cards again.
    if (newCardTop || newCardBottom) {
      addNewCardsIfNecessary(noCardsToStart);
    } else {
      if (noCardsToStart) {
        (centerOn > 0) && centerCard(cardDatas[0], switchFocusIfNecessary);
        (centerOn < 0) && centerCard(cardDatas[cardDatas.length - 1], switchFocusIfNecessary);
      } else {
        switchFocusIfNecessary();
      }
    }
  }

  function addCardToBottom(cardDataToMoveDown) {
    var currentBottomCardData = cardDatas[cardDatas.length - 1];
    var currentBottomCardCursor = currentBottomCardData && currentBottomCardData.card && currentBottomCardData.card.getCursor();

    var newCard = fillCardBelow(cardDataToMoveDown.cardEl, currentBottomCardCursor);

    if (newCard) {
      cardDataToMoveDown.card && cardDataToMoveDown.card.hide();
      cardDataToMoveDown.card && enqueueCardDestroy(cardDataToMoveDown.card);

      cardDataToMoveDown.card = newCard;

      // rearrange the note list
      var cardIndex = cardDatas.indexOf(cardDataToMoveDown);
      (cardIndex > -1) && cardDatas.splice(cardIndex, 1);
      cardDatas.push(cardDataToMoveDown);

      //adjust the height based on the height specified in the card view
      cardDataToMoveDown.cardEl.css({"height": newCard.height + "vh", "margin-bottom":  margin + "vh"});

      // rearrange/add the note element to the dom
      bottomBumper.before(cardDataToMoveDown.cardEl);

      // render the new note
      newCard.render();
    } else if(currentBottomCardData) {
      bottomBumper.css({"height": getMarginHeightToCenterCard(currentBottomCardData.card)})
    }

    return newCard;
  }

  function addCardToTop(cardDataToMoveUp) {
    var currentScroll = parentContainer.scrollTop();
    var currentTopCardData = cardDatas[0];
    var currentTopCardCursor = cardDatas[0] && cardDatas[0].card && cardDatas[0].card.getCursor();

    var newCard = fillCardAbove(cardDataToMoveUp.cardEl, currentTopCardCursor);

    if (newCard) {
      var newScrollOffset = getCardOffsetPx(newCard);
      var newScrollPos = currentScroll + newScrollOffset;

      cardDataToMoveUp.card && cardDataToMoveUp.card.hide();
      cardDataToMoveUp.card && enqueueCardDestroy(cardDataToMoveUp.card);
      cardDataToMoveUp.card = newCard;

      // rearrange the note list
      var cardIndex = cardDatas.indexOf(cardDataToMoveUp);
      (cardIndex > -1) && cardDatas.splice(cardIndex, 1);
      cardDatas.unshift(cardDataToMoveUp);

//      adjust the height based on the height specified in the card view
      cardDataToMoveUp.cardEl.css({"height": newCard.height + "vh", "margin-bottom": margin + "vh"});

      // rearrange/ add the note elements to the dom
      topBumper.after(cardDataToMoveUp.cardEl);

      // render the new note
      newCard.render();

      transposeUpPx += newScrollOffset;

      // scroll to compensate for the element changes.
      parentContainer.scrollTop(newScrollPos);
    } else if(currentTopCardData) {
      topBumper.css({"height": getMarginHeightToCenterCard(currentTopCardData.card)})
    }

    return newCard
  }

  function switchFocusIfNecessary() {
    var newFocusableCards  = [];

    $.each(cardDatas, function(i, cardData) {
      var wasFocusableBefore = focusableCards.indexOf(cardData.card);

      if (cardData.card && cardData.card.shouldSwitchFocus(parentContainer)) {
        newFocusableCards.push(cardData.card)

        // if this card is newly focusable, or if the currently focused card is now not
        // focusable, or is there is now focused card, then focus this card.
        if (!wasFocusableBefore || (!focusedCard || !focusedCard.shouldSwitchFocus(parentContainer))) {
          cardData.card.focus();
          focusedCard = cardData.card
        }
      }
    })

    focusableCards = newFocusableCards;
  }

  self.scrollToNext = function() {
    self.scrollNCards(1);
  }

  self.scrollToPrevious = function() {
    self.scrollNCards(-1);
  }

  function centerCard(cardData, scrollComplete) {
    var currentScroll = parentContainer.scrollTop();
    var centeredLocation = parentContainer.height() / 2 - getCardHeightPx(cardData.card) / 2;
    var top = cardData.cardEl.position().top;

    var scroll = currentScroll - (centeredLocation - top);
    parentContainer.scrollTop(scroll);
  }

  // returns the distance to of the card which is closest to centered in the specified scroll direction. -1 means scrolling
  // up (cards move down), and 1 means scrolling down (cards move up).
  function getAmountToScrollToCenterNextCard(direction) {
    var centeredLocation = parentContainer.height() / 2 ;
    var scrollDifference = 0;

    if (direction < 0) {
      $.each(cardDatas, function(i, cardData) {
        var height = getCardHeightPx(cardData.card);
        var totalCardSpace = height + getMarginPx();
        var cardTop = cardData.cardEl.position().top;

        var cardOverCenterLine = (cardTop + totalCardSpace) > centeredLocation;

        // is the card already past the center. If this is the case then we should scroll to the card above.
        var cardPastCenter = (centeredLocation - cardTop) < (height / 2 + 5);

        var desiredScrollForTopOfCard = centeredLocation - height/2;
        if (cardOverCenterLine && !cardPastCenter) {
          scrollDifference = desiredScrollForTopOfCard - cardTop;
          return false
        } else if (cardOverCenterLine) {
          var prevCard = cardDatas[i-1];
          if (prevCard) {
            scrollDifference = desiredScrollForTopOfCard - prevCard.cardEl.position().top;
          }
          return false
        } else {
          // if we don't find any cards over the centerline, then just scroll to the bottommost card.
          scrollDifference = desiredScrollForTopOfCard - cardTop;
        }
      })
    } else {
      // in order from the bottom to the top
      var reversedCards = cardDatas.slice(0, cardDatas.length).reverse();

      $.each(reversedCards, function(i, cardData) {
        var height = getCardHeightPx(cardData.card);
        var cardTop = cardData.cardEl.position().top;

        // cardBox includes the margin on top
        var cardBoxTop = cardTop + getMarginPx();

        var cardOverCenterLine = cardBoxTop < centeredLocation;

        // is the card already past the center. If this is the case then we should scroll to the card below.
        var cardPastCenter = (centeredLocation - cardTop) > (height / 2 - 5)

        var desiredScrollForTopOfCard = centeredLocation - height/2;
        if (cardOverCenterLine && !cardPastCenter) {
          scrollDifference = desiredScrollForTopOfCard - cardTop;

          return false
        } else if (cardOverCenterLine) {
          // this card is already past center, so scroll to center the previous card
          scrollDifference = desiredScrollForTopOfCard - cardTop;
          var prevCard = reversedCards[i-1];
          if (prevCard) {
            scrollDifference = desiredScrollForTopOfCard - prevCard.cardEl.position().top;
          }

          return false
        } else {
          // if we don't find any cards over the centerline, then just scroll to the top card.
          scrollDifference = desiredScrollForTopOfCard - cardTop;
        }
      })
    }

    return scrollDifference * -1;
  }

  self.scrollNCards = function(numOfCardsToScroll, totalCardsScrollingArg) {
    // if we are scrolling 0 cards, do nothing
    if (numOfCardsToScroll === 0) {
      return
    }

    var absNumCardsToScroll = Math.abs(numOfCardsToScroll);

    var totalCardsScrolling = totalCardsScrollingArg || absNumCardsToScroll

    var numOfCardsToScrollSign = numOfCardsToScroll && (absNumCardsToScroll / numOfCardsToScroll);

    var currentScroll = parentContainer.scrollTop();

    var scrollTime = 700;

    var scrollDifference = getAmountToScrollToCenterNextCard(numOfCardsToScrollSign);

    animateScroll(currentScroll + scrollDifference, scrollTime / totalCardsScrolling, function() {
      if (absNumCardsToScroll > 0) {
        self.scrollNCards((absNumCardsToScroll - 1) * numOfCardsToScrollSign, absNumCardsToScroll);
      }
    }) ;
  }

  self.refreshCards = function() {
    $.each(cardDatas, function(i, cardData) {
      cardData.card.updateContent && cardData.card.updateContent();
    })

    destroyOutOfDateCards();
    addNewCardsIfNecessary();
  }

  function animateScroll(scrollTo, timeToTake, onScrollComplete) {
    var heightOfView = parentContainer[0].scrollHeight;
    // make sure we don't get stuck in an infinite loop trying to scroll
    if (scrollTo >= heightOfView) {
      scrollTo = heightOfView - 1
    } else if(scrollTo <= 0 ) {
      scrollTo = 1
    }

    var d = new Date();
    var currentTime = d.getTime();

    var desiredEndTime = currentTime + timeToTake;

    var lastLoopEndTime = currentTime;
    var startingTransposeUp = transposeUpPx;
    var startingTransposeDown = transposeDownPx;


    scroll();

    function scroll() {
      var transposeUpPxSinceStart = transposeUpPx - startingTransposeUp;
      var transposeDownPxSinceStart = transposeDownPx - startingTransposeDown;
      var goalScrollOffset = transposeUpPxSinceStart - transposeDownPxSinceStart;

      var d = new Date();
      var currentTime = d.getTime();
      var timeRemaining = desiredEndTime - currentTime;
      var lastLoopDuration = currentTime - lastLoopEndTime;
      var iterationsRemaining = timeRemaining / lastLoopDuration

      var newGoalScroll = goalScrollOffset + scrollTo;

      var currentScroll = parentContainer.scrollTop();
      var scrollDifference = newGoalScroll - currentScroll;

      var stepSize = Math.abs(scrollDifference / iterationsRemaining);

      if (scrollDifference > 1 || scrollDifference < -1){
        var absInterval = Math.min(Math.abs(scrollDifference), stepSize);

        var interval = scrollDifference < 0 ? -1 * absInterval : absInterval
        var newScrollTo = currentScroll + interval
        parentContainer.scrollTop(newScrollTo);
        lastLoopEndTime = currentTime;
        setTimeout(scroll , 1);
      } else {
        onScrollComplete && onScrollComplete();
      }
    }
  }
}

