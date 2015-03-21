/*
  This view allows an infinite list of cards, rendered just in time. The view manages three cards. When
  the user is about to scroll to a point where another card needs to show up at the bottom, the view moves the top
  card to the bottom. Same for when a card needs to rendered at the top. When a card is moved the content in the card
  is changed, so that it appears that the user is actually scrolling through a list with cards containing different
  content. The rendering occurs by calling one of the two functions passed as arguments, fillNextCard or
  fillPreviousCard. fillNextCard is called when moving a card from the bottom to the  top, to prepare for the user
  seeing the next card. The opposite is true for fillPreviousCard. The methods are passed the jquery element for the
  card container being moved. These methods should return an object with at least 4 methods, render,
  shouldSwitchFocus, focus and destroy. centerOn should be 1 of 3 options: 0, 1, or 2. Where 0 is first card, 1 is
  middle and 2 is last.

  render: called after a card is moved. render should insert the correct content into the card.

  shouldSwitchFocus: called every time a user scrolls, passing the parent container for the scrollCardView.
  shouldSwitchFocus should return true if a card needs to be focused at that time.

  focus: perform any logic necessary to focus the card.

  destroy: called when the card is being moved, before the next or previous is rendered. destroy should perform any
  tear down actions (unbinding callbacks etc.). it is the last call that is made to the object.
 */

ScrollCardView = function(fillNextCard, fillPreviousCard, centerOn) {

  var self = this
  var parentContainer;

  var topBumper;
  var bottomBumper;

  self.render = function(parentContainerArg) {
    parentContainer = parentContainerArg;

    bottomBumper = generateCard(bottomBumperMargin, bottomBumperHeight).css("visibility", "hidden");
    topBumper = generateCard(topBumperMargin, topBumperHeight).css("visibility", "hidden");

    parentContainer.append(bottomBumper);
    parentContainer.prepend(topBumper);

    // initialize the 3 displayable cards
    $.each(initializationList, function(index, n) {
      var cardEl = generateCard(margin, height);
      var card = fillNextCard(cardEl);

      if (card) {
        console.log("adding the card");
        topBumper.after(cardEl);
        card.render();
        cards.push({cardEl: cardEl, card: card});
      } else {
        topBumper.after(cardEl);
        cardEl.css("display", "none");
        cards.push({cardEl: cardEl, notDisplayed: true})
      }
    })

    scrollToCenterCard(centerOn)

    parentContainer.scroll(fillNextOrPreviousCardIfNecessary);
  }

  function getCardIndex(cardToFind) {
    var indexToReturn = -1;
    $.each(cards, function(i, card){
      if (cardToFind == card) {
        indexToReturn = i;
        return false
      }
    })
    return indexToReturn;
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
  var margin = 20;
  var height = 50;

  // the top bumper needs to be high enough such that the top card is centered when all the way scrolled
  var topBumperMargin = 0
  var topBumperHeight = Math.max(0, (100 - height)/2 - topBumperMargin);

  var bottomBumperMargin = 0
  var bottomBumperHeight = Math.max(0, (100 - height)/2 - margin);


  var cards = [];

  var initializationList = [1, 2, 3];

  var focusedCard;
  var focusableCards = [];

  // if the top of a info card passes this limit, we move it to the bottom
  var topBuffer = topBumperMargin + topBumperHeight + margin + height + 10; // accounts for the bumper

  // if the top of a info card passes this limit, we move it to the bottom
  var bottomBuffer = 100 + 10;

  // the scroll percentage which is necessary to center the middle card;
  function percentScrollToCenterCard(cardNumber) {
    return topBumperMargin + topBumperHeight + (height + margin) * cardNumber + height/2;
  }

  function getCardOffsetPx() {
    return (margin + height)/100 * parentContainer.height();
  }

  function getCenteredScrollPx(cardNumber) {
    var parentHeight = parentContainer.height();
    return (percentScrollToCenterCard(cardNumber) / 100) * parentHeight - parentHeight / 2;
  }

  function moveCardDown(cardToMoveDown) {
    var currentScroll = parentContainer.scrollTop();
    var newScrollPos = currentScroll - ((margin + height) / 100)  * parentContainer.height();

    var currentBottomCard = cards[cards.length - 1];

    var cardContent = fillPreviousCard(cardToMoveDown.cardEl, currentBottomCard.card.getCursor());

    if (cardContent) {
      cardToMoveDown.card && cardToMoveDown.card.destroy();
      cardToMoveDown.card = cardContent;

      // rearrange the note list
      var cardIndex = cards.indexOf(cardToMoveDown);
      cards.splice(cardIndex, 1);
      cards.push(cardToMoveDown);

      // rearrange the note elements in the dom
      cardToMoveDown.cardEl.detach();
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
    var newScrollPos = currentScroll + ((margin + height) / 100) * parentContainer.height();

    var currentTopCard = cards[0];

    var cardContent = fillNextCard(cardToMoveUp.cardEl, currentTopCard.card.getCursor());

    if (cardContent) {
      cardToMoveUp.card && cardToMoveUp.card.destroy();
      cardToMoveUp.card = cardContent;

      // rearrange the note list
      var cardIndex = cards.indexOf(cardToMoveUp);
      cards.splice(cardIndex, 1);
      cards.unshift(cardToMoveUp);

      // rearrange the note elements in the dom
      cardToMoveUp.cardEl.detach();
      topBumper.after(cardToMoveUp.cardEl);

      // render the new note
      cardContent.render();

      transposeUpCount += 1;

      // scroll to compensate for the element changes.
      parentContainer.scrollTop(newScrollPos);
    }
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

  self.scrollNCards = function(numOfCardsToScroll) {

    // if we are scrolling 0 cards, do nothing
    if (numOfCardsToScroll === 0) {
      return
    }

    var currentScroll = parentContainer.scrollTop();
    var numOfCardsToScrollSign = numOfCardsToScroll && (Math.abs(numOfCardsToScroll) / numOfCardsToScroll);

//    if ((currentScroll < 5) || (currentScroll > (parentContainer.height() - 5))) {
//      attemptToFillMissingCards();
//      fillNextOrPreviousCardIfNecessary();
//    }

    // recalculate the current scroll in case new
    currentScroll = parentContainer.scrollTop();

    var centeredScrollPx = getCenteredScrollPx(1);
    var scrollByToCenter = centeredScrollPx + (currentScroll * numOfCardsToScrollSign);

    // if the sign of the scrollByToCenter is not that same as the number of cards we want
    // to scroll, then we'll have to get the distance to the next card. This is so we always scroll
    // in the correct direction.
    if (scrollByToCenter * numOfCardsToScrollSign < 0) {
      scrollByToCenter = (getCardOffsetPx() - Math.abs(scrollByToCenter)) * numOfCardsToScrollSign;
      centeredScrollPx = currentScroll + scrollByToCenter;
    }

    // if we're close to centered let's pretend we're centered and just scroll up to the next card.
    // else, let's count the scroll to the next card as a full card scroll.
    if (Math.abs(scrollByToCenter) > 5) {
      numOfCardsToScroll = numOfCardsToScroll + (-1 * numOfCardsToScrollSign);
    }

    var scrollToCenter = centeredScrollPx + getCardOffsetPx() * numOfCardsToScroll;

    animateScroll(scrollToCenter, 700);
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

    // this specifies the different orderings of card display we should use, depending on which
    // card should be centered. fixScrollOn specifies on which elements we should scroll down, to compensate
    // for a shift in cards shown on screen.
    var cardListOrdering = [
      {cards: [cards[0], cards[1], cards[2]], fixScrollOn: []},
      {cards: [cards[1], cards[0], cards[2]], fixScrollOn: [1]},
      {cards: cards, fixScrollOn: [1,2]}
    ]

    var orderedCards = cardListOrdering[centerOn];
    var scrollCompensation = 0;

    $.each(orderedCards.cards, function(i, card) {
      if (card.notDisplayed) {
        var cursor = cards[getCardIndex(card) - 1];
        var cardContent = fillNextCard(card.cardEl, 0) || fillPreviousCard(card.cardEl, 0);
        console.log("card content", cardContent);
        if (cardContent) {
          card.cardEl.css("display", "block");
          card.card = cardContent;
          topBumper.after(card.cardEl);
          card.card.render();
          card.notDisplayed = false;

          if (orderedCards.fixScrollOn.indexOf(i) > -1) {
            scrollCompensation += getCardOffsetPx();
          }
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
    var currentScroll = parentContainer.scrollTop();
    var pxToScroll = Math.abs(currentScroll - scrollTo);

    var d = new Date();
    var currentTime = d.getTime();

    var desiredEndTime = currentTime + timeToTake;

//    console.log("srating scroll is: " + parentContainer.scrollTop());
//    console.log("starting goal scroll is: " + scrollTo);

    var lastLoopEndTime = currentTime;
    var startingTransposeUp = transposeUpCount;
    var startingTransposeDown = transposeDownCount;
//    var unitToScrollBy = 2
    scroll();

    function scroll() {
      console.log("scrolling now");
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

      console.log("step size is: ", stepSize)

      if (scrollDifference > 1 || scrollDifference < -1){
        var absInterval = Math.min(Math.abs(scrollDifference), stepSize);

        var interval = scrollDifference < 0 ? -1 * absInterval : absInterval
        var newScrollTo = currentScroll + interval
        parentContainer.scrollTop(newScrollTo);
        lastLoopEndTime = currentTime
        setTimeout(scroll , 1);
      }

      console.log("desired end time: ", desiredEndTime, "actual end time", currentTime);
    }
  }
}

