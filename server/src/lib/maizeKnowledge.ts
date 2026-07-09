// Grounding facts for the Claude-powered Ask AI assistant — keeps answers
// specific to Ugandan smallholder maize farming instead of generic advice.
export const MAIZE_KNOWLEDGE_BASE = `
VARIETIES COMMONLY GROWN IN UGANDA
- Longe 10H: high-yield hybrid, ~120-140 days to maturity, popular in Masindi, Kapchorwa and Iganga.
- Longe 7H: hybrid seed maize, good drought tolerance, widely certified by NARO.
- Longe 5: open-pollinated variety, farmers can save seed from it, lower yield than hybrids.
- Longe 4: older open-pollinated variety, still used in some highland districts.

PLANTING
- Two rainy seasons: first rains (March-May) and second rains (August-November) in most of central/eastern Uganda; the north (Lira, Gulu) has one longer rainy season (April-October).
- Recommended spacing: 75cm between rows, 30cm between plants (roughly 2-3 seeds per hole, thin to 1-2).
- Plant at the onset of reliable rains — planting into dry soil risks poor germination.

FERTILIZER AND SOIL
- DAP (Di-Ammonium Phosphate) is commonly applied at planting for phosphorus.
- Urea top-dressed 3-4 weeks after emergence supports vegetative growth.
- Manure/compost improves soil structure in depleted soils common in central Uganda.

COMMON PESTS
- Fall armyworm: the most destructive pest in Uganda since 2016; feeds on the whorl, leaves ragged holes and sawdust-like frass. Scout weekly, especially in the first 6 weeks.
- Stalk borer: bores into stems, causing "deadheart" in young plants.
- Weevils and larger grain borer: major post-harvest storage pests, especially in poorly dried grain.

COMMON DISEASES
- Northern Corn Leaf Blight, Gray Leaf Spot, Maize Streak Virus (leafhopper-transmitted, worst in early-planted fields near grass borders).

HARVEST AND STORAGE
- Harvest when husks are dry and kernels are hard (moisture around 20-25% in the field).
- Dry grain to 13% moisture or below before storage to prevent mould (aflatoxin risk) and weevil damage.
- Hermetic storage bags (e.g. PICS bags) are the most effective low-cost way to protect dried grain from weevils and larger grain borer without chemicals.
- Avoid storing maize directly on the ground; use pallets or raised platforms and keep storage areas dry and ventilated.

SELLING AND MARKET
- Prices are typically highest a few months after harvest, once farmer supply has thinned; selling immediately after harvest ("distress selling") usually means the lowest price of the season.
- Dry grain and certified seed maize command a premium over wet or poorly sorted grain.
- District dry-grain prices in Uganda have recently ranged roughly UGX 1,300-1,500 per kg, but always check the Farm Bhade Market Prices page for current, district-specific figures rather than relying on general knowledge — prices vary by season and district.

FARM BHADE CONTEXT
- Farm Bhade is an AI-powered maize marketplace and farming assistant app for Uganda.
- It has an AI Crop Doctor for diagnosing crop photos, a marketplace connecting farmers directly to buyers and processors, live-ish market prices, and district weather forecasts.
- When a farmer asks about their crop's health from a description (not a photo), give general guidance but suggest they use the AI Crop Doctor's photo diagnosis for a specific answer.
- When asked about current prices, remind the farmer to check the Market Prices page for up-to-date, district-specific numbers rather than quoting a fixed figure.
`.trim()
