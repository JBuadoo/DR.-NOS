/**
 * Dr. No's Comics & Games SuperStore - Catalog & Store Data
 */

export const STORE_INFO = {
  name: "Dr. No's Comics & Games SuperStore",
  tagline: "Georgia's Legendary Comic & Gaming SuperStore Since 1977",
  address: "3372 Canton Road, Suite 104, Marietta, GA 30066",
  center: "Blackwell Square Shopping Center",
  phone: "(770) 422-4642",
  email: "manager@drnos.com",
  established: 1977,
  pages: {
    about: "https://www.drnos.com/aboutus.html",
    events: "https://www.drnos.com/events.html",
    ordering: "https://www.drnos.com/ordering.html",
    directions: "https://www.drnos.com/directions.html",
    onlineStore: "https://www.drnos.com/onlinestore.html"
  },
  hours: {
    monday: "11:00 AM – 8:00 PM",
    tuesday: "11:00 AM – 8:00 PM",
    wednesday: "11:00 AM – 8:00 PM (New Comic Day!)",
    thursday: "11:00 AM – 8:00 PM",
    friday: "11:00 AM – 8:00 PM (FNM Magic Night)",
    saturday: "11:00 AM – 8:00 PM",
    sunday: "12:00 PM – 6:00 PM"
  },
  newComicDrop: "Wednesdays at 11:00 AM EST"
};

export const NEW_RELEASES = [
  {
    id: "nr-1",
    title: "Chrono Knight #1: Masters of Time",
    publisher: "indie",
    publisherLabel: "Dr. No Exclusive",
    writer: "S. Dale",
    artist: "Star-Killer",
    price: 4.99,
    cover: "/assets/grail_chrono_knight.jpg",
    badge: "Staff Pick",
    description: "The cosmic time-travel thriller begins! When temporal cracks shatter Atlanta, only the Chrono Knight stands between order and total oblivion.",
    stock: 24,
    variant: "Foil Virgin Variant"
  },
  {
    id: "nr-2",
    title: "Night Blade #1: Neo-Kyoto Protocol",
    publisher: "image",
    publisherLabel: "Image Comics",
    writer: "Kairo Vance",
    artist: "M. Chen",
    price: 4.99,
    cover: "/assets/night_blade.jpg",
    badge: "Hot Release",
    description: "Cyberpunk vigilante saga. In the neon-drenched rain of the megacity, a lone blade dismantles corporate cyber-warlords.",
    stock: 18,
    variant: "1:25 Incentive Cover"
  },
  {
    id: "nr-3",
    title: "Captain Nova #1: Cosmic Collision",
    publisher: "marvel",
    publisherLabel: "Marvel Comics",
    writer: "Jonathan Hickman",
    artist: "Pepe Larraz",
    price: 5.99,
    cover: "/assets/hero_banner.jpg",
    badge: "Key Issue",
    description: "A monumental clash across the galactic rim! The Nova Corps faces an unstoppable ancient mechanoid threat.",
    stock: 35,
    variant: "Alex Ross Variant"
  },
  {
    id: "nr-4",
    title: "Batman: Dark City Vigilance #142",
    publisher: "dc",
    publisherLabel: "DC Comics",
    writer: "Chip Zdarsky",
    artist: "Jorge Jimenez",
    price: 4.99,
    cover: "/assets/night_blade.jpg",
    badge: "Top Seller",
    description: "The Dark Knight faces a calculated psychological siege inside Arkham Tower.",
    stock: 42,
    variant: "Cardstock Foil"
  },
  {
    id: "nr-5",
    title: "Spawn: Dark Ages Unleashed #350",
    publisher: "image",
    publisherLabel: "Image Comics",
    writer: "Todd McFarlane",
    artist: "Brett Booth",
    price: 3.99,
    cover: "/assets/grail_chrono_knight.jpg",
    badge: "Anniversary",
    description: "History in the making as the Spawn universe enters its next apocalyptic epoch.",
    stock: 20,
    variant: "McFarlane B&W Inks"
  },
  {
    id: "nr-6",
    title: "Cyber Mecha Zero #1",
    publisher: "manga",
    publisherLabel: "Kodansha / Manga",
    writer: "T. Asuka",
    artist: "K. Murata",
    price: 12.99,
    cover: "/assets/night_blade.jpg",
    badge: "Vol 1 Debut",
    description: "High-octane mecha combat meets hard sci-fi cyberpunk warfare in this oversized debut volume.",
    stock: 15,
    variant: "First Printing Tankōbon"
  }
];

export const GRAIL_VAULT = [
  {
    id: "grail-1",
    title: "Chrono Knight #1 (1968)",
    grade: "9.8",
    gradeType: "CGC Universal Grade",
    cert: "CGC #3849201942",
    price: 3850.00,
    publisher: "Vintage Marvel / Atlas",
    cover: "/assets/grail_chrono_knight.jpg",
    notes: "White pages. First appearance of Chrono Knight and Lord Chaos. Perfect centering.",
    signers: "Signed by Stan Lee & Jack Kirby"
  },
  {
    id: "grail-2",
    title: "Night Blade: Special Ashcan Edition #1",
    grade: "9.9",
    gradeType: "CBCS Mint Reserve",
    cert: "CBCS #22-839210-001",
    price: 1450.00,
    publisher: "Image Gold Foil Limited",
    cover: "/assets/night_blade.jpg",
    notes: "Flawless corners. 1 of 500 Worldwide. High gloss finish.",
    signers: "Certified 1st Print"
  },
  {
    id: "grail-3",
    title: "Captain Nova: Galactic War #1 (1977)",
    grade: "9.6",
    gradeType: "CGC Signature Series",
    cert: "CGC #1977082910",
    price: 2100.00,
    publisher: "Bronze Age Classic",
    cover: "/assets/hero_banner.jpg",
    notes: "Off-White to White Pages. Commemorates Dr. No's 1977 founding era.",
    signers: "Verified Signature Series"
  }
];

export const TCG_TOURNAMENTS = [
  // --- FRIDAY WEEKLY TOURNAMENTS & LEAGUES ---
  {
    id: "tcg-pokemon-friday",
    game: "Pokémon TCG",
    gameClass: "game-pokemon",
    logo: "/assets/logo_pokemon.png",
    event: "Pokemon and the Open Anime Gaming League",
    dayTime: "Fridays: Weekly starting at 4:00 pm",
    entry: "$7 per monthly season",
    prize: "To Be Announced each Season",
    format: "Open Anime & Pokémon League Play",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 16
  },
  {
    id: "tcg-mtg-draft-friday",
    game: "Magic: The Gathering",
    gameClass: "game-mtg",
    logo: "/assets/logo_mtg.png",
    event: "Friday Night Magic Draft",
    dayTime: "Fridays: Weekly starting at 6:00 pm",
    entry: "$20.00",
    prize: "FNM Exclusive Promos!",
    format: "Booster Draft (3 Packs) + Swiss",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 12
  },
  {
    id: "tcg-yugioh-friday",
    game: "Yu-Gi-Oh!",
    gameClass: "game-yugioh",
    logo: "/assets/logo_yugioh.png",
    event: "Yu-Gi-Oh Konami Sanctioned Tournaments",
    dayTime: "Fridays: Weekly starting at 7:00 pm",
    entry: "$5.00 for one event",
    prize: "Booster packs (Spots are limited!)",
    format: "Konami Sanctioned Constructed Swiss",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 14
  },
  // --- SATURDAY & SPECIAL TOURNAMENTS ---
  {
    id: "tcg-onepiece-sat",
    game: "One Piece CCG",
    gameClass: "game-onepiece",
    logo: "/assets/logo_onepiece.png",
    event: "One Piece CCG Tournament (2nd Saturday of Every Month)",
    dayTime: "2nd Saturday of Every Month (Call for Upcoming Info)",
    entry: "$5.00",
    prize: "Tournament Prize Pack",
    format: "Official Bandai Constructed Swiss",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 18
  },
  {
    id: "tcg-yugioh-celebration",
    game: "Yu-Gi-Oh!",
    gameClass: "game-yugioh",
    logo: "/assets/logo_yugioh.png",
    event: "Yu-Gi-Oh Celebration! Konami Weekend Events",
    dayTime: "Saturdays (Call for information on upcoming events)",
    entry: "$5.00",
    prize: "Yu-Gi-Oh Playmat",
    format: "Konami Sanctioned Weekend Celebration",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 16
  },
  {
    id: "tcg-yugioh-preview",
    game: "Yu-Gi-Oh!",
    gameClass: "game-yugioh",
    logo: "/assets/logo_yugioh.png",
    event: "Yu-Gi-Oh Konami Preview Weekend Events",
    dayTime: "Saturdays (Call for information on upcoming events)",
    entry: "$20.00",
    prize: "Yu-Gi-Oh Playmat & everyone gets a Special Pre-release Tournament Promo card",
    format: "Konami Official Preview & Sealed",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 20
  },
  {
    id: "tcg-mtg-prerelease",
    game: "Magic: The Gathering",
    gameClass: "game-mtg",
    logo: "/assets/logo_mtg.png",
    event: "Magic: The Gathering Pre-release Tournaments",
    dayTime: "Saturdays (Call for information on upcoming events)",
    entry: "TBA",
    prize: "Magic Boosters & everyone gets a Special Pre-release Tournament Promo card",
    format: "Prerelease Sealed Deck + Swiss",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 24
  },
  {
    id: "tcg-mtg-release",
    game: "Magic: The Gathering",
    gameClass: "game-mtg",
    logo: "/assets/logo_mtg.png",
    event: "Magic: The Gathering Release Tournament",
    dayTime: "Saturdays (Call for information on upcoming events)",
    entry: "TBA",
    prize: "Magic Boosters & everyone gets a Special Release Tournament Promo card",
    format: "Release Championship Swiss",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 24
  },
  {
    id: "tcg-mtg-gameday",
    game: "Magic: The Gathering",
    gameClass: "game-mtg",
    logo: "/assets/logo_mtg.png",
    event: "Magic: The Gathering Game Day",
    dayTime: "Saturdays (Call for information on upcoming events)",
    entry: "TBA",
    prize: "TBA & everyone gets a Special Game Day Promo card",
    format: "Standard / Modern Game Day",
    banner: "/assets/tcg_arena.jpg",
    spotsLeft: 24
  }
];

export const SAMPLER_COMIC_PAGES = [
  {
    pageNumber: 1,
    title: "Page 1: The Rift in Blackwell Square",
    narration: "Marietta, Georgia — 11:00 PM. Inside the hallowed aisles of Dr. No's SuperStore...",
    panels: [
      {
        caption: "PANEL 1",
        dialog: "Look at the long boxes! The quantum spectrum is spiking!",
        speaker: "Captain Nova"
      },
      {
        caption: "PANEL 2",
        dialog: "Hold steady! The multiverse is bleeding into our back-issue vault!",
        speaker: "Chrono Knight"
      }
    ]
  },
  {
    pageNumber: 2,
    title: "Page 2: The Quantum Convergence",
    narration: "A burst of golden energy illuminates the vintage comic racks...",
    panels: [
      {
        caption: "PANEL 3",
        dialog: "KA-POW! The temporal lock is broken! Every comic ever written is alive!",
        speaker: "Night Blade"
      },
      {
        caption: "PANEL 4",
        dialog: "Welcome to Dr. No's — where legends never go out of print!",
        speaker: "Dr. No"
      }
    ]
  }
];
