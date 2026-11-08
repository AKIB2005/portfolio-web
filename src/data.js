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
  ['Stack', 'MERN, DSA'],
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

export const STACK_ROW_1 = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Framer Motion', 'Java', 'Python', 'C', 'C++']
export const STACK_ROW_2 = ['Node.js', 'Express', 'Flask', 'MongoDB', 'Firebase', 'Flutter', 'Gemini API', 'D3.js', 'GitHub REST API', 'Git', 'GitHub', 'Vercel']

export const STACK = [
  ['Frontend', ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Framer Motion']],
  ['Backend', ['Node.js', 'Express', 'Flask']],
  ['Database', ['MongoDB', 'Firebase']],
  ['Languages', ['Java', 'Python', 'C', 'C++']],
  ['Mobile and AI', ['Flutter', 'Gemini API']],
  ['Tools', ['D3.js', 'GitHub REST API', 'Git', 'GitHub', 'Vercel']],
]
