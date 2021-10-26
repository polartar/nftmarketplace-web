import img1 from '../Assets/2d.png'
import img2 from '../Assets/cronieno22.svg'
import img3 from '../Assets/placeholder_logo.svg'
import gif from '../Assets/3d.gif'
import video from '../Assets/video.mp4'

export const InitialState = {
  nftslect:{},
  nftCard: [
    {
      id: '01',
      img: img1,
      title: 'Lizard',
      descs: `Lorem ipsum dolor sit amet consectetur `,
    },
    {
      id: '02',
      img: img2,
      title: 'Lizard',
      descs: `Lorem ipsum dolor sit amet consectetur `,
    },
    {
      id: '03',
      img: gif,
      title: 'Lizard',
      descs: `Lorem ipsum dolor sit amet consectetur `,
    },
  ],
  myNftCard: [
    {
      id: '04',
      img: img2,
      title: 'Lizard',
      price:1597,
      descs: `Lorem ipsum dolor sit amet consectetur  `,
    },
    {
      id: '05',
      price:9499,
      img: img3,
      title: 'Lizard',
      descs: `Lorem ipsum dolor sit amet consectetur  `,
    },
    {
      id: '06',
      video: video,
      price:574,
      title: 'Lizard',
      descs: `Lorem ipsum dolor sit amet consectetur  `,
    },
  ],
  marketplaceCard: [
    {
      id: '07',
      video: video,
      title: 'Lizard',
      descs: `Lorem ipsum dolor sit amet consectetur adipisicing elit. `,
    },
    {
      id: '08',
      img: img1,
      title: 'Lizard',
      descs: `Lorem ipsum dolor sit amet consectetur adipisicing elit. `,
    },
    {
      id: '09',
      img: img3,
      title: 'Lizard',
      descs: `Lorem ipsum dolor sit amet consectetur adipisicing elit. `,
    },
  ],
  faq: [
    {
      head: `Q: Why are you launching on the Cronos network, doesn’t Crypto.com
          already have a fantastic NFT marketplace?`,
      desc: `A: The Cronos network is a separate blockchain than the CRO Mainnet.
          Furthermore, Cronos smart contracts can not currently interact with
          CRO Mainnet without IBC communications. Many exciting NFT projects
          and games will be coming to the Cronos EVM and we want to empower
          investors and developers to trade their NFTs.`,
      tab: 'panel1a-content',
      id: 'panel1a-header',
    },
    {
        head:`Q: What benefits can Big Fish members enjoy?`,
        desc:`A: Big fish members will gain early access to new features, have
        reduced service fees, and have the option to stake their NFT to earn
        a portion of the fees collected for all sales.`,
        tab:'panel2a-content',
        id:'panel2a-header'
    },
    {
        head:`Q: If I buy a Big Fish membership on one blockchain, can I enjoy its
        benefits on another?`,
        desc:`A: Because there is not currently an IBC between Cronos and Songbird
        networks it will not be possible to trustlessly share benefits
        between blockchains.`,
        tab:'panel3a-content',
        id:'panel3a-header'
    },
    {
        head:`Q: Will you be launching on the Flare network?`,
        desc:`A: If the community demands it!`,
        tab:'panel4a-content',
        id:'panel4a-header'
    },
    {
        head:`Q: What is the Launchpad?`,
        desc:`A: We will be working with curated artists and promising new NFT
        gaming projects to promote and launch new drops. If you are
        interested on getting a rocketship onto the launchpad please contact
        us.`,
        tab:'panel5a-content',
        id:'panel5a-header'
    },
  ],
}
