import type { ProductCategory } from '@/types/product'

import greenMaize from '@/assets/images/product-green-maize.jpg'
import greenMaizeSm from '@/assets/images/product-green-maize-sm.jpg'
import wetMaize from '@/assets/images/product-wet-maize.jpg'
import wetMaizeSm from '@/assets/images/product-wet-maize-sm.jpg'
import dryGrain from '@/assets/images/product-dry-grain.jpg'
import dryGrainSm from '@/assets/images/product-dry-grain-sm.jpg'
import dryCobs from '@/assets/images/product-dry-cobs.jpg'
import dryCobsSm from '@/assets/images/product-dry-cobs-sm.jpg'
import roastedMaize from '@/assets/images/product-roasted-maize.jpg'
import roastedMaizeSm from '@/assets/images/product-roasted-maize-sm.jpg'
import maizeFlour from '@/assets/images/product-maize-flour.jpg'
import maizeFlourSm from '@/assets/images/product-maize-flour-sm.jpg'
import seedMaize from '@/assets/images/product-seed-maize.jpg'
import seedMaizeSm from '@/assets/images/product-seed-maize-sm.jpg'

export const CATEGORY_IMAGES: Record<ProductCategory, { full: string; sm: string }> = {
  'green-maize': { full: greenMaize, sm: greenMaizeSm },
  'wet-maize': { full: wetMaize, sm: wetMaizeSm },
  'dry-grain': { full: dryGrain, sm: dryGrainSm },
  'dry-cobs': { full: dryCobs, sm: dryCobsSm },
  'roasted-maize': { full: roastedMaize, sm: roastedMaizeSm },
  'maize-flour': { full: maizeFlour, sm: maizeFlourSm },
  'seed-maize': { full: seedMaize, sm: seedMaizeSm },
}
