(function (w, d, undefined) {

// region management functionality (http://yuilibrary.com/yui/docs/api/modules/dom-screen.html)
var Y = YUI().use('dom-screen'),

    movieLists  = d.querySelector('#main .bd'),
    closeButton = d.querySelector('#close'),
    detailView  = d.querySelector('#detail'),
    mainView    = d.querySelector('#main'),
    movieTitle  = d.querySelector('#detail .movie-title'),
    playButton  = d.querySelector('#detail .play'),

    scrollViewNodeList = d.querySelectorAll('.scrollview'),
    scrollViewArray    = Array.prototype.slice.apply(scrollViewNodeList),

    lists = [],

    selectedMovie,
    timeoutId;

function bind (context, fn) {
    return function () {
        fn.apply(context, arguments);
    };
}

function MovieList (node) {
    var self = this;

    this.node = node;
    this.cards = node.getElementsByTagName('li');
    this.loaded = [];

    this.node.addEventListener('scroll', function () {
        if (self.timeoutId) {
            w.clearTimeout(self.timeoutId);
        }
        self.timeoutId = setTimeout(function () {
            self.loadVisible();
        }, 100);
    });
}

MovieList.prototype = {
    /**
    Load the box art for a card. Uses detailed images when available.
    @param {Node} card
    **/
    load: function (card) {
        var image = card.dataset.detailed || card.dataset.image;
        card.setAttribute('style', 'background-image:url(' + image + ')');
        this.loaded.push(card);
    },

    /**
    Loads the box art for cards that are visible in the viewport. Caches loaded
    cards to minimize DOM interaction.
    @method loadVisible
    @param refresh Force a refresh of the NodeList of cards.
    **/
    loadVisible: function () {
        var card,
            len,
            i;

        for (i = 0, len = this.cards.length; i < len; i += 1) {
            card = this.cards[i];

            if (
                this.loaded.indexOf(card) === -1 && // card has not been loaded
                Y.DOM.inViewportRegion(card)        // card is in viewport
            ) {
                this.load(this.cards[i]);
            }
        }

        this.fill(); // load any gaps
    },

    /**
    Loads any unloaded cards that come before the most recently loaded card.
    **/
    fill: function () {
        var endmost = this.loaded[this.loaded.length - 1],
            card,
            len,
            i;

        if (endmost) {
            for (i = 0, len = this.cards.length; i < len; i += 1) {
                card = this.cards[i];
                if (card === endmost) {
                    break;
                }
                this.load(card);
            }
        }
    }
};

// hide detail view and show main view
closeButton.addEventListener('click', function () {
    Y.DOM.removeClass(mainView, 'hidden');
    Y.DOM.addClass(detailView, 'hidden');

    // give the selected movie focus when returning to the gallery
    selectedMovie.focus();
});

// event delegation for movie clicks
movieLists.addEventListener('click',  function (e) {
    if (e.target.tagName === 'BUTTON') {
        var image   = e.target.parentNode.dataset.image,
            title   = e.target.firstChild.textContent;

        movieTitle.textContent = title;
        playButton.setAttribute('style', 'background-image:url(' + image + ')');

        Y.DOM.removeClass(detailView, 'hidden');
        Y.DOM.addClass(mainView, 'hidden');

        selectedMovie = e.target;
    }
});

w.addEventListener('scroll', function () {
    if (timeoutId) {
        w.clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(function () {
        for (var i = 0, len = lists.length; i < len; i += 1) {
            lists[i].loadVisible();
        }
    }, 100);
});

// initialize all MovieList instances
scrollViewArray.forEach(function (sv) {
    var list = new MovieList(sv);
    list.loadVisible();
    lists.push(list);
});

}(window, document));
