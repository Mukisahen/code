import type { FaqEntry } from '@/types/chatbot'

export const CHATBOT_FAQ: FaqEntry[] = [
  {
    id: 'faq-planting-time',
    keywords: ['when', 'plant', 'planting', 'season', 'okusimba', 'ebiseera'],
    question: {
      en: 'When should I plant maize?',
      lg: 'Nsaanidde okusimba kasooli ddi?',
    },
    answer: {
      en: 'In most of Uganda, plant at the start of the rains — early March for the first season (Season A) and early August/September for the second (Season B). Wait until the soil has had at least 2–3 good rain showers so there is enough moisture for germination.',
      lg: 'Mu bitundu bingi mu Uganda, simba enkuba bwe zitandika okutonnya — mu ntandikwa za Maaki ku kyeya ekisooka (Season A), ne mu ntandikwa za Agusito/Ssebutemba ku kyeya ekyokubiri (Season B). Lindirira enkuba ez’amaanyi ezisukka mu bbiri oba ssatu ettaka lisobole okutobeka bulungi.',
    },
  },
  {
    id: 'faq-spacing',
    keywords: ['spacing', 'space', 'distance', 'ebbanga'],
    question: {
      en: 'What spacing should I use for maize?',
      lg: 'Nkozesa bbanga ki nga nsimba kasooli?',
    },
    answer: {
      en: 'A common recommended spacing is 75cm between rows and 30cm between plants, with 1–2 seeds per hole. This gives roughly 44,000–53,000 plants per acre and good airflow to reduce disease.',
      lg: 'Ebbanga eritera okukozesebwa lya sentimita 75 wakati w’emirongo, ne sentimita 30 wakati w’ebimera, nga oteeka ensigo emu oba bbiri mu buli kinnya. Kino kikuwa emimera nga 44,000–53,000 ku eka, era omukka gutambula bulungi okukendeeza ku bulwadde.',
    },
  },
  {
    id: 'faq-fertilizer',
    keywords: ['fertilizer', 'fertiliser', 'manure', 'urea', 'dap', 'nutrient', 'ebigimusa'],
    question: {
      en: 'What fertilizer should I use for maize?',
      lg: 'Nkozesa ebigimusa ki ku kasooli?',
    },
    answer: {
      en: 'Apply DAP or NPK at planting to support root growth, then top-dress with Urea or CAN 4–6 weeks later at knee-high stage for strong vegetative growth. Well-rotted manure or compost also improves soil health over time.',
      lg: 'Teeka DAP oba NPK bw’osimba okuyamba emirandira okukula, oluvannyuma oteeke Urea oba CAN nga wayiseewo wiiki 4–6 ekimera nga kituuse ku maaso g’amaviivi, kino kikiyamba okukula obulungi. N’obusa bw’ente obukaddiye oba compost nabyo bilungamya ettaka mu bbanga.',
    },
  },
  {
    id: 'faq-leaf-blight',
    keywords: ['blight', 'leaf', 'spots', 'lesion', 'obulwadde', 'ebikuta'],
    question: {
      en: 'How do I control Northern Corn Leaf Blight?',
      lg: 'Nzikiriza ntya obulwadde bwa Northern Corn Leaf Blight?',
    },
    answer: {
      en: 'Remove and destroy heavily infected leaves, rotate maize with a non-host crop like beans, plant tolerant varieties where available, and apply a mancozeb-based fungicide if the infection is spreading quickly. Good spacing helps leaves dry faster and reduces spread.',
      lg: 'Ggyawo era ozikirize ebikoola ebirwadde nnyo, kyusa ku kasooli n’ebirime ebirala nga ebijanjaalo, simba ensigo eziwangula obulwadde bwe ziba waliwo, era okozese ddagala lya mancozeb obulwadde bwe buba bwiyongera mangu. Ebbanga eddungi wakati w’ebimera liyamba ebikoola okukala mangu ne kikendeeza obulwadde okusaasaana.',
    },
  },
  {
    id: 'faq-armyworm',
    keywords: ['armyworm', 'worm', 'pest', 'caterpillar', 'ekiwuka'],
    question: {
      en: 'How do I deal with fall armyworm?',
      lg: 'Nkola ntya ku kiwuka kya fall armyworm?',
    },
    answer: {
      en: 'Scout your field weekly, especially the whorl of young plants. If you see window-pane feeding damage or frass, apply an approved insecticide targeting armyworm early in the morning or evening. Early planting and field hygiene also reduce infestation.',
      lg: 'Kebera ennimiro yo buli wiiki, na kyokka mu mutima gw’ebimera ebito. Bw’olaba obwonoono ku bikoola oba amasandwa g’ekiwuka, kozesa ddagala eryakkirizibwa erizikiriza ekiwuka mu makya oba akawungeezi. Okusimba mangu n’okukuuma ennimiro nga nnongoofu nabyo bikendeeza obuzibu buno.',
    },
  },
  {
    id: 'faq-watering',
    keywords: ['water', 'rain', 'irrigation', 'drought', 'enkuba', 'amazzi'],
    question: {
      en: 'How much water/rain does maize need?',
      lg: 'Kasooli yeetaaga nkuba oba mazzi kimeka?',
    },
    answer: {
      en: 'Maize needs about 500–800mm of rainfall across the season, with the most critical period being flowering and grain-filling. If rains fail during this window, irrigate if possible — moisture stress at flowering causes the biggest yield losses.',
      lg: 'Kasooli yeetaaga nkuba nga mm 500–800 mu kyeya kyonna, n’ekiseera ekisinga obukulu nga kye kya kulimula n’okujjuza empeke. Enkuba bwe zibula mu kiseera ekyo, teeka amazzi bw’osobola — okubulwa amazzi mu kiseera ekyo kye kisinga okukendeeza ku muganyulo.',
    },
  },
  {
    id: 'faq-harvest',
    keywords: ['harvest', 'ready', 'mature', 'okukungula'],
    question: {
      en: 'How do I know when maize is ready to harvest?',
      lg: 'Ntegeera ntya nti kasooli akaaye okukungulwa?',
    },
    answer: {
      en: 'Maize is ready when the husks turn brown/dry and a black layer forms at the base of the kernel (black layer stage). For dry grain storage, wait until moisture content drops to around 13–14%, or dry further after harvest before storing.',
      lg: 'Kasooli akaaye nga amagumba gakalira ne gafuuka bbulawuni, era nga wabaawo akaddo akaddugavu wansi w’empeke. Okusobola okuterekawo empeke enkalu, lindirira amazzi mu mpeke gakendeere ku 13–14%, oba weongereko okwokya nga tonannyika mu tterekero.',
    },
  },
  {
    id: 'faq-seed-selection',
    keywords: ['seed', 'variety', 'hybrid', 'which seed', 'ensigo'],
    question: {
      en: 'Which maize seed variety should I plant?',
      lg: 'Nsimba ku ngeri ki eya nsigo za kasooli?',
    },
    answer: {
      en: 'Certified hybrids like Longe 10H give strong yields in most districts and tolerate common diseases better than recycled seed. Buy certified seed each season rather than replanting saved grain — yields drop noticeably after the first generation.',
      lg: 'Ensigo ez’ekikula ekirongoosezze nga Longe 10H ziwa ebibala bingi mu bitundu bingi era zigumira endwadde ez’awamu okusinga ensigo eziddiŋŋanwa. Gula ensigo ezaakakasibwa buli kyeya mu kifo ky’okuddamu okusimba empeke z’osobozezza — omuganyulo gukendeera nnyo oluvannyuma lw’omulembe ogusooka.',
    },
  },
  {
    id: 'faq-storage-pests',
    keywords: ['weevil', 'storage pest', 'grain store', 'obuwuka', 'okutereka'],
    question: {
      en: 'How do I protect stored maize from weevils?',
      lg: 'Nkuuma ntya kasooli akaterekeddwa okuva ku buwuka?',
    },
    answer: {
      en: 'Dry grain to 13% moisture before storing, use hermetic (airtight) bags like PICS bags where possible, and keep sacks off the floor on pallets. Inspect stored grain monthly for weevil holes or heating.',
      lg: 'Kalira empeke okutuuka ku 13% ey’amazzi nga tonannyika mu tterekero, kozesa nga kisoboka ensawo ezisibiddwa obulungi nga PICS, era oteeke ensawo waggulu ku mbaawo so si wansi ku ttaka. Kebera empeke buli mwezi olabe obama bw’obuwuka oba ebbugumu.',
    },
  },
  {
    id: 'faq-selling-price',
    keywords: ['sell', 'best price', 'when to sell', 'okutunda'],
    question: {
      en: 'When is the best time to sell my maize?',
      lg: 'Kiseera ki ekisinga obulungi okutunda kasooli kange?',
    },
    answer: {
      en: 'Prices are usually lowest right after harvest when supply is high, and rise a few months later. If you can store grain safely and don’t need immediate cash, holding a few weeks to months often gets a better price — check Market Prices for current trends in your district.',
      lg: 'Emiwendo gitera okuba emitono nnyo bwe buba nga bakungudde kati kubanga kasooli mungi, ne gyeyongera oluvannyuma lw’emyezi. Bw’osobola okuterekawo empeke obulungi era nga tolina bwetaavu bwa nsimbi mangu, okulinda wiiki oba emyezi kitera okukuwa omuwendo omulungi — kebera Emiwendo gy’Akatale okumanya kye kiri mu disitulikiti yo.',
    },
  },
  {
    id: 'faq-greeting',
    keywords: ['hello', 'hi', 'oli otya', 'gyebale', 'wasuze'],
    question: {
      en: 'Hello!',
      lg: 'Ki kati!',
    },
    answer: {
      en: "Hello! I'm your Farm Bhade AI assistant. Ask me anything about planting, fertilizer, pests, diseases, watering or harvesting maize — in English or Luganda.",
      lg: 'Ki kati! Nze mubeezi wo owa Farm Bhade AI. Mbuuza kyonna ekikwata ku kusimba, ebigimusa, ebiwuka, obulwadde, amazzi oba okukungula kasooli — mu Lungereza oba Oluganda.',
    },
  },
]

export const FALLBACK_RESPONSE: Record<'en' | 'lg', string> = {
  en: "I don't have a specific answer for that yet, but I'm learning. Try asking about planting time, spacing, fertilizer, pests, diseases, watering or harvesting — or use AI Crop Doctor to diagnose a photo.",
  lg: "Sirina kya kuddamu ku ekyo kati, naye njiga bulijjo. Gezaako okubuuza ku kiseera ky'okusimba, ebbanga, ebigimusa, ebiwuka, obulwadde, amazzi oba okukungula — oba kozesa AI Crop Doctor okwekenneenya ekifaananyi.",
}
