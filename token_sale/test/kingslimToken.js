var kingslimToken = artifacts.require('kingslimToken');

contract('kingslimToken', function(accounts) {
	
	it('initializes the contract with the current values', function() {
		return kingslimToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name, 'King Slim Token', 'has the correct name');
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,  'King Slim', 'has correct symbol');
			return  tokenInstance.standard();
		}).then(function(standard){
			assert.equal(standard, 'King Slim Token v1.0', 'has correct standard');
			return tokenInstance.standard();
		});
	});

	it('sets the total allocates upon deployment', function() {
		return kingslimToken.deployed().then(function(instance){
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
		return kingslimToken.deployed().then(function(instance){
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
	
	it('approves tokens for delegated transfer', function() {
		return kingslimToken.deployed().then(function(instance){
			tokenInstance = instance;
			return tokenInstance.approve.call(accounts[1], 1);
		}).then(function(success){
			assert.equal(success, true, 'it returns true');
			return tokenInstance.approve(accounts[1], 1, {from:accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Approval', 'triggers one event');
			assert.equal(receipt.logs[0].args._value, 1, 'logs the transfer amount');
			return tokenInstance.allowance(accounts[0], accounts[1]
				);
		}).then(function(allowance){
			assert.equal(parseInt(allowance), 1, 'stores the allowance for delegated transfer');
		});
	});


	it('handles delegated token transfers', function(){
		return kingslimToken.deployed().then(function(instance){
			tokenInstance = instance;
			fromAccount = accounts[2];
			toAccount = accounts[3];
			spendingAccount = accounts[4];

			return tokenInstance.transfer(fromAccount, 100, {from:accounts[0]});
		}).then(function(receipt){
			return tokenInstance.approve(spendingAccount, 10, {from: fromAccount});
		}).then(function(receipt){
			return tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from:spendingAccount})
		}).then(function(success){
			assert.equal(success, true);
			return tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendingAccount});
		}).then(function(receipt){
			assert.equal(receipt.logs.length, 1, 'triggers one event');
			assert.equal(receipt.logs[0].event, 'Transfer', 'triggers one event');
			assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the toknes are transferred from');
			assert.equal(receipt.logs[0].args._to, toAccount, 'logs the transfer amount');
			assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount');
			return tokenInstance.balanceOf(fromAccount);
		}).then(function(balance){
			assert.equal(parseInt(balance), 90, 'deducts the amount from the sending Account');	
		});
	})
});