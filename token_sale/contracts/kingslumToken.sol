pragma solidity ^0.5.16;

contract kingslumToken{
	//constructor
	//set the tokens
	//read the total number of token
	//add a name
	//add a symbol 
	string public name = 'King Slum Token';
	string public symbol = 'King Slum';
	string public standard = 'King Slum Token v1.0';
	uint256 public totalSupply;
	event Transfer(address indexed _from,
	address indexed _to,
	uint256 _value);



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
}