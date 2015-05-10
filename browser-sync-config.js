/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
module.exports = {
    "ui": {
        "port": 9003,
    },
    "files": ['build'],
    "server": {
      baseDir: [ '.' ],
      routes: {
      }
    },
    "proxy": false,
    port: 9002,
    "open": false,
    "reloadDebounce": 1000,
    "host": 'js-test.dev'
};
