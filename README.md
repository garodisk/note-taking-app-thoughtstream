# Saket's ThoughtStream

> *Capture your thoughts, organize your mind*

A beautiful, modern Kanban-style note-taking app that helps you stay on top of your ideas, tasks, and random shower thoughts. Built with love, React, and way too much coffee.

![ThoughtStream Banner](./screenshots/banner.png)

---

## What's This All About?

Ever had a brilliant idea at 3 AM and forgot it by morning? Or maybe you're drowning in sticky notes that have achieved sentience and are plotting against you?

**ThoughtStream** is here to save the day (and your sanity).

It's a sleek, drag-and-drop Kanban board that lets you:
- Jot down thoughts instantly
- Organize them into columns (Notes → To Do → In Progress → Done)
- Tag everything with #hashtags
- Find stuff with powerful search and filters
- Look cool doing it (dark mode included)

---

## Screenshots

### Light Mode
![Light Mode](./screenshots/light-mode.png)

### Dark Mode
![Dark Mode](./screenshots/dark-mode.png)

### Login Screen
![Login](./screenshots/login.png)

---

## Features That'll Make You Smile

### Kanban Board
Drag and drop your notes between columns like a productivity ninja. Watch your tasks flow from "just an idea" to "done and dusted."

### #Hashtags That Actually Work
Type `#work`, `#personal`, or `#random-thoughts` and boom - instant organization. Click any tag to filter. It's like magic, but real.

### Dark Mode
Because staring at a bright screen at midnight is a crime against your eyeballs. Toggle it with one click.

### Search & Filter
Find that note you wrote last Tuesday about the thing. You know the one. Filter by date, tags, or just search for keywords.

### Hover Previews
Long notes? Hover over them to see the full content. No more clicking around like a detective.

### Cloud Sync
Your notes live in the cloud (powered by Supabase). Log in from anywhere and pick up where you left off.

### Google Sign-In
One click to sign in. No new passwords to forget. You're welcome.

---

## Tech Stack (For the Nerds)

| Tech | Why |
|------|-----|
| React 19 | Because it's shiny and new |
| TypeScript | Types are friends, not food |
| Tailwind CSS | CSS without the crying |
| Supabase | PostgreSQL + Auth, but make it easy |
| Vite | Builds faster than you can say "webpack" |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A Supabase account (free tier works great)
- A Google Cloud project (for OAuth)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/thoughtstream.git
cd thoughtstream

# Install dependencies
npm install

# Set up your environment
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run it!
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Focus the note input |
| `Enter` | Save a note |
| `Escape` | Cancel editing |

---

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Markdown support
- [ ] Due dates & reminders
- [ ] Collaboration (share boards)
- [ ] Export to PDF
- [ ] World domination (stretch goal)

---

## Contributing

Found a bug? Have a cool idea? PRs are welcome! Just keep it fun and friendly.

---

## License

MIT - Do whatever you want, just don't blame me if your thoughts escape.

---

## Built By

**Saket** - A human who thinks too much and needed somewhere to put it all.

---

*Remember: A thought not captured is a thought lost forever. Or something deep like that.*
