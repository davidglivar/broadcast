# Broadcast

A companion web application for twitch streamers.

## Developing

Clone this project: 

```
git clone https://github.com/davidglivar/broadcast.git
cd broadcast
```

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## OBS Scenes

With this application, you'll be able to add Browser sources in OBS pointing to localhost routes. Here is a list of routes and how they work:

### localhost:5678/brb

- [ ] Check "refresh browser when scene becomes active"
- [ ] Set URL to localhost:5678/brb
- [ ] Set width and height to output of stream

### localhost:5678/countdown

- [ ] Check "refresh browser when scene becomes active"
- [ ] Set URL to localhost:5678/countdown
- [ ] Set width and height to output of stream