var CATALOG = [
    { regex: /ipod|iphone/i, name: 'iphone' },
    { regex: /ipad/i,        name: 'ipad'   }
];

function extractDevice (ua) {
    var name;

    CATALOG.some(function (entry) {
        if (entry.regex.test(ua)) {
            name = entry.name;
            return true;
        }
    });

    return name || 'desktop';
}

function isSupported (device) {
    return CATALOG.some(function (entry) {
        return entry.name === device;
    });
}

module.exports = function (req, res, next) {
    req.context = req.context || {};

    var ua      = req.headers['user-agent'],
        device  = req.query.device;

    if (device && isSupported(device)) {
        req.context.device = device;
    } else {
        req.context.device = extractDevice(ua);
    }

    console.log('[context]', 'device=' + req.context.device);

    next();
};
