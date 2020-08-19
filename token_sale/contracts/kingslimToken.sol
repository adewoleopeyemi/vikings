pragma solidity ^0.5.16;

contract kingslimToken{
	//constructor
	//set the tokens
	//read the total number of token
	//add a name
	//add a symbol 
	string public name = 'King Slim Token';
	string public symbol = 'King Slim';
	string public standard = 'King Slim Token v1.0';
	uint256 public totalSupply;
	event Transfer(address indexed _from,
	address indexed _to,
	uint256 _value);
	event Approval(
	address indexed _owner, address indexed _spender, uint256 _value);



	mapping(address=>uint256) public balanceOf;

	constructor (uint256 _initialsupply) public {
		balanceOf[msg.sender] = _initialsupply;
		totalSupply = _initialsupply;

		//alloate the initial supply
	}

	// Transfer token function
	
	function transfer(address _to, uint256 _value) public returns (bool success) {
		require(balanceOf[msg.sender] >= _value);
		balanceOf[msg.sender] -= _value;
		balanceOf[_to] += _value;

		emit Transfer(msg.sender, _to, _value);
		return true;
	}
	
	function approve(address _spender, uint256 _value) public returns(bool success) {
		emit Approval(msg.sender, _spender, _value);
		return true;
	}

}