(function() {
    /**
     *
     * @type img|Boolean
     */
    var resourceCache = {};

    /**
     *
     * @type Array
     */
    var loading = [];

    /**
     *
     * @type Array
     */
    var readyCallbacks = [];

    /**
     * Load an image url or an array of image urls
     *@function
     */
    function load(urlOrArr) {
        if(urlOrArr instanceof Array) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    /**
     *
     * @param {type} url
     * @returns {resourceCache|resources_L1.resourceCache}
     */
    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    /**
     *
     * @param {type} url
     * @returns {resources_L1.resourceCache|Boolean}
     */
    function get(url) {
        return resourceCache[url];
    }

    /**
     *
     * @returns {Boolean}
     */
    function isReady() {
        var ready = true;
        for(var k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    /**
     *
     * @param {type} func
     * @returns {undefined}
     */
    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.Resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
