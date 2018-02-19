var express = require('express');
var router = express.Router();
var userProvider = require('../providers/userProvider');

console.log('Init User Controller');
// Save a User
router.post('/api/user', function (req, res) {
    userProvider.createUser(req.body, function (err, doc) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(doc));
    });
});

// Get users
router.get('/api/user', function (req, res) {
    userProvider.getUsers(function (err, docs) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(docs));
    });
});

// Get User
router.get('/api/user/:userId', function (req, res) {
    userProvider.getUser(req.params.userId, function (err, doc) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(doc));
    })
});

// Update user
router.put('/api/user/:userId', function (req, res) {
    userProvider.updateUser(req.params.userId, req.body, function (err, doc) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(doc));
    })
});

// Delete user
router.delete('/api/user/:userId', function (req, res) {
    userProvider.deleteUser(req.params.userId, function (err, doc) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(doc));
    })
});

module.exports = router;