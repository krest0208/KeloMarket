import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPhotoWheel,photoIndex,swipeStep} from '../lib/gallery-gestures';

test('Small swipes snap back; intentional swipes move one photo',()=>{
 assert.equal(swipeStep(8,900,400),0);
 assert.equal(swipeStep(-55,-100,400),1);
 assert.equal(swipeStep(30,650,800),-1);
 assert.equal(swipeStep(30,100,800),0);
});
test('Photo navigation stays within bounds and explicit controls can wrap',()=>{
 assert.equal(photoIndex(0,-1,6),0);
 assert.equal(photoIndex(5,1,6),5);
 assert.equal(photoIndex(0,-1,6,true),5);
 assert.equal(photoIndex(5,1,6,true),0);
 assert.equal(photoIndex(0,1,0),0);
});
test('Trackpad deltas accumulate and momentum does not skip photos',()=>{
 const wheel=createPhotoWheel();
 assert.deepEqual(wheel(16,0,1,6),{step:0,prevent:true});
 assert.deepEqual(wheel(22,30,1,6),{step:1,prevent:true});
 assert.deepEqual(wheel(90,100,2,6),{step:0,prevent:true});
 assert.deepEqual(wheel(45,500,2,6),{step:1,prevent:true});
});
test('Wheel releases the page at gallery ends, and supports reversing',()=>{
 const wheel=createPhotoWheel();
 assert.deepEqual(wheel(-80,0,0,6),{step:0,prevent:false});
 assert.deepEqual(wheel(80,100,5,6),{step:0,prevent:false});
 assert.deepEqual(wheel(-80,200,5,6),{step:-1,prevent:true});
 assert.deepEqual(wheel(20,700,3,6),{step:0,prevent:true});
 assert.deepEqual(wheel(-20,730,3,6),{step:0,prevent:true});
 assert.deepEqual(wheel(-20,760,3,6),{step:-1,prevent:true});
});
