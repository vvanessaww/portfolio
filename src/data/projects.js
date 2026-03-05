// Project data for portfolio showcase
export const projects = {
  gitArt: {
    id: 'git-art',
    title: 'Git Art',
    description: 'Transform your GitHub contribution graph into terminal-style art! Choose from 7 different art styles including Rainbow, Tetris, Pac-Man, and custom text. Features a Matrix-inspired dark theme and downloads as PNG for your GitHub profile.',
    techStack: ['React', 'Vite', 'Canvas API', 'GitHub API'],
    liveUrl: 'https://vanessazwang.com/git',
    githubUrl: 'https://github.com/vvanessaww/git-art',
    previewUrl: 'https://vanessazwang.com/git',
    deskObject: 'tablet'
  },
  
  books: {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'My personal digital book library. Pulls ISBNs and categories from my latest Goodreads export, fetches book covers from Google Books API, and displays them in a clean responsive grid organized by genre.',
    techStack: ['React', 'Vite', 'Google Books API', 'CSS Grid'],
    liveUrl: 'https://vanessasbooks.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/bookworm',
    previewUrl: 'https://vanessasbooks.vercel.app/',
    deskObject: 'bookshelf'
  },

  stravaPostcard: {
    id: 'strava-postcard',
    title: 'Strava Postcard',
    description: 'Turn your Strava activities into beautiful, vintage-style commemorative postcards. Features activity-specific imagery, route visualization from GPS data, and stats display. Perfect for printing or sharing your fitness achievements.',
    techStack: ['React', 'TypeScript', 'Vite', 'Express', 'Strava API', 'Canvas'],
    liveUrl: 'https://strava-postcard.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/strava-postcard',
    deskObject: 'postcard',
    comingSoon: true // Hide deployment/GitHub until ready
  },

  writing: {
    id: 'writing',
    title: 'Writing',
    description: 'Essays, thoughts, and stories about product management, technology, and building things.',
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
