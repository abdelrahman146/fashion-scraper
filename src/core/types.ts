export type Product = Category & Attr;

export interface Attr {
  id: string;
  productId?: string;
  source: string;
  region: REGION;
  title: string;
  brand?: string;
  gender?: "MALE" | "FEMALE" | "NEUTRAL";
  size?: string;
  color?: COLOR;
  material?: MATERIAL;
  discountPrice?: string;
  price: string;
  currency: string;
  hasPromotion?: string;
  ratingScore?: string;
  ratingCount?: string;
  isFreeShipping?: string;
}

enum MATERIAL {
  COTTON = "COTTON",
  POLYESTER = "POLYESTER",
  WOOL = "WOOL",
  SILK = "SILK",
  DENIM = "DENIM",
  LEATHER = "LEATHER",
  LINEN = "LINEN",
  NYLON = "NYLON",
  RAYON = "RAYON",
  SPANDEX = "SPANDEX",
  VELVET = "VELVET",
  FLEECE = "FLEECE",
  CHIFFON = "CHIFFON",
  SATIN = "SATIN",
  LACE = "LACE",
  JERSEY = "JERSEY",
  FLANNEL = "FLANNEL",
  TWEED = "TWEED",
  CANVAS = "CANVAS",
  MESH = "MESH",
  CASHMERE = "CASHMERE",
  ACRYLIC = "ACRYLIC",
  LINING = "LINING",
  TERRY_CLOTH = "TERRY_CLOTH",
}

enum COLOR {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  PINK = "PINK",
  YELLOW = "YELLOW",
  BROWN = "BROWN",
  PURPLE = "PURPLE",
  BLACK = "BLACK",
  WHITE = "WHITE",
  ORANGE = "ORANGE",
  GRAY = "GRAY",
  LIGHT_BLUE = "LIGHT_BLUE",
  DARK_GREEN = "DARK_GREEN",
  MAGENTA = "MAGENTA",
  CYAN = "CYAN",
  GOLD = "GOLD",
  SILVER = "SILVER",
  LIME = "LIME",
  INDIGO = "INDIGO",
  TURQUOISE = "TURQUOISE",
  MAROON = "MAROON",
  NAVY = "NAVY",
  OLIVE = "OLIVE",
  TEAL = "TEAL",
  CORAL = "CORAL",
  VIOLET = "VIOLET",
  SALMON = "SALMON",
  BEIGE = "BEIGE",
  TAN = "TAN",
}

export enum REGION {
  GCC = "GCC",
  NA = "NORTH_AMERICA",
  EU = "EAST_EUROPE",
  WU = "WEST_EUROPE",
  SC = "SCANDINAVIA",
  SA = "SOUTH_ASIA",
  SEA = "SOUTHEAST_ASIA",
  OC = "OCEANIA",
}

export type Category =
  | {
      category: "TOP";
      subCategory: TOP;
    }
  | {
      category: "BOTTOM";
      subCategory: BOTTOM;
    }
  | {
      category: "OUTERWEAR";
      subCategory: OUTERWEAR;
    }
  | {
      category: "UNDERWEAR";
      subCategory: UNDERWEAR;
    }
  | {
      category: "FOOTWEAR";
      subCategory: FOOTWEAR;
    }
  | {
      category: "ACTIVEWEAR";
      subCategory: ACTIVEWEAR;
    }
  | {
      category: "FORMALWEAR";
      subCategory: FORMALWEAR;
    }
  | {
      category: "BAG";
      subCategory: BAG;
    }
  | {
      category: "HAT";
      subCategory: HAT;
    }
  | {
      category: "OTHER";
      subCategory: OTHER;
    };

enum TOP {
  TSHIRT = "T-SHIRT",
  SHIRT = "SHIRT",
  BLOUSE = "BLOUSE",
  SWEATER = "SWEATER",
}

enum BOTTOM {
  PANTS = "PANTS",
  SKIRT = "SKIRT",
  SHORT = "SHORT",
  BERMUDA = "BERMUDA",
}

enum FOOTWEAR {
  SNEAKERS = "SNEAKERS",
  BOOTS = "BOOTS",
  FLATS = "FLATS",
  HEELS = "HEELS",
  SANDALS = "SANDALS",
  FLIP_FLOPS = "FLIP_FLOPS",
  SLIDES = "SLIDES",
  ESPADRILLES = "ESPADRILLES",
  WEDGES = "WEDGES",
  ATHLETIC = "ATHLETIC",
}

enum BAG {
  PURSE = "PURSE",
  CROSSBODY_BAG = "CROSSBODY_BAG",
  SHOULDER_BAG = "SHOULDER_BAG",
  BACKPACK = "BACKPACK",
}

enum HAT {
  CAP = "CAP",
  BEANIE = "BEANIE",
  FEDORA = "FEDORA",
  SUNHAT = "SUNHAT",
}

enum OTHER {
  SCARVE = "SCARVE",
  BELT = "BELT",
  TIE = "TIE",
  BOW_TIE = "TIE",
}

enum OUTERWEAR {
  JACKET = "JACKET",
  COAT = "COAT",
  OVERCOAT = "OVERCOAT",
}

enum ACTIVEWEAR {
  ACTIVEWEAR = "ACTIVEWEAR",
  SWIMWEAR = "SWIMWEAR",
}

enum FORMALWEAR {
  SUIT = "SUIT",
  TUXEDO = "TUXEDO",
  CASUAL = "CASUAL_DRESS",
  FORMAL = "FORMAL_DRESS",
}

enum UNDERWEAR {
  LINGERIE = "LINGERIE",
  UNDERWEAR = "UNDERWEAR",
}
