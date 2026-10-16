// Edit this file to update the site's content.
export const PROFILE = {
  name: 'Akib Shaikh',
  email: 'akibshaikh2005@gmail.com',
  github: 'https://github.com/AKIB2005',
  linkedin: 'https://www.linkedin.com/in/akibshaikh2005',
  x: 'https://x.com/akibshaikh2005',
  instagram: 'https://www.instagram.com/akibshaikh2005',
}

export const FACTS = [
  ['College', 'N.K. Orchid College of Engineering & Technology'],
  ['Course', 'B.E. Computer Science Engineering, first year'],
  ['University', 'DBATU'],
  ['Based in', 'Solapur, Maharashtra'],
  ['Open source', 'GSSoC 2026'],
]

export const PROJECTS = [
  {
    title: 'CommunityBridge',
    status: 'Google Solution Challenge 2026',
    text: 'Matches NGOs with volunteers who fit what they need, so help reaches the right place faster. I lead the team building it.',
    big: true,
  },
  {
    title: 'Email spam detector',
    status: 'In progress',
    text: 'A machine-learning model that tells spam from real email.',
  },
  {
    title: 'DevDNA',
    status: 'College mini-project',
    text: 'Built with classmates and supervised by Prof. S.D. Dudhanikar.',
  },
]

// Positions are 0–1 inside the constellation area. dash = still learning.
export const NODES = [
  { id: 'MongoDB', x: 0.06, y: 0.78 },
  { id: 'Express', x: 0.3, y: 0.58 },
  { id: 'Node.js', x: 0.55, y: 0.7 },
  { id: 'React', x: 0.7, y: 0.34 },
  { id: 'JavaScript', x: 0.42, y: 0.2 },
  { id: 'DSA', x: 0.14, y: 0.12 },
  { id: 'Git', x: 0.92, y: 0.62 },
  { id: 'Agentic AI', x: 0.96, y: 0.9 },
]
export const EDGES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 1], [2, 6],
  [2, 7, true],
]
