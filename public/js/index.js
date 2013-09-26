(function (w, d, undefined) {

// region management functionality (http://yuilibrary.com/yui/docs/api/modules/dom-screen.html)
var Y = YUI().use('dom-screen'),

    movieLists  = d.querySelector('#main .bd'),
    closeButton = d.querySelector('#close'),
    detailView  = d.querySelector('#detail'),
    mainView    = d.querySelector('#main'),
    movieTitle  = d.querySelector('#detail .movie-title'),
    playButton  = d.querySelector('#detail .play'),

    loadedCards = [],

    timeoutId,
    cards;

/**
Loads the box art for cards that are visible in the viewport. Caches loaded
cards to minimize DOM interaction.
@method loadVisible
@param refresh Force a refresh of the NodeList of cards.
**/
function loadVisible (refresh) {
    var image,
        card,
        len,
        i;

    if (!cards || refresh) {
        cards = d.querySelectorAll('.movie');
        loadedCards = [];
    }

    for (i = 0, len = cards.length; i < len; i += 1) {
        card = cards[i];

        // if the card has not been loaded yet and the card is visible
        if (loadedCards.indexOf(card) === -1 && Y.DOM.inViewportRegion(card)) {
            // give detailed image higher priority
            image = card.dataset.detailed || card.dataset.image;

            card.setAttribute('style', 'background-image:url(' + image + ')');
            loadedCards.push(card);
        }
    }
}

loadVisible();

// hide detail view and show main view
closeButton.addEventListener('click', function () {
    Y.DOM.removeClass(mainView, 'hidden');
    Y.DOM.addClass(detailView, 'hidden');
});

// event delegation
movieLists.addEventListener('click',  function (e) {
    if (e.target.tagName === 'BUTTON') {
        var image   = e.target.parentNode.dataset.image,
            title   = e.target.firstChild.textContent;

        movieTitle.textContent = title;
        playButton.setAttribute('style', 'background-image:url(' + image + ')');

        Y.DOM.removeClass(detailView, 'hidden');
        Y.DOM.addClass(mainView, 'hidden');
    }
});

// lazy load when the user stops scrolling
w.addEventListener('scroll', function () {
    if (timeoutId) {
        w.clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(function () {
        loadVisible();
    }, 100);
});

}(window, document));
