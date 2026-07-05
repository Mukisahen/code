export interface CommunityFarmer {
  id: string
  name: string
  initials: string
  district: string
  focus: string
  online: boolean
}

export const MOCK_COMMUNITY_FARMERS: CommunityFarmer[] = [
  { id: 'cf-1', name: 'Nakabugo Esther', initials: 'NE', district: 'Masindi', focus: 'Hybrid maize, storage', online: true },
  { id: 'cf-2', name: 'Ssekandi Robert', initials: 'SR', district: 'Kapchorwa', focus: 'Seed maize, organic', online: true },
  { id: 'cf-3', name: 'Auma Christine', initials: 'AC', district: 'Lira', focus: 'Green maize, poultry', online: false },
  { id: 'cf-4', name: 'Byabasaija Emmanuel', initials: 'BE', district: 'Kamwenge', focus: 'Dry grain, irrigation', online: true },
  { id: 'cf-5', name: 'Nabatanzi Joan', initials: 'NJ', district: 'Luwero', focus: 'Maize flour milling', online: false },
  { id: 'cf-6', name: 'Wasswa Ronald', initials: 'WR', district: 'Iganga', focus: 'Dry grain, cooperatives', online: true },
  { id: 'cf-7', name: 'Nalubega Sarah', initials: 'NS', district: 'Mukono', focus: 'Wet maize, quick drying', online: true },
]
