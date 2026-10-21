const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

async function run() {
  const listeners = new Map(), elements = new Map();
  const element = selector => {
    if (!elements.has(selector)) elements.set(selector, {
      textContent: '', value: '', style: {}, classList: {add(){},remove(){}},
      addEventListener(type, fn){this[type] = fn;},
      querySelector: element, querySelectorAll: () => [], focus(){},
    });
    return elements.get(selector);
  };
  let resolveCopy, rejectCopy;
  const context = vm.createContext({
    window: {ClipboardItem: true, addEventListener:(type,fn)=>listeners.set(type,fn), removeEventListener:type=>listeners.delete(type)},
    navigator:{clipboard:{write:()=>new Promise((resolve,reject)=>{resolveCopy=resolve;rejectCopy=reject;})}},
    ClipboardItem:class {},
    main:{querySelector:element}, reportName:'', reportReflection:'',
    reportText:()=>'', toast(){}, setTimeout:()=>1, clearTimeout(){},
    URL:{createObjectURL:()=> 'blob:test', revokeObjectURL(){}},
    document:{createElement:()=>({click(){},remove(){}}),body:{append(){}}},
  });
  vm.runInContext(fs.readFileSync('dist/report-image.js','utf8'),context);
  vm.runInContext('createReportImage = async () => ({}); bindReport({level:"grund",date:"2026-10-21"})',context);
  const pending = () => vm.runInContext('reportNeedsExport',context);
  assert(pending());
  let prevented=false;
  const event={preventDefault(){prevented=true;}};
  listeners.get('beforeunload')(event);
  assert(prevented); assert.equal(event.returnValue,'');
  const denied=element('#copy').click(); rejectCopy(new Error('Denied')); await denied;
  assert(pending(),'Denied clipboard must keep warning');
  const stale=element('#copy').click();
  element('#student-name').value='New name'; element('#student-name').input();
  resolveCopy(); await stale;
  assert(pending(),'Old export must not clear warning for edited image');
  const copied=element('#copy').click(); resolveCopy(); await copied;
  assert(!pending()); assert(!listeners.has('beforeunload'));
  element('#reflection').value='New reflection'; element('#reflection').input();
  assert(pending());
  await element('#download').click();
  assert(!pending(),'PNG download is a supported alternative');
  element('#reflection').input();
  vm.runInContext('disposeReport()',context);
  assert(!listeners.has('beforeunload'),'Leaving report must dispose warning');

  const app=fs.readFileSync('dist/app.js','utf8');
  const routing=app.slice(app.indexOf('let renderedHash = null;'),app.indexOf("window.addEventListener('hashchange'"));
  let replacements=0, disposals=0;
  Object.assign(context,{location:{hash:'#ovningar',pathname:'/',search:''},history:{replaceState(){replacements++;}},confirm:()=>false,document:{querySelectorAll:()=>[]}});
  vm.runInContext(routing,context);
  vm.runInContext('renderedHash="#resultat/test"; reportNeedsExport=true; disposeReport=()=>{throw Error("Cancelled navigation disposed report")}; route()',context);
  assert.equal(replacements,1);
  console.log('PASS: leave warning, copy denial, stale async export, field edits, successful copy/download, disposal and cancelled navigation.');
}
run().catch(error=>{console.error(error);process.exitCode=1;});
