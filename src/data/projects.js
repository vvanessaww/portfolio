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
    deskObject: 'postcard'
  },

  auralFixation: {
    id: 'aural-fixation',
    title: 'Aural Fixation',
    description: 'a mixtape maker. curate and share custom mixtapes with friends, complete with tracklists and cover art.',
    techStack: ['Next.js', 'React', 'Supabase'],
    liveUrl: 'https://vanessazwang.com/mixtape',
    githubUrl: null,
    previewUrl: 'https://vanessazwang.com/mixtape',
    deskObject: 'mixtape'
  },

  vibecheck: {
    id: 'vibecheck',
    title: 'Vibe Check',
    description: 'a coachella 2026 vibe check. take a short quiz to find your stage and recommended artists, or share with a friend to find your coachella chemistry.',
    techStack: ['React', 'Vite', 'Supabase'],
    liveUrl: 'https://vanessazwang.com/vibecheck',
    githubUrl: null,
    previewUrl: 'https://vanessazwang.com/vibecheck',
    deskObject: 'vibecheck'
  },

  botfriend: {
    id: 'botfriend',
    title: 'Botfriend',
    description: 'A real-time voice-to-code pipeline. Talk about code changes out loud — botfriend listens, extracts what\'s actionable, and runs it through Claude Code.',
    techStack: ['Python', 'Whisper', 'Claude Code', 'Textual TUI', 'pyannote'],
    liveUrl: null,
    githubUrl: 'https://github.com/vvanessaww/botfriend',
    previewUrl: null,
    previewType: 'image',
    deskObject: 'microphone'
  },

  claudejournal: {
    id: 'claudejournal',
    title: 'Session Journal',
    description: 'A Claude Code plugin that auto-logs every session so you never lose a conversation. Browse and resume past sessions with /sessions.',
    techStack: ['Bash', 'jq', 'Claude Code Plugin API'],
    liveUrl: null,
    githubUrl: 'https://github.com/vvanessaww/claudejournal',
    previewUrl: null,
    previewType: 'image',
    deskObject: 'journal'
  },

  gititogether: {
    id: 'gititogether',
    title: 'Git It Together',
    description: 'an interactive CLI tutorial that teaches Git by having you type real commands. 15 lessons across 5 levels, from cloning a repo to cherry-picking commits. features a growing ASCII tree that evolves as you progress, contextual hints, and multi-step scenarios. built for PMs, designers, and founders who work with AI coding tools but never learned Git.',
    techStack: ['TypeScript', 'React', 'Ink', 'Node.js CLI'],
    liveUrl: 'https://www.npmjs.com/package/git-it-together',
    githubUrl: 'https://github.com/vvanessaww/git-it-together',
    previewUrl: '/previews/git-it-together-preview.gif',
    previewType: 'image',
    deskObject: 'terminal'
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
