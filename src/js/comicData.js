/**
 * Comic Book Store Template - Catalog & Store Data
 * Easily customize store details, new arrivals, grail vault, and events below.
 */

export const STORE_INFO = {
  name: "[YOUR COMIC SHOP NAME]",
  tagline: "Your Hometown Comic Book, Graphic Novel & Gaming Headquarters",
  address: "123 Comic Street, Suite 100, Your City, ST 12345",
  center: "Downtown Arts & Shopping Plaza",
  phone: "(555) 123-4567",
  secondaryPhone: "(555) 987-6543",
  email: "contact@yourcomicshop.example",
  established: 2026,
  pages: {
    about: "#about",
    events: "#events",
    ordering: "#ordering",
    directions: "#directions",
    onlineStore: "#store"
  },
  hours: {
    monday: "11:00 AM – 7:00 PM",
    tuesday: "11:00 AM – 7:00 PM",
    wednesday: "11:00 AM – 8:00 PM (New Comic Day!)",
    thursday: "11:00 AM – 7:00 PM",
    friday: "11:00 AM – 9:00 PM (Game Night)",
    saturday: "10:00 AM – 8:00 PM",
    sunday: "12:00 PM – 5:00 PM"
  },
  newComicDrop: "Wednesdays at 11:00 AM"
};

export const NEW_RELEASES = [
  {
    id: "nr-1",
    title: "Cosmic Crusader #1: Dawn of Eternity",
    publisher: "marvel",
    publisherLabel: "Marvel Comics",
    writer: "Alex Mercer",
    artist: "David Ross",
    price: 4.99,
    cover: "./assets/blank_white.png",
    badge: "Staff Pick",
    description: "An epic cosmic odyssey begins! When an ancient anomaly threatens the galactic rim, the universe's mightiest defender steps forward.",
    stock: 25,
    variant: "Foil Virgin Variant"
  },
  {
    id: "nr-2",
    title: "Neon Shadows #1: Protocol Omega",
    publisher: "image",
    publisherLabel: "Image Comics",
    writer: "Kairo Vance",
    artist: "Elena Vance",
    price: 4.99,
    cover: "./assets/blank_white.png",
    badge: "Hot Release",
    description: "Cyberpunk vigilante noir. In the rain-soaked alleys of a futuristic megacity, a lone cyber-detective uncovers a global conspiracy.",
    stock: 20,
    variant: "1:25 Incentive Cover"
  },
  {
    id: "nr-3",
    title: "Chrono Knight #1: Masters of the Rift",
    publisher: "indie",
    publisherLabel: "Indie Spotlight",
    writer: "Marcus Stone",
    artist: "Sarah Chen",
    price: 3.99,
    cover: "./assets/blank_white.png",
    badge: "Key Issue",
    description: "Time fractures across the multiverse! A warrior armed with temporal armor battles through historical epochs to save reality.",
    stock: 18,
    variant: "Artist Edition Variant"
  },
  {
    id: "nr-4",
    title: "Shadow Detective: Dark Alley Murders #1",
    publisher: "dc",
    publisherLabel: "DC Comics",
    writer: "Victor Vance",
    artist: "Leo Martinez",
    price: 4.99,
    cover: "./assets/blank_white.png",
    badge: "Top Seller",
    description: "A gritty psychological thriller in the heart of the metropolis. When the city sleeps, the detective tracks an elusive underworld mastermind.",
    stock: 30,
    variant: "Cardstock Foil Cover"
  },
  {
    id: "nr-5",
    title: "Mythic Realm: Book of Prophecies #1",
    publisher: "indie",
    publisherLabel: "Fantasy Forge",
    writer: "Lyra Thorne",
    artist: "Gareth Cole",
    price: 5.99,
    cover: "./assets/blank_white.png",
    badge: "Debut Series",
    description: "High fantasy epic filled with ancient dragons, rogue sorcerers, and legendary blades awaiting their rightful wielder.",
    stock: 15,
    variant: "Collector Gold Foil"
  },
  {
    id: "nr-6",
    title: "Cyber Mecha Strike Zero Vol. 1",
    publisher: "manga",
    publisherLabel: "Manga Press",
    writer: "Kenji Sato",
    artist: "Yuki Tanaka",
    price: 12.99,
    cover: "./assets/blank_white.png",
    badge: "Vol 1 Graphic Novel",
    description: "Oversized graphic novel edition collecting the explosive mecha tournament arc with 200+ action-packed illustrated pages.",
    stock: 12,
    variant: "First Edition Tankōbon"
  }
];

export const GRAIL_VAULT = [
  {
    id: "grail-1",
    title: "Cosmic Crusader #1 (Collector Classic)",
    grade: "9.8",
    gradeType: "CGC Universal Grade",
    cert: "CGC #1002948201",
    price: 2450.00,
    publisher: "Vintage Classic",
    cover: "./assets/blank_white.png",
    notes: "White pages. High grade key issue. Flawless spine and sharp centering.",
    signers: "Verified Universal Grade"
  },
  {
    id: "grail-2",
    title: "Chrono Knight: Ashcan Edition #1",
    grade: "9.9",
    gradeType: "CBCS Mint Reserve",
    cert: "CBCS #22-839210-001",
    price: 1750.00,
    publisher: "Limited Foil Press",
    cover: "./assets/blank_white.png",
    notes: "Flawless corners. Limited printing run. Pristine high-gloss foil finish.",
    signers: "Certified 1st Print"
  },
  {
    id: "grail-3",
    title: "Neon Shadows: Zero Hour Variant #1",
    grade: "9.6",
    gradeType: "CGC Signature Series",
    cert: "CGC #8492019482",
    price: 890.00,
    publisher: "Collector Incentive",
    cover: "./assets/blank_white.png",
    notes: "Off-White to White Pages. Rare 1:100 retail incentive variant cover.",
    signers: "Verified Creator Signature"
  }
];

export const TCG_TOURNAMENTS = [
  {
    id: "tcg-pokemon-weekly",
    game: "Pokémon TCG",
    gameClass: "game-pokemon",
    logo: "./assets/logo_pokemon.png",
    event: "Weekly Pokémon League & Casual Play",
    dayTime: "Fridays: Weekly at 4:00 PM",
    entry: "$5.00 entry",
    prize: "Booster packs & League Promos",
    format: "Standard Constructed & Open Play",
    banner: "./assets/blank_white.png",
    spotsLeft: 16
  },
  {
    id: "tcg-mtg-draft",
    game: "Magic: The Gathering",
    gameClass: "game-mtg",
    logo: "./assets/logo_mtg.png",
    event: "Friday Night Magic: Booster Draft",
    dayTime: "Fridays: Weekly at 6:30 PM",
    entry: "$18.00",
    prize: "FNM Promo Packs & Booster Rewards",
    format: "Booster Draft (3 Packs) + Swiss",
    banner: "./assets/blank_white.png",
    spotsLeft: 16
  },
  {
    id: "tcg-yugioh-weekly",
    game: "Yu-Gi-Oh!",
    gameClass: "game-yugioh",
    logo: "./assets/logo_yugioh.png",
    event: "Yu-Gi-Oh! Local Tournament",
    dayTime: "Saturdays: Weekly at 1:00 PM",
    entry: "$5.00",
    prize: "Official OTS Packs & Store Credit",
    format: "Advanced Constructed Swiss",
    banner: "./assets/blank_white.png",
    spotsLeft: 20
  },
  {
    id: "tcg-onepiece-monthly",
    game: "One Piece CCG",
    gameClass: "game-onepiece",
    logo: "./assets/logo_onepiece.png",
    event: "One Piece Card Game Tournament",
    dayTime: "2nd Saturday of Every Month at 3:00 PM",
    entry: "$5.00",
    prize: "Bandai Tournament Packs & Winner Cards",
    format: "Constructed Swiss",
    banner: "./assets/blank_white.png",
    spotsLeft: 16
  }
];

export const SAMPLER_COMIC_PAGES = [
  {
    pageNumber: 1,
    title: "Page 1: The Gateway to Adventure",
    narration: "A quiet afternoon in the comic shop... until the pages begin to glow!",
    panels: [
      {
        caption: "PANEL 1",
        dialog: "Look at the comic racks! The multiverse frequency is fluctuating!",
        speaker: "Hero"
      },
      {
        caption: "PANEL 2",
        dialog: "Grab your dice and your cape! An epic adventure is about to start!",
        speaker: "Sidekick"
      }
    ]
  },
  {
    pageNumber: 2,
    title: "Page 2: The Adventure Unfolds",
    narration: "Cosmic energy fills the room as heroes leap from the panels...",
    panels: [
      {
        caption: "PANEL 3",
        dialog: "KA-POW! The portal has opened! Welcome to our comic universe!",
        speaker: "Cosmic Knight"
      },
      {
        caption: "PANEL 4",
        dialog: "Customize this reader with your own comic pages and illustrations!",
        speaker: "Narrator"
      }
    ]
  }
];
