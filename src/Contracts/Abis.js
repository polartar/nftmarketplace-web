export const ERC721 =[
    "function balanceOf(address owner) public view returns (uint256)",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function tokenURI(uint256 tokenId) public view returns (string memory)",
    "function approve(address to, uint256 tokenId) public",
    "function getApproved(uint256 tokenId) public view returns (address)",
    "function setApprovalForAll(address operator, bool approved) public",
    "function safeTransferFrom(address from, address to, uint256 tokenId) public",
    "function isApprovedForAll(address account, address operator) public view returns (bool)",
    "function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)",
    "function totalSupply() public view returns (uint256)",
    "function tokenByIndex(uint256 index) public view returns (uint256)",
    "function walletOfOwner(address owner) public view returns (uint256[] memory)"
]

export const ERC1155 = [
    "function uri(uint256) public view returns (string memory)",
    "function balanceOf(address account, uint256 id) public view returns (uint256)",
    "function setApprovalForAll(address operator, bool approved) public",
    "function isApprovedForAll(address account, address operator) public view returns (bool)",
    "function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes memory data) public"
]

export const Elon = [
    "function mint(uint256 count) public payable"
]

export const EbisuDropAbi = [
    "function mintCost(address _minter) external view returns (uint256)",
    "function canMint(address _minter) external view returns (uint256)",
    "function mint(uint256 _amount) external payable",
    "function maxSupply() external view returns (uint256)",
    "function getInfo() view returns (tuple(uint256 regularCost,uint256 memberCost,uint256 whitelistCost,uint256 maxSupply,uint256 totalSupply,uint256 maxMintPerAddress,uint256 maxMintPerTx))"
]