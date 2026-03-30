// ─── Types & defaults for editable site sections ─────────

// ── Capabilities (Why Us) ────────────────────────────────
export interface CapabilitiesContent {
  headline: string
  headlineHighlight: string
  darkCard: { title: string; bullets: string[] }
  rating: { score: string; clientCount: string }
  testimonial: { quote: string; name: string; role: string }
  features: { icon: string; title: string; desc: string }[]
}

export const defaultCapabilities: CapabilitiesContent = {
  headline: 'We cut through noise to create designs that are',
  headlineHighlight: 'thoughtful, timeless, and impactful.',
  darkCard: {
    title: 'Purposeful Design\nfor Modern Brands.',
    bullets: ['Collaborative Approach', 'Quick turnaround', 'Clear Communication', 'Consistent Quality', 'Reliable Support'],
  },
  rating: { score: '4.9/5', clientCount: '100+' },
  testimonial: {
    quote: '"Tirrex understood our brand better than we did. Their ability to find the essential and express it simply is what sets them apart."',
    name: 'Sofia Ford',
    role: 'Founder',
  },
  features: [
    { icon: '⚡', title: 'Streamlined Process', desc: 'Our focused, step-by-step approach saves time and keeps projects moving smoothly.' },
    { icon: '↗', title: 'Scalable Design', desc: 'We create systems that grow with your brand and stay effective over time.' },
    { icon: '◎', title: '24/7 Dedicated Support', desc: "We're always here when you need us, ready to answer questions and provide updates." },
  ],
}

// ── Services ─────────────────────────────────────────────
export interface ServiceItem {
  name: string
  num: string
  desc: string
  tags: string[]
}

export interface ServicesContent {
  items: ServiceItem[]
}

export const defaultServices: ServicesContent = {
  items: [
    { name: 'Brand Identity', num: '1', desc: 'We craft cohesive brand systems that communicate who you are with clarity and intention, from the core idea to every visual expression.', tags: ['Logo Design', 'Visual Identity Systems', 'Brand Guidelines', 'Typography & Color Systems', 'Naming & Tone of Voice', 'Brand Strategy'] },
    { name: 'Digital Design', num: '2', desc: 'Creating stunning digital experiences that blend aesthetics with functionality, from responsive websites to interactive applications.', tags: ['Web Design', 'UI/UX Design', 'Responsive Design', 'Prototyping', 'Design Systems', 'Interaction Design'] },
    { name: 'Art Direction', num: '3', desc: 'Guiding the visual narrative of your brand through thoughtful creative direction that ensures consistency across all touchpoints.', tags: ['Creative Direction', 'Visual Strategy', 'Photography Direction', 'Campaign Design', 'Editorial Design'] },
    { name: 'Strategy & Consulting', num: '4', desc: 'Strategic consulting to help you define your brand positioning, understand your audience, and craft meaningful brand experiences.', tags: ['Brand Positioning', 'Market Research', 'Audience Analysis', 'Content Strategy', 'Growth Strategy'] },
  ],
}

// ── Pricing ──────────────────────────────────────────────
export interface PricingPlan {
  type: string
  price: string
  period: string
  desc: string
  addon: string
  delivery: string
}

export interface PricingContent {
  monthly: PricingPlan
  project: PricingPlan
  features: string[]
}

export const defaultPricing: PricingContent = {
  monthly: { type: 'Subscription', price: '$2500', period: '/month', desc: 'For ongoing support and flexible design needs. Ideal for startups, growing brands, and marketing teams needing consistent creative support.', addon: '($800/m) SEO optimization Add-on.', delivery: '48 hours' },
  project: { type: 'Project Based', price: '$5000', period: '/project', desc: 'For focused, one-time design projects. Perfect for brands that need a complete design solution delivered as a cohesive package.', addon: '($1200) SEO optimization Add-on.', delivery: '2-4 weeks' },
  features: [
    'Unlimited design requests', 'One active task at a time', 'Weekly progress calls',
    'Fast turnaround times', 'Brand consistency across all deliverables', 'Priority support', 'Pause or cancel anytime',
  ],
}

// ── Journal (Blog) ───────────────────────────────────────
export interface JournalPost {
  title: string
  tag: string
  date: string
}

export interface JournalContent {
  posts: JournalPost[]
}

export const defaultJournal: JournalContent = {
  posts: [
    { title: 'The Art of Minimal Design in a Maximalist World', tag: 'Design',   date: 'Mar 10, 2026' },
    { title: 'Building Brands That Stand the Test of Time',     tag: 'Branding', date: 'Feb 24, 2026' },
    { title: 'Why User Experience Is the New Luxury',           tag: 'UX',       date: 'Feb 12, 2026' },
  ],
}

// ── Combined type for context ────────────────────────────
export interface SiteContent {
  capabilities: CapabilitiesContent
  services: ServicesContent
  pricing: PricingContent
  journal: JournalContent
}

export const defaultSiteContent: SiteContent = {
  capabilities: defaultCapabilities,
  services: defaultServices,
  pricing: defaultPricing,
  journal: defaultJournal,
}
