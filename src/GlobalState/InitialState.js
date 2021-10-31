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
      title: 'Cronies',
      price: 200,
      descs: `NFT commemorating the launch of the Cronos network`,
    },
    {
      id: '02',
      img: img2,
      title: 'Lizard',
      price: 200,
      descs: `Lorem ipsum dolor sit amet consectetur `,
    },
    {
      id: '03',
      img: gif,
      title: 'Lizard',
      price: 1000,
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
      desc: `A: The Cronos network is a separate blockchain from the CRO Mainnet.
          Furthermore, Cronos smart contracts can not currently interact with
          CRO Mainnet without IBC communications. Many exciting NFT projects
          and games will be coming to the Cronos EVM and we want to empower
          investors and collectors to trade their NFTs.`,
      tab: 'panel1a-content',
      id: 'panel1a-header',
    },
    {
      head:`Q: What benefits can Founding Members enjoy?`,
      desc:`A: Founding members will have a reduced service fee when selling NFTs.`,
      tab:'panel2a-content',
      id:'panel2a-header'
  },
    {
        head:`Q: What benefits can VIP Founding Members enjoy?`,
        desc:`A: VIP Founding Members will gain early access to new features, have
        further reduced service fees, and have the option to stake their membership NFT to earn
        a portion of the fees collected from all sales on the platform.`,
        tab:'panel3a-content',
        id:'panel3a-header'
    },

    {
        head:`Q: Will you be launching on any other networks?`,
        desc:`A: If the community demands it! We are currently evaluating adding support for Songbird and Flare networks.`,
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
    {
      head:`Q: I want a feature that isn't on the roadmap. Will you do it please?`,
      desc:`A: We aim to please. Reach out to us and let us know what you would like to see!`,
      tab:'panel6a-content',
      id:'panel6a-header'
  },
  ],
}
