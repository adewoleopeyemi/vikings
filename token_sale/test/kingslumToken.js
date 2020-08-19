var kingslumToken = artifacts.require('kingslumToken');

contract('kingslumToken', function(accounts) {
	
	it('initializes the contract with the current values', function() {
		return kingslumToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name, 'King Slum Token', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,  'King Slum', 'has correct symbol');
			return  tokenInstance.standard();
		}).then(function(standard){
			assert.equal(standard, 'King Slum Token v1.0', 'has correct standard');
			return tokenInstance.standard();
		});
	});

	it('sets the total alloctaes upon deployment', function() {
		return kingslumToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(parseInt(totalSupply), 1000000, 'sets the total supply to 1,000,000');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(parseInt(adminBalance), 1000000, 'it allocates the inital supply to the admin  account'); 
		});
	}); 

	it('transfers token ownership', function(){
		return kingslumToken.deployed().then(function(instance){
			tokenInstance = instance;

			return tokenInstance.transfer.call(accounts[1], 99999999999999999999999);
		}).then(assert.fail).catch(function(error){
			assert(error.message, 'error message must cointain revert');
			return tokenInstance.transfer.call(accounts[1], 250000, {from:accounts[0]});
		}).then(function(success){
			assert.equal(success, true, 'it returns true');
			return tokenInstance.transfer(accounts[1], 250000, {from:accounts[0]});
		}).then(function(receipt) {
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'triggers one event');
			assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the toknes are transferred from');
			assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the transfer amount');
			assert.equal(receipt.logs[0].args._value, 250000, 'logs the transfer amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(parseInt(balance), 250000, 'adds the amount to the recieving account');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(parseInt(balance), 750000, 'deducts from the sending account');
	});
});
});