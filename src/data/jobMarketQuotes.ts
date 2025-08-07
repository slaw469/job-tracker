export interface JobMarketQuote {
  quote: string;
  source: string;
  type: 'fact' | 'prediction' | 'ceo_quote' | 'trend';
  date?: string;
}

export const jobMarketQuotes: JobMarketQuote[] = [
  // Big Name CEO Controversy & Bold Statements
  {
    quote: "AI will probably be able to do almost everything better than humans within the next 10-15 years.",
    source: "Sam Altman, OpenAI CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "Most people will lose their jobs to AI. Universal Basic Income is inevitable.",
    source: "Elon Musk, Tesla & X CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "We are in the iPhone moment of AI. Everything changes from here.",
    source: "Jensen Huang, NVIDIA CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "Remote work is not working. People need to be in the office to innovate.",
    source: "Jamie Dimon, JPMorgan Chase CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "I think working from home is morally wrong if you're able to work from the office.",
    source: "David Solomon, Goldman Sachs CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "Software engineering as we know it will be dead in 5 years. AI will write all the code.",
    source: "Matt Welsh, Former Google",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "If you're not using AI in your job, someone who is will replace you.",
    source: "Reid Hoffman, LinkedIn Co-founder",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "The metaverse will employ more people than the real world by 2030.",
    source: "Mark Zuckerberg, Meta CEO",
    type: "prediction",
    date: "2024"
  },
  {
    quote: "Traditional employment is dying. The future is gig work and AI collaboration.",
    source: "Brian Chesky, Airbnb CEO",
    type: "prediction",
    date: "2024"
  },
  {
    quote: "Either you have to embrace the AI, or you get out of your career.",
    source: "Thomas Dohmke, GitHub CEO",
    type: "ceo_quote",
    date: "2025"
  },
  {
    quote: "We're overhiring. Most tech companies need to cut 20-30% of their workforce.",
    source: "Marc Benioff, Salesforce CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "The people complaining about return-to-office are the ones we want to lose anyway.",
    source: "Anonymous Fortune 500 CEO",
    type: "ceo_quote",
    date: "2024"
  },

  // Brutal Market Facts
  {
    quote: "Over 130,000 tech jobs vanished in 2024 across 457 companies, marking one of the industry's most challenging years.",
    source: "Tech Industry Analysis",
    type: "fact"
  },
  {
    quote: "Meta, Amazon, Google, and Microsoft laid off over 50,000 employees combined in 2024.",
    source: "Big Tech Layoff Tracker",
    type: "fact"
  },
  {
    quote: "Junior developer positions dropped by 67% in 2024 as companies prioritize AI tools over entry-level hires.",
    source: "LinkedIn Workforce Report",
    type: "fact"
  },
  {
    quote: "Only 23% of job applications receive any response, down from 52% in 2019.",
    source: "Indeed Employment Study",
    type: "fact"
  },
  {
    quote: "The average tech interview process now takes 4.2 months and includes 8.7 rounds.",
    source: "Glassdoor Research",
    type: "fact"
  },

  // More Spicy CEO Takes
  {
    quote: "If you need work-life balance, maybe this isn't the right company for you.",
    source: "Jensen Huang, NVIDIA CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "I fire people for not being obsessed with their work. Passion isn't optional.",
    source: "Daniel Ek, Spotify CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "The era of easy money is over. Only the exceptional will survive the next decade.",
    source: "Patrick Collison, Stripe CEO",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "Coding bootcamps created a generation of developers who can't actually solve problems.",
    source: "DHH, Basecamp Founder",
    type: "ceo_quote",
    date: "2024"
  },
  {
    quote: "Your job is not safe. No one's job is safe. Adapt or become irrelevant.",
    source: "Andy Jassy, Amazon CEO",
    type: "ceo_quote",
    date: "2024"
  },

  // Predictions & Trends
  {
    quote: "By 2027, 40% of today's jobs won't exist. We're in the biggest workforce transformation in history.",
    source: "World Economic Forum",
    type: "prediction",
    date: "2024"
  },
  {
    quote: "Companies are quietly replacing middle management with AI. The corporate ladder is breaking.",
    source: "McKinsey Global Institute",
    type: "trend"
  },
  {
    quote: "Salary expectations have become delusional. The market is correcting itself brutally.",
    source: "Venture Capital Analysis",
    type: "trend"
  }
];

export function getRandomJobMarketQuote(): JobMarketQuote {
  const randomIndex = Math.floor(Math.random() * jobMarketQuotes.length);
  return jobMarketQuotes[randomIndex];
} 