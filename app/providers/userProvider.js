var persistence = require('../persistence/persistence');
var dataHelper = require('../helpers/dataHelper');
var DATABASE = 'users';

// Public methods (exports)
exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUser = getUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;

// private methods
function createUser (data, done) {
    data.id = data.userName;
    persistence.save(DATABASE, data, function (err, doc) {
        if (err) console.log('Unable to connect to CouchDB');
        if (doc.error) console.log('Unable to save the user');
        done(null, doc);
    });
}

function getUsers (done) {
    persistence.request('GET',DATABASE + '/_all_docs', function (err, data) {
        if (err) return done('Unable to connect to CouchDB');
        if (data.error) return done('Unable to get the users');
        console.log('Provider: ' + DATABASE + ': total_rows: ', data.total_rows);
        done(null, data.rows)
    })
}

function getUser (userId, done) {
    persistence.request('GET',DATABASE + "/" + userId, function (err, data) {
        if (err) return done('Unable to connect to CouchDB');
        if (data.error) return done('Unable to get the user');
        console.log('Provider: ' + DATABASE + ': total_rows: ', data);
        done(null, data)
    })
}

function updateUser (userId, updatedUserData, done) {
    getUser(userId, function (err, doc) {
        updatedUserData._rev = doc._rev;
        updatedUserData.id = doc._id;
        persistence.save(DATABASE, updatedUserData, function (err, doc) {
            if (err) console.log('Unable to connect to CouchDB');
            if (doc.error) console.log('Unable to save the announcement');
            done(null, doc);
        });
    });
}

function deleteUser (userId, done) {
    getUser(userId, function (err, doc) {
        persistence.request('DELETE', DATABASE + '/' + userId + '?rev=' + doc._rev, function (err, data) {
            if (err) return done('Unable to connect to CouchDB');
            if (data.error) return done('Unable to get the users');
            console.log('Provider: ' + DATABASE + ': total_rows: ', data.total_rows);
            done(null, data.rows)
        });
    });
}