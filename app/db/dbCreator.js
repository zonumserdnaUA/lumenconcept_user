var request = require('request');
var url = 'http://admin:admin@127.0.0.1:5984';
var dbUtil = {};
dbUtil.createResourceDB = function (method, url, body, done) {
    console.log('DB Util : ' + method + ' : ' + url);
    request({
            url: url,
            json: true,
            body: body,
            method: method
        },
        function (err, resp, body) {
            if (err) {
                console.log('DB Util : Unable to connect CouchDB');
                done(err);
                return;
            }
            if (body.ok) {
                console.log('DB Util : ' + method + ' : ' + url + '  [OK]');
                done(body);
                return;
            }
            console.log('DB Util : Unable to ' + method + ' the ' + url);
        }
    );
};

var userView = {
    "_id": "_design/voicesDesignDoc",
    "views": {"by_userName": {"map": "function (doc) {\n  emit(doc.userName, doc);\n}"}},
    "language": "javascript"
};
/*var announcementView = {
    "_id": "_design/voicesDesignDoc",
    "views": {
        "by_owner": {"map": "function (doc) {\n  emit([doc.owner, doc.timeStamp], doc);\n}"},
        "by_publicUrl": {"map": "function (doc) {\n  emit([doc.publicUrl, doc.timeStamp], doc);\n}"}
    },
    "language": "javascript"
};
var voiceView = {
    "_id": "_design/voicesDesignDoc",
    "views": {"by_creation_date": {"map": "function (doc) {\n  emit([doc.announcementId, doc.timeStamp], null);\n}"}},
    "language": "javascript"
};*/

dbUtil.createResourceDB('CREATE', url + '/users', null, function () {
    dbUtil.createResourceDB('PUT', url + '/users', null, function () {
        dbUtil.createResourceDB('PUT', url + '/users/_design/DesignedDocs', userView, function () {
        });
    });
});
/*dbUtil.createResourceDB('DELETE', url + '/announcements', null, function () {
    dbUtil.createResourceDB('PUT', url + '/announcements', null, function () {
        dbUtil.createResourceDB('PUT', url + '/announcements/_design/DesignedDocs', announcementView, function () {
        });
    });
});
dbUtil.createResourceDB('DELETE', url + '/voices', null, function () {
    dbUtil.createResourceDB('PUT', url + '/voices', null, function () {
        dbUtil.createResourceDB('PUT', url + '/voices/_design/DesignedDocs', voiceView, function () {
        });
    });
});*/





