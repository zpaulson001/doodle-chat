# Welcome to Doodle Chat!

Doodle chat makes your conversations more intentional, more whimsical, and most importantly, more fun! It's a real-time chat application with a twist— the only messages you can send are doodles.

Tech used:
- React / Remix
- shadcn/ui components
- Tailwind CSS
- Prisma
- SQLite database for local develoment
- libSQL database hosted on Turso for deployment
- Deployed on Fly.io

Link to live application: <https://doodle-chat.fly.dev>. If you just want to test it out without creating an account, be sure to click the "demo account" button on the login page. Send me a doodle 🙃! My handle -> @zacklemack

## Motivation

Life is made better by friends, scribbles, and fewer distractions. Doodle Chat was designed not to hold your attention, but to put a smile on your face as you connect with others.

## Getting Started

If you just want to check out Doodle Chat, you can do so at <https://doodle-chat.fly.dev>. If you'd like to experiment a bit, follow the instructions to get it up and running on your local machine.

Prequisites: You need to have Node.js, npm, and Git installed.

1. First, clone the repo.

```bash
git clone https://github.com/zpaulson001/doodle-chat.git
```

2. Then navigate inside the directory.

```bash
cd doodle-chat
```

3. Next, install the dependencies with npm.

```bash
npm install
```

4. Now copy the contents of ".env.sample" into a new file called ".env".

```bash
cp .env.sample .env
```

5. Next, use the latest Prisma migration to generate a new sqlite.db file.

```bash
npx prisma migrate dev
```

6. Then seed the database with a few sample users.

```bash
npx tsx seed.ts
```

7. If everything's gone smoothly, you can now start the dev server and navigate to the link it provides. Create an account or log in as the demo user. After the first login, you may need to refresh the page to see your profile picture and other sample users. Happy doodling! 🥳

```bash
npm run dev
```

## Fixes

- [x] Server-side validation for Login/Signup
- [ ] Client-side validation for Login/Signup
- [x] Error handling
  - [x] 404 page

## Roadmap

- [x] Private messages to specific users
- [x] Demo account
- [x] Delete messages
- [x] Switch between conversation threads using the sidebar
- [x] Users can draw their own profile picture
- [ ] Opt-in email notifications
- [ ] Improve mobile responsiveness
- [ ] Add friends/known contacts
- [ ] Group conversations
  - [ ] Change group name/picture
  - [ ] Add or remove members
