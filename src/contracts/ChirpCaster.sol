//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract ChirpCaster is ERC1155, Ownable ,Pausable {
using Counters for Counters.Counter;
Counters.Counter private _tokenIdCounter;
 struct Profile {
    address owner;
    string uri;
    bool isValue;
 }

 struct Channel {
    string channelId;
    uint256 tokenId;
    address owner;
    string name;
    string hash;
    string ciphertext;
    bool isValue;
 }


struct ChannelUser {
    address user;
    bool active;
    bool isValue;
}

struct MyChannels {
      string channelId;
      string name;
      uint256 tokenId;

}


/**
  * @dev Modifier to check if the profile is registered.
  * @param user The address of the user to check.
  */

modifier profileRegistered(address user) {
    require(profiles[user].isValue,"Profile not registered");
    _;
}


 /**
     * @dev Modifier to check if the caller is the owner of the channel.
     * @param channelId The ID of the channel to check.
     */
modifier isChannelOwner(string memory channelId){
   require(createdChannels[channelId].owner == msg.sender,"You don't own this channel.");
   _;
}
 /**
     * @dev Modifier to check if the channel does not already exist.
     * @param channelId The ID of the channel to check.
     */
modifier userNotInChannel(string memory channelId,address user) {
    require(!channelUsers[channelId][user].isValue,"User already in channel.");
    _;
}


    /**
     * @dev Modifier to check if the channel does not already exist.
     * @param channelId The ID of the channel to check.
     */

modifier channelDoesNotExist(string memory channelId) {
    require(!createdChannels[channelId].isValue,"Channel already exist");
    _;
}
 
event ChannelCreated(address indexed owner,string indexed channelId,uint256 datecreated);
event UserAddedToChannel(string indexed channelId,address indexed user,uint256 dateadded);

 string private ciphertext ;
 string private dataToEncryptHash;
 mapping (address =>Profile) profiles;
 mapping (address=>mapping (string=> Channel)) channels;
 mapping(string=> mapping (address=> ChannelUser)) channelUsers;
 mapping (address=> Channel[]) myCreatedChannels;
 mapping (string=> ChannelUser[]) channelUsersArray; 
 mapping (string => Channel) createdChannels;
 mapping (address=> MyChannels[]) myChannels;


  /**
     * @dev Updates the profile of the caller.
     * @param uri The URI of the profile.
     */
function updateProfile(string memory uri) public {
   profiles[msg.sender].owner  = msg.sender;
   profiles[msg.sender].uri = uri;
   profiles[msg.sender].isValue = true;

} 

   constructor() ERC1155("https://mytoken.api/{id}.json") Ownable(msg.sender){
      
    }

   /**
     * @dev Retrieves the profile of a user.
     * @param owner The address of the user.
     * @return Profile The profile of the user.
     */
     function getProfile(address owner) public view returns ( Profile memory) {
    return(profiles[owner]); 
}


 /**
     * @dev Creates a new channel.
     * @param channelId The unique ID of the channel.
     * @param name The name of the channel.
     */
function createChannel(string memory channelId,string memory _ciphertext,string memory name ,string memory hash) public channelDoesNotExist(channelId) profileRegistered(msg.sender) whenNotPaused {
   _tokenIdCounter.increment();
     uint256  _tokenId = _tokenIdCounter.current();
   
   Channel memory newChannel = Channel({channelId:channelId,tokenId:_tokenId,owner:msg.sender,name:name,hash:hash,ciphertext:_ciphertext,isValue:true});
   channels[msg.sender][channelId] =newChannel; 
   myCreatedChannels[msg.sender].push(newChannel);
   createdChannels[channelId] = newChannel;
   addUserToChannel(channelId,msg.sender); //Register the channel owner as a channel user
   
   emit ChannelCreated(msg.sender, channelId,block.timestamp);

}


 /**
     * @dev Retrieves channels created by the caller.
     * @return Channel[] The list of channels created by the caller.
     */
function getCreatedChannels() public view  returns(Channel[] memory){
    return(myCreatedChannels[msg.sender]);
}


   /**
     * @dev Adds a user to a channel.
     * @param channelId The ID of the channel.
     * @param user The address of the user to add.
     */
function addUserToChannel(string memory channelId,address user) public isChannelOwner(channelId) profileRegistered(user) userNotInChannel(channelId,user){
   ChannelUser memory newChannelUser = ChannelUser({user:user,active:true,isValue:true});
   channelUsers[channelId][user] = newChannelUser; 
   MyChannels memory _channel = MyChannels({channelId:channelId,name:createdChannels[channelId].name,tokenId:createdChannels[channelId].tokenId});
   myChannels[user].push(_channel) ; 
   channelUsersArray[channelId].push(newChannelUser);
   mint(user, channels[msg.sender][channelId].tokenId,"");
   emit UserAddedToChannel( channelId,user,block.timestamp);

}


 /**
     * @dev Checks if a user is in a channel.
     * @param channelId The ID of the channel.
     * @param user The address of the user.
     * @return bool True if the user is in the channel, false otherwise.
     */

function userInChannel(string memory channelId,address user) public view returns(bool){
    return(channelUsers[channelId][user].isValue);
}


 /**
     * @dev Retrieves all users in a channel.
     * @param channelId The ID of the channel.
     * @return ChannelUser[] The list of users in the channel.
     */
function getChannelUsers(string memory channelId) public view returns(ChannelUser[] memory){
   return(channelUsersArray[channelId]);
}


 /**
     * @dev Retrieves channels the caller is part of.
     * @return MyChannels[] The list of channels the caller is part of.
     */
function getMyChannels() public view returns (MyChannels[] memory){
    return(myChannels[msg.sender]);
}



/**
     * @dev Retrieves all users in a channel.
     * @param channelId The ID of the channel.
     * @return _hash _ciphertext 
     */
function getChannelHash(string memory channelId) public view returns(string memory _hash,string memory _ciphertext){
   return(createdChannels[channelId].hash,createdChannels[channelId].ciphertext);
}

/**
     * @dev Securely stores Huddle01 encrypted API Key.
     * @param _ciphertext .
     * @param _dataToEncryptHash .
     
     */

function setPrivateData(string calldata _ciphertext,string calldata _dataToEncryptHash) public onlyOwner
{
     ciphertext = _ciphertext;
    dataToEncryptHash = _dataToEncryptHash;
}

/**
     * @dev Retrieves securely stored Huddle01 encrypted API Key.
     
*/
function getPrivateData()  public view  returns (string memory  _ciphertext ,string memory _dataToEncryptHash ) 
{
    return(ciphertext,dataToEncryptHash);
} 
function mint(
    address to,
    uint256 amount,
    bytes memory data
) internal  {
    _tokenIdCounter.increment();
    uint256 newTokenId = _tokenIdCounter.current();
    _mint(to, newTokenId, amount, data);
}
}


