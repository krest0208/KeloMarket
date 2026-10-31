import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createLengthDetent} from '../lib/length-detents';
test('Every centimeter remains selectable',()=>{
 const range=createLengthDetent(42,30,150);
 assert.deepEqual(range.input(43,0),{value:43,holdFor:0});
 assert.deepEqual(range.input(44,10),{value:44,holdFor:0});
 assert.equal(range.finish(),44);
});
test('Crossing a ten briefly holds it and release preserves the exact pointer value',()=>{
 const range=createLengthDetent(48,30,150);
 assert.deepEqual(range.input(51,0),{value:50,holdFor:120});
 assert.deepEqual(range.input(53,60),{value:50,holdFor:60});
 assert.equal(range.finish(),53);
 assert.deepEqual(range.input(54,65),{value:54,holdFor:0});
});
test('Continuous input does not extend the pause or queue other marks',()=>{
 const range=createLengthDetent(78,30,150);
 assert.equal(range.input(81,0).value,80);
 assert.equal(range.input(105,60).value,80);
 assert.deepEqual(range.input(107,121),{value:107,holdFor:0});
 assert.deepEqual(range.input(108,130),{value:108,holdFor:0});
});
test('Reverse dragging pauses at tens and still keeps one centimeter precision',()=>{
 const range=createLengthDetent(113,30,150);
 assert.deepEqual(range.input(109,0),{value:110,holdFor:120});
 assert.equal(range.input(107,40).value,110);
 assert.equal(range.finish(),107);
});
test('Starting on a mark does not trap movement and bounds stay safe',()=>{
 const range=createLengthDetent(120,30,150);
 assert.deepEqual(range.input(121,0),{value:121,holdFor:0});
 range.input(170,20);assert.equal(range.finish(),150);
 range.input(0,200);assert.equal(range.finish(),30);
});
