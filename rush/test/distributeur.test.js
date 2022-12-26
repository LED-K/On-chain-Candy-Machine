const fs = require('fs');
const { compile } = require('./compile.test');

const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3');
const web3 = new Web3(provider);

const mocha = require('mocha');
const assert = require('assert');

mocha.describe('Rush', () => {
    const contractName = 'Distributeur';
    let accounts = undefined;
    let contract = undefined;

    mocha.beforeEach(async () => {
        const { abi, bytecode } = compile(contractName, {
            'Distributeur.sol': {
                content: fs.readFileSync('./exercices/rush/sources/' + contractName + ".sol", "utf-8")
            }
        });
        accounts = await web3.eth.getAccounts();
        contract = await new web3.eth.Contract(abi)
            .deploy({data: bytecode.object.toString()})
            .send({from: accounts[0], gas: 3000000});
    });
    mocha.it('has been deployed', () => {
        assert.ok(contract.options.address);
    });
    mocha.it('test functions', async () => {
        //test for ICE_TEA
        const iceTeaBalanceGet = await contract.methods.getMetsBalance(0).call();
        assert.equal(iceTeaBalanceGet,10);
        const account = await web3.eth.getAccounts();
        //withdraw 1 ice tea
        const requestIceTea = await contract.methods.withdrawMets(1,0).send({from:account[0],value:'3000000000000000'});
        const iceTeaBalanceGet2 = await contract.methods.getMetsBalance(0).call();
        //Check balance after widhdraw
        assert.equal(iceTeaBalanceGet2,9);
        //Refill mets
        const iceTeaBalanceSet = await contract.methods.setMetsBalance(0,1).send({from:account[0]});
        const iceTeaBalanceGet3 = await contract.methods.getMetsBalance(0).call();
        //check balance after refill
        assert.equal(iceTeaBalanceGet3,10);
        
    });
});
