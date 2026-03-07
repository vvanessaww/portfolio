// Project data for portfolio showcase
export const projects = {
  gitArt: {
    id: 'git-art',
    title: 'Git Art',
    description: 'your contribution graph, reimagined. enter your github username and turn your commit history into art. choose from 7 retro-inspired styles — including tetris, pacman, and custom text — then download as a png to share.',
    techStack: ['React', 'Vite', 'Canvas API', 'GitHub API'],
    liveUrl: 'https://vanessazwang.com/git',
    githubUrl: 'https://github.com/vvanessaww/git-art',
    previewUrl: 'https://vanessazwang.com/git',
    deskObject: 'tablet'
  },
  
  books: {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'my personal digital book library. browse my favorite niche genres and track progress toward my annual (audacious) reading goal. pulls ISBNs and categories from my latest goodreads export, fetches covers via the google books api, and displays everything in a clean, responsive grid.',
    techStack: ['React', 'Vite', 'Google Books API', 'CSS Grid'],
    liveUrl: 'https://vanessazwang.com/books',
    githubUrl: 'https://github.com/vvanessaww/bookworm',
    previewUrl: 'https://vanessazwang.com/books',
    deskObject: 'bookshelf'
  },

  stravaPostcard: {
    id: 'strava-postcard',
    title: 'Strava Postcard',
    description: 'where my love for running meets building. turn your strava activities into beautiful, vintage-style commemorative postcards. features activity-specific imagery, route visualization from GPS data, and a stats display for sharing your achievements.',
    techStack: ['React', 'TypeScript', 'Vite', 'Express', 'Strava API', 'Canvas'],
    liveUrl: 'https://strava-postcard.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/strava-postcard',
    deskObject: 'postcard',
    comingSoon: true // Hide deployment/GitHub until ready
  },

  writing: {
    id: 'writing',
    title: 'Writing',
    description: 'my musings on life in new york and the digital world.',
    techStack: ['Substack'],
    liveUrl: 'https://vanessawang.substack.com',
    githubUrl: null,
    previewUrl: '/previews/substack-preview.jpg',
    previewType: 'image', // Use image instead of iframe
    deskObject: 'notebook'
  }
}

// Helper to get project by desk object name
export const getProjectByObject = (objectName) => {
  return Object.values(projects).find(p => p.deskObject === objectName)
}

// Helper to get project by id
export const getProjectById = (id) => {
  return Object.values(projects).find(p => p.id === id)
}
