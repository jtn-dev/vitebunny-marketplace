export const nfts = [
  {
    id: '1',
    name: 'BadB#1',
    collection: 'Cosmic Bunnies',
    description: 'A rare cosmic bunny from the Andromeda galaxy, known for its vibrant colors and magical properties.',
    image: '/images/nft1.jpg',
    price: '0.75',
    likes: 42,
    owner: '0x02C6b7c2281F82471590351a1b18eFF627e9b2Ae',
    creator: '0x02C6b7c2281F82471590351a1b18eFF627e9b2Ae',
    isListed: true,
    attributes: [
      { trait_type: 'Background', value: 'Cosmic Void' },
      { trait_type: 'Fur', value: 'Nebula Pink' },
      { trait_type: 'Eyes', value: 'Star Gazer' },
      { trait_type: 'Ears', value: 'Glowing' },
      { trait_type: 'Outfit', value: 'Space Explorer' },
    ]
  },
  {
    id: '2',
    name: 'BadB#2',
    collection: 'Digital Dreamscape',
    description: 'A mesmerizing digital artwork that represents the interconnection between humanity and technology.',
    image: '/images/nft2.jpg',
    price: '1.2',
    likes: 38,
    owner: '0x02C6b7c2281F82471590351a1b18eFF627e9b2Ae',
    creator: '0x02C6b7c2281F82471590351a1b18eFF627e9b2Ae',
    isListed: true,
    attributes: [
      { trait_type: 'Style', value: 'Abstract' },
      { trait_type: 'Color Palette', value: 'Neon' },
      { trait_type: 'Mood', value: 'Introspective' },
      { trait_type: 'Technique', value: 'Digital Painting' },
    ]
  },
  {
    id: '3',
    name: 'BadB#3',
    collection: 'Pixel Pets',
    description: 'A charming 8-bit style rabbit created with pixel-perfect precision. Part of the exclusive Pixel Pets collection.',
    image: '/images/nft3.jpg',
    price: '0.5',
    likes: 24,
    owner: '0x02C6b7c2281F82471590351a1b18eFF627e9b2Ae',
    creator: '0x02C6b7c2281F82471590351a1b18eFF627e9b2Ae',
    isListed: true,
    attributes: [
      { trait_type: 'Size', value: '32x32' },
      { trait_type: 'Color', value: 'Sepia' },
      { trait_type: 'Rarity', value: 'Uncommon' },
      { trait_type: 'Generation', value: 'First' },
    ]
  },
  {
    id: '5',
    name: 'BadB#5',
    collection: 'Veggie Artifacts',
    description: 'An ancient carrot artifact said to have mystical powers over rabbit-kind. Extremely rare collectible.',
    image: '/images/nft5.jpg',
    price: '2.0',
    likes: 67,
    owner: '0xadccd6194BA9F656795fB345D6D21b78ae5CA097',
    creator: '0xadccd6194BA9F656795fB345D6D21b78ae5CA097',
    isListed: true,
    attributes: [
      { trait_type: 'Age', value: 'Ancient' },
      { trait_type: 'Material', value: 'Digital Gold' },
      { trait_type: 'Power Level', value: 'Mythic' },
      { trait_type: 'Origin', value: 'Mystic Garden' },
    ]
  },
  {
    id: '6',
    name: 'BadB#6',
    collection: 'Voxel World',
    description: 'A cute voxel bunny created for the metaverse. Perfect for virtual world exploration and gaming.',
    image: '/images/nft6.jpg',
    price: '0.65',
    likes: 31,
    owner: '0xadccd6194BA9F656795fB345D6D21b78ae5CA097',
    creator: '0xadccd6194BA9F656795fB345D6D21b78ae5CA097',
    isListed: true,
    attributes: [
      { trait_type: 'Resolution', value: '32x32x32' },
      { trait_type: 'Animation', value: 'Hop Cycle' },
      { trait_type: 'World', value: 'Carrot Kingdom' },
      { trait_type: 'Compatibility', value: 'Cross-Platform' },
    ]
  },
  {
    id: '7',
    name: 'BadB#7',
    collection: 'Ethereal Beings',
    description: 'An ethereal hare that embodies the spirit of springtime. Its presence brings luck and prosperity.',
    image: '/images/nft7.jpg',
    price: '1.35',
    likes: 45,
    owner: '0xadccd6194BA9F656795fB345D6D21b78ae5CA097',
    creator: '0xadccd6194BA9F656795fB345D6D21b78ae5CA097',
    isListed: true,
    attributes: [
      { trait_type: 'Element', value: 'Spirit' },
      { trait_type: 'Season', value: 'Spring' },
      { trait_type: 'Aura', value: 'Shimmering Gold' },
      { trait_type: 'Special Ability', value: 'Luck Amplifier' },
    ]
  }
];

export const collections = [
  {
    id: '1',
    name: 'Cosmic Bunnies',
    slug: 'cosmic-bunnies',
    description: 'A collection of space-traveling bunnies from various galaxies, each with unique cosmic properties and abilities.',
    avatarImage: '/images/nft1.jpg',
    bannerImage: '/images/nft8.jpg',
    owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    floorPrice: '0.75',
    volume: '120.5',
    items: 250,
    verified: true,
    featured: true
  },
  {
    id: '2',
    name: 'Digital Dreamscape',
    slug: 'digital-dreamscape',
    description: 'Abstract digital art that blurs the line between reality and imagination, taking viewers on a journey through digital dreams.',
    avatarImage: '/images/nft2.jpg',
    bannerImage: '/images/nft7.jpg',
    owner: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    floorPrice: '1.2',
    volume: '85.3',
    items: 100,
    verified: true,
    featured: true
  },
  {
    id: '3',
    name: 'Pixel Pets',
    slug: 'pixel-pets',
    description: 'A nostalgic collection of pixel art pets inspired by retro video games. Each pet has been lovingly crafted pixel by pixel.',
    avatarImage: '/images/nft3.jpg',
    bannerImage: '/images/nft6.jpg',
    owner: '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    floorPrice: '0.5',
    volume: '45.8',
    items: 150,
    verified: true,
    featured: false
  },
  {
    id: '4',
    name: 'Bunny Punks',
    slug: 'bunny-punks',
    description: 'Rebellious bunnies with attitude that defy the cute bunny stereotype. Each punk bunny has its own personality and style.',
    avatarImage: '/images/nft4.jpg',
    bannerImage: '/images/nft5.jpg',
    owner: '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    floorPrice: '0.85',
    volume: '67.2',
    items: 200,
    verified: true,
    featured: true
  },
  {
    id: '5',
    name: 'Veggie Artifacts',
    slug: 'veggie-artifacts',
    description: 'Mystical vegetable artifacts with extraordinary powers. These ancient relics are sought after by collectors throughout the digital realm.',
    avatarImage: '/images/nft5.jpg',
    bannerImage: '/images/nft4.jpg',
    owner: '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
    floorPrice: '2.0',
    volume: '140.6',
    items: 75,
    verified: true,
    featured: false
  },
  {
    id: '6',
    name: 'Voxel World',
    slug: 'voxel-world',
    description: 'A metaverse-ready collection of voxel characters and items perfect for virtual world integration and gaming experiences.',
    avatarImage: '/images/nft6.jpg',
    bannerImage: '/images/nft3.jpg',
    owner: '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
    floorPrice: '0.65',
    volume: '52.4',
    items: 300,
    verified: false,
    featured: false
  }
];

export const categories = [
  { id: '1', name: 'Art', icon: '🎨' },
  { id: '2', name: 'Collectibles', icon: '🏆' },
  { id: '3', name: 'Music', icon: '🎵' },
  { id: '4', name: 'Photography', icon: '📸' },
  { id: '5', name: 'Virtual Worlds', icon: '🌎' },
  { id: '6', name: 'Sports', icon: '⚽' },
  { id: '7', name: 'Trading Cards', icon: '🃏' },
  { id: '8', name: 'Utility', icon: '🔧' }
]; 