const Web3 = require('web3'); 
const Contract = require('truffle-contract');
const fs = require('fs');

var provider = new Web3.providers.HttpProvider("http://localhost:9545");
var web3 = new Web3(provider);

web3.eth.getAccounts(function (err, accounts) {
    exports.accounts = accounts;
});

const buildPath = "./build/contracts/";
// Load contracts from build
fs.readdirSync(buildPath).forEach(abiFile => {
    if (abiFile.split(".")[1] !== "json") { return; }
    const contractABI = require("." + buildPath + abiFile);
    var contractObj = Contract(contractABI);
    contractObj.setProvider(provider);
    //dirty hack for web3@1.0.0 support for localhost testrpc, see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
    if (typeof contractObj.currentProvider.sendAsync !== "function") {
        contractObj.currentProvider.sendAsync = function() {
        return contractObj.currentProvider.send.apply(
            contractObj.currentProvider, arguments
        );
    };
    }
    contractObj.detectNetwork();
    exports[abiFile.split(".")[0]] = contractObj;
});