var request = require('request');
var querystring = require('querystring');

function getDBUrl() {
    var url = process.env.VOX_COUCHDB_URL || 'http://admin:admin@127.0.0.1:5984';
    return url;
}
// Save a document
exports.save = function (db, data, done) {
    data.timeStamp = new Date().getTime();
    // todo: change the url to getDBUrl() + '/' + db
    var resourceUrl = getDBUrl() + '/' + db + '/' + data.id;
    console.log('Persistence : save : ' + resourceUrl);
    // todo: change this request to a post method
    request.put({
        url: resourceUrl,
        body: data,
        json: true
    }, function (err, resp, body) {
        if (err) return done('Unable to connect CouchDB');
        if (body.ok) {
            data._rev = body.rev;
            console.log('Persistence : save :  OK : ' + resourceUrl);
            return done(null, data);
        }
        done('Unable to save the document')
    })
};

// Get all documents with the built-in 'All' view
/**
 include_docs:
 descending:
 skip:
 limit:
 key:
 startkey:
 endkey:
 **/
exports.request = function (method, db, done) {
    var resourceUrl = getDBUrl() + '/' + db;
    console.log('Persistence : query :', resourceUrl);
    request({
        url: resourceUrl,
        json: true,
        method: method
    }, function (err, res, body) {
        if (err) return done('Unable to connect to CouchDB');
        console.log('Persistence : query : OK :', resourceUrl);
        done(null, body);
    })
};