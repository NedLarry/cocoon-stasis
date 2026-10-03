export type Team = 'Research' | 'Engineering' | 'Trading' | 'Operations';

export interface Role {
  id: string;
  title: string;
  team: Team;
  location: string;
  type: 'Full-time' | 'Internship';
  summary: string;
  responsibilities: string[];
  requirements: string[];
}

// Placeholder openings — replace with the firm's live roles (or wire to an ATS feed).
export const ROLES: Role[] = [
  {
    id: 'quant-researcher',
    title: 'Quantitative Researcher',
    team: 'Research',
    location: 'Lagos',
    type: 'Full-time',
    summary: 'Generate, test and deploy predictive signals across Nigerian equities, fixed income and FX.',
    responsibilities: [
      'Form hypotheses about market behaviour and test them rigorously against large datasets',
      'Build and validate alpha models end to end, from raw data to live trading',
      'Collaborate with engineers to take research into production',
    ],
    requirements: [
      'PhD or equivalent experience in a quantitative field — mathematics, statistics, physics, CS',
      'Strong command of probability, statistics and machine learning',
      'Fluency in Python; C++ is a plus',
    ],
  },
  {
    id: 'quant-researcher-intern',
    title: 'Quantitative Research Intern',
    team: 'Research',
    location: 'Lagos',
    type: 'Internship',
    summary: 'Ten weeks working on a real research problem alongside a senior researcher.',
    responsibilities: [
      'Own a self-contained research project with a live-data deliverable',
      'Present findings to the research group at the end of the programme',
    ],
    requirements: ['Penultimate or final year of a quantitative degree or PhD', 'Comfort with Python and data analysis'],
  },
  {
    id: 'low-latency-engineer',
    title: 'Low-Latency C++ Engineer',
    team: 'Engineering',
    location: 'Lagos',
    type: 'Full-time',
    summary: 'Design and optimise the trading engine where every microsecond is measured.',
    responsibilities: [
      'Build market-data handlers, order gateways and the core event loop',
      'Profile and optimise hot paths down to cache lines and branch predictors',
      'Own reliability and determinism of production trading systems',
    ],
    requirements: [
      'Expert modern C++ (20/23) and deep knowledge of Linux internals',
      'Experience with kernel bypass networking, lock-free data structures or FPGAs',
      'A habit of measuring before optimising',
    ],
  },
  {
    id: 'research-platform-engineer',
    title: 'Research Platform Engineer',
    team: 'Engineering',
    location: 'Lagos / Remote',
    type: 'Full-time',
    summary: 'Build the data lake, compute grid and tooling that power every research idea.',
    responsibilities: [
      'Design point-in-time data pipelines for tick-level and alternative datasets',
      'Scale distributed backtesting and simulation infrastructure',
      'Make researchers faster with great internal tools',
    ],
    requirements: [
      'Strong Python and one systems language (Rust, C++ or Go)',
      'Experience with distributed computing and columnar storage',
    ],
  },
  {
    id: 'quant-trader',
    title: 'Quantitative Trader',
    team: 'Trading',
    location: 'Lagos',
    type: 'Full-time',
    summary: 'Run and improve systematic strategies in real time, starting with Nigerian markets.',
    responsibilities: [
      'Monitor live strategies, manage risk and respond to market events',
      'Analyse execution quality and feed improvements back into research',
      'Develop intuition for microstructure and translate it into models',
    ],
    requirements: [
      'Exceptional quantitative reasoning and quick, calm decision making',
      'Programming experience in Python or similar',
      'Interest in markets; no prior finance experience required',
    ],
  },
  {
    id: 'risk-analyst',
    title: 'Risk & Operations Analyst',
    team: 'Operations',
    location: 'Lagos',
    type: 'Full-time',
    summary: 'Safeguard the firm with independent risk oversight and robust post-trade processes.',
    responsibilities: [
      'Monitor exposures, limits and P&L attribution across all books',
      'Build automated reconciliations and controls',
    ],
    requirements: ['Degree in a quantitative discipline', 'Strong SQL and Python', 'Meticulous attention to detail'],
  },
];

export const TEAMS: Team[] = ['Research', 'Engineering', 'Trading', 'Operations'];
