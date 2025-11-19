import fs from 'fs';
import path from 'path';

const dataDir = path.join(__dirname, 'data');

const readJsonArray = (filename: string): string[] => {
  const fullPath = path.join(dataDir, filename);
  return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
};

export const jobToBeDoneSeeds = [
  'Raise Capital',
  'Invest Capital',
  'Find Lead Investor',
  'Hire CTO',
  'Recruit Engineers'
];

export const skillSeeds = [
  'Python',
  'JavaScript / TypeScript',
  'Cloud Architecture',
  'DevOps',
  'Machine Learning',
  'Deep Learning',
  'Data Engineering',
  'AI Systems',
  'MLOps',
  'Security',
  'Blockchain',
  'Embedded Systems',
  'Mobile Development',
  'Product Management',
  'UX Research',
  'UI/UX Design',
  'Product Strategy',
  'Roadmapping',
  'Product Analytics',
  'Prototyping',
  'Sales',
  'B2B Sales',
  'Enterprise Sales',
  'CRM Management',
  'Customer Success',
  'Performance Marketing',
  'SEO',
  'Content Marketing',
  'Growth Strategy',
  'Brand Marketing',
  'Fundraising',
  'Investor Relations',
  'Leadership',
  'Hiring & Recruiting',
  'Team Building',
  'Operations Management',
  'Financial Modeling',
  'Legal & Compliance'
];

export const industrySeeds: string[] = readJsonArray('industries_v0_2.json');

export const verticalSeeds: string[] = readJsonArray('verticals_v0_2.json');

export const jobRoleSeeds = [
  'Founder',
  'Co-Founder',
  'CEO (Chief Executive Officer)',
  'President',
  'COO (Chief Operating Officer)',
  'CFO (Chief Financial Officer)',
  'CTO (Chief Technology Officer)',
  'CIO (Chief Information Officer)',
  'CPO (Chief Product Officer)',
  'CHRO / Chief People Officer',
  'Chief Revenue Officer (CRO)',
  'Chief Marketing Officer (CMO)',
  'Chief Growth Officer (CGO)',
  'Chief Strategy Officer (CSO)',
  'Chief Design Officer (CDO)',
  'Chief Legal Officer (CLO)',
  'Chief Compliance Officer (CCO)',
  'Software Engineer',
  'Backend Engineer',
  'Frontend Engineer',
  'Full-Stack Engineer',
  'Mobile Engineer',
  'Machine Learning Engineer',
  'AI Engineer',
  'Data Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Site Reliability Engineer (SRE)',
  'QA Engineer',
  'Security Engineer',
  'Firmware Engineer',
  'Hardware Engineer',
  'Research Scientist',
  'Applied Scientist',
  'Product Manager',
  'Technical Product Manager',
  'Product Owner',
  'Product Analyst',
  'UX Researcher',
  'UX Designer',
  'UI Designer',
  'Product Designer',
  'Growth Lead',
  'Growth Manager',
  'Performance Marketer',
  'Social Media Manager',
  'Content Strategist',
  'Brand Manager',
  'SEO Specialist',
  'Community Manager',
  'Partnerships Manager',
  'Account Executive (AE)',
  'Sales Manager',
  'Enterprise AE',
  'SDR (Sales Development Representative)',
  'BDR (Business Development Representative)',
  'Sales Engineer',
  'Partnerships Lead',
  'Customer Success Manager',
  'Operations Manager',
  'Business Operations (BizOps)',
  'Project Manager',
  'Program Manager',
  'Compliance Manager',
  'Legal Counsel',
  'Office Manager',
  'Financial Analyst',
  'Investment Analyst',
  'Controller',
  'Accountant'
];

export const productTypeSeeds = [
  'Software',
  'Hardware',
  'Non-tech',
  'Capital Management'
];

export const companyHeadcountRangeSeeds = ['<10', '10-50', '>50'];
export const engineeringHeadcountRangeSeeds = ['<30%', '30-60%', '>60%'];
export const targetDomainSeeds = ['B2B', 'B2C', 'Enterprise', 'Consumer Health', 'Developer Tools'];

export const distributionCapabilitySeeds = [
  { distribution_type: 'SocialMedia', label: 'Social Media', description: 'Audience reach via social platforms.' },
  { distribution_type: 'ContentPlatform', label: 'Content Platform', description: 'Owned media channels (newsletter, podcast, blog).' },
  { distribution_type: 'Community', label: 'Community', description: 'Owned communities with engaged members.' },
  { distribution_type: 'Institutional', label: 'Institutional', description: 'Enterprise or institutional distribution access.' },
  { distribution_type: 'ProductUserbase', label: 'Product Userbase', description: 'Existing product users/customers.' },
  { distribution_type: 'Partnerships', label: 'Partnerships', description: 'Strategic partner ecosystems.' },
  { distribution_type: 'Other', label: 'Other', description: 'Miscellaneous distribution advantages.' }
];

export const raisedCapitalRangeSeeds = [
  { label: '<500K USD', min: 0, max: 500000 },
  { label: '500K–2M USD', min: 500000, max: 2000000 },
  { label: '2–5M USD', min: 2000000, max: 5000000 },
  { label: '>5M USD', min: 5000000 }
];

export const targetCriterionSeeds = [
  { dimension: 'Industry', operator: 'in', value: ['fintech'], label: 'Industry in Fintech' },
  { dimension: 'Location', operator: 'in', value: ['USA', 'Canada'], label: 'Location in North America' },
  { dimension: 'RaisedCapital', operator: '>=', value: 500000, label: 'Raised >= $500K' },
  { dimension: 'Vertical', operator: 'in', value: ['Telemedicine'], label: 'Vertical in Telemedicine' },
  { dimension: 'TypeOfGoodProduced', operator: '=', value: 'Software', label: 'Produces Software' },
  { dimension: 'Headcount', operator: 'between', value: [10, 50], label: 'Headcount 10-50' },
  { dimension: 'EngineersHeadcount', operator: '>=', value: 10, label: 'Engineering Headcount >=10' },
  { dimension: 'FoundationYear', operator: '=', value: 2024, label: 'Founded in 2024' },
  { dimension: 'Skill', operator: 'in', value: ['Machine Learning'], label: 'Has ML skill' },
  { dimension: 'JobRole', operator: 'in', value: ['Product Manager'], label: 'Targets Product Manager' },
  { dimension: 'DistributionCapability', operator: 'in', value: ['Social Media'], label: 'Needs Social Media distribution' },
  { dimension: 'MRR', operator: '>=', value: 200000, label: 'MRR >= $200K' }
];
