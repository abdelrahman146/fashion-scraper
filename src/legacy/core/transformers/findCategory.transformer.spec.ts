import { categorize } from "./findCategory.transformer"; // Replace with your actual file name

describe("categorize function", () => {
  test("should categorize empty text as 'uncategorized/uncategorized'", () => {
    const result = categorize("");
    expect(result.category).toBe("uncategorized");
    expect(result.subCategory).toBe("uncategorized");
  });

  test("should categorize 'blue jeans' as 'bottom/jeans'", () => {
    const result = categorize("blue jeans");
    expect(result.category).toBe("bottom");
    expect(result.subCategory).toBe("jeans");
  });

  test("should categorize 'running shoes' as 'footwear/shoes'", () => {
    const result = categorize("running shoes");
    expect(result.category).toBe("footwear");
    expect(result.subCategory).toBe("shoes");
  });

  // Add more test cases covering different scenarios and categories

  test("should categorize 't-shirt' as 'top/tshirt'", () => {
    const result = categorize("t-shirt");
    expect(result.category).toBe("top");
    expect(result.subCategory).toBe("tshirt");
  });

  test("should categorize 'backpack' as 'bag/backpack'", () => {
    const result = categorize("backpack");
    expect(result.category).toBe("bag");
    expect(result.subCategory).toBe("backpack");
  });

  test("should categorize 'formal shirt' as 'formalwear/shirt'", () => {
    const result = categorize("formal shirt");
    expect(result.category).toBe("top");
    expect(result.subCategory).toBe("shirt");
  });

  test("should categorize 'winter coat' as 'outerwear/coat'", () => {
    const result = categorize("winter coat");
    expect(result.category).toBe("outerwear");
    expect(result.subCategory).toBe("coat");
  });

  test("should categorize 'leather boots' as 'footwear/boots'", () => {
    const result = categorize("leather boots");
    expect(result.category).toBe("footwear");
    expect(result.subCategory).toBe("boots");
  });

  test("should categorize 'sun hat' as 'hat/sunhat'", () => {
    const result = categorize("sun hat");
    expect(result.category).toBe("hat");
    expect(result.subCategory).toBe("sunhat");
  });

  test("should categorize 'lace panties' as 'underwear/panties'", () => {
    const result = categorize("lace panties");
    expect(result.category).toBe("underwear");
    expect(result.subCategory).toBe("panties");
  });

  test("should categorize 'dress shoes' as 'footwear/shoes'", () => {
    const result = categorize("dress shoes");
    expect(result.category).toBe("footwear");
    expect(result.subCategory).toBe("shoes");
  });

  test("should handle mixed case and categorize 'SweatPants' as 'bottom/sweatpants'", () => {
    const result = categorize("SweatPants");
    expect(result.category).toBe("bottom");
    expect(result.subCategory).toBe("sweatpants");
  });

  test("should handle irregular plurals and return 'uncategorized/uncategorized'", () => {
    const result = categorize("people");
    expect(result.category).toBe("uncategorized");
    expect(result.subCategory).toBe("uncategorized");
  });

  test("should categorize 'Elegant Red Velvet Evening Gown' as 'formalwear/gown'", () => {
    const result = categorize("Elegant Red Velvet Evening Gown");
    expect(result.category).toBe("formalwear");
    expect(result.subCategory).toBe("evening/gown");
  });

  test("should categorize 'Stylish Leather Biker Jacket with Zipper Details' as 'outerwear/jacket'", () => {
    const result = categorize("Stylish Leather Biker Jacket with Zipper Details");
    expect(result.category).toBe("outerwear");
    expect(result.subCategory).toBe("jacket");
  });

  test("should categorize 'Classic Black and White Houndstooth Checkered Dress' as 'formalwear/dress'", () => {
    const result = categorize("Classic Black and White Houndstooth Checkered Dress");
    expect(result.category).toBe("formalwear");
    expect(result.subCategory).toBe("dress");
  });

  test("should categorize 'Cozy Cashmere Pullover Sweater with Cable Knit Pattern' as 'outerwear/sweater'", () => {
    const result = categorize("Cozy Cashmere Pullover Sweater with Cable Knit Pattern");
    expect(result.category).toBe("outerwear");
    expect(result.subCategory).toBe("pullover/sweater");
  });

  test("should categorize 'Designer Floral Print Silk Kimono Robe' as 'outerwear/robe'", () => {
    const result = categorize("Designer Floral Print Silk Kimono Robe");
    expect(result.category).toBe("outerwear");
    expect(result.subCategory).toBe("kimono/robe");
  });

  test("should categorize 'Premium Wool Blend Fedora Hat with Leather Band' as 'hat/fedora'", () => {
    const result = categorize("Premium Wool Blend Fedora Hat with Leather Band");
    expect(result.category).toBe("hat");
    expect(result.subCategory).toBe("fedora/hat");
  });

  test("should categorize 'Vintage Denim High-Waisted Wide-Leg Jeans' as 'bottom/jeans'", () => {
    const result = categorize("Vintage Denim High-Waisted Wide-Leg Jeans");
    expect(result.category).toBe("bottom");
    expect(result.subCategory).toBe("denim/jeans");
  });

  test("should categorize 'Handcrafted Leather Oxford Shoes with Brogue Details' as 'footwear/oxford'", () => {
    const result = categorize("Handcrafted Leather Oxford Shoes with Brogue Details");
    expect(result.category).toBe("footwear");
    expect(result.subCategory).toBe("oxford/shoes/brogue");
  });

  test("should categorize 'Chic Sleeveless Sequin Evening Gown with V-Neck' as 'formalwear/gown'", () => {
    const result = categorize("Chic Sleeveless Sequin Evening Gown with V-Neck");
    expect(result.category).toBe("formalwear");
    expect(result.subCategory).toBe("evening/gown");
  });

  test("should categorize 'Warm Fleece-Lined Parka Jacket with Faux Fur Hood' as 'outerwear/parka/jacket'", () => {
    const result = categorize("Warm Fleece-Lined Parka Jacket with Faux Fur Hood");
    expect(result.category).toBe("outerwear");
    expect(result.subCategory).toBe("parka/jacket");
  });

  test("should categorize 'Bohemian Floral Print Maxi Dress with Ruffled Hem' as 'formalwear/dress'", () => {
    const result = categorize("Bohemian Floral Print Maxi Dress with Ruffled Hem");
    expect(result.category).toBe("formalwear");
    expect(result.subCategory).toBe("dress");
  });

  test("should categorize 'Soft Merino Wool Turtleneck Sweater in Heather Gray' as 'top/sweater'", () => {
    const result = categorize("Soft Merino Wool Turtleneck Sweater in Heather Gray");
    expect(result.category).toBe("top");
    expect(result.subCategory).toBe("turtleneck/sweater");
  });

  test("should categorize 'Luxurious Satin Bridal Robe with Lace Trim' as 'outerwear/robe'", () => {
    const result = categorize("Luxurious Satin Bridal Robe with Lace Trim");
    expect(result.category).toBe("outerwear");
    expect(result.subCategory).toBe("robe");
  });

  test("should categorize 'Handwoven Straw Panama Hat with Wide Brim' as 'hat/panama'", () => {
    const result = categorize("Handwoven Straw Panama Hat with Wide Brim");
    expect(result.category).toBe("hat");
    expect(result.subCategory).toBe("panamahat");
  });

  test("should categorize 'Distressed Boyfriend Fit Denim Jeans with Embroidery' as 'bottom/jeans'", () => {
    const result = categorize("Distressed Boyfriend Fit Denim Jeans with Embroidery");
    expect(result.category).toBe("bottom");
    expect(result.subCategory).toBe("denim/jeans");
  });

  test("should categorize 'Italian Leather Loafers with Tassel Detail' as 'footwear/loafers'", () => {
    const result = categorize("Italian Leather Loafers with Tassel Detail");
    expect(result.category).toBe("footwear");
    expect(result.subCategory).toBe("loafers");
  });

  test("should categorize 'Elegant Lace A-Line Wedding Gown with Train' as 'formalwear/gown'", () => {
    const result = categorize("Elegant Lace A-Line Wedding Gown with Train");
    expect(result.category).toBe("formalwear");
    expect(result.subCategory).toBe("wedding/gown");
  });

  test("should categorize 'Quilted Puffer Jacket with Detachable Hood' as 'outerwear/jacket'", () => {
    const result = categorize("Quilted Puffer Jacket with Detachable Hood");
    expect(result.category).toBe("outerwear");
    expect(result.subCategory).toBe("puffer/jacket");
  });

  test("should categorize 'Vintage-Inspired Tea-Length Swing Dress with Polka Dots' as 'top/dress'", () => {
    const result = categorize("Vintage-Inspired Tea-Length Swing Dress with Polka Dots");
    expect(result.category).toBe("formalwear");
    expect(result.subCategory).toBe("dress");
  });

  test("should categorize 'Cozy Cable-Knit Cardigan Sweater in Autumn Colors' as 'top/sweater'", () => {
    const result = categorize("Cozy Cable-Knit Cardigan Sweater in Autumn Colors");
    expect(result.category).toBe("outerwear");
    expect(result.subCategory).toBe("cardigan/sweater");
  });

  test("should categorize 'Typography Print Better Cotton T-shirt' as 'top/tshirt'", () => {
    const result = categorize("Typography Print Better Cotton T-shirt");
    expect(result.category).toBe("top");
    expect(result.subCategory).toBe("tshirt");
  });

  test("should categorize 'Textured Polo T-shirt' as 'top/tshirt'", () => {
    const result = categorize("Textured Polo T-shirt");
    expect(result.category).toBe("top");
    expect(result.subCategory).toBe("polo/tshirt");
  });

  test("should categorize 'Skinny Fit Chino Pants' as 'bottom/chino/pants'", () => {
    const result = categorize("Skinny Fit Chino Pants");
    expect(result.category).toBe("bottom");
    expect(result.subCategory).toBe("chino/pants");
  });

  test("should categorize 'Jacquard Collared Top' as 'top/top'", () => {
    const result = categorize("Jacquard Collared Top");
    expect(result.category).toBe("top");
    expect(result.subCategory).toBe("top");
  });

  test("should categorize 'Plain Wide Leg Pants with Pockets' as 'bottom/pants'", () => {
    const result = categorize("Plain Wide Leg Pants with Pockets");
    expect(result.category).toBe("bottom");
    expect(result.subCategory).toBe("wideleg/pants");
  });

  test("should categorize 'Coin Unisex Black Running Shoes' as 'bottom/pants'", () => {
    const result = categorize("Coin Unisex Black Running Shoes");
    expect(result.category).toBe("footwear");
    expect(result.subCategory).toBe("shoes");
  });

  test("should categorize 'U.S. POLO Assn. AREN Sneaker Shoes' as 'bottom/pants'", () => {
    const result = categorize("U.S. POLO Assn. AREN Sneaker Shoes");
    expect(result.category).toBe("footwear");
    expect(result.subCategory).toBe("sneaker/shoes");
  });

  test("should categorize 'Shirt - Brown - Slim fit' as 'bottom/pants'", () => {
    const result = categorize("Shirt - Brown - Slim fit");
    expect(result.category).toBe("top");
    expect(result.subCategory).toBe("shirt");
  });

  test("should categorize 'Women's Bag Jpm2181 Black' as 'top/tshirt'", () => {
    const result = categorize("Women's Bag Jpm2181 Black");
    expect(result.category).toBe("bag");
    expect(result.subCategory).toBe("bag");
  });

  test("should handle special characters and return 'uncategorized/uncategorized'", () => {
    const result = categorize("!@#$%^&*()_+");
    expect(result.category).toBe("uncategorized");
    expect(result.subCategory).toBe("uncategorized");
  });
});
