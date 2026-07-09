// Grounding facts for the Claude-powered Help assistant — describes how to
// use Farm Bhade itself, not farming advice.
export const APP_HELP_KNOWLEDGE = `
WHAT FARM BHADE IS
- An AI-powered marketplace and farm-management app for Ugandan maize farmers, buyers and processors.
- Four account roles: Farmer, Buyer, Processor, and Administrator (admins are never self-registered — an existing supreme admin promotes them).

KEY FEATURES AND WHERE TO FIND THEM
- Dashboard: each role's home screen — shows quick actions, weather, market prices and recent activity.
- Marketplace: browse and filter maize listings by category, district and price. Buyers/processors can make offers or place orders directly from a listing.
- My Listings (farmers/processors): create, edit and delete your own product listings, including variety, grade, moisture % and harvest date.
- Buyer Requests: buyers/processors post what they need; farmers can browse open requests and message the buyer directly.
- AI Crop Doctor: farmers can photograph a maize leaf, cob or stalk to get an instant diagnosis with causes, treatment steps and prevention tips. The "Ask AI" tab there answers general maize-farming questions in English or Luganda.
- Market Prices: live-ish district maize prices, filterable by district, with a 7-day trend chart.
- Weather: forecasts for every maize-growing district, with the farmer's own registered district highlighted first.
- Messages: direct chat with any buyer/farmer/processor, plus a Farmer Community directory. Supports swipe-to-reply, photo/file attachments (up to 20MB), and a call button that dials the other person's phone number.
- Journey stages (farmers): Planning → Growing → Harvesting → Storage → Selling → Processing — the Farmer Dashboard's "Farm progress" card lets a farmer advance their own stage as the season progresses.
- Farm Health Score (farmers): a composite score on the dashboard based on recent AI Crop Doctor results, daily task follow-through, and season progress.
- Reports & Analytics: personal (or, for admins, platform-wide) sales, spend and activity summaries.
- Settings: change theme/language, manage notification preferences, and send feedback (creates a support ticket admins can see).
- Profile: view/edit your account info, district and role, and log out.
- Subscription: optional premium tier with extra features.

COMMON HOW-DO-I QUESTIONS
- "How do I sell my maize?" → Go to My Listings, tap "New listing", fill in title, category, price, quantity and district (variety/grade/moisture/harvest date are optional but build buyer trust), then Publish.
- "How do I contact a buyer/seller?" → Open their listing or request and use the "Contact seller" / "Message buyer" section, or find them in Messages → Community.
- "How do I check today's price?" → Market Prices page, filter by your district.
- "How do I know if my maize is diseased?" → AI Crop Doctor → Diagnose tab → take or upload a photo.
- "How do I change my district or password?" → Profile page for basic info; Settings → Change password.
- "I can't find the logout button" → Profile page has a Log out button, reachable from every role's mobile bottom navigation.

WHEN YOU CAN'T HELP
- If the question is about a specific order, payment, account issue, or anything you're not confident about, tell the user to tap "Contact support" below this chat to reach the Farm Bhade admin team directly — don't guess about account-specific details you don't have access to.
`.trim()
