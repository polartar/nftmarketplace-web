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


export const MetaPixelsAbi = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"uint16","name":"_xmin","internalType":"uint16"},{"type":"uint16","name":"_xmax","internalType":"uint16"},{"type":"uint16","name":"_ymin","internalType":"uint16"},{"type":"uint16","name":"_ymax","internalType":"uint16"},{"type":"address","name":"_metaPxAddress","internalType":"address"},{"type":"address","name":"_oldNFTContract","internalType":"address"},{"type":"address","name":"priceUtilsAddress","internalType":"address"}]},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"owner","internalType":"address","indexed":true},{"type":"address","name":"approved","internalType":"address","indexed":true},{"type":"uint256","name":"tokenId","internalType":"uint256","indexed":true}],"anonymous":false},{"type":"event","name":"ApprovalForAll","inputs":[{"type":"address","name":"owner","internalType":"address","indexed":true},{"type":"address","name":"operator","internalType":"address","indexed":true},{"type":"bool","name":"approved","internalType":"bool","indexed":false}],"anonymous":false},{"type":"event","name":"NewLandRequested","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"id","internalType":"uint256","indexed":true},{"type":"uint256","name":"cost","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"NewRequestCreated","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"landId","internalType":"uint256","indexed":true},{"type":"uint256","name":"index","internalType":"uint256","indexed":true}],"anonymous":false},{"type":"event","name":"OwnershipTransferred","inputs":[{"type":"address","name":"previousOwner","internalType":"address","indexed":true},{"type":"address","name":"newOwner","internalType":"address","indexed":true}],"anonymous":false},{"type":"event","name":"Paused","inputs":[{"type":"address","name":"account","internalType":"address","indexed":false}],"anonymous":false},{"type":"event","name":"RecoverERC20","inputs":[{"type":"address","name":"user","internalType":"address","indexed":false},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"RecoverEth","inputs":[{"type":"address","name":"user","internalType":"address","indexed":false},{"type":"uint256","name":"amount","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"RequestApproved","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"landId","internalType":"uint256","indexed":true},{"type":"uint256","name":"requestIndex","internalType":"uint256","indexed":true}],"anonymous":false},{"type":"event","name":"RequestRejected","inputs":[{"type":"address","name":"user","internalType":"address","indexed":true},{"type":"uint256","name":"landId","internalType":"uint256","indexed":true},{"type":"uint256","name":"requestIndex","internalType":"uint256","indexed":true},{"type":"string","name":"reason","internalType":"string","indexed":false}],"anonymous":false},{"type":"event","name":"ReviewerUpdated","inputs":[{"type":"address","name":"reviewer","internalType":"address","indexed":true},{"type":"bool","name":"status","internalType":"bool","indexed":true}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"tokenId","internalType":"uint256","indexed":true}],"anonymous":false},{"type":"event","name":"Unpaused","inputs":[{"type":"address","name":"account","internalType":"address","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","outputs":[{"type":"uint16","name":"","internalType":"uint16"}],"name":"XMAX","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint16","name":"","internalType":"uint16"}],"name":"XMIN","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint16","name":"","internalType":"uint16"}],"name":"YMAX","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint16","name":"","internalType":"uint16"}],"name":"YMIN","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"approve","inputs":[{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"tokenId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"approveRequest","inputs":[{"type":"uint256","name":"landId","internalType":"uint256"},{"type":"uint256","name":"index","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"owner","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"blocksCovered","inputs":[{"type":"uint16","name":"","internalType":"uint16"},{"type":"uint16","name":"","internalType":"uint16"}]},{"type":"function","stateMutability":"payable","outputs":[],"name":"buyLand","inputs":[{"type":"uint16","name":"_xmin","internalType":"uint16"},{"type":"uint16","name":"_xmax","internalType":"uint16"},{"type":"uint16","name":"_ymin","internalType":"uint16"},{"type":"uint16","name":"_ymax","internalType":"uint16"},{"type":"uint8","name":"coin","internalType":"enum IMetaPixelsPriceUtils.Coins"},{"type":"string","name":"_link","internalType":"string"},{"type":"string","name":"_detail","internalType":"string"},{"type":"string","name":"_image","internalType":"string"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"calculateFinalPrice","inputs":[{"type":"uint16","name":"_xmin","internalType":"uint16"},{"type":"uint16","name":"_xmax","internalType":"uint16"},{"type":"uint16","name":"_ymin","internalType":"uint16"},{"type":"uint16","name":"_ymax","internalType":"uint16"},{"type":"uint8","name":"coin","internalType":"enum IMetaPixelsPriceUtils.Coins"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"calculateRequestCost","inputs":[{"type":"uint16","name":"_xmin","internalType":"uint16"},{"type":"uint16","name":"_xmax","internalType":"uint16"},{"type":"uint16","name":"_ymin","internalType":"uint16"},{"type":"uint16","name":"_ymax","internalType":"uint16"},{"type":"uint8","name":"coin","internalType":"enum IMetaPixelsPriceUtils.Coins"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"clearLand","inputs":[{"type":"uint256","name":"landId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"getApproved","inputs":[{"type":"uint256","name":"tokenId","internalType":"uint256"}]},{"type":"function","stateMutability":"pure","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getBlockCount","inputs":[{"type":"uint16","name":"_xmin","internalType":"uint16"},{"type":"uint16","name":"_xmax","internalType":"uint16"},{"type":"uint16","name":"_ymin","internalType":"uint16"},{"type":"uint16","name":"_ymax","internalType":"uint16"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"getLandBlockCount","inputs":[{"type":"uint256","name":"landId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"isApprovedForAll","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"address","name":"operator","internalType":"address"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"landCost","inputs":[{"type":"uint8","name":"coin","internalType":"enum IMetaPixelsPriceUtils.Coins"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint16","name":"xmin","internalType":"uint16"},{"type":"uint16","name":"xmax","internalType":"uint16"},{"type":"uint16","name":"ymin","internalType":"uint16"},{"type":"uint16","name":"ymax","internalType":"uint16"},{"type":"uint256","name":"created","internalType":"uint256"},{"type":"string","name":"link","internalType":"string"},{"type":"string","name":"detail","internalType":"string"},{"type":"string","name":"image","internalType":"string"},{"type":"bool","name":"isFirstEdition","internalType":"bool"}],"name":"lands","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"metaPxAddress","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"migrateBulk","inputs":[{"type":"uint16","name":"from","internalType":"uint16"},{"type":"uint16","name":"to","internalType":"uint16"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"migrateLand","inputs":[{"type":"uint256","name":"landId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"migrateLands","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"migrated","inputs":[{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"migrationFinished","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"oldNFTContract","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"owner","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"address","name":"","internalType":"address"}],"name":"ownerOf","inputs":[{"type":"uint256","name":"tokenId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"pause","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"paused","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"recoverERC20","inputs":[{"type":"address","name":"tokenAddress","internalType":"address"},{"type":"uint256","name":"tokenAmount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"recoverEth","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"rejectRequest","inputs":[{"type":"uint256","name":"landId","internalType":"uint256"},{"type":"uint256","name":"index","internalType":"uint256"},{"type":"string","name":"reason","internalType":"string"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"renounceOwnership","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"requestCost","inputs":[{"type":"uint8","name":"coin","internalType":"enum IMetaPixelsPriceUtils.Coins"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"created","internalType":"uint256"},{"type":"uint256","name":"updated","internalType":"uint256"},{"type":"uint8","name":"status","internalType":"enum MetaPixelsNFTFactoryV2.RequestStatus"},{"type":"address","name":"owner","internalType":"address"},{"type":"string","name":"link","internalType":"string"},{"type":"string","name":"detail","internalType":"string"},{"type":"string","name":"image","internalType":"string"},{"type":"string","name":"reason","internalType":"string"},{"type":"bool","name":"exists","internalType":"bool"}],"name":"requestsByLand","inputs":[{"type":"uint256","name":"","internalType":"uint256"},{"type":"uint256","name":"","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"requestsByLandLength","inputs":[{"type":"uint256","name":"land","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"reviewers","inputs":[{"type":"address","name":"","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"safeTransferFrom","inputs":[{"type":"address","name":"from","internalType":"address"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"tokenId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"safeTransferFrom","inputs":[{"type":"address","name":"from","internalType":"address"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"tokenId","internalType":"uint256"},{"type":"bytes","name":"_data","internalType":"bytes"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setApprovalForAll","inputs":[{"type":"address","name":"operator","internalType":"address"},{"type":"bool","name":"approved","internalType":"bool"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setLandLimits","inputs":[{"type":"uint16","name":"newXMIN","internalType":"uint16"},{"type":"uint16","name":"newXMAX","internalType":"uint16"},{"type":"uint16","name":"newYMIN","internalType":"uint16"},{"type":"uint16","name":"newYMAX","internalType":"uint16"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setMetaPxAddress","inputs":[{"type":"address","name":"_address","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"setMigrationFinished","inputs":[{"type":"bool","name":"finished","internalType":"bool"}]},{"type":"function","stateMutability":"payable","outputs":[],"name":"submitRequest","inputs":[{"type":"string","name":"_link","internalType":"string"},{"type":"string","name":"_detail","internalType":"string"},{"type":"string","name":"_image","internalType":"string"},{"type":"uint256","name":"landId","internalType":"uint256"},{"type":"uint8","name":"coin","internalType":"enum IMetaPixelsPriceUtils.Coins"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"supportsInterface","inputs":[{"type":"bytes4","name":"interfaceId","internalType":"bytes4"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"symbol","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"tokenByIndex","inputs":[{"type":"uint256","name":"index","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"tokenOfOwnerByIndex","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"uint256","name":"index","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"tokenURI","inputs":[{"type":"uint256","name":"tokenId","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalSupply","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferFrom","inputs":[{"type":"address","name":"from","internalType":"address"},{"type":"address","name":"to","internalType":"address"},{"type":"uint256","name":"tokenId","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"transferOwnership","inputs":[{"type":"address","name":"newOwner","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"unpause","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"updateLandData","inputs":[{"type":"uint256","name":"landId","internalType":"uint256"},{"type":"string","name":"_link","internalType":"string"},{"type":"string","name":"_detail","internalType":"string"},{"type":"string","name":"_image","internalType":"string"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"updatePriceUtils","inputs":[{"type":"address","name":"_address","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"updateReviewer","inputs":[{"type":"address","name":"_reviewer","internalType":"address"},{"type":"bool","name":"_status","internalType":"bool"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"updateTokenUpdater","inputs":[{"type":"address","name":"_address","internalType":"address"}]}]
