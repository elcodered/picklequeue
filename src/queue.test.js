import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,startMatch,finishMatch,playerStandings,statusOf} from './queue.js';
test('FCFS selects first four, assigns unique players, and rotates to the tail',()=>{
 const initial=initialState();const started=startMatch(initial,'court-1');
 assert.deepEqual(started.courts[0].match.playerIds,['player-0','player-1','player-2','player-3']);
 assert.deepEqual(started.queue.map(q=>q.playerId),['player-4','player-5','player-6','player-7']);
 assert.equal(statusOf(started,'player-0'),'Playing');
 const finished=finishMatch(started,'court-1','A');
 assert.equal(finished.courts[0].match,null);assert.equal(finished.history.length,1);
 assert.deepEqual(finished.queue.map(q=>q.playerId),['player-4','player-5','player-6','player-7','player-0','player-1','player-2','player-3']);
 assert.equal(finished.players[0].games,1);assert.equal(finished.players[4].games,0);
 assert.equal(statusOf(finished,'player-0'),'In queue');
 assert.equal(finishMatch(finished,'court-1'),finished);
});
test('multiple courts cannot assign the same player or start without four players',()=>{
 const initial=initialState();const one=startMatch(initial,'court-1');
 assert.equal(startMatch(one,'court-1'),one);
 const both=startMatch(one,'court-2');
 assert.equal(both.queue.length,0);
 assert.equal(new Set(both.courts.flatMap(c=>c.match.playerIds)).size,8);
 const short={...initial,queue:initial.queue.slice(0,3)};
 assert.equal(startMatch(short,'court-1'),short);
 const disabled={...initial,courts:initial.courts.map(c=>({...c,enabled:false}))};
 assert.equal(startMatch(disabled,'court-1'),disabled);
 assert.equal(startMatch(initial,'unknown'),initial);
 assert.equal(finishMatch(initial,'unknown'),initial);
});

test('completion requires a winner and rejects a stale match without changing the queue',()=>{
 const started=startMatch(initialState(),'court-1');
 for(const winner of [undefined,null,'','C']) assert.equal(finishMatch(started,'court-1',winner),started);
 assert.equal(finishMatch(started,'court-1','A','old-match'),started);
 const finished=finishMatch(started,'court-1','B',started.courts[0].match.id);
 assert.equal(finished.history[0].winningTeam,'B');
 assert.equal(finishMatch(finished,'court-1','B'),finished);
 const standings=playerStandings(JSON.parse(JSON.stringify(finished)));
 for(const id of ['player-2','player-3']){
  const p=standings.find(p=>p.id===id);
  assert.equal(p.wins,1);assert.equal(p.losses,0);assert.equal(p.rank,1);assert.equal(p.winRate,1);
 }
 for(const id of ['player-0','player-1']){
  const p=standings.find(p=>p.id===id);
  assert.equal(p.wins,0);assert.equal(p.losses,1);assert.equal(p.rank,3);
 }
 assert.equal(standings.find(p=>p.id==='player-4').rank,null);
});
test('rankings sort by wins then win rate, share ties and ignore historical matches without winners',()=>{
 const state=initialState();
 state.players=state.players.slice(0,5);
 state.history=[
  {playerIds:['player-0','player-1','player-2','player-3'],winningTeam:'A'},
  {playerIds:['player-0','player-2','player-1','player-3'],winningTeam:'B'},
  {playerIds:['player-0','player-1','player-2','player-3']}
 ];
 const standings=playerStandings(state);
 assert.deepEqual(standings.map(p=>[p.id,p.wins,p.losses,p.rank]),[
  ['player-1',2,0,1],['player-3',1,1,2],['player-0',1,1,2],['player-2',0,2,4],['player-4',0,0,null]
 ]);
 assert.equal(standings.find(p=>p.id==='player-0').winRate,0.5);
 const legacy=playerStandings({...state,history:[state.history[2]]});
 assert.ok(legacy.every(p=>p.rank===null&&p.ratedGames===0));
 const deleted=playerStandings({...state,players:state.players.filter(p=>p.id!=='player-0')});
 assert.equal(deleted.find(p=>p.id==='player-1').wins,2);
});
