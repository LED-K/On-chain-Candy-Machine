// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.4;

contract Distributeur {
    address public owner;
    uint256 price = 0.003 ether;
    uint256 maxMetsSupply = 10;
    enum mets{ICE_TEA, MARS, LION, FANTA, COCA_COLA}
    mapping (mets => uint256) public metsBalance;


    constructor(){
        owner = msg.sender;
        metsBalance[mets.ICE_TEA]=maxMetsSupply;
        metsBalance[mets.MARS]=maxMetsSupply;
        metsBalance[mets.LION]=maxMetsSupply;
        metsBalance[mets.FANTA]=maxMetsSupply;
        metsBalance[mets.COCA_COLA]=maxMetsSupply;

    }

    function getMetsBalance(mets choice) public view returns(uint256){
        return metsBalance[choice];
    }

    function setMetsBalance(mets choice, uint256 _amount) public{
        //check if message sender is the owner
        require(msg.sender == owner, "You are not the owner");
        require(_amount+metsBalance[choice] <= maxMetsSupply, "can't exceed max supply");
        metsBalance[choice] =metsBalance[choice]+ _amount;
    }

    function withdrawMets(uint256 _amount, mets choice) public payable{
        //check if enough in stock & if user have enough funds
        require(metsBalance[choice] >= _amount, "Sorry, no enough in stock");
        require(msg.value >= price, "Not enough funds");
        metsBalance[choice] = metsBalance[choice] - _amount;
    }

}