// import img1 from '../Assets/2d.png'
// import img2 from '../Assets/cronieno22.svg'
// import img3 from '../Assets/placeholder_logo.svg'
// import gif from '../Assets/3d.gif'
import cronies from '../Assets/cronies.webp'
// import video from '../Assets/video.mp4'
import founding_member from '../Assets/vip_member.webp'
import member from '../Assets/founding_member.webp'

export const InitialState = {
  nftslect:{},
  nftCard: [
    {
      id: '01',
      img: cronies,
      title: 'Cronies',
      price: 100,
      descs: `Commemorating the launch of the Cronos network`,
      p1: 'Cronies are a NFT to commemorate the launch of the Cronos network. Here we will take advantage of the low gas fees on Cronos and produce a randomly generated 100% on-chain SVG with the Cronos logo and the block number in which it was minted.',
      p2: 'We are really excited to see the unique collections you will build. Such as, sequential block numbers, block numbers that have a special meaning to you like a birthday, and color schemes. Cronies will not be mintable after the 1 millionth block or 10,000 minted. Whichever happens first. '
    },
    {
      id: '02',
      img: member,
      title: 'Founding Member',
      price: 250,
      descs: `Early access to features and reduced fees forever.`,
      p1: 'If you hold a Founding Member NFT you will have access to beta features on the platform and receive the benefit of reduced service fees.',
      p2: 'The Founding Member NFT has an on-chain referral system. Refer a friend and recieve 5% of the NFT cost and they receive 5% off. We reserve the right to adjust the sale price based on CRO price action. Founding Member NFTs will be limited to 10,000.'
    },
    {
      id: '03',
      img: founding_member,
      title: 'VIP Founding Member',
      price: 1000,
      descs: `Early access, further reduced fees and staking rewards`,
      p1: 'If you hold a VIP Founding Member NFT you will have access to beta features on the platform and receive reduced service fees. You can stake your VIP NFT, 50% of ALL service fees will go into the VIP Member rewards pool and divided evenly among stakers once per month. You can only stake one NFT per address but it is not against the rules to use multiple addresses',
      p2: 'The VIP Founding Member NFT has an on-chain referral system. Refer a friend and recieve 5% of the NFT cost and they receive 5% off. We reserve the right to adjust the sale price based on CRO price action. VIP Founding Member NFTs will be limited to 1,000.'
    },
  ],
  myNftCard: [
    // {
    //   id: '04',
    //   img: img2,
    //   title: 'Lizard',
    //   price:1597,
    //   descs: `Lorem ipsum dolor sit amet consectetur  `,
    // },
    // {
    //   id: '05',
    //   price:9499,
    //   img: img3,
    //   title: 'Lizard',
    //   descs: `Lorem ipsum dolor sit amet consectetur  `,
    // },
    // {
    //   id: '06',
    //   video: video,
    //   price:574,
    //   title: 'Lizard',
    //   descs: `Lorem ipsum dolor sit amet consectetur  `,
    // },
  ],
  marketplaceCard: [
    // {
    //   id: '07',
    //   video: video,
    //   title: 'Lizard',
    //   descs: `Lorem ipsum dolor sit amet consectetur adipisicing elit. `,
    // },
    // {
    //   id: '08',
    //   img: img1,
    //   title: 'Lizard',
    //   descs: `Lorem ipsum dolor sit amet consectetur adipisicing elit. `,
    // },
    // {
    //   id: '09',
    //   img: img3,
    //   title: 'Lizard',
    //   descs: `Lorem ipsum dolor sit amet consectetur adipisicing elit. `,
    // },
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
