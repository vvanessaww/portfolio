// Project data for portfolio showcase
export const projects = {
  gitArt: {
    id: 'git-art',
    title: 'Git Art',
    description: 'Transform your GitHub contribution graph into terminal-style art! Choose from 7 different art styles including Rainbow, Tetris, Pac-Man, and custom text. Features a Matrix-inspired dark theme and downloads as PNG for your GitHub profile.',
    techStack: ['React', 'Vite', 'Canvas API', 'GitHub API'],
    liveUrl: 'https://git-art-theta.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/git-art',
    previewUrl: 'https://git-art-theta.vercel.app/',
    deskObject: 'tablet',
    features: [
      '7 art styles: GitHub Classic, Rainbow, Tetris, Pac-Man, Custom Text, Your Name, Heatmap',
      'Real 2026 contribution data from GitHub',
      'Terminal/Matrix-inspired dark theme with green glow',
      'Download as PNG for GitHub profile README',
      'Auto-fetch username from GitHub profile',
      'Mobile responsive, no authentication required'
    ]
  },
  
  books: {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'A clean, minimal personal book library. Browse your collection in a beautiful responsive grid with automatic cover fetching from Google Books API. Simply add ISBNs and watch your library come to life.',
    techStack: ['React', 'Vite', 'Google Books API', 'CSS Grid'],
    liveUrl: 'https://vanessasbooks.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/bookworm',
    previewUrl: 'https://vanessasbooks.vercel.app/',
    deskObject: 'bookshelf',
    features: [
      'Responsive grid layout: 5 books per row on desktop',
      'Automatic cover and metadata fetching via Google Books API',
      'Dark theme with smooth hover effects',
      'Easy customization: just edit books.json with ISBNs',
      'Mobile-friendly design'
    ]
  },

  stravaPostcard: {
    id: 'strava-postcard',
    title: 'Strava Postcard',
    description: 'Turn your Strava activities into beautiful, vintage-style commemorative postcards. Features activity-specific imagery, route visualization from GPS data, and stats display. Perfect for printing or sharing your fitness achievements.',
    techStack: ['React', 'TypeScript', 'Vite', 'Express', 'Strava API', 'Canvas'],
    liveUrl: 'https://strava-postcard.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/strava-postcard',
    deskObject: 'postcard',
    features: [
      'Strava OAuth integration for secure authentication',
      'Vintage postcard design with front (scenic image) and back (route/stats)',
      'Activity-specific images: Run, Hike, Snowboard, and general fitness',
      'Abstract route art generated from GPS polyline data',
      'Display stats: distance, time, pace, elevation, location, date',
      'Download as high-resolution PNG for printing or sharing'
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
