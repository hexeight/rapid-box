const express = require('express');
var bodyParser = require('body-parser');

const Contracts = require('./app/contracts.js');

const port = process.env.PORT || 80;

const app = express();
app.use(bodyParser.json());

// Routes
// Get all unlocked accounts
app.get('/accounts', function (req, res) {
    Contracts.web3.eth.getAccounts(function (err, accounts) {
        if (err) { res.status(500).json({ error: err }); return; }
        res.json({
            accounts: accounts
        });
    });
});

// Get storage contract value
app.get('/storage', function (req, res) {
    Contracts.SimpleStorage.deployed().then(function (instance) {
        instance.get.call().then(function (value) {
            res.json({
                value: value
            });
        });
    });
});

// Set storage contract value
app.post('/storage', function (req, res) {
    var value = req.body.value;
    Contracts.SimpleStorage.deployed().then(function (instance) {
        instance.set(value, { from: Contracts.accounts[0] }).then(function (tx) {
            res.json({
                transaction: tx
            });
        });
    });
});

app.listen(port);