
function generateInfoCard(margin, height) {
  var flashCard = $("#flash-card-model").clone().removeAttr("id")//.hide();
  flashCard.css({
    "margin-bottom": margin + "vh",
    "height": height + "vh"
  });

  return flashCard
}

InfoCardView = function(noteCardController) {
  var self = this;

  var infoCardsContainer = $(".card-container");

  var margin = 20;
  var height = 50;

  var focusedCard;

  var infoCards = [];

  var initializationList = [1, 2, 3];
  // initialize the 6 displayable cards
  $.each(initializationList, function(index, n) {
    var cardEl = generateInfoCard(margin, height)
    var newCard = new NoteCard(cardEl, infoCardsContainer);
    $(infoCardsContainer).append(cardEl);
//    cardEl.html("this is number " + n);
    infoCards.push({card: newCard, cardEl: cardEl});
    // + 1 from the placeholder, +/- 2 for the buffer and partially showing note.
//    var upperHideBound = (margin + height) * n;
//    var lowerHideBound = (margin + height) * n - (margin + height);
//    console.log("upper " + upperHideBound);
//    console.log("lower " + lowerHideBound);
//    infoCards.push({ upper:  upperHideBound: upperHideBound, lowerHideBound: lowerHideBound, card: newCard, cardEl: cardEl});
  })

  var placeHolderBottom = generateInfoCard(margin, height).css("visibility", "hidden");
  var placeHolderTop = generateInfoCard(margin, height).css("visibility", "hidden");

  infoCardsContainer.append(placeHolderBottom);
  infoCardsContainer.prepend(placeHolderTop);

  var numberOfCards = initializationList.length;

  // if the top of a info card passes either of these two limits, we hide it.
  var topBuffer = margin + height + 10; // accounts for the placeholder
  var bottomBuffer = 100 + 10;

  // info card display constants in percentage of view port height


  self.addNoteCard = function() {
//    console.log("adding note card")
//    var numberOfCards = infoCards.length;
//
//    var cardEl = generateInfoCard(margin, height)
//    var newCard = NoteCard(cardEl);
//    $(infoCardsContainer).prepend(cardEl);
//
//    // + 1 from the placeholder, +/- 2 for the buffer and partially showing note.
//    var upperHideBound = (margin + height) * numberOfCards + 3;
//    var lowerHideBound = (margin + height) * numberOfCards - 1;
//
//    infoCards.push({ upperHideBound: upperHideBound, lowerHideBound: lowerHideBound, card: newCard});
  }

  function checkForNextOrPreviousNote(e) {
    var currentScroll = infoCardsContainer.scrollTop();
    var cardToMoveUp =  false;
    var cardToMoveDown = false;

    var upperLimit = -1 * topBuffer - 5;
    var lowerLimit = bottomBuffer + 5;

    $.each(infoCards, function(i, cardData) {
      var cardTop = ((cardData.cardEl.position().top / infoCardsContainer.height()) * 100)

      if (cardTop < upperLimit) {
        cardToMoveDown = cardData.cardEl;
      } else if(cardTop > lowerLimit) {
        cardToMoveUp = cardData.cardEl;
      } else if(focusedCard !== cardData.card) {
        focusedCard = cardData.card
        var challengeObject = noteCardController.nextNote();
        cardData.card.showChallenge(challengeObject);
//        debugger;
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

var NoteCard = function(cardEl, infoCardsContainer) {
  var self = this;

  var preUnderline = cardEl.find('.pre-underline');
  var underline = cardEl.find('.underline');
  var postUnderline  = cardEl.find('.post-underline');

  var challenge = cardEl.find('.challenge');
  var result = cardEl.find('.result');

  self.showChallenge = function(challengeObject) {
    submitBinding = KeyBinding.keypress(KeyCode.enter, $(self.cardEl), submitNote);
    updateNoteText(challengeObject);
    challenge.show();
    var y = infoCardsContainer.scrollTop();
    challenge.focus();
    infoCardsContainer.scrollTop(y);
  }

  self.hideChallenge = function() {
    challenge.hide();
  }

  self.showResult = function() {

  }

  self.hideResult = function() {

  }

  function submitNote() {
    var missingWord = underline.val();
    infoCardController.submitNote(missingWord);
  }

  function updateNoteText(text) {
    console.log("upating note text with:", text)
    underline.val("");
    underline.attr("size", text.missingWord.length - 1);

    postUnderline.html(text.postfix);
    preUnderline.html(text.prefix)
  }
}