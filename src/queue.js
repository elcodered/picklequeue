export const uid = () => globalThis.crypto.randomUUID();
export const partnerOf = (state, id) => (state.lockedPairs || []).find(pair => pair.includes(id))?.find(playerId => playerId !== id);
export function unlockPair(state, id) {
  return {...state, lockedPairs:(state.lockedPairs || []).filter(pair => !pair.includes(id))};
}
export function lockPair(state, first, second) {
  if (first === second || partnerOf(state, first) || partnerOf(state, second) ||
      ![first, second].every(id => state.players.some(p => p.id === id) && statusOf(state, id) === 'In queue')) return state;
  // The pair takes the later queue position so locking cannot jump the queue.
  const later = Math.max(...[first, second].map(id => state.queue.findIndex(q => q.playerId === id)));
  const pair = [first, second].map(id => state.queue.find(q => q.playerId === id));
  const queue = state.queue.filter(q => ![first, second].includes(q.playerId));
  queue.splice(later - 1, 0, ...pair);
  return {...state, queue, lockedPairs:[...(state.lockedPairs || []), [first, second]]};
}
function queueGroups(state, entries) {
  const seen = new Set();
  const groups = [];
  for (const entry of entries) {
    if (seen.has(entry.playerId)) continue;
    const partner = partnerOf(state, entry.playerId);
    const other = partner && entries.find(q => q.playerId === partner);
    if (partner && !other) continue;
    const group = other ? [entry, other] : [entry];
    group.forEach(q => seen.add(q.playerId));
    groups.push(group);
  }
  return groups;
}
export function nextMatchPlayerIds(state) {
  const groups = queueGroups(state, state.queue);
  function select(index, remaining) {
    if (!remaining) return [];
    for (let i = index; i < groups.length; i++) {
      if (groups[i].length > remaining) continue;
      const rest = select(i + 1, remaining - groups[i].length);
      if (rest) return [groups[i], ...rest];
    }
    return null;
  }
  const selected = select(0, 4) || [];
  // Locked groups occupy a complete team; singles fill the other team.
  return [...selected.filter(g => g.length === 2), ...selected.filter(g => g.length === 1)].flat().map(q => q.playerId);
}
export function initialState() {
  const names = ['Juan Dela Cruz', 'Maria Santos', 'Pedro Reyes', 'Ana Garcia', 'Mark Mendoza', 'John Rivera', 'Carlo Ramos', 'Jessa Lim'];
  const players = names.map((name, i) => ({id: `player-${i}`, name, skill: ['Intermediate', 'Beginner', 'Advanced'][i % 3], games: 0}));
  return {players, queue: players.map(p => ({playerId: p.id, joinedAt: Date.now()})), courts: [{id:'court-1', name:'Court 1', enabled:true, match:null}, {id:'court-2', name:'Court 2', enabled:true, match:null}], history:[]};
}
function shuffled(items, random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function assignTeams(state, ids, random) {
  const [a,b,c,d] = ids;
  const choices = shuffled([[a,b,c,d], [a,c,b,d], [a,d,b,c]], random).filter(order =>
    order.every((id, index) => !partnerOf(state,id) || partnerOf(state,id) === order[index ^ 1]));
  const lastPartners = new Map();
  for (const match of state.history) {
    match.playerIds.forEach((id, index) => {
      if (!lastPartners.has(id)) lastPartners.set(id, match.playerIds[index ^ 1]);
    });
  }
  const repeats = order => order.reduce((count, id, index) => count + Number(!partnerOf(state,id) && lastPartners.get(id) === order[index ^ 1]), 0);
  choices.sort((left, right) => repeats(left) - repeats(right));
  return choices[0];
}
export function startMatch(state, courtId, random = Math.random) {
  const court = state.courts.find(c => c.id === courtId);
  if (!court || !court.enabled || court.match || state.queue.length < 4) return state;
  // Draw from the entire waiting pool, rather than retaining arrival cohorts.
  const pool = shuffled(queueGroups(state, state.queue), random).flat();
  const selected = nextMatchPlayerIds({...state, queue:pool});
  if (selected.length !== 4) return state;
  const playerIds = assignTeams(state, selected, random);
  const match = {id:uid(), playerIds, startedAt:Date.now()};
  return {...state, queue:state.queue.filter(q => !playerIds.includes(q.playerId)), courts:state.courts.map(c=>c.id===courtId ? {...c,match} : c)};
}
export function finishMatch(state, courtId, winningTeam, matchId, random = Math.random) {
  const court = state.courts.find(c => c.id === courtId);
  if (!court?.match || !['A', 'B'].includes(winningTeam) || (matchId && court.match.id !== matchId)) return state;
  const match = {...court.match, winningTeam, courtName:court.name, endedAt:Date.now()};
  const groups = queueGroups(state, match.playerIds.map(playerId=>({playerId,joinedAt:match.endedAt})));
  for (let i = groups.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [groups[i], groups[j]] = [groups[j], groups[i]];
  }
  return {...state, players:state.players.map(p=>match.playerIds.includes(p.id)?{...p,games:p.games+1}:p), queue:[...state.queue,...groups.flat()], courts:state.courts.map(c=>c.id===courtId?{...c,match:null}:c), history:[match,...state.history]};
}
export function playerStandings(state) {
  const records = new Map(state.players.map(player => [player.id, {...player, wins:0, losses:0}]));
  for (const match of state.history) {
    if (!['A', 'B'].includes(match.winningTeam)) continue;
    match.playerIds.forEach((id, index) => {
      const record = records.get(id);
      if (record) record[(index < 2 ? 'A' : 'B') === match.winningTeam ? 'wins' : 'losses']++;
    });
  }
  const standings = [...records.values()].map(player => ({...player, ratedGames:player.wins + player.losses,
    winRate:player.wins + player.losses ? player.wins / (player.wins + player.losses) : 0}));
  standings.sort((a,b) => Number(b.ratedGames > 0) - Number(a.ratedGames > 0) || b.wins - a.wins || b.winRate - a.winRate || a.name.localeCompare(b.name));
  return standings.map((player, index) => ({...player, rank:player.ratedGames ? standings.findIndex(p => p.wins === player.wins && p.winRate === player.winRate) + 1 : null}));
}
export function statusOf(state, id) {
  if (state.courts.some(c=>c.match?.playerIds.includes(id))) return 'Playing';
  return state.queue.some(q=>q.playerId===id) ? 'In queue' : 'Checked out';
}
