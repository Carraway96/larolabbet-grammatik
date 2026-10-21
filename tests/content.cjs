const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = vm.createContext({});
for (const file of ['content','topics','lesson','new-lessons']) vm.runInContext(fs.readFileSync(`dist/${file}.js`,'utf8'), context);
const { levels, topics, lessons } = vm.runInContext('({levels:LEVELS,topics:TOPICS,lessons:LESSONS})', context);
assert.equal(levels.length, 9);
assert.equal(new Set(levels.map(l=>l.id)).size, 9);
assert.equal(levels.reduce((n,l)=>n+l.questions.length,0),90);
for (const topic of ['be','have','article']) {
  const subset=levels.filter(l=>l.topic===topic);
  assert.deepEqual(Array.from(subset,l=>l.stage),['grund','vidare','utmaning']);
  for(const level of subset){
    assert.equal(level.questions.length,10);
    for(const q of level.questions){
      assert.equal(q[0].split('___').length,2,`One gap: ${level.id}`);
      assert(topics[topic].options.includes(q[1]),`Valid answer: ${q[0]}`);
      assert(q[2].length>10 && q[3].length>2,`Explanation/translation: ${q[0]}`);
      if(topic!=='be')assert.equal(q[4].length,2,'Visual reasoning route');
    }
    assert(topics[topic].options.includes(lessons[level.id].check.answer));
    assert(lessons[level.id].scenes.length>0);
  }
}
vm.runInContext('let session={scene:0}; function getTopic(l){return TOPICS[l.topic];}',context);
for(const level of levels){
  for(let i=0;i<lessons[level.id].scenes.length;i++){
    context.testLevel=level;context.sceneIndex=i;
    const html=vm.runInContext('session.scene=sceneIndex;lessonScene(testLevel)',context);
    assert(!html.includes('undefined'));
    assert(html.includes('<svg'));
  }
}
const soundCases=levels.find(l=>l.id==='article-utmaning').questions;
for(const [word,answer] of [['hour','an'],['honest','an'],['university','a'],['useful','a'],['uniform','a'],['European','a'],['one-way','a']]){
  assert.equal(soundCases.find(q=>q[0].includes(word))[1],answer);
}
assert(levels.some(l=>l.id==='grund') && levels.some(l=>l.id==='vidare') && levels.some(l=>l.id==='utmaning'),'Preserve saved is/are IDs');
console.log('PASS: 3 topics, 9 levels, 90 questions, all illustrated scenes, visual reasoning data, phonetic cases and existing IDs.');
