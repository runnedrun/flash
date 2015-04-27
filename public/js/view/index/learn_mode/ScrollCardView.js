/*
  This view allows an infinite list of cards, rendered just in time. The view manages three cards. When
  the user is about to scroll to a point where another card needs to show up at the bottom, the view moves the top
  card to the bottom. Same for when a card needs to rendered at the top. When a card is moved the content in the card
  is changed, so that it appears that the user is actually scrolling through a list with cards containing different
  content. The rendering occurs by calling one of the two functions passed as arguments, fillNextCard or
  fillPreviousCard. fillNextCard is called when moving a card from the bottom to the  top, to prepare for the user
  seeing the next card. The opposite is true for fillPreviousCard. The methods are passed the jquery element for the
  card container being moved. These methods should return an object with at least 4 methods, render,
  shouldSwitchFocus, focus and destroy. centerOn should be 1 of 2 options: 0, 1. Where 0 is first card, and 1 is last.

  render: called after a card is moved. render should insert the correct content into the card.

  shouldSwitchFocus: called every time a user scrolls, passing the parent container for the scrollCardView.
  shouldSwitchFocus should return true if a card needs to be focused at that time.

  focus: perform any logic necessary to focus the card.

  destroy: called when the card is being moved, before the next or previous is rendered. destroy should perform any
  tear down actions (unbinding callbacks etc.). it is the last call that is made to the object.
 */


var printCardPos;
var check;

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

    bottomBumper = generateCard(bottomBumperMargin, bottomBumperHeight).css("visibility", "hidden");
    topBumper = generateCard(topBumperMargin, topBumperHeight).css("visibility", "hidden");

    parentContainer.append(bottomBumper);
    parentContainer.prepend(topBumper);

    // initialize the 5 displayable cards
    $.each(initializationList, function(index, n) {
      var cardEl = generateCard(margin, defaultHeight);
      var card = fillCardAbove(cardEl);

      if (card) {
        var height = card.height || defaultHeight;
        cardEl.css("height", (height/100) * parentContainer.height);
        topBumper.after(cardEl);
        card.render();
        cards.push({cardEl: cardEl, card: card});
      } else {
        cards.push({cardEl: cardEl, notDisplayed: true})
      }
    })

    cards.reverse();

    scrollToCenterCard(centerOn)

    parentContainer.scroll(function(e) {
      var d = new Date();
      lastScrollTime = d.getTime();

      fillNextOrPreviousCardIfNecessary(e);
    });
  }

  function getDisplayedCards() {
    return cards.filter(function(card) { return !card.notDisplayed })
  }

  function generateCard(margin, height) {
    var card = $("#info-card-model").clone().removeAttr("id")
    card.css({
      "margin-bottom": margin + "vh",
      "height": height + "vh"
    });

    return card
  }

  // the number of times a card has been moved from the bottom to the top, and vice versa, used for scrolling
  var transposeUpCount = 0
  var transposeDownCount = 0

  // info card display constants in percentage of view port height
  var margin = 10;
  var defaultHeight = 50;

  // the top bumper needs to be high enough such that the top card is centered when all the way scrolled
  var topBumperMargin = 0
  var topBumperHeight = Math.max(0, (100 - defaultHeight)/2 - topBumperMargin);

  var bottomBumperMargin = 0
  var bottomBumperHeight = Math.max(0, (100 - defaultHeight)/2 - bottomBumperMargin);


  var cards = [];

  // the number of cards we should have already rendered, must be an odd number
  var numberOfCardsPreRendered = 5

  var initializationList = Array.apply(null, new Array(numberOfCardsPreRendered)).map(function(v, i) {
    return i + 1
  })

  var focusedCard;
  var focusableCards = [];

//  // only 3 cards are on screen at once
//  var totalHeightOfView = initializationList.length * (height + margin)

  // if the top of a info card passes this limit, we move it to the bottom
  var topBuffer = (margin + defaultHeight) * 2  + 10; // accounts for the bumper

  // if the top of a info card passes this limit, we move it to the top. If more than 3 cards are, we need to compensate
  // and allow for multiple cards to be scroling offscreen
  var bottomBuffer = (margin + defaultHeight)  + 100 + 10;

  function getCardHeightPercent(card) {
    return card.height || defaultHeight
  }

  function getCardHeightPx(card) {
    var percentHeight = getCardHeightPercent(card)
    return (percentHeight / 100) * parentContainer.height();
  }

  function getMarginPx() {
    return margin / 100 * parentContainer.height()
  }

  // the scroll percentage which is necessary to center the middle card;
  function percentScrollToCenterCard(cardNumber) {
    return topBumperMargin + topBumperHeight + (defaultHeight + margin) * cardNumber + defaultHeight/2;
  }

  function getCardOffsetPx(card) {
    return (margin + defaultHeight)/100 * parentContainer.height();
  }

  function getCenteredScrollPx(cardNumber) {
    var parentHeight = parentContainer.height();
    return (percentScrollToCenterCard(cardNumber) / 100) * parentHeight - parentHeight / 2;
  }

  function moveCardDown(cardToMoveDown) {
    var currentScroll = parentContainer.scrollTop();
    var currentBottomCard = getDisplayedCards()[getDisplayedCards().length - 1];

    var cardContent = fillCardBelow(cardToMoveDown.cardEl, currentBottomCard.card.getCursor());

    if (cardContent) {
      var newCardHeightPx = getCardHeightPx(cardContent);
      var newScrollPos = currentScroll - getMarginPx() - newCardHeightPx;

      cardToMoveDown.card && cardToMoveDown.card.hide();
      cardToMoveDown.card && enqueueCardDestroy(cardToMoveDown.card);

      cardToMoveDown.card = cardContent;

      // rearrange the note list
      var cardIndex = cards.indexOf(cardToMoveDown);
      cards.splice(cardIndex, 1);
      cards.push(cardToMoveDown);

      //adjust the height based on the height specified in the card view
      cardToMoveDown.cardEl.css("height", newCardHeightPx);

      // rearrange the note elements in the dom
      bottomBumper.before(cardToMoveDown.cardEl);

      // render the new note
      cardContent.render();

      transposeDownCount += 1;

      // scroll to compensate for the element changes, and focus change from rendering.
      parentContainer.scrollTop(newScrollPos);
    }
  }

  function moveCardUp(cardToMoveUp) {
    var currentScroll = parentContainer.scrollTop();
    var currentTopCard = getDisplayedCards()[0];

    var cardContent = fillCardAbove(cardToMoveUp.cardEl, currentTopCard.card.getCursor());

    if (cardContent) {
      var newCardHeightPx = getCardHeightPx(cardContent);
      var newScrollPos = currentScroll + getMarginPx() + newCardHeightPx;

      cardToMoveUp.card && cardToMoveUp.card.hide();
      cardToMoveUp.card && enqueueCardDestroy(cardToMoveUp.card);
      cardToMoveUp.card = cardContent;

      // rearrange the note list
      var cardIndex = cards.indexOf(cardToMoveUp);
      cards.splice(cardIndex, 1);
      cards.unshift(cardToMoveUp);

//      adjust the height based on the height specified in the card view
      cardToMoveUp.cardEl.css("height", newCardHeightPx);

      // rearrange the note elements in the dom
      topBumper.after(cardToMoveUp.cardEl);

      // render the new note
      cardContent.render();

      transposeUpCount += 1;

      // scroll to compensate for the element changes.
      parentContainer.scrollTop(newScrollPos);
    }
  }

  printCardPos = function() {
    $.each(cards, function(cardNumber, cardData) {
      var cardEl = cardData.cardEl;

      var cardTop = ((cardEl.position().top / parentContainer.height()) * 100);

      var upperLimit = -1 * topBuffer - 5;
      var lowerLimit = bottomBuffer + 5;

      console.log("card top is ", cardTop, upperLimit, lowerLimit);
    })
  }

  function fillNextOrPreviousCardIfNecessary() {
    var cardToMoveUp =  false;
    var cardToMoveDown = false;

    var upperLimit = -1 * topBuffer - 5;
    var lowerLimit = bottomBuffer + 5;

    $.each(cards, function(cardNumber, cardData) {
      var cardEl = cardData.cardEl;

      var cardTop = ((cardEl.position().top / parentContainer.height()) * 100);

      if (cardTop < upperLimit) {
        cardToMoveDown = cardData;
      } else if(cardTop > lowerLimit) {
        cardToMoveUp = cardData;
      }
    });

    cardToMoveDown && moveCardDown(cardToMoveDown);
    cardToMoveUp && moveCardUp(cardToMoveUp);

    switchFocusIfNecessary();
  }

  check = fillNextOrPreviousCardIfNecessary

  function switchFocusIfNecessary() {
    var newFocusableCards  = [];

    $.each(cards, function(i, cardData) {
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

  // returns the index of the card which is closest to centered in the specified scroll direction. -1 means scrolling
  // up (cards move down), and 1 means scrolling down (cards move up).
  function getScrollToCenterNextCard(direction) {
    var centeredLocation = parentContainer.height() / 2 ;
    var cardsToScan = getDisplayedCards();
    var scrollDifference = 0;

    if (direction < 0) {
      $.each(cardsToScan, function(i, card) {
        var height = getCardHeightPx(card);
        var totalCardSpace = height + (margin / 100) * parentContainer.height();
        var cardTop = card.cardEl.position().top;

        var cardOverCenterLine = (cardTop + totalCardSpace) > centeredLocation;

        // is the card already past the center. If this is the case then we should scroll to the card above.
        var cardPastCenter = (centeredLocation - cardTop) < (height / 2 + 5);

        var desiredScrollForTopOfCard = centeredLocation - height/2;
        if (cardOverCenterLine && !cardPastCenter) {
//          debugger;
          scrollDifference = desiredScrollForTopOfCard - cardTop;
          return false
        } else if (cardOverCenterLine) {
          var prevCard = cardsToScan[i-1];
          if (prevCard) {
            scrollDifference = desiredScrollForTopOfCard - prevCard.cardEl.position().top;
          }
          return false
        }
      })
    } else {
      // in order from the bottom to the top
      var reversedCards = cardsToScan.reverse();

      $.each(reversedCards, function(i, card) {
        var height = getCardHeightPx(card);
        var cardTop = card.cardEl.position().top;

        // cardBox includes the margin on top
        var cardBoxTop = cardTop + (margin / 100) * parentContainer.height();

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
        }
      })
    }

    return scrollDifference * -1;
  }

  self.scrollNCards = function(numOfCardsToScroll) {

    // if we are scrolling 0 cards, do nothing
    if (numOfCardsToScroll === 0) {
      return
    }

    var absNumCardsToScroll = Math.abs(numOfCardsToScroll);
    var numOfCardsToScrollSign = numOfCardsToScroll && (absNumCardsToScroll / numOfCardsToScroll);
//
    var currentScroll = parentContainer.scrollTop();
//
//    var centeredScrollPx = getCenteredScrollPx(1);
//    var scrollByToCenter = centeredScrollPx + (currentScroll * numOfCardsToScrollSign);
//
//    // if the sign of the scrollByToCenter is not that same as the number of cards we want
//    // to scroll, then we'll have to get the distance to the next card. This is so we always scroll
//    // in the correct direction.
//    if (scrollByToCenter * numOfCardsToScrollSign < 0) {
//      scrollByToCenter = (getCardOffsetPx() - Math.abs(scrollByToCenter)) * numOfCardsToScrollSign;
//      centeredScrollPx = currentScroll + scrollByToCenter;
//    }
//
//    // if we're close to centered let's pretend we're centered and just scroll up to the next card.
//    // else, let's count the scroll to the next card as a full card scroll.
//    if (Math.abs(scrollByToCenter) > 5) {
//      numOfCardsToScroll = numOfCardsToScroll + (-1 * numOfCardsToScrollSign);
//    }
//
//    var scrollToCenter = centeredScrollPx + getCardOffsetPx() * numOfCardsToScroll;

    var scrollTime = 700;

    for(var i = 0; i < absNumCardsToScroll; i++) {
      var scrollDifference = getScrollToCenterNextCard(numOfCardsToScrollSign);
      console.log("scroll one card", scrollDifference);
      animateScroll(currentScroll + scrollDifference, scrollTime / numOfCardsToScroll, false);
    }
  }

  function scrollToCenterCard(cardNumber) {
    var centerScroll = getCenteredScrollPx(cardNumber)
    parentContainer.scrollTop(centerScroll);
  }

  /*
    This method is called on every scroll. If any card has the attribute "notAppended" then this method will
    attempt to get content for the card. If the card has content then it will prepend the card to the scroll
    container.
   */
  function attemptToFillMissingCards() {
    var startingScroll = parentContainer.scrollTop();
    var orderedCards;
    var fillCard;

    if (centerOn == 0) {
      orderedCards = cards;
      fillCard = fillCardBelow;
    } else {
      orderedCards = cards.slice(0, cards.length).reverse();
      fillCard = fillCardAbove;
    }

    var scrollCompensation = 0;

    $.each(orderedCards, function(i, card) {
      var prevCard = orderedCards[i - 1];
      var prevCursor;
      if (prevCard && !prevCard.notDisplayed) {
        prevCursor = prevCard.card.getCursor() || 0;
      } else {
        prevCursor = 0
      }

      if (card.notDisplayed) {
        var cardContent = fillCard(card.cardEl, prevCursor)
        if (cardContent) {
          var height = getCardHeightPx(cardContent);
          console.log("height", height);
          card.cardEl.css({display: "block", height: height});
          card.card = cardContent;
          topBumper.after(card.cardEl);
          card.card.render();
          card.notDisplayed = false;
          if (centerOn !== 0 && i > 0) {
            scrollCompensation += getCardOffsetPx();
          }
        } else {
          // if there is no card content, we kill the loop, there will be no further content
          return false
        }
      }
    });

    parentContainer.scrollTop(startingScroll + scrollCompensation);
  }

  self.refreshCards = function() {
    attemptToFillMissingCards();
    fillNextOrPreviousCardIfNecessary();
  }

  function animateScroll(scrollTo, timeToTake) {
    var d = new Date();
    var currentTime = d.getTime();

    var desiredEndTime = currentTime + timeToTake;

    var lastLoopEndTime = currentTime;
    var startingTransposeUp = transposeUpCount;
    var startingTransposeDown = transposeDownCount;
    scroll();

    function scroll() {
      var numberOfTransposeUpsSinceStart = transposeUpCount - startingTransposeUp;
      var numberOfTransposeDownsSinceStart = transposeDownCount - startingTransposeDown;
      var goalScrollOffset = numberOfTransposeUpsSinceStart * (getCardOffsetPx()) - numberOfTransposeDownsSinceStart * (getCardOffsetPx)();

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
        lastLoopEndTime = currentTime
        setTimeout(scroll , 1);
      }
    }
  }
}

