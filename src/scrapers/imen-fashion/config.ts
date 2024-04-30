import { ScraperConfig } from "../../types";

export const SixthStreetConfig: ScraperConfig = {
  pages: [
    {
      url: "https://en-ae.6thstreet.com/women/clothing/dresses.html?q=Women+Clothing+Dresses&p=1&hFR%5Bcategories.level0%5D%5B0%5D=Women+%2F%2F%2F+Clothing+%2F%2F%2F+Dresses&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&idx=enterprise_magento_english_products&dFR%5Bsort%5D%5B0%5D=&hFR%5Bcategories.level1%5D%5B0%5D=&dFR%5Bcolorfamily%5D%5B0%5D=&dFR%5Bdiscount%5D%5B0%5D=&dFR%5Bsizes%5D%5B0%5D=&dFR%5Bsize_uk%5D%5B0%5D=&dFR%5Bsize_eu%5D%5B0%5D=&dFR%5Bsize_us%5D%5B0%5D=&dFR%5Bprice.AED.default%5D%5B0%5D=gte34%2Clte181&dFR%5Bgender%5D%5B0%5D=Women&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bcategories_without_path%5D%5B0%5D=Maxi+Dresses&dFR%5BcategoryIds%5D%5B0%5D=19234&dFR%5Bsleeve_length%5D%5B0%5D=Long+Sleeve&dFR%5Bneck_line%5D%5B0%5D=Boat+Neck%2CChoker+Neck%2CCollared+Neck%2CCowl+Neck%2CCrew+Neck%2CHalterneck%2CHenley+Neck%2CHigh+Neck%2CHooded+Neck%2CMock+Neck%2CQuarter+Zip%2CRound+Neck%2CScoop+Neck%2CSlash+Neck%2CSplit+Neck%2CSquare+Neck%2CTie-Up+Neck%2CTurtle+Neck%2CV+Neck%2CCollared",
      specs: {
        listingUrl:
          "https://en-ae.6thstreet.com/women/clothing/dresses.html?q=Women+Clothing+Dresses&p=1&hFR%5Bcategories.level0%5D%5B0%5D=Women+%2F%2F%2F+Clothing+%2F%2F%2F+Dresses&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&idx=enterprise_magento_english_products&dFR%5Bsort%5D%5B0%5D=&hFR%5Bcategories.level1%5D%5B0%5D=&dFR%5Bcolorfamily%5D%5B0%5D=&dFR%5Bdiscount%5D%5B0%5D=&dFR%5Bsizes%5D%5B0%5D=&dFR%5Bsize_uk%5D%5B0%5D=&dFR%5Bsize_eu%5D%5B0%5D=&dFR%5Bsize_us%5D%5B0%5D=&dFR%5Bprice.AED.default%5D%5B0%5D=gte34%2Clte181&dFR%5Bgender%5D%5B0%5D=Women&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bcategories_without_path%5D%5B0%5D=Maxi+Dresses&dFR%5BcategoryIds%5D%5B0%5D=19234&dFR%5Bsleeve_length%5D%5B0%5D=Long+Sleeve&dFR%5Bneck_line%5D%5B0%5D=Boat+Neck%2CChoker+Neck%2CCollared+Neck%2CCowl+Neck%2CCrew+Neck%2CHalterneck%2CHenley+Neck%2CHigh+Neck%2CHooded+Neck%2CMock+Neck%2CQuarter+Zip%2CRound+Neck%2CScoop+Neck%2CSlash+Neck%2CSplit+Neck%2CSquare+Neck%2CTie-Up+Neck%2CTurtle+Neck%2CV+Neck%2CCollared",
        for: "women",
        category: "dress",
        subCategory: "casual",
      },
    },
    {
      url: "https://en-ae.6thstreet.com/women/clothing/arabian-clothing.html?q=Women+Clothing+Modest+Wear&p=1&hFR%5Bcategories.level0%5D%5B0%5D=Women+%2F%2F%2F+Clothing+%2F%2F%2F+Modest+Wear&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&idx=enterprise_magento_english_products&dFR%5Bprice.AED.default%5D%5B0%5D=gte98%2Clte172&dFR%5BcategoryIds%5D%5B0%5D=&dFR%5Bgender%5D%5B0%5D=Women&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bbrand_name%5D%5B0%5D=Roza+Abaya",
      specs: {
        listingUrl:
          "https://en-ae.6thstreet.com/women/clothing/arabian-clothing.html?q=Women+Clothing+Modest+Wear&p=1&hFR%5Bcategories.level0%5D%5B0%5D=Women+%2F%2F%2F+Clothing+%2F%2F%2F+Modest+Wear&nR%5Bvisibility_catalog%5D%5B=%5D%5B0%5D%3D1&idx=enterprise_magento_english_products&dFR%5Bprice.AED.default%5D%5B0%5D=gte98%2Clte172&dFR%5BcategoryIds%5D%5B0%5D=&dFR%5Bgender%5D%5B0%5D=Women&dFR%5Bin_stock%5D%5B0%5D=1&dFR%5Bbrand_name%5D%5B0%5D=Roza+Abaya",
        for: "women",
        category: "dress",
        subCategory: "abaya",
      },
    },
  ],
  defaultSpecs: {
    source: "6thstreet",
    website: "https://en-ae.6thstreet.com",
    region: "UAE",
    currency: "AED",
  },
  options: {
    take: 150,
  },
};

export const NamshiConfig: ScraperConfig = {
  pages: [
    {
      url: "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-abayas/?page=1&f%5Bcurrent_price%5D%5Bmin%5D=42&f%5Bcurrent_price%5D%5Bmax%5D=150",
      specs: {
        listingUrl:
          "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-abayas/?page=1&f%5Bcurrent_price%5D%5Bmin%5D=42&f%5Bcurrent_price%5D%5Bmax%5D=150",
        for: "women",
        category: "dress",
        subCategory: "abaya",
      },
    },
    {
      url: "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-jalabiyas/?f%5Bcurrent_price%5D%5Bmin%5D=42&f%5Bcurrent_price%5D%5Bmax%5D=150",
      specs: {
        listingUrl:
          "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-jalabiyas/?f%5Bcurrent_price%5D%5Bmin%5D=42&f%5Bcurrent_price%5D%5Bmax%5D=150",
        for: "women",
        category: "dress",
        subCategory: "jalabiya",
      },
    },
    {
      url: "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-dresses/?f%5Bcurrent_price%5D%5Bmin%5D=42&f%5Bcurrent_price%5D%5Bmax%5D=150",
      specs: {
        listingUrl:
          "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-dresses/?f%5Bcurrent_price%5D%5Bmin%5D=42&f%5Bcurrent_price%5D%5Bmax%5D=150",
        for: "women",
        category: "dress",
        subCategory: "casual",
      },
    },
    {
      url: "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-kaftans/?page=1&f%5Bcurrent_price%5D%5Bmin%5D=11&f%5Bcurrent_price%5D%5Bmax%5D=150",
      specs: {
        listingUrl:
          "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-kaftans/?page=1&f%5Bcurrent_price%5D%5Bmin%5D=11&f%5Bcurrent_price%5D%5Bmax%5D=150",
        for: "women",
        category: "dress",
        subCategory: "kaftan",
      },
    },
    {
      url: "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-tops/?f%5Bcurrent_price%5D%5Bmin%5D=11&f%5Bcurrent_price%5D%5Bmax%5D=150",
      specs: {
        listingUrl:
          "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-tops/?f%5Bcurrent_price%5D%5Bmin%5D=11&f%5Bcurrent_price%5D%5Bmax%5D=150",
        for: "women",
        category: "top",
        subCategory: "top",
      },
    },
    {
      url: "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-sets/?f%5Bcurrent_price%5D%5Bmin%5D=11&f%5Bcurrent_price%5D%5Bmax%5D=150",
      specs: {
        listingUrl:
          "https://www.namshi.com/uae-en/women-clothing-arabian_clothing-sets/?f%5Bcurrent_price%5D%5Bmin%5D=11&f%5Bcurrent_price%5D%5Bmax%5D=150",
        for: "women",
        category: "set",
        subCategory: "set",
      },
    },
  ],
  defaultSpecs: {
    source: "namshi",
    website: "https://www.namshi.com",
    region: "UAE",
    currency: "AED",
  },
  options: {
    take: 400,
  },
};
