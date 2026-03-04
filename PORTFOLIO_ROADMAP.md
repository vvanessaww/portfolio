# Portfolio Roadmap - Public Launch Prep

## Latest Changes (Current State)
✅ 3D hallway intro with immersive camera movement  
✅ Interactive desk scene with clickable objects  
✅ CTA buttons in navigation  
✅ Git Art integration at `/git` route  
✅ Books showcase at `/books` route  
✅ Strava Postcard project (postcard on desk)  
✅ Mobile navigation fixes  
✅ Day/night mode toggle  

## Current Projects Showcased
1. **Git Art** - tablet on desk → `/git` (external navigation)
2. **Books** - bookshelf → `/books` (external navigation)
3. **Strava Postcard** - postcard on desk → modal popup ✅
4. **Writing** - notebook → modal popup ✅
5. **About** - laptop → modal popup ✅

## Missing Projects to Showcase

### From Your GitHub
1. **shadow-tamagotchi** - "Shadow's live agent dashboard — Tamagotchi-style AI familiar monitor"
2. **repo-story** - "Transform GitHub repository history into narrative stories"
3. **git-it-together** - "Interactive CLI tutorial for learning Git in AI-assisted workflows"
4. **thoughtful** - Smart journal app (mentioned in USER.md)
5. **kanban** - "Simple drag-and-drop Kanban board for task management"

---

## 🎯 Next Steps for Public Launch

### Phase 1: Modal System Improvements (HIGH PRIORITY)
**Goal:** Keep users on portfolio page unless they explicitly choose to open in new tab

#### Changes Needed:
1. **Convert External Routes to Modals**
   - `/books` → Modal with iframe/preview + "Open in new tab" button
   - `/git` → Modal with iframe/preview + "Open in new tab" button
   
2. **Create Unified Project Modal Component**
   ```jsx
   <ProjectModal
     title="Project Name"
     description="Description"
     previewUrl="https://..."
     githubUrl="https://github.com/..."
     liveUrl="https://..."
     screenshots={[...]}
     onClose={handleClose}
   />
   ```

3. **Modal Features:**
   - Hero image/screenshot
   - Project description
   - Tech stack badges
   - "View Live" button (opens in new tab)
   - "View Code" button (GitHub)
   - Close button (X) + ESC key support
   - Click outside to close
   - Smooth animations

### Phase 2: Add More Projects to Desk Scene (MEDIUM PRIORITY)

#### Object Ideas:
1. **Phone/Tablet** (shadow-tamagotchi)
   - Screen shows animated Tamagotchi-style monitor
   - Click → Modal with project details
   
2. **Sticky Note/Task Board** (kanban)
   - Small bulletin board with colorful notes
   - Click → Modal with project preview
   
3. **Book/Journal** (thoughtful app)
   - Different from notebook (which is Writing)
   - Click → Modal with app showcase
   
4. **Comic Book/Magazine** (repo-story)
   - Visual storytelling theme
   - Click → Modal with examples
   
5. **Terminal/Command Palette** (git-it-together)
   - Small terminal window with green text
   - Click → Modal with interactive demo

### Phase 3: Polish & Content (HIGH PRIORITY)

#### Content Updates:
- [ ] Update contact email (currently `vanessawang@example.com`)
- [ ] Add real project descriptions
- [ ] Add screenshots for each project
- [ ] Write compelling About Me content
- [ ] Add resume/CV link
- [ ] Social media links (Instagram, TikTok, Substack, YouTube)

#### Visual Polish:
- [ ] Optimize 3D model performance
- [ ] Add loading states for modals
- [ ] Accessibility audit (keyboard nav, screen readers)
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing

### Phase 4: SEO & Analytics (MEDIUM PRIORITY)
- [ ] Meta tags (title, description, OG tags)
- [ ] Favicon
- [ ] sitemap.xml
- [ ] robots.txt
- [ ] Google Analytics / Plausible
- [ ] Performance optimization (Lighthouse score)

### Phase 5: Content Strategy (LOW PRIORITY, POST-LAUNCH)
- [ ] Writing section: Import Substack posts?
- [ ] Case studies for each project
- [ ] Video demos
- [ ] Blog integration

---

## 📋 Implementation Plan

### Immediate Next Steps (This Week):
1. Create `ProjectModal.jsx` component
2. Convert `/books` and `/git` to use modals instead of direct navigation
3. Add 3-4 more project objects to desk scene
4. Update contact email
5. Write compelling About Me content

### Code Structure:
```
src/
├── components/
│   ├── DeskScene.jsx (add more interactive objects)
│   ├── ProjectModal.jsx (NEW - unified modal)
│   ├── MacHomeScreenFullscreen.jsx (About Me - keep)
│   ├── NotebookFullscreen.jsx (Writing - keep)
│   ├── PostcardFullscreen.jsx (Strava - keep)
│   └── ...
├── data/
│   └── projects.js (NEW - centralized project data)
└── ...
```

### Project Data Schema:
```javascript
// src/data/projects.js
export const projects = {
  gitArt: {
    id: 'git-art',
    title: 'Git Art',
    description: 'Transform your GitHub contribution graph into art',
    techStack: ['JavaScript', 'Canvas API', 'GitHub API'],
    liveUrl: 'https://git-art-theta.vercel.app/',
    githubUrl: 'https://github.com/vvanessaww/git-art',
    screenshots: ['/screenshots/git-art-1.png'],
    deskObject: 'tablet'
  },
  // ... more projects
}
```

---

## 🚀 Launch Checklist

### Pre-Launch:
- [ ] All projects showcased
- [ ] Modal system working smoothly
- [ ] Contact info updated
- [ ] Mobile tested
- [ ] Performance optimized
- [ ] Accessibility checked
- [ ] Content proofread

### Launch:
- [ ] Deploy to production
- [ ] Share on social media
- [ ] Add to LinkedIn
- [ ] Submit to portfolio showcases
- [ ] Share in relevant communities

### Post-Launch:
- [ ] Monitor analytics
- [ ] Collect feedback
- [ ] Iterate on UX
- [ ] Add new projects as they're built

---

## Notes
- Current branch: `add-cta-buttons` (up to date with origin)
- Vercel deployment configured
- React + Vite + Three.js stack
- Keep the playful, interactive 3D vibe - it's a differentiator!
