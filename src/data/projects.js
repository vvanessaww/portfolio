// Project data for portfolio showcase
export const projects = {
  gitArt: {
    id: 'git-art',
    title: 'Git Art',
    description: 'Transform your GitHub contribution graph into pixel art and animated visualizations. Create custom patterns, export as images, and share your coding journey visually.',
    techStack: ['JavaScript', 'Canvas API', 'GitHub API', 'SVG'],
    liveUrl: 'https://git-art-theta.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/git-art',
    previewUrl: 'https://git-art-theta.vercel.app/',
    deskObject: 'tablet',
    features: [
      'Real-time GitHub contribution graph visualization',
      'Custom pixel art pattern creator',
      'Export as PNG or SVG',
      'Animated timeline playback'
    ]
  },
  
  books: {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'A personal digital library to track your reading journey. Search books, save favorites, and organize your reading list with a clean, intuitive interface.',
    techStack: ['React', 'Vite', 'Open Library API', 'CSS3'],
    liveUrl: 'https://vanessasbooks.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/bookworm',
    previewUrl: 'https://vanessasbooks.vercel.app/',
    deskObject: 'bookshelf',
    features: [
      'Search millions of books via Open Library API',
      'Save and organize your reading list',
      'Beautiful book cover displays',
      'Reading progress tracking'
    ]
  },

  stravaPostcard: {
    id: 'strava-postcard',
    title: 'Strava Postcard',
    description: 'Turn back time by going from digital to analog - convert your Strava activities into beautiful, shareable postcards with route maps and stats.',
    techStack: ['React', 'Strava API', 'Mapbox', 'Canvas'],
    liveUrl: 'https://strava-postcard.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/strava-postcard',
    deskObject: 'postcard',
    features: [
      'Connect with Strava account',
      'Generate vintage postcard designs',
      'Custom route map visualization',
      'Download or share on social media'
    ]
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
