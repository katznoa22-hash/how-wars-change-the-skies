/* Uses Node's built-in WebSocket and an installed Chrome/Edge. No npm packages. */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const artifacts=resolve(root,'artifacts');await mkdir(artifacts,{recursive:true});
const results=[],errors=[],requests=[];
function sanitizeReport(value){
  if(typeof value==='string'){
    for(const prefix of [pathToFileURL(root).href,root.replaceAll('\\','/'),root])value=value.split(prefix).join('<project>');
    return value;
  }
  if(Array.isArray(value))return value.map(sanitizeReport);
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,sanitizeReport(item)]));
  return value;
}
const server=createServer(async(req,res)=>{
  try {const filename=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));
    if(!filename.startsWith(root+'\\')&&!filename.startsWith(root+'/'))throw Error('outside root');
    const bytes=await readFile(filename);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.css':'text/css','.json':'application/json','.md':'text/plain'})[extname(filename)]||'application/octet-stream');res.end(bytes);
  }catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(r=>server.listen(8765,'127.0.0.1',r));
const executable=['C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find(existsSync);
if(!executable)throw Error('Chrome or Edge required');
const child=spawn(executable,['--headless=new','--remote-debugging-port=9222','--remote-allow-origins=http://localhost:9222','--user-data-dir='+resolve(root,'.browser-profile'),'--no-first-run','--no-default-browser-check','--use-angle=swiftshader','--enable-unsafe-swiftshader','about:blank'],{windowsHide:true,stdio:'ignore'});
child.on('error',e=>errors.push(String(e)));
let socket,id=0;const pending=new Map();
const pause=ms=>new Promise(r=>setTimeout(r,ms));
function cdp(method,params={}){return new Promise((resolve,reject)=>{const seq=++id;const timer=setTimeout(()=>{pending.delete(seq);reject(Error('CDP timeout: '+method));},15000);pending.set(seq,{resolve,reject,timer});socket.send(JSON.stringify({id:seq,method,params}));});}
async function evaluate(expression){const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function check(name,fn){await fn();results.push({name,result:'passed'});console.log('PASS',name);}
async function screenshot(name){const shot=await cdp('Page.captureScreenshot',{format:'png'});await writeFile(resolve(artifacts,name),Buffer.from(shot.data,'base64'));}
try{
  let targets;
  for(let i=0;i<100;i++){try{targets=await(await fetch('http://127.0.0.1:9222/json')).json();if(targets.length)break;}catch{}await pause(150);}
  assert(targets?.length,'Browser debugging endpoint unavailable');
  socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((r,j)=>{socket.addEventListener('open',r,{once:true});socket.addEventListener('error',j,{once:true});});
  socket.addEventListener('message',event=>{const data=JSON.parse(event.data);if(data.id){const p=pending.get(data.id);if(!p)return;pending.delete(data.id);clearTimeout(p.timer);if(data.error)p.reject(Error(JSON.stringify(data.error)));else p.resolve(data.result);}else if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails);else if(data.method==='Network.requestWillBeSent')requests.push(data.params.request.url);});
  await cdp('Page.enable');await cdp('Runtime.enable');await cdp('Network.enable');
  await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await cdp('Page.navigate',{url:'http://127.0.0.1:8765/'});await pause(1400);
  await check('10 slides and local model initialize',async()=>{assert.equal(await evaluate('document.querySelectorAll("section.slide").length'),10);assert.equal(await evaluate('PRESENTATION_DATA.version'),2);assert.match(await evaluate('document.getElementById("heroDistance").textContent'),/^\+/);});
  await check('all navigation dots, previous/next, keyboard and boundaries',async()=>{
    for(let i=0;i<10;i++){await evaluate(`document.querySelectorAll('.dot-item')[${i}].click()`);assert.equal(await evaluate('currentSlide'),i);}
    await evaluate('goToSlide(0);navigateSlide(-1)');assert.equal(await evaluate('currentSlide'),0);
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});assert.equal(await evaluate('currentSlide'),1);
    await evaluate('document.getElementById("btnNext").click()');assert.equal(await evaluate('currentSlide'),2);
    await evaluate('document.getElementById("btnPrev").click()');assert.equal(await evaluate('currentSlide'),1);
    await evaluate('goToSlide(9);navigateSlide(1)');assert.equal(await evaluate('currentSlide'),9);
  });
  await check('case study tabs and shortcut modal',async()=>{
    await evaluate('goToSlide(3);document.querySelectorAll(".tab-btn")[1].click()');assert(await evaluate('document.getElementById("case-mideast").classList.contains("active")'));
    await evaluate('document.querySelectorAll(".tab-btn")[0].click()');assert(await evaluate('document.getElementById("case-russia").classList.contains("active")'));
    await evaluate('toggleShortcutsModal()');await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});assert(!await evaluate('document.getElementById("shortcutsModal").classList.contains("active")'));
  });
  await check('fullscreen enters and exits with a user gesture',async()=>{
    await cdp('Runtime.evaluate',{expression:'toggleFullScreen()',userGesture:true});await pause(300);
    assert(await evaluate('!!document.fullscreenElement'));
    await evaluate('document.exitFullscreen()');assert(!await evaluate('document.fullscreenElement'));
    await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await pause(350);
  });
  await check('three routes agree with generated data and chart',async()=>{
    for(const key of ['lhr-hnd','fra-sin','hel-icn']){await evaluate(`goToSlide(4);document.getElementById('routeSelector').value='${key}';document.getElementById('routeSelector').dispatchEvent(new Event('change'))`);
      assert.equal(await evaluate('selectedRoute'),key);assert.equal(await evaluate(`document.getElementById('dispDirectDist').textContent`),await evaluate(`km(model.routes['${key}'].directKm)`));}
  });
  await check('fuel and time sliders change cost, emissions use the same fuel mass',async()=>{
    await evaluate('goToSlide(6);document.getElementById("inputExtraHours").value="2";document.getElementById("inputFuelPrice").value="2.8";recalcCostSimulator()');
    assert.equal(await evaluate('document.getElementById("resCO2").textContent'),'47.4 tonnes CO₂');
    const before=await evaluate('document.getElementById("resFlightCost").textContent');
    await evaluate('document.getElementById("inputFuelPrice").value="3.8";document.getElementById("inputFuelPrice").dispatchEvent(new Event("input"))');assert.notEqual(await evaluate('document.getElementById("resFlightCost").textContent'),before);
  });
  await check('2 scenarios × 4 strategies × 3 prices; suspension punctuality N/A',async()=>{
    const costs=[];
    for(const scenario of ['siberia','mideast'])for(let strategy=0;strategy<4;strategy++)for(const price of ['moderate','high','spike']){
      await evaluate(`goToSlide(8);document.getElementById('simScenarioSelect').value='${scenario}';document.getElementById('simOilPrice').value='${price}';document.querySelectorAll('.sim-option-card')[${strategy}].click()`);
      assert(!await evaluate('/NaN|undefined/.test(document.getElementById("simDebriefText").textContent)'));
      if(strategy===2)assert.equal(await evaluate('document.getElementById("simStatReliability").textContent'),'N/A');
      if(strategy===0&&price==='high')costs.push(await evaluate('document.getElementById("simStatCost").textContent'));
    }assert.notEqual(costs[0],costs[1]);
  });
  await check('3D WebGL, texture, coordinates, route geometry and resource cleanup',async()=>{
    await evaluate('goToSlide(5);chooseGlobeRoute("lhr-hnd")');await pause(1200);
    assert(await evaluate('globeInitialized && !!renderer.getContext()'));
    assert.equal(await evaluate('earthMesh.material.map.image.width'),2048);
    assert(await evaluate('movingPoints.every(p=>p.length()>=R)'));
    assert.equal(await evaluate('latLonToVector3(0,0).x'),12);
    await evaluate('setGlobeScenario("mideast")');assert.equal(await evaluate('selectedRoute'),'fra-sin');
    await evaluate('chooseGlobeRoute("hel-icn")');assert.equal(await evaluate('airportLabels.length'),2);
    for(let i=0;i<10;i++)await evaluate(`setGlobeScenario('${i%2?'mideast':'russia'}')`);
    await pause(500);assert(await evaluate('renderer.info.memory.geometries < 35'));
    await evaluate('resetGlobeCamera();toggleGlobeRotation()');assert.equal(await evaluate('controls.autoRotate'),await evaluate('spin'));
    await screenshot('globe-desktop.png');
  });
  await check('drag, zoom, reset and 2D map toggle',async()=>{
    const point=await evaluate('(()=>{const r=document.getElementById("globeCanvas").getBoundingClientRect();return {x:Math.min(innerWidth-30,r.left+r.width*.6),y:Math.min(innerHeight-110,r.top+r.height*.45)}})()');
    const before=await evaluate('camera.position.toArray().join()');
    await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:point.x,y:point.y,button:'left',clickCount:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x+70,y:point.y+20,button:'left',buttons:1});
    await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.x+70,y:point.y+20,button:'left',clickCount:1});await pause(300);
    assert.notEqual(await evaluate('camera.position.toArray().join()'),before);
    const distance=await evaluate('camera.position.length()');await cdp('Input.dispatchMouseEvent',{type:'mouseWheel',x:point.x,y:point.y,deltaX:0,deltaY:200});await pause(200);assert.notEqual(await evaluate('camera.position.length()'),distance);
    await evaluate('resetGlobeCamera();toggleMapView()');assert(await evaluate('mapMode'));await screenshot('map-desktop.png');await evaluate('toggleMapView()');
  });
  await check('all slides at desktop and mobile widths without page overflow',async()=>{
    for(const [width,height] of [[1440,1000],[390,844]]){
      await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
      for(let i=0;i<10;i++){await evaluate(`goToSlide(${i})`);await pause(100);assert(await evaluate('document.documentElement.scrollWidth <= innerWidth'),`page overflow at slide ${i+1}, ${width}`);assert(await evaluate(`document.getElementById('slide-${i}').scrollWidth <= document.getElementById('slide-${i}').clientWidth+1`),`slide content overflow at slide ${i+1}, ${width}`);}
      assert(await evaluate('document.getElementById("btnNext").getBoundingClientRect().right <= innerWidth'),'Next button must remain inside viewport');
      assert(await evaluate('document.getElementById("btnPrev").getBoundingClientRect().left >= 0'),'Previous button must remain inside viewport');
      await evaluate('goToSlide(5)');await pause(500);if(width===390)await screenshot('globe-mobile.png');
      assert(await evaluate('camera.position.length() >= R/Math.sin(Math.atan(Math.tan(camera.fov*Math.PI/360)*Math.min(camera.aspect,1)))'),'Default camera fits Earth at narrow aspect ratios');
    }
  });
  await check('reduced motion pauses rotation by default after reload',async()=>{
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await cdp('Page.reload');await pause(800);assert.equal(await evaluate('spin'),false);
  });
  await check('presentation requests no external runtime resources',async()=>{assert(!requests.some(u=>/^https?:/.test(u)&&!u.startsWith('http://127.0.0.1:8765/')));});
  await check('direct file preview works with local data and WebGL',async()=>{
    await cdp('Page.navigate',{url:'file:///'+root.replaceAll('\\','/')+'/index.html'});await pause(900);
    await evaluate('goToSlide(5)');await pause(500);assert(await evaluate('globeInitialized'));assert.equal(await evaluate('PRESENTATION_DATA.version'),2);
    await cdp('Page.navigate',{url:'http://127.0.0.1:8765/'});await pause(700);
  });
  await check('missing model reports a visible error and keeps navigation',async()=>{
    await cdp('Network.setBlockedURLs',{urls:['*presentation-data.js']});await cdp('Page.reload');await pause(700);
    assert.match(await evaluate('document.getElementById("dataStatus").textContent'),/missing/);assert(await evaluate('document.getElementById("dataStatus").getBoundingClientRect().height>0'));await evaluate('goToSlide(9)');assert.equal(await evaluate('currentSlide'),9);
    await cdp('Network.setBlockedURLs',{urls:[]});
  });
  // Restore assets, then verify the no-WebGL fallback independently.
  await cdp('Page.reload');await pause(700);
  await check('missing Three.js falls back to 2D with explanatory text',async()=>{
    await evaluate('window.THREE=undefined;goToSlide(5)');assert(await evaluate('mapMode'));assert.match(await evaluate('document.getElementById("globeStatus").textContent'),/unavailable/);
  });
  assert.deepEqual(errors,[],'Unexpected JavaScript exceptions');
}catch(error){results.push({name:'failure',result:'failed',detail:String(error)});console.error(error);try{await screenshot('browser-failure.png');}catch{}process.exitCode=1;}
finally{
  const report=sanitizeReport({browser:basename(executable),mode:'headless; software WebGL (SwiftShader)',results,errors,requests:[...new Set(requests)]});
  await writeFile(resolve(artifacts,'browser-results.json'),JSON.stringify(report,null,2)+'\n');
  if(socket?.readyState===WebSocket.OPEN){try{await cdp('Browser.close');}catch{}socket.close();}
  child.kill();server.close();
}
