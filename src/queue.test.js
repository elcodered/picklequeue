import test from 'node:test';
import assert from 'node:assert/strict';
import {initialState,startMatch,finishMatch,statusOf} from './queue.js';
test('FCFS selects first four, assigns unique players, and rotates to the tail',()=>{
 const initial=initialState();const started=startMatch(initial,'court-1');
 assert.deepEqual(started.courts[0].match.playerIds,['player-0','player-1','player-2','player-3']);
 assert.deepEqual(started.queue.map(q=>q.playerId),['player-4','player-5','player-6','player-7']);
 assert.equal(statusOf(started,'player-0'),'Playing');
 const finished=finishMatch(started,'court-1');
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
