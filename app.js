var express = require('express'),
    exphbs  = require('express3-handlebars'),
    apiData = require('./data/sample-movie-lists'),
    app     = express(),
    port    = process.env.PORT || 5000,

    middleware = {
        context: require('./lib/middleware/context')
    },

    tplData,
    iphoneData,
    ipadData;


function normalizeData (apiData, load) {
    var normalized = [];

    apiData.lists.forEach(function (list, index) {
        var category = {
            name: list.summary.displayName,
            movies: []
        };

        // flag the rows which should initially show images
        if (index < load) {
            category.load = true;
        }

        // causes the `detailed` class to be added in the template
        if (list.summary.type === 'RecentlyWatchedList') {
            category.detailed = true;
        }

        list.movies.forEach(function (id) {
            var data = apiData.movies[id],
                boxArt = data.summary.box_art;

            category.movies.push({
                id:     id,
                title:  data.summary.title.title_short,
                image: {
                    s:  boxArt['150x214'],
                    m:  boxArt['284x405'],
                    l:  boxArt['350x197'],
                    xl: boxArt['665x375']
                }
            });
        });
        normalized.push(category);
    });

    return normalized;
}

tplData     = normalizeData(apiData, 0);
iphoneData  = normalizeData(apiData, 3);
ipadData    = normalizeData(apiData, 6);

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.logger());

// gzipped responses
app.use(express.compress());

app.use(express.static(__dirname + '/public'));

app.use(middleware.context);

app.get('/', function(req, res) {
    res.render('index', {
        device: req.context.device,
        movieData: req.context.device === 'iphone' ? iphoneData : ipadData
    });
});

// for debugging
app.get('/data', function (req, res) {
    res.send(req.context.device === 'iphone' ? iphoneData : ipadData);
});

app.listen(port, function() {
    console.log('Listening on ' + port);
});
