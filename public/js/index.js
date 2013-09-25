(function (w, d, undefined) {

var Y = YUI().use('dom-screen'), // basic DOM operations

    movieLists  = d.querySelector('#main .bd'),
    closeButton = d.querySelector('#close'),
    detailView  = d.querySelector('#detail'),
    mainView    = d.querySelector('#main'),
    movieTitle  = d.querySelector('#detail .movie-title'),
    playButton  = d.querySelector('#detail .play'),

    timeoutId;

// TODO: conditionally load the rest of the rows
function lazyLoadRows () {
    var movies = d.querySelectorAll('.movie'),
        movie,
        len,
        i;
    for (i = 0, len = movies.length; i < len; i += 1) {
        movie = movies[i];
        if (!Y.DOM.hasClass(movie, 'loaded')) {
            Y.DOM.addClass(movie, 'loaded');
            movie.setAttribute('style', 'background-image:url(' + movie.dataset.image + ')');
        }
    }
}

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
        lazyLoadRows();
    }, 300);
});

}(window, document));
