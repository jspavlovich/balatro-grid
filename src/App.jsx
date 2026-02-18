import { useState, useCallback, useMemo, useEffect, useRef } from "react";

// Joker database with properties
const JOKERS = [
  // Common Jokers
  { name: "Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Greedy Joker", rarity: "Common", effects: ["+Mult"], triggers: ["When Scored"], suits: ["Diamonds"], hands: [], misc: [] },
  { name: "Lusty Joker", rarity: "Common", effects: ["+Mult"], triggers: ["When Scored"], suits: ["Hearts"], hands: [], misc: [] },
  { name: "Wrathful Joker", rarity: "Common", effects: ["+Mult"], triggers: ["When Scored"], suits: ["Spades"], hands: [], misc: [] },
  { name: "Gluttonous Joker", rarity: "Common", effects: ["+Mult"], triggers: ["When Scored"], suits: ["Clubs"], hands: [], misc: [] },
  { name: "Jolly Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Contains Hand"], suits: [], hands: ["Pair"], misc: [] },
  { name: "Zany Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Contains Hand"], suits: [], hands: ["Three of a Kind"], misc: [] },
  { name: "Mad Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Contains Hand"], suits: [], hands: ["Two Pair"], misc: [] },
  { name: "Crazy Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Contains Hand"], suits: [], hands: ["Straight"], misc: [] },
  { name: "Droll Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Contains Hand"], suits: [], hands: ["Flush"], misc: [] },
  { name: "Sly Joker", rarity: "Common", effects: ["+Chips"], triggers: ["Contains Hand"], suits: [], hands: ["Pair"], misc: [] },
  { name: "Wily Joker", rarity: "Common", effects: ["+Chips"], triggers: ["Contains Hand"], suits: [], hands: ["Three of a Kind"], misc: [] },
  { name: "Clever Joker", rarity: "Common", effects: ["+Chips"], triggers: ["Contains Hand"], suits: [], hands: ["Two Pair"], misc: [] },
  { name: "Devious Joker", rarity: "Common", effects: ["+Chips"], triggers: ["Contains Hand"], suits: [], hands: ["Straight"], misc: [] },
  { name: "Crafty Joker", rarity: "Common", effects: ["+Chips"], triggers: ["Contains Hand"], suits: [], hands: ["Flush"], misc: [] },
  { name: "Half Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Card Count"] },
  { name: "Credit Card", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Banner", rarity: "Common", effects: ["+Chips"], triggers: ["Passive"], suits: [], hands: [], misc: ["Discards"] },
  { name: "Mystic Summit", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Discards"] },
  { name: "8 Ball", rarity: "Common", effects: ["Creates Cards"], triggers: ["Contains Hand"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "Misprint", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Random"] },
  { name: "Raised Fist", rarity: "Common", effects: ["+Mult"], triggers: ["Held in Hand"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "Fibonacci", rarity: "Common", effects: ["+Mult"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "Scary Face", rarity: "Common", effects: ["+Chips"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Face Cards"] },
  { name: "Abstract Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Delayed Gratification", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: ["Discards"] },
  { name: "Gros Michel", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Destroys Self"] },
  { name: "Even Steven", rarity: "Common", effects: ["+Mult"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "Odd Todd", rarity: "Common", effects: ["+Chips"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "Scholar", rarity: "Common", effects: ["+Mult", "+Chips"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "Business Card", rarity: "Common", effects: ["$Money"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Face Cards"] },
  { name: "Supernova", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Ride the Bus", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Face Cards"] },
  { name: "Space Joker", rarity: "Common", effects: ["Level Up"], triggers: ["Passive"], suits: [], hands: [], misc: ["Random"] },
  { name: "Egg", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Burglar", rarity: "Common", effects: ["Extra Discards"], triggers: ["On Blind Select"], suits: [], hands: [], misc: [] },
  { name: "Blackboard", rarity: "Common", effects: ["xMult"], triggers: ["Held in Hand"], suits: ["Spades", "Clubs"], hands: [], misc: [] },
  { name: "Runner", rarity: "Common", effects: ["+Chips"], triggers: ["Contains Hand"], suits: [], hands: ["Straight"], misc: ["Scaling"] },
  { name: "Ice Cream", rarity: "Common", effects: ["+Chips"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Splash", rarity: "Common", effects: ["Scores All"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Blue Joker", rarity: "Common", effects: ["+Chips"], triggers: ["Passive"], suits: [], hands: [], misc: ["Deck"] },
  { name: "Sixth Sense", rarity: "Common", effects: ["Creates Cards"], triggers: ["Passive"], suits: [], hands: [], misc: ["Ranks", "Destroys Cards"] },
  { name: "Constellation", rarity: "Common", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Hiker", rarity: "Common", effects: ["+Chips"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Card Sharp", rarity: "Common", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Red Card", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Madness", rarity: "Common", effects: ["xMult"], triggers: ["On Blind Select"], suits: [], hands: [], misc: ["Destroys Jokers", "Scaling"] },
  { name: "Square Joker", rarity: "Common", effects: ["+Chips"], triggers: ["Passive"], suits: [], hands: [], misc: ["Card Count", "Scaling"] },
  { name: "Vampire", rarity: "Common", effects: ["xMult"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Enhanced", "Scaling"] },
  { name: "Shortcut", rarity: "Common", effects: ["Rule Change"], triggers: ["Passive"], suits: [], hands: ["Straight"], misc: [] },
  { name: "Hologram", rarity: "Common", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling", "Deck"] },
  { name: "Vagabond", rarity: "Rare", effects: ["Creates Cards"], triggers: ["Passive"], suits: [], hands: [], misc: ["$Money"] },
  { name: "Cloud 9", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: ["Ranks", "Deck"] },
  { name: "Rocket", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Midas Mask", rarity: "Common", effects: ["Enhanced"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Face Cards"] },
  { name: "Luchador", rarity: "Common", effects: ["Sell Effect"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Gift Card", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Turtle Bean", rarity: "Common", effects: ["Hand Size"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Erosion", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Deck"] },
  { name: "Reserved Parking", rarity: "Common", effects: ["$Money"], triggers: ["Held in Hand"], suits: [], hands: [], misc: ["Face Cards", "Random"] },
  { name: "Mail-In Rebate", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: ["Discards", "Ranks"] },
  { name: "To the Moon", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Hallucination", rarity: "Common", effects: ["Creates Cards"], triggers: ["Passive"], suits: [], hands: [], misc: ["Random"] },
  { name: "Fortune Teller", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Juggler", rarity: "Common", effects: ["Hand Size"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Drunkard", rarity: "Common", effects: ["Extra Discards"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Golden Joker", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Popcorn", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Walkie Talkie", rarity: "Common", effects: ["+Chips", "+Mult"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "Smiley Face", rarity: "Common", effects: ["+Mult"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Face Cards"] },
  { name: "Golden Ticket", rarity: "Common", effects: ["$Money"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Enhanced"] },
  { name: "Swashbuckler", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Troubadour", rarity: "Common", effects: ["Hand Size"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Certificate", rarity: "Common", effects: ["Creates Cards"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Smeared Joker", rarity: "Common", effects: ["Rule Change"], triggers: ["Passive"], suits: ["Hearts", "Diamonds", "Spades", "Clubs"], hands: [], misc: [] },
  { name: "Throwback", rarity: "Common", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Rough Gem", rarity: "Common", effects: ["$Money"], triggers: ["When Scored"], suits: ["Diamonds"], hands: [], misc: [] },
  { name: "Bloodstone", rarity: "Common", effects: ["xMult"], triggers: ["When Scored"], suits: ["Hearts"], hands: [], misc: ["Random"] },
  { name: "Arrowhead", rarity: "Common", effects: ["+Chips"], triggers: ["When Scored"], suits: ["Spades"], hands: [], misc: [] },
  { name: "Onyx Agate", rarity: "Common", effects: ["+Mult"], triggers: ["When Scored"], suits: ["Clubs"], hands: [], misc: [] },
  { name: "Glass Joker", rarity: "Common", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Enhanced", "Scaling"] },
  { name: "Showman", rarity: "Common", effects: ["Rule Change"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Flower Pot", rarity: "Common", effects: ["xMult"], triggers: ["When Scored"], suits: ["Hearts", "Diamonds", "Spades", "Clubs"], hands: [], misc: [] },
  { name: "Wee Joker", rarity: "Rare", effects: ["+Chips"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Ranks", "Scaling"] },
  { name: "Merry Andy", rarity: "Common", effects: ["Extra Discards"], triggers: ["Passive"], suits: [], hands: [], misc: ["Hand Size"] },
  { name: "The Idol", rarity: "Common", effects: ["xMult"], triggers: ["When Scored"], suits: ["Hearts", "Diamonds", "Spades", "Clubs"], hands: [], misc: ["Ranks"] },
  { name: "Seeing Double", rarity: "Common", effects: ["xMult"], triggers: ["When Scored"], suits: ["Clubs"], hands: [], misc: [] },
  { name: "Matador", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Satellite", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Cartomancer", rarity: "Common", effects: ["Creates Cards"], triggers: ["On Blind Select"], suits: [], hands: [], misc: [] },
  { name: "Astronomer", rarity: "Common", effects: ["Rule Change"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Bootstraps", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["$Money"] },

  // Uncommon Jokers
  { name: "Acrobat", rarity: "Uncommon", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Sock and Buskin", rarity: "Uncommon", effects: ["Retrigger"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Face Cards"] },
  { name: "Hack", rarity: "Uncommon", effects: ["Retrigger"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "Pareidolia", rarity: "Uncommon", effects: ["Rule Change"], triggers: ["Passive"], suits: [], hands: [], misc: ["Face Cards"] },
  { name: "Mime", rarity: "Uncommon", effects: ["Retrigger"], triggers: ["Held in Hand"], suits: [], hands: [], misc: [] },
  { name: "Dusk", rarity: "Uncommon", effects: ["Retrigger"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Selzer", rarity: "Uncommon", effects: ["Retrigger"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Castle", rarity: "Uncommon", effects: ["+Chips"], triggers: ["Passive"], suits: ["Hearts", "Diamonds", "Spades", "Clubs"], hands: [], misc: ["Discards", "Scaling"] },
  { name: "Mr. Bones", rarity: "Uncommon", effects: ["Prevents Death"], triggers: ["Passive"], suits: [], hands: [], misc: ["Destroys Self"] },
  { name: "Hanging Chad", rarity: "Uncommon", effects: ["Retrigger"], triggers: ["When Scored"], suits: [], hands: [], misc: [] },
  { name: "Stuntman", rarity: "Rare", effects: ["+Chips"], triggers: ["Passive"], suits: [], hands: [], misc: ["Hand Size"] },
  { name: "Invisible Joker", rarity: "Rare", effects: ["Copies Joker"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Brainstorm", rarity: "Rare", effects: ["Copies Joker"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Burnt Joker", rarity: "Rare", effects: ["Level Up"], triggers: ["Passive"], suits: [], hands: [], misc: ["Discards"] },
  { name: "Stone Joker", rarity: "Uncommon", effects: ["+Chips"], triggers: ["Passive"], suits: [], hands: [], misc: ["Enhanced", "Deck"] },
  { name: "Lucky Cat", rarity: "Uncommon", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling", "Enhanced"] },
  { name: "Bull", rarity: "Uncommon", effects: ["+Chips"], triggers: ["Passive"], suits: [], hands: [], misc: ["$Money"] },
  { name: "Diet Cola", rarity: "Uncommon", effects: ["Creates Cards"], triggers: ["Passive"], suits: [], hands: [], misc: ["Sell Effect"] },
  { name: "Trading Card", rarity: "Uncommon", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: ["Discards"] },
  { name: "Flash Card", rarity: "Uncommon", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Spare Trousers", rarity: "Uncommon", effects: ["+Mult"], triggers: ["Contains Hand"], suits: [], hands: ["Two Pair"], misc: ["Scaling"] },
  { name: "Ramen", rarity: "Uncommon", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Discards", "Scaling"] },
  { name: "Seltzer", rarity: "Uncommon", effects: ["Retrigger"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Faceless Joker", rarity: "Common", effects: ["$Money"], triggers: ["Passive"], suits: [], hands: [], misc: ["Face Cards", "Discards"] },
  { name: "Green Joker", rarity: "Common", effects: ["+Mult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling", "Discards"] },
  { name: "Superposition", rarity: "Common", effects: ["Creates Cards"], triggers: ["Contains Hand"], suits: [], hands: ["Straight"], misc: ["Ranks"] },
  { name: "Cavendish", rarity: "Common", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Destroys Self"] },
  { name: "Loyalty Card", rarity: "Common", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },

  // Rare Jokers
  { name: "Baron", rarity: "Rare", effects: ["xMult"], triggers: ["Held in Hand"], suits: [], hands: [], misc: ["Ranks"] },
  { name: "DNA", rarity: "Rare", effects: ["Copies Card"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Blueprint", rarity: "Rare", effects: ["Copies Joker"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Obelisk", rarity: "Rare", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Baseball Card", rarity: "Rare", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Ancient Joker", rarity: "Rare", effects: ["xMult"], triggers: ["When Scored"], suits: ["Hearts", "Diamonds", "Spades", "Clubs"], hands: [], misc: [] },
  { name: "Campfire", rarity: "Rare", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Scaling"] },
  { name: "Duo", rarity: "Rare", effects: ["xMult"], triggers: ["Contains Hand"], suits: [], hands: ["Pair"], misc: [] },
  { name: "Trio", rarity: "Rare", effects: ["xMult"], triggers: ["Contains Hand"], suits: [], hands: ["Three of a Kind"], misc: [] },
  { name: "Family", rarity: "Rare", effects: ["xMult"], triggers: ["Contains Hand"], suits: [], hands: ["Four of a Kind"], misc: [] },
  { name: "Order", rarity: "Rare", effects: ["xMult"], triggers: ["Contains Hand"], suits: [], hands: ["Straight"], misc: [] },
  { name: "Tribe", rarity: "Rare", effects: ["xMult"], triggers: ["Contains Hand"], suits: [], hands: ["Flush"], misc: [] },
  { name: "Driver's License", rarity: "Rare", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Enhanced"] },

  // Legendary Jokers
  { name: "Canio", rarity: "Legendary", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Face Cards", "Destroys Cards", "Scaling"] },
  { name: "Triboulet", rarity: "Legendary", effects: ["xMult"], triggers: ["When Scored"], suits: [], hands: [], misc: ["Face Cards"] },
  { name: "Yorick", rarity: "Legendary", effects: ["xMult"], triggers: ["Passive"], suits: [], hands: [], misc: ["Discards", "Scaling"] },
  { name: "Chicot", rarity: "Legendary", effects: ["Disables Boss"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
  { name: "Perkeo", rarity: "Legendary", effects: ["Creates Cards"], triggers: ["Passive"], suits: [], hands: [], misc: [] },
];

// Category definitions
const CATEGORIES = [
  { id: "common", label: "Common", icon: "🃏", color: "#4a90d9", check: j => j.rarity === "Common" },
  { id: "uncommon", label: "Uncommon", icon: "🟢", color: "#2ecc71", check: j => j.rarity === "Uncommon" },
  { id: "rare", label: "Rare", icon: "🔴", color: "#e74c3c", check: j => j.rarity === "Rare" },
  { id: "legendary", label: "Legendary", icon: "🟣", color: "#9b59b6", check: j => j.rarity === "Legendary" },
  { id: "plus_mult", label: "+Mult", icon: "🔺", color: "#e74c3c", check: j => j.effects.includes("+Mult") },
  { id: "x_mult", label: "×Mult", icon: "✖️", color: "#ff6b6b", check: j => j.effects.includes("xMult") },
  { id: "plus_chips", label: "+Chips", icon: "🔵", color: "#3498db", check: j => j.effects.includes("+Chips") },
  { id: "money", label: "$Money", icon: "💰", color: "#f39c12", check: j => j.effects.includes("$Money") },
  { id: "creates", label: "Creates Cards", icon: "✨", color: "#1abc9c", check: j => j.effects.includes("Creates Cards") },
  { id: "retrigger", label: "Retrigger", icon: "🔁", color: "#e67e22", check: j => j.effects.includes("Retrigger") },
  { id: "when_scored", label: "When Scored", icon: "🎯", color: "#e91e63", check: j => j.triggers.includes("When Scored") },
  { id: "contains_hand", label: "Contains Hand", icon: "🖐️", color: "#795548", check: j => j.triggers.includes("Contains Hand") },
  { id: "passive", label: "Passive", icon: "💤", color: "#607d8b", check: j => j.triggers.includes("Passive") },
  { id: "on_blind", label: "On Blind Select", icon: "👁️", color: "#ff5722", check: j => j.triggers.includes("On Blind Select") },
  { id: "held_hand", label: "Held in Hand", icon: "✋", color: "#8bc34a", check: j => j.triggers.includes("Held in Hand") },
  { id: "hearts", label: "Hearts", icon: "♥️", color: "#e74c3c", check: j => j.suits.includes("Hearts") },
  { id: "diamonds", label: "Diamonds", icon: "♦️", color: "#3498db", check: j => j.suits.includes("Diamonds") },
  { id: "spades", label: "Spades", icon: "♠️", color: "#2c3e50", check: j => j.suits.includes("Spades") },
  { id: "clubs", label: "Clubs", icon: "♣️", color: "#27ae60", check: j => j.suits.includes("Clubs") },
  { id: "pair", label: "Pair", icon: "👯", color: "#9c27b0", check: j => j.hands.includes("Pair") },
  { id: "straight", label: "Straight", icon: "📏", color: "#00bcd4", check: j => j.hands.includes("Straight") },
  { id: "flush", label: "Flush", icon: "🌊", color: "#2196f3", check: j => j.hands.includes("Flush") },
  { id: "three_kind", label: "Three of a Kind", icon: "3️⃣", color: "#ff9800", check: j => j.hands.includes("Three of a Kind") },
  { id: "face_cards", label: "Face Cards", icon: "👑", color: "#ffd700", check: j => j.misc.includes("Face Cards") },
  { id: "scaling", label: "Scaling", icon: "📈", color: "#4caf50", check: j => j.misc.includes("Scaling") },
  { id: "discards", label: "Discards", icon: "🗑️", color: "#78909c", check: j => j.misc.includes("Discards") },
  { id: "ranks", label: "Specific Ranks", icon: "🔢", color: "#ff7043", check: j => j.misc.includes("Ranks") },
  { id: "destroys", label: "Destroys/Self-Destructs", icon: "💥", color: "#b71c1c", check: j => j.misc.includes("Destroys Self") || j.misc.includes("Destroys Cards") || j.misc.includes("Destroys Jokers") },
];

function getValidJokers(rowCat, colCat) {
  return JOKERS.filter(j => rowCat.check(j) && colCat.check(j));
}

// Seeded random
function seededRandom(seed) {
  let s = seed;
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
}

function generateGrid(seed) {
  const rng = seededRandom(seed);
  const shuffled = [...CATEGORIES].sort(() => rng() - 0.5);
  
  // Try many combos to find a valid grid
  for (let attempt = 0; attempt < 500; attempt++) {
    const perm = [...shuffled].sort(() => rng() - 0.5);
    const rows = perm.slice(0, 3);
    const cols = perm.slice(3, 6);
    
    // Check no duplicate IDs
    const ids = [...rows, ...cols].map(c => c.id);
    if (new Set(ids).size !== 6) continue;
    
    // Check every cell has at least one valid joker
    let valid = true;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (getValidJokers(rows[r], cols[c]).length === 0) {
          valid = false;
          break;
        }
      }
      if (!valid) break;
    }
    if (valid) return { rows, cols };
  }
  
  // Fallback
  return {
    rows: [CATEGORIES[0], CATEGORIES[4], CATEGORIES[6]],
    cols: [CATEGORIES[10], CATEGORIES[12], CATEGORIES[23]]
  };
}

function getDaySeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

const RARITY_COLORS = {
  Common: "#4a90d9",
  Uncommon: "#2ecc71",
  Rare: "#e74c3c",
  Legendary: "#9b59b6"
};

const RARITY_BG = {
  Common: "rgba(74,144,217,0.15)",
  Uncommon: "rgba(46,204,113,0.15)",
  Rare: "rgba(231,76,60,0.15)",
  Legendary: "rgba(155,89,182,0.15)"
};

export default function BalatroGrid() {
  const [grid] = useState(() => generateGrid(getDaySeed()));
  const [guesses, setGuesses] = useState(9);
  const [cells, setCells] = useState(Array(9).fill(null));
  const [selectedCell, setSelectedCell] = useState(null);
  const [search, setSearch] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [usedJokers, setUsedJokers] = useState(new Set());
  const inputRef = useRef(null);

  const correctCount = cells.filter(c => c && c.correct).length;

  useEffect(() => {
    if (selectedCell !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [selectedCell]);

  const getFilteredJokers = useCallback(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase().trim();
    return JOKERS.filter(j => 
      j.name.toLowerCase().includes(q) && !usedJokers.has(j.name)
    ).slice(0, 8);
  }, [search, usedJokers]);

  const handleGuess = useCallback((joker) => {
    if (selectedCell === null || gameOver) return;
    const r = Math.floor(selectedCell / 3);
    const c = selectedCell % 3;
    const rowCat = grid.rows[r];
    const colCat = grid.cols[c];
    const correct = rowCat.check(joker) && colCat.check(joker);

    const newCells = [...cells];
    newCells[selectedCell] = { joker, correct };
    setCells(newCells);
    setUsedJokers(prev => new Set([...prev, joker.name]));
    
    const newGuesses = guesses - 1;
    setGuesses(newGuesses);
    setSelectedCell(null);
    setSearch("");

    if (newGuesses <= 0 || newCells.filter(c => c && c.correct).length === 9) {
      setGameOver(true);
      setShowResults(true);
    }
  }, [selectedCell, gameOver, cells, guesses, grid, usedJokers]);

  const handleCellClick = (idx) => {
    if (gameOver || cells[idx]) return;
    setSelectedCell(selectedCell === idx ? null : idx);
    setSearch("");
  };

  const filteredJokers = getFilteredJokers();

  const rarityScore = useMemo(() => {
    const filled = cells.filter(c => c && c.correct);
    if (filled.length === 0) return 0;
    return filled.reduce((acc, c) => {
      const r = c.joker.rarity;
      return acc + (r === "Common" ? 1 : r === "Uncommon" ? 3 : r === "Rare" ? 8 : 20);
    }, 0);
  }, [cells]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0a1628 100%)",
      color: "#e8e8e8",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      padding: "12px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: 900,
          background: "linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: 0,
          letterSpacing: "1px"
        }}>
          🃏 BALATRO GRID 🃏
        </h1>
        <p style={{ fontSize: "13px", color: "#888", margin: "4px 0 0" }}>
          Fill the grid with Jokers matching both row & column categories
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: "flex",
        gap: "16px",
        marginBottom: "16px",
        fontSize: "14px",
        fontWeight: 600
      }}>
        <div style={{
          background: "rgba(255,107,107,0.15)",
          border: "1px solid rgba(255,107,107,0.3)",
          borderRadius: "8px",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <span>🎯</span>
          <span style={{ color: guesses <= 3 ? "#ff6b6b" : "#ffd93d" }}>{guesses}</span>
          <span style={{ color: "#888" }}>guesses left</span>
        </div>
        <div style={{
          background: "rgba(107,203,119,0.15)",
          border: "1px solid rgba(107,203,119,0.3)",
          borderRadius: "8px",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: "6px"
        }}>
          <span>✅</span>
          <span style={{ color: "#6bcb77" }}>{correctCount}</span>
          <span style={{ color: "#888" }}>/9</span>
        </div>
      </div>

      {/* Grid */}
      <div style={{ position: "relative" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "100px repeat(3, 100px)",
          gridTemplateRows: "80px repeat(3, 100px)",
          gap: "4px",
        }}>
          {/* Top-left empty cell */}
          <div style={{
            background: "rgba(255,255,255,0.03)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span style={{ fontSize: "24px" }}>🃏</span>
          </div>

          {/* Column headers */}
          {grid.cols.map((cat, i) => (
            <div key={`col-${i}`} style={{
              background: `linear-gradient(180deg, ${cat.color}22, ${cat.color}08)`,
              border: `1px solid ${cat.color}44`,
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              gap: "2px"
            }}>
              <span style={{ fontSize: "20px" }}>{cat.icon}</span>
              <span style={{
                fontSize: "11px",
                fontWeight: 700,
                color: cat.color,
                textAlign: "center",
                lineHeight: 1.2
              }}>{cat.label}</span>
            </div>
          ))}

          {/* Rows */}
          {grid.rows.map((rowCat, r) => (
            <>
              {/* Row header */}
              <div key={`row-${r}`} style={{
                background: `linear-gradient(90deg, ${rowCat.color}22, ${rowCat.color}08)`,
                border: `1px solid ${rowCat.color}44`,
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px",
                gap: "2px"
              }}>
                <span style={{ fontSize: "20px" }}>{rowCat.icon}</span>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: rowCat.color,
                  textAlign: "center",
                  lineHeight: 1.2
                }}>{rowCat.label}</span>
              </div>

              {/* Cells */}
              {[0, 1, 2].map(c => {
                const idx = r * 3 + c;
                const cell = cells[idx];
                const isSelected = selectedCell === idx;
                const validCount = getValidJokers(rowCat, grid.cols[c]).length;

                return (
                  <div
                    key={`cell-${idx}`}
                    onClick={() => handleCellClick(idx)}
                    style={{
                      width: "100px",
                      height: "100px",
                      background: cell
                        ? cell.correct
                          ? "linear-gradient(135deg, rgba(46,204,113,0.25), rgba(46,204,113,0.1))"
                          : "linear-gradient(135deg, rgba(231,76,60,0.25), rgba(231,76,60,0.1))"
                        : isSelected
                          ? "linear-gradient(135deg, rgba(255,217,61,0.2), rgba(255,217,61,0.05))"
                          : "rgba(255,255,255,0.04)",
                      border: cell
                        ? cell.correct
                          ? "2px solid rgba(46,204,113,0.6)"
                          : "2px solid rgba(231,76,60,0.6)"
                        : isSelected
                          ? "2px solid rgba(255,217,61,0.7)"
                          : "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "10px",
                      cursor: cell || gameOver ? "default" : "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      transition: "all 0.2s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                  >
                    {cell ? (
                      <>
                        <div style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          fontSize: "14px"
                        }}>
                          {cell.correct ? "✅" : "❌"}
                        </div>
                        <span style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: RARITY_COLORS[cell.joker.rarity],
                          background: RARITY_BG[cell.joker.rarity],
                          padding: "2px 6px",
                          borderRadius: "4px",
                          marginBottom: "2px"
                        }}>
                          {cell.joker.rarity}
                        </span>
                        <span style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          textAlign: "center",
                          color: "#ddd",
                          lineHeight: 1.2
                        }}>
                          {cell.joker.name}
                        </span>
                      </>
                    ) : (
                      <>
                        {isSelected ? (
                          <span style={{ fontSize: "10px", color: "#ffd93d", fontWeight: 600 }}>
                            Type below...
                          </span>
                        ) : (
                          <span style={{ fontSize: "10px", color: "#555" }}>
                            {validCount} valid
                          </span>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Search input */}
      {selectedCell !== null && !gameOver && (
        <div style={{
          marginTop: "16px",
          width: "320px",
          position: "relative"
        }}>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search for a Joker..."
            style={{
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,217,61,0.4)",
              borderRadius: "10px",
              color: "#fff",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
          {search.trim() && (
            <div style={{
              marginTop: "4px",
              background: "rgba(20,20,40,0.98)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              overflow: "hidden",
              maxHeight: "260px",
              overflowY: "auto"
            }}>
              {filteredJokers.length === 0 ? (
                <div style={{ padding: "12px", color: "#666", fontSize: "13px", textAlign: "center" }}>
                  No matching Jokers found
                </div>
              ) : (
                filteredJokers.map(j => (
                  <div
                    key={j.name}
                    onClick={() => handleGuess(j)}
                    style={{
                      padding: "10px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <span style={{
                      fontSize: "10px",
                      fontWeight: 700,
                      color: RARITY_COLORS[j.rarity],
                      background: RARITY_BG[j.rarity],
                      padding: "2px 8px",
                      borderRadius: "4px",
                      minWidth: "70px",
                      textAlign: "center"
                    }}>
                      {j.rarity}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{j.name}</span>
                    <span style={{ fontSize: "10px", color: "#666", marginLeft: "auto" }}>
                      {j.effects.join(", ")}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Game Over Results */}
      {showResults && (
        <div style={{
          marginTop: "20px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "14px",
          padding: "20px",
          textAlign: "center",
          maxWidth: "340px",
          width: "100%"
        }}>
          <div style={{ fontSize: "28px", marginBottom: "8px" }}>
            {correctCount === 9 ? "🏆" : correctCount >= 7 ? "🎉" : correctCount >= 4 ? "👍" : "😵"}
          </div>
          <h2 style={{
            fontSize: "20px",
            fontWeight: 800,
            margin: "0 0 4px",
            background: correctCount === 9
              ? "linear-gradient(135deg, #ffd700, #ff6b6b)"
              : "linear-gradient(135deg, #fff, #aaa)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            {correctCount === 9 ? "IMMACULATE!" : `${correctCount}/9 Correct`}
          </h2>
          <p style={{ color: "#888", fontSize: "13px", margin: "4px 0 12px" }}>
            Rarity Score: {rarityScore}
          </p>

          {/* Mini result grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 28px)",
            gap: "4px",
            justifyContent: "center",
            marginBottom: "12px"
          }}>
            {cells.map((cell, i) => (
              <div key={i} style={{
                width: "28px",
                height: "28px",
                borderRadius: "4px",
                background: cell
                  ? cell.correct ? "#2ecc71" : "#e74c3c"
                  : "#333",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px"
              }}>
                {cell ? (cell.correct ? "✅" : "❌") : "⬛"}
              </div>
            ))}
          </div>

          <p style={{ color: "#666", fontSize: "11px" }}>
            New grid every day at midnight!
          </p>
        </div>
      )}

      {/* How to Play */}
      {!gameOver && !selectedCell && (
        <div style={{
          marginTop: "20px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          padding: "14px 18px",
          maxWidth: "340px",
          width: "100%"
        }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, margin: "0 0 8px", color: "#ffd93d" }}>
            How to Play
          </h3>
          <div style={{ fontSize: "12px", color: "#999", lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 4px" }}>🃏 Click a cell, then search for a Balatro Joker that matches <strong style={{ color: "#ccc" }}>both</strong> the row and column categories.</p>
            <p style={{ margin: "0 0 4px" }}>🎯 You have <strong style={{ color: "#ffd93d" }}>9 guesses</strong> — wrong answers still cost a guess!</p>
            <p style={{ margin: "0 0 4px" }}>🔒 Each Joker can only be used <strong style={{ color: "#ccc" }}>once</strong>.</p>
            <p style={{ margin: 0 }}>📈 Lower rarity = lower score. Go for rare picks!</p>
          </div>
        </div>
      )}
    </div>
  );
}