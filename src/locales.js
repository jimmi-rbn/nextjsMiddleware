const markets = {
  en: {
    //Global - English
    language: "en",
    locale: "en",
    market: "en",
    country: "Global",
    currency: "EUR",
  },
  //Denmark - Danish
  "da-DK": {
    language: "da",
    locale: "da_DK",
    market: "da-DK",
    country: "denmark",
    currency: "DKK",
  },
};

const publisedMarkets = Object.values(markets);

module.exports = {
  localeIdentifiers: publisedMarkets,
};
