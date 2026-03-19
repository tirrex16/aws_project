// Central project data store with TypeScript types

export interface ProjectSection {
  label: string
  num: string
  headline: string
  body: string
  images: string[]
}

export interface Project {
  id: string
  name: string
  tagline: string
  type: string
  client: string
  duration: string
  year: string
  img: string
  heroImg: string
  sections: ProjectSection[]
  relatedIds: string[]
}

export const projects: Project[] = [
  {
    id: 'lune',
    name: 'Lune',
    tagline: 'A mental wellness app with a calming visual identity.',
    type: 'App Visual Direction',
    client: 'Lune',
    duration: '2 months',
    year: '2025',
    img: '/images/work-1.png',
    heroImg: '/images/work-1.png',
    sections: [
      {
        label: 'Challenge',
        num: '01',
        headline: 'Lune was building a mental wellness app but lacked a clear visual direction.',
        body: "The early interface felt clinical and didn't evoke the calming experience they were aiming to create. Users found onboarding confusing and the colour palette uninviting.",
        images: ['/images/project-1.png'],
      },
      {
        label: 'Solution',
        num: '02',
        headline: 'We developed a soft, serene visual system with a warm palette, rounded iconography, and a clean layout framework.',
        body: 'Subtle motion and sound cues were introduced to enhance emotional connection without distraction. Every screen was rebuilt around clarity and calm.',
        images: ['/images/project-2.png', '/images/project-3.png'],
      },
      {
        label: 'Conclusion',
        num: '03',
        headline: "Lune's reimagined interface improved onboarding and daily use engagement.",
        body: 'Users described the app as "inviting" and "centering," and retention rose steadily after the visual update. The project won two regional design awards.',
        images: ['/images/project-4.png'],
      },
    ],
    relatedIds: ['aren', 'oura'],
  },
  {
    id: 'aren',
    name: 'Aren',
    tagline: 'Launching a new fashion brand with purpose and edge.',
    type: 'Fashion Brand Launch',
    client: 'Aren Studio',
    duration: '3 months',
    year: '2025',
    img: '/images/work-2.png',
    heroImg: '/images/work-2.png',
    sections: [
      {
        label: 'Challenge',
        num: '01',
        headline: 'Aren needed a bold brand presence from scratch to enter a crowded market.',
        body: "With no existing visual identity, the brand had to feel both premium and approachable—a difficult balance in the fashion world.",
        images: ['/images/project-1.png'],
      },
      {
        label: 'Solution',
        num: '02',
        headline: 'We created a monochromatic brand system grounded in architecture and texture.',
        body: 'The logo, type stack, colour palette, and photography direction were all designed together for maximum cohesion. Editorial imagery reinforced the identity.',
        images: ['/images/project-2.png', '/images/project-3.png'],
      },
      {
        label: 'Conclusion',
        num: '03',
        headline: 'Aren launched to critical acclaim and sold out its first collection.',
        body: 'Within 60 days of launch, the brand had earned press features and a growing community of loyal customers who resonated with the vision.',
        images: ['/images/project-4.png'],
      },
    ],
    relatedIds: ['lune', 'oura'],
  },
  {
    id: 'oura',
    name: 'Oura',
    tagline: 'A premium brand refinement for a beloved wellness company.',
    type: 'Brand Refinement',
    client: 'Oura Ring',
    duration: '6 weeks',
    year: '2024',
    img: '/images/work-3.png',
    heroImg: '/images/work-3.png',
    sections: [
      {
        label: 'Challenge',
        num: '01',
        headline: "Oura had grown rapidly but their visual brand hadn't kept pace.",
        body: "Inconsistencies across touchpoints were diluting the premium positioning they'd worked hard to establish in a competitive wearable market.",
        images: ['/images/project-1.png'],
      },
      {
        label: 'Solution',
        num: '02',
        headline: 'We audited every touchpoint and built a rigorous, scalable design system.',
        body: 'Typography was refined, the colour palette tightened, and a comprehensive component library was delivered so the in-house team could move fast without breaking consistency.',
        images: ['/images/project-2.png', '/images/project-4.png'],
      },
      {
        label: 'Conclusion',
        num: '03',
        headline: "The refreshed identity unified Oura's global presence and boosted brand trust.",
        body: 'Internal teams reported dramatically faster design cycles and external surveys showed a measurable uptick in perceived brand premium-ness.',
        images: ['/images/project-3.png'],
      },
    ],
    relatedIds: ['forma', 'lune'],
  },
  {
    id: 'forma',
    name: 'Forma',
    tagline: 'Designing a next-generation product UI for the modern workspace.',
    type: 'Product UI',
    client: 'Forma Inc.',
    duration: '4 months',
    year: '2024',
    img: '/images/work-4.png',
    heroImg: '/images/work-4.png',
    sections: [
      {
        label: 'Challenge',
        num: '01',
        headline: "Forma's power features were buried under layers of interface complexity.",
        body: "Users churned early because they couldn't discover the value fast enough. The product needed a complete UX restructure without losing existing users.",
        images: ['/images/project-1.png'],
      },
      {
        label: 'Solution',
        num: '02',
        headline: 'We redesigned Forma around progressive disclosure and task-based flows.',
        body: 'A new navigation architecture and refined component system reduced cognitive load dramatically while making advanced features feel accessible and intuitive.',
        images: ['/images/project-3.png', '/images/project-2.png'],
      },
      {
        label: 'Conclusion',
        num: '03',
        headline: 'User activation rates climbed 38% and churn dropped within the first quarter.',
        body: "The redesign became the foundation for Forma's Series B pitch, with investors citing product quality as a key differentiator.",
        images: ['/images/project-4.png'],
      },
    ],
    relatedIds: ['aren', 'oura'],
  },
]

export const getProject = (id: string): Project | undefined =>
  projects.find((p) => p.id === id)

export const getRelated = (ids: string[]): Project[] =>
  projects.filter((p) => ids.includes(p.id))
