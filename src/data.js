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
  ['Open source', 'GSSoC 2026'],
  ['More info', 'github.com/AKIB2005', PROFILE.github],
]

export const PROJECTS = [
  {
    title: 'Grantly',
    status: 'Frontend hackathon project',
    text: 'Finds scholarships you actually qualify for, explains why each one is a match, and tracks every deadline in one place.',
    stack: 'Built for THE OUTPOST, a six-hour frontend hackathon by Frontend Arena.',
    live: 'https://frontend-arena-one.vercel.app/profile',
    source: 'https://github.com/AKIB2005/frontend-arena',
    kind: 'grants',
  },
  {
    title: 'HAMMER: email spam detector',
    status: 'Live project',
    text: 'Paste an email and HAMMER scores it with a machine-learning model, then shows which words pushed the result toward spam or toward legitimate. It runs entirely in your browser, so nothing you paste is sent anywhere.',
    stack: 'Trained with Python (scikit-learn) and scored in JavaScript using TF-IDF features.',
    live: 'https://email-spam-detector-tp2v.vercel.app/',
    source: 'https://github.com/AKIB2005/email-spam-detector',
    kind: 'spam',
  },
]
