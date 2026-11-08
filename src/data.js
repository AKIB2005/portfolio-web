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
  ['Course', 'Computer Science Engineering, T.Y.'],
  ['Based in', 'Solapur, Maharashtra'],
  ['Stack', 'MERN, DSA'],
  ['Open source', 'GSSoC 2026'],
  ['Focus', 'Agentic AI'],
  ['More info', 'github.com/AKIB2005', PROFILE.github],
]

export const FEATURED = [
  {
    title: 'Grantly',
    status: 'Frontend hackathon',
    text: 'Finds scholarships you actually qualify for, explains why each one is a match, and keeps every deadline in one place. Built solo in six hours for THE OUTPOST by Frontend Arena.',
    points: ['Personalised scholarship matching', 'Clear eligibility for every match', 'Simple deadline tracker'],
    live: 'https://frontend-arena-one.vercel.app/profile',
    source: 'https://github.com/AKIB2005/frontend-arena',
    kind: 'grants',
  },
  {
    title: 'HAMMER',
    status: 'AI / ML project',
    text: 'An email spam detector. Paste an email and HAMMER scores it with a machine-learning model, then shows which words pushed the result toward spam or toward legitimate.',
    points: ['Runs entirely in your browser, nothing is sent anywhere', 'Shows the words behind each score', 'Trained in Python (scikit-learn), scored in JavaScript with TF-IDF'],
    live: 'https://email-spam-detector-tp2v.vercel.app/',
    source: 'https://github.com/AKIB2005/email-spam-detector',
    kind: 'spam',
  },
]

export const MORE = [
  { title: 'CommunityBridge', tag: 'Google Solution Challenge 2026', stack: 'Flutter, Firebase, Gemini API', text: 'NGO volunteer matching with Gemini-based urgency scoring, NGO dashboards and Firebase matching. I lead the team and handle the full-stack work.' },
  { title: 'DevDNA', tag: 'College mini-project', stack: 'Flask, D3.js, GitHub REST API', text: 'A GitHub profile analyzer with caching, language analysis, archetype detection, a compare mode and export.' },
]

export const OSS = [
  ['VISUALAIZE', 'Export as PNG with html-to-image, plus architecture diagram docs'],
  ['fetchai / innovation-lab-examples', 'A real-time weather monitoring agent'],
  ['AlgoScope', '404 page redesign with React and Framer Motion'],
  ['career-pilot', 'Holographic ResumeCTA component'],
  ['CreatorOs', 'Dashboard modularization'],
  ['LuvLyricsApp', 'Magic number refactor'],
]

export const HACKS = [
  ['Oct 2026', 'Hacktoberfest Hack Day Pune', 'Cloud Native Pune with MLH. Built a project with teammates among 400+ builders and presented it to the evaluators.'],
  ['Nov 2026', 'THE OUTPOST, Frontend Arena', 'Six-hour online solo frontend hackathon. Built Grantly.'],
  ['Nov 2026', 'CodersInPune Hackathon', 'Team PROTEAS on a knowledge-handover platform. I build the backend and the extraction-to-verification pipeline.'],
]

export const STACK = [
  ['Languages', ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Java', 'Python', 'C', 'C++']],
  ['Frameworks', ['React', 'Node.js', 'Express', 'Flask', 'Flutter']],
  ['Data and tools', ['MongoDB', 'Firebase', 'D3.js', 'Gemini API', 'Git and GitHub']],
]
