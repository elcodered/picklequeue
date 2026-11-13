# PickleQueue

A React + JSX frontend for pickleball open-play queues and doubles court rotations.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm run build` for production output, `npm run preview` to preview the build, and `npm test` for queue algorithm tests.

## Included

- Dashboard with live waiting, playing, completed-match, and court counts.
- Player registration, editing, deletion, check-in, and queue checkout.
- Queue priority selects the next four eligible players; returning players shuffle at the queue tail after each match.
- Lock two waiting players as persistent partners using the lock icon. They take the later queue position, stay on one team, shuffle as a unit, and join or leave the queue together. Unlock from the queue or player roster.
- Locked pairs stay intact when selecting matches, including across multiple courts. If needed, a player waits for the next available group of four.
- Multiple courts, availability controls, and match timers.
- Match completion requires choosing the winning doubles team and returns all four players to the queue tail.
- Match history with winning teams and per-player games played.
- Player leaderboard with wins, losses, and win rate; ranked by wins, then win rate, with shared ranks for ties. Older matches without winners stay in history but do not affect rankings.
- Responsive navigation and browser-local persistence.

Data is stored under `picklequeue-v1` in localStorage. The initial demo has eight waiting players and two available courts. This frontend does not yet include Laravel, MySQL, authentication, or shared real-time updates. Clear the site's browser storage to reset the demo. Core queue transitions are isolated in `src/queue.js` to simplify a later API integration.
