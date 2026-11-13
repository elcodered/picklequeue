export const uid = () => globalThis.crypto.randomUUID();
export function initialState() {
  const names = ['Juan Dela Cruz', 'Maria Santos', 'Pedro Reyes', 'Ana Garcia', 'Mark Mendoza', 'John Rivera', 'Carlo Ramos', 'Jessa Lim'];
  const players = names.map((name, i) => ({id: `player-${i}`, name, skill: ['Intermediate', 'Beginner', 'Advanced'][i % 3], games: 0}));
  return {players, queue: players.map(p => ({playerId: p.id, joinedAt: Date.now()})), courts: [{id:'court-1', name:'Court 1', enabled:true, match:null}, {id:'court-2', name:'Court 2', enabled:true, match:null}], history:[]};
}
export function startMatch(state, courtId) {
  const court = state.courts.find(c => c.id === courtId);
  if (!court || !court.enabled || court.match || state.queue.length < 4) return state;
  const match = {id:uid(), playerIds:state.queue.slice(0,4).map(q=>q.playerId), startedAt:Date.now()};
  return {...state, queue:state.queue.slice(4), courts:state.courts.map(c=>c.id===courtId ? {...c,match} : c)};
}
export function finishMatch(state, courtId, winningTeam, matchId) {
  const court = state.courts.find(c => c.id === courtId);
  if (!court?.match || !['A', 'B'].includes(winningTeam) || (matchId && court.match.id !== matchId)) return state;
  const match = {...court.match, winningTeam, courtName:court.name, endedAt:Date.now()};
  return {...state, players:state.players.map(p=>match.playerIds.includes(p.id)?{...p,games:p.games+1}:p), queue:[...state.queue,...match.playerIds.map(playerId=>({playerId,joinedAt:Date.now()}))], courts:state.courts.map(c=>c.id===courtId?{...c,match:null}:c), history:[match,...state.history]};
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
