/* Uses Node's built-in WebSocket and an installed Chrome/Edge. No npm packages. */
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
const artifacts=resolve(root,'artifacts','v4');await mkdir(artifacts,{recursive:true});
const fixture=JSON.parse(await readFile(resolve(root,'data/scenarios.json'),'utf8'));
function independentHours(route){
  const rad=Math.PI/180;
  const arc=(a,b)=>6371*Math.acos(Math.max(-1,Math.min(1,Math.sin(a.lat*rad)*Math.sin(b.lat*rad)+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.cos((a.lon-b.lon)*rad))));
  const points=[route.origin,...route.waypoints,route.destination];
  return (points.slice(1).reduce((sum,p,i)=>sum+arc(points[i],p),0)-arc(route.origin,route.destination))/860;
}
const results=[],errors=[],requests=[],layout=[],cameraChecks=[],consoleIssues=[],networkIssues=[],accessibility=[];
let activeCheck='startup';
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
const executable=[process.env.BROWSER_PATH,'C:/Program Files/Google/Chrome/Application/chrome.exe','C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe','/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean).find(existsSync);
if(!executable)throw Error('Chrome or Edge required');
const child=spawn(executable,['--headless=new','--remote-debugging-port=9222','--remote-allow-origins=http://localhost:9222','--user-data-dir='+resolve(root,'.browser-profile'),'--no-first-run','--no-default-browser-check','--use-angle=swiftshader','--enable-unsafe-swiftshader','about:blank'],{windowsHide:true,stdio:'ignore'});
child.on('error',e=>errors.push(String(e)));
let socket,id=0;const pending=new Map();
const pause=ms=>new Promise(r=>setTimeout(r,ms));
function cdp(method,params={}){return new Promise((resolve,reject)=>{const seq=++id;const timer=setTimeout(()=>{pending.delete(seq);reject(Error('CDP timeout: '+method));},15000);pending.set(seq,{resolve,reject,timer});socket.send(JSON.stringify({id:seq,method,params}));});}
async function evaluate(expression){const r=await cdp('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;}
async function check(name,fn){activeCheck=name;await fn();results.push({name,result:'passed'});console.log('PASS',name);}
async function screenshot(name){const shot=await cdp('Page.captureScreenshot',{format:'png'});await writeFile(resolve(artifacts,name),Buffer.from(shot.data,'base64'));}
async function clickButton(selector){
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).scrollIntoView({block:'nearest',inline:'nearest'})`);
  // Wait for the presentation's 180 ms slide transition and browser hit-test tree.
  await pause(220);
  await evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)))');
  const point=await evaluate(`(()=>{const button=document.querySelector(${JSON.stringify(selector)});const r=button.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;return {x,y,hit:document.elementFromPoint(x,y)?.closest('button')===button,stack:document.elementsFromPoint(x,y).slice(0,6).map(e=>e.tagName+'#'+e.id+'.'+e.className),inert:button.closest('section')?.inert,visibility:getComputedStyle(button).visibility,disabled:button.disabled,pointerEvents:getComputedStyle(button).pointerEvents}})()`);
  assert(point.hit,'Button is intercepted by another element: '+selector+' '+JSON.stringify(point));
  assert.notEqual(point.pointerEvents,'none','Pointer events disabled: '+selector);
  await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x,y:point.y});
  await cdp('Input.dispatchMouseEvent',{type:'mousePressed',x:point.x,y:point.y,button:'left',clickCount:1});
  await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.x,y:point.y,button:'left',clickCount:1});
  return point;
}
try{
  let targets;
  for(let i=0;i<100;i++){try{targets=await(await fetch('http://127.0.0.1:9222/json')).json();if(targets.length)break;}catch{}await pause(150);}
  assert(targets?.length,'Browser debugging endpoint unavailable');
  socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((r,j)=>{socket.addEventListener('open',r,{once:true});socket.addEventListener('error',j,{once:true});});
  socket.addEventListener('message',event=>{const data=JSON.parse(event.data);if(data.id){const p=pending.get(data.id);if(!p)return;pending.delete(data.id);clearTimeout(p.timer);if(data.error)p.reject(Error(JSON.stringify(data.error)));else p.resolve(data.result);}else if(data.method==='Runtime.exceptionThrown')errors.push(data.params.exceptionDetails);else if(data.method==='Network.requestWillBeSent')requests.push(data.params.request.url);else if(data.method==='Runtime.consoleAPICalled'&&['error','warning'].includes(data.params.type))consoleIssues.push({check:activeCheck,type:data.params.type,text:data.params.args.map(a=>a.value||a.description).join(' ')});else if(data.method==='Network.loadingFailed')networkIssues.push({check:activeCheck,error:data.params.errorText,blocked:data.params.blockedReason});else if(data.method==='Network.responseReceived'&&data.params.response.status>=400)networkIssues.push({check:activeCheck,url:data.params.response.url,status:data.params.response.status});});
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
  await check('V4 modal focus, inactive slides and native keyboard buttons',async()=>{
    await evaluate('goToSlide(0);document.getElementById("shortcutsTrigger").focus();document.getElementById("shortcutsTrigger").click()');
    assert.equal(await evaluate('document.activeElement.id'),'shortcutsClose');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
    assert.equal(await evaluate('document.activeElement.id'),'shortcutsClose');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});
    assert.equal(await evaluate('document.activeElement.id'),'shortcutsTrigger');
    assert.equal(await evaluate('document.querySelectorAll("section.slide[inert]").length'),9);
    await evaluate('document.getElementById("btnNext").focus()');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
    await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});
    assert.equal(await evaluate('currentSlide'),1,'Space on Next must advance exactly once');
    await evaluate('document.activeElement.blur()');
  });
  await check('fullscreen enters and exits with a user gesture',async()=>{
    await cdp('Runtime.evaluate',{expression:'toggleFullScreen()',userGesture:true});await pause(300);
    assert(await evaluate('!!document.fullscreenElement'));
    await evaluate('document.exitFullscreen()');assert(!await evaluate('document.fullscreenElement'));
    await cdp('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});await pause(350);
    await evaluate('document.activeElement.blur()');
    for(const expected of [true,false]){
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'f',code:'KeyF',text:'f',windowsVirtualKeyCode:70});
      await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'f',code:'KeyF',windowsVirtualKeyCode:70});await pause(200);
      assert.equal(await evaluate('!!document.fullscreenElement'),expected,'F key fullscreen toggle');
    }

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
  await check('V4 cost decomposition, route-hour shortcut and reset preserve model',async()=>{
    const parseMoney=text=>Number(text.replace(/[^0-9.]/g,''));
    for(const hours of [.5,5])for(const price of [1.5,4.5]){
      await evaluate(`document.getElementById('inputExtraHours').value='${hours}';document.getElementById('inputFuelPrice').value='${price}';recalcCostSimulator()`);
      const expectedFuel=hours*7500/.8/3.785411784*price,expectedOther=hours*2200;
      assert.equal(parseMoney(await evaluate('document.getElementById("fuelCostValue").textContent')),Math.round(expectedFuel));
      assert.equal(parseMoney(await evaluate('document.getElementById("otherCostValue").textContent')),expectedOther);
      assert.equal(parseMoney(await evaluate('document.getElementById("resFlightCost").textContent')),Math.round(expectedFuel+expectedOther));
      assert(Math.abs(await evaluate('parseFloat(document.getElementById("fuelCostBar").style.width)+parseFloat(document.getElementById("otherCostBar").style.width)')-100)<.01);
    }
    await evaluate('chooseGlobeRoute("hel-icn");useSelectedRouteHours()');assert.equal(await evaluate('document.getElementById("inputExtraHours").value'),'4.7');
    await evaluate('resetCostInputs()');assert.equal(await evaluate('document.getElementById("inputExtraHours").value'),'3.2');assert.equal(await evaluate('document.getElementById("inputFuelPrice").value'),'2.8');
  });
  await check('2 scenarios × 4 strategies × 3 prices; suspension punctuality N/A',async()=>{
    const costs=[];
    for(const scenario of ['siberia','mideast'])for(let strategy=0;strategy<4;strategy++)for(const price of ['moderate','high','spike']){
      await evaluate(`goToSlide(8);document.getElementById('simScenarioSelect').value='${scenario}';document.getElementById('simOilPrice').value='${price}';document.querySelectorAll('.sim-option-card')[${strategy}].click()`);
      assert(!await evaluate('/NaN|undefined/.test(document.getElementById("simDebriefText").textContent)'));
      assert.equal(await evaluate('document.querySelectorAll("#strategyComparison tr").length'),4);
      assert.equal(await evaluate('document.querySelector("#strategyComparison tr[aria-current=true] td:nth-child(2)").textContent'),await evaluate('document.getElementById("simStatCost").textContent'));
      const hours=independentHours(fixture.routes[scenario==='siberia'?'lhr-hnd':'fra-sin']);
      const unitRate=7500/.8/3.785411784*({moderate:2.2,high:2.8,spike:3.8}[price])+2200;
      const expected=[hours*unitRate,(hours+.5)*unitRate+4500,0,scenario==='siberia'?10000:8500][strategy];
      assert.equal(await evaluate('document.getElementById("simStatCost").textContent'),'$'+Math.round(expected).toLocaleString('en-US'));
      const scores=scenario==='siberia'?[[74,88],[62,68],[null,0],[82,55]]:[[84,91],[72,78],[null,0],[86,65]];
      assert.equal(await evaluate('document.getElementById("simStatReliability").textContent'),scores[strategy][0]===null?'N/A':scores[strategy][0]+'%');
      assert.equal(await evaluate('document.getElementById("simStatMarket").textContent'),scores[strategy][1]+'%');
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
  await check('V4 keyboard globe rotation and zoom',async()=>{
    await evaluate('document.getElementById("globeCanvas").focus()');
    const before=await evaluate('camera.position.toArray().join()');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'d',code:'KeyD'});assert.notEqual(await evaluate('camera.position.toArray().join()'),before);
    const distance=await evaluate('camera.position.length()');await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'+',code:'Equal'});
    assert(await evaluate('camera.position.length()')<distance);assert.equal(await evaluate('currentSlide'),5);
    await evaluate('resetGlobeCamera();document.activeElement.blur()');
  });
  await check('V4 Start, case selected states and modifier-safe navigation',async()=>{
    await evaluate('goToSlide(0)');await clickButton('.hero-start');assert.equal(await evaluate('currentSlide'),1);
    await evaluate('goToSlide(3)');
    for(const index of [1,0]){
      await clickButton('.tab-btn:nth-child('+(index+1)+')');
      assert.equal(await evaluate('document.querySelectorAll(".tab-btn[aria-pressed=true]").length'),1);
      assert(await evaluate(`!document.getElementById('case-${index?'mideast':'russia'}').hidden`));
    }
    await evaluate('document.querySelectorAll(".tab-btn")[1].focus()');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',text:'\r',windowsVirtualKeyCode:13});
    await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13});await pause(150);
    assert(await evaluate('document.querySelectorAll(".tab-btn")[1].getAttribute("aria-pressed")==="true"'));
    await evaluate('goToSlide(2);document.activeElement.blur()');
    for(const modifiers of [2,4,1]){await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'0',code:'Digit0',modifiers});assert.equal(await evaluate('currentSlide'),2);}
    for(const [key,target] of [['Home',0],['End',9],['1',0],['9',8],['0',9],['PageUp',8],['PageDown',9],['ArrowLeft',8],['ArrowRight',9]]){
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key,code:key});assert.equal(await evaluate('currentSlide'),target);
    }

    for(let n=1;n<=9;n++){
      await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:String(n),code:'Digit'+n});assert.equal(await evaluate('currentSlide'),n-1);
    }
    await evaluate('goToSlide(0);document.activeElement.blur()');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
    await cdp('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space',windowsVirtualKeyCode:32});assert.equal(await evaluate('currentSlide'),1,'Space on slide background advances once');
    await evaluate('goToSlide(9)');await clickButton('#slide-9>.nav-btn');assert.equal(await evaluate('currentSlide'),0,'Return to Start native pointer click');
    await evaluate('goToSlide(4)');
    for(const key of ['lhr-hnd' ,'fra-sin','hel-icn']){
      await evaluate(`chooseGlobeRoute('${key}')`);
      assert.equal(await evaluate('document.getElementById("globeRouteSelect").value'),key);
      assert.equal(await evaluate('document.getElementById("routeSelector").value'),key);
      assert(Math.abs(independentHours(fixture.routes[key])-fixture.routes[key].extraHours)<1e-8);
    }
    await evaluate('goToSlide(5)');await pause(400);
  });
  await check('V4 native touch/keyboard strategy selection and range keyboard input',async()=>{
    await evaluate('goToSlide(8);document.querySelectorAll(".sim-option-card")[1].focus()');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space',windowsVirtualKeyCode:32});
    assert.equal(await evaluate('currentStrategy'),'techstop');assert.equal(await evaluate('currentSlide'),8);
    const point=await evaluate('(()=>{const r=document.querySelectorAll(".sim-option-card")[3].getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()');
    await cdp('Emulation.setTouchEmulationEnabled',{enabled:true});
    await cdp('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[point]});
    await cdp('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await pause(250);
    assert.equal(await evaluate('currentStrategy'),'codeshare');
    await cdp('Emulation.setTouchEmulationEnabled',{enabled:false});
    await evaluate('goToSlide(6);resetCostInputs();document.getElementById("inputFuelPrice").focus()');
    await cdp('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
    assert.equal(await evaluate('document.getElementById("inputFuelPrice").value'),'2.9');assert.equal(await evaluate('currentSlide'),6);
    await evaluate('resetCostInputs();document.activeElement.blur();goToSlide(5)');
  });
  await check('V4 semantic palette contrast, focus, targets and hero provenance',async()=>{
    const values=await evaluate(`(()=>{const s=getComputedStyle(document.documentElement);return Object.fromEntries(['--bg-deep','--bg-card','--text-main','--text-muted','--accent-cyan'].map(k=>[k,s.getPropertyValue(k).trim()]))})()`);
    const lum=h=>{const c=h.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;};
    const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
    for(const foreground of ['--text-main','--text-muted','--accent-cyan'])for(const background of ['--bg-deep','--bg-card']){
      const ratio=contrast(values[foreground],values[background]);accessibility.push({foreground,background,ratio});assert(ratio>=4.5);
    }
    assert(contrast(values['--bg-deep'],values['--accent-cyan'])>=4.5);
    assert(await evaluate('[...document.querySelectorAll(".dot-item")].every(e=>{const r=e.getBoundingClientRect();return r.width>=24&&r.height>=24})'));
    await evaluate('document.getElementById("btnNext").focus()');
    assert.equal(await evaluate('getComputedStyle(document.getElementById("btnNext")).outlineStyle'),'solid');
    assert.equal(await evaluate('getComputedStyle(document.getElementById("btnNext")).outlineWidth'),'3px');
    assert.equal(await evaluate('document.querySelector(".hero-tagline").textContent'),'The Impact of Geopolitical Conflicts on Global Aviation');
    assert.match(await evaluate('document.querySelector(".hero-art-credit").textContent'),/AI-generated.*not verified/);
    const response=await fetch('http://127.0.0.1:8765/assets/hero-v4.jpg');assert(response.ok);assert(Number(response.headers.get('content-length'))<500000);
    assert.deepEqual(consoleIssues,[],'Unexpected normal-mode console warnings/errors');assert.deepEqual(networkIssues,[],'Unexpected normal-mode failed assets');
    await evaluate('document.activeElement.blur()');
  });
  await check('missing OrbitControls disables all camera buttons with accessible 2D fallback',async()=>{
    await cdp('Network.setBlockedURLs',{urls:['*OrbitControls.js']});await cdp('Page.reload');await pause(700);
    await evaluate('goToSlide(5)');await pause(350);
    const state=await evaluate('({mapMode,initialized:globeInitialized,controls:!!controls,buttons:[...document.querySelectorAll("[title=\\"Reset Camera View\\"],[aria-label=\\"Zoom in on globe\\"],[aria-label=\\"Zoom out on globe\\"]")].map(button=>({label:button.title||button.getAttribute("aria-label"),disabled:button.disabled})),message:document.getElementById("globeStatus").textContent})');
    cameraChecks.push({missingOrbitControls:state});console.log('CAMERA FALLBACK',JSON.stringify(state));
    assert(state.mapMode);assert(state.buttons.every(button=>button.disabled));assert.match(state.message,/3D|camera/i);
    await cdp('Network.setBlockedURLs',{urls:[]});await cdp('Page.reload');await pause(700);await evaluate('goToSlide(5)');
  });
  await check('camera buttons respond to actual pointer clicks and reset rotation/zoom',async()=>{
    if(await evaluate('spin'))await clickButton('#rotateGlobe');
    for(const route of ['lhr-hnd','fra-sin','hel-icn']){
      await evaluate(`chooseGlobeRoute('${route}')`);await pause(600);
      const initial=await evaluate('({position:camera.position.toArray(),distance:camera.position.distanceTo(controls.target),mapMode,ready:globeInitialized&&!webglLost,controls:!!controls})');
      await clickButton('[aria-label="Zoom in on globe"]');await pause(150);
      const zoomIn=await evaluate('camera.position.distanceTo(controls.target)');
      await clickButton('[aria-label="Zoom out on globe"]');await pause(150);
      const zoomOut=await evaluate('camera.position.distanceTo(controls.target)');
      await clickButton('[title="Reset Camera View"]');await pause(200);
      const resetZoom=await evaluate('camera.position.distanceTo(controls.target)');
      const point=await evaluate('(()=>{const r=document.getElementById("globeCanvas").getBoundingClientRect();return{x:r.left+r.width*.55,y:r.top+r.height*.5}})()');
      await cdp('Input.dispatchMouseEvent',{type:'mousePressed',...point,button:'left',clickCount:1});
      await cdp('Input.dispatchMouseEvent',{type:'mouseMoved',x:point.x+90,y:point.y+30,button:'left',buttons:1});
      await cdp('Input.dispatchMouseEvent',{type:'mouseReleased',x:point.x+90,y:point.y+30,button:'left',clickCount:1});
      const rotated=await evaluate('camera.position.toArray()');
      await clickButton('[title="Reset Camera View"]');await pause(350);
      const resetPosition=await evaluate('camera.position.toArray()');
      const difference=(a,b)=>Math.hypot(...a.map((value,i)=>value-b[i]));
      cameraChecks.push({route,initial,zoomIn,zoomOut,resetZoom,rotated,resetPosition,resetError:difference(initial.position,resetPosition)});
      console.log('CAMERA',JSON.stringify(cameraChecks.at(-1)));
      assert(zoomIn<initial.distance*.9,'+ must visibly zoom in');
      assert(zoomOut>zoomIn*1.1,'- must visibly zoom out');
      assert(Math.abs(resetZoom-initial.distance)<.02,'Reset must restore the default distance');
      assert(difference(initial.position,rotated)>.5,'Pointer drag must rotate the camera before reset');
      assert(difference(initial.position,resetPosition)<.02,'Reset must clear pending damping and restore the default position');
    }
  });
  await check('2D mode disables all camera buttons and restores them in 3D',async()=>{
    const before=await evaluate('camera.position.toArray()');
    await clickButton('#mapToggle');assert(await evaluate('mapMode'));
    assert(await evaluate('[...document.querySelectorAll("[data-globe-only]")].every(button=>button.disabled&&button.getAttribute("aria-describedby")==="globeStatus")'));
    assert.match(await evaluate('document.getElementById("globeStatus").textContent'),/2D.*disabled/);
    for(const selector of ['#resetGlobe','[aria-label="Zoom in on globe"]','[aria-label="Zoom out on globe"]'])await clickButton(selector);
    assert.deepEqual(await evaluate('camera.position.toArray()'),before,'Disabled 2D controls must not move the hidden camera');
    await clickButton('#mapToggle');assert(!await evaluate('mapMode'));assert(await evaluate('[...document.querySelectorAll("[data-globe-only]")].every(button=>!button.disabled)'));
    await clickButton('[aria-label="Zoom in on globe"]');assert(await evaluate('camera.position.length()')<Math.hypot(...before));
    await clickButton('#resetGlobe');
  });
  await check('V4 projector layouts and readable primary text',async()=>{
    for(const [width,height] of [[1280,720],[1366,768],[1920,1080]]){
      await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
      for(let i=0;i<10;i++){
        await evaluate(`goToSlide(${i});document.getElementById('slide-${i}').scrollTop=0`);await pause(120);
        const metrics=await evaluate(`(()=>{const el=document.getElementById('slide-${i}');return {slide:${i+1},width:innerWidth,height:innerHeight,contentHeight:el.scrollHeight,availableHeight:el.clientHeight,overflowX:el.scrollWidth>el.clientWidth+1,bodyFont:parseFloat(getComputedStyle(document.body).fontSize)}})()`);
        layout.push(metrics);assert(!metrics.overflowX);assert(metrics.bodyFont>=17);
        if(width===1366){await pause(180);await screenshot(`v4-slide-${String(i+1).padStart(2,'0')}-projector.png`);}
      }
    }
    const overflowing=layout.filter(item=>item.contentHeight>item.availableHeight+2);
    assert.equal(overflowing.length,0,'Default projector slides require vertical scrolling: '+JSON.stringify(overflowing));
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
  await check('V4 expanded disclosures remain reachable without horizontal clipping',async()=>{
    for(const [width,height] of [[1366,768],[390,844],[683,384]]){
      await cdp('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
      for(const slide of [4,5,6,8,9]){
        await evaluate(`goToSlide(${slide});document.querySelectorAll('#slide-${slide} details').forEach(e=>e.open=true)`);await pause(150);
        assert(await evaluate(`document.getElementById('slide-${slide}').scrollWidth<=document.getElementById('slide-${slide}').clientWidth+1`),'Expanded disclosure overflow');
        await evaluate(`document.querySelectorAll('#slide-${slide} details').forEach(e=>e.open=false)`);
      }
    }
    await cdp('Emulation.setDeviceMetricsOverride',{width:1366,height:768,deviceScaleFactor:1,mobile:false});
  });
  await check('reduced motion pauses rotation by default after reload',async()=>{
    await cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await cdp('Page.reload');await pause(800);assert.equal(await evaluate('spin'),false);
  });
  await check('presentation requests no external runtime resources',async()=>{assert(!requests.some(u=>/^https?:/.test(u)&&!u.startsWith('http://127.0.0.1:8765/')));});
  await check('V4 retained academic links and expandable conclusions',async()=>{
    await evaluate('goToSlide(9);document.querySelector(".source-register").open=true');
    assert.equal(await evaluate('document.querySelectorAll("#slide-9 .source-register a[href^=https]").length'),6);
    assert.match(await evaluate('document.querySelector(".conclusion-callout").textContent'),/safety/);
    await evaluate('document.querySelector(".source-register").open=false');
  });
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
  await check('V4 actual WebGL context loss preserves the 2D route comparison',async()=>{
    await evaluate('goToSlide(5)');await pause(400);
    await evaluate('renderer.getContext().getExtension("WEBGL_lose_context").loseContext()');await pause(400);
    assert(await evaluate('mapMode && webglLost'));
    assert(await evaluate('[...document.querySelectorAll("[data-globe-only]")].every(button=>button.disabled)'));
    assert.match(await evaluate('document.getElementById("globeStatus").textContent'),/disabled/);
    await evaluate('chooseGlobeRoute("fra-sin");toggleMapView()');assert(await evaluate('mapMode'));
    assert.equal(await evaluate('selectedRoute'),'fra-sin');
    await cdp('Page.reload');await pause(700);
  });
  await check('WebGL initialization failure disables camera controls and retains the 2D map',async()=>{
    const {identifier}=await cdp('Page.addScriptToEvaluateOnNewDocument',{source:'const nativeContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /^(webgl2?|experimental-webgl)$/i.test(type)?null:nativeContext.call(this,type,...args)};'});
    await cdp('Page.reload');await pause(700);await evaluate('goToSlide(5)');await pause(350);
    assert(await evaluate('mapMode&&!globeInitialized'));
    assert(await evaluate('[...document.querySelectorAll("[data-globe-only]")].every(button=>button.disabled)'));
    assert.match(await evaluate('document.getElementById("globeStatus").textContent'),/WebGL.*disabled/);
    const before=await evaluate('camera.position.toArray()');
    for(const selector of ['#resetGlobe','[aria-label="Zoom in on globe"]','[aria-label="Zoom out on globe"]'])await clickButton(selector);
    assert.deepEqual(await evaluate('camera.position.toArray()'),before);
    await evaluate('chooseGlobeRoute("fra-sin")');assert.equal(await evaluate('selectedRoute'),'fra-sin');
    assert(await evaluate('document.getElementById("mapCanvas").width>0&&getComputedStyle(document.getElementById("mapCanvas")).display!=="none"'));
    await cdp('Page.removeScriptToEvaluateOnNewDocument',{identifier});await cdp('Page.reload');await pause(700);
  });
  await check('missing Three.js falls back to 2D with explanatory text',async()=>{
    await evaluate('window.THREE=undefined;goToSlide(5)');assert(await evaluate('mapMode'));assert.match(await evaluate('document.getElementById("globeStatus").textContent'),/unavailable/);
    assert(await evaluate('[...document.querySelectorAll("[data-globe-only]")].every(button=>button.disabled)'));
    await evaluate('useSelectedRouteHours()');assert(!await evaluate('/NaN/.test(document.getElementById("resFlightCost").textContent)'));
  });
  assert.deepEqual(errors,[],'Unexpected JavaScript exceptions');
}catch(error){results.push({name:'failure',result:'failed',detail:String(error)});console.error(error);try{await screenshot('browser-failure.png');}catch{}process.exitCode=1;}
finally{
  const report=sanitizeReport({browser:basename(executable),mode:'headless; software WebGL (SwiftShader)',results,errors,layout,cameraChecks,consoleIssues,networkIssues,accessibility,requests:[...new Set(requests)]});
  await writeFile(resolve(artifacts,'browser-results.json'),JSON.stringify(report,null,2)+'\n');
  if(socket?.readyState===WebSocket.OPEN){try{await cdp('Browser.close');}catch{}socket.close();}
  child.kill();server.close();
}
