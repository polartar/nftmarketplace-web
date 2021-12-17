import crosmonautsCard from "../Assets/collections/crosmonauts/card.png";
import crosmonautsAvatar from "../Assets/collections/crosmonauts/avatar.png";
import crosmonautsBanner from "../Assets/collections/crosmonauts/banner.png";
import chimpAvatar from "../Assets/collections/chimps/avatar.png";
import chimpBanner from "../Assets/collections/chimps/banner.png";
import meerkatsBanner from "../Assets/collections/meerkats/banner.jpg";
import meerkatsAvatar from "../Assets/collections/meerkats/avatar.png";

export const CollectionsMetadata = {
    collections: [
        {
            id: '',
            slug: 'crosmonauts',
            address: '0xDFab622fC4E5CE1420F83cf38E52312f33849a0A',
            name: 'Crosmonauts',
            description: '',
            verified: true,
            avatar: crosmonautsAvatar,
            banner: crosmonautsBanner,
            card: crosmonautsCard,
        },
        {
            id: '',
            slug: 'cronos-chimp-club',
            address: '0x562F021423D75A1636DB5bE1C4D99Bc005ccebFe',
            name: 'Cronos Chimp Club',
            description: '',
            verified: true,
            avatar: chimpAvatar,
            banner: chimpBanner
        },
        {
            id: '',
            slug: 'mad-meerkats',
            address: '0x89dBC8Bd9a6037Cbd6EC66C4bF4189c9747B1C56',
            name: 'Mad Meerkats',
            description: '',
            verified: true,
            avatar: meerkatsAvatar,
            banner: meerkatsBanner
        }
    ]
}