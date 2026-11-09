/* Version 2 model and geography. Original navigation and case tabs remain in index.html. */
'use strict';
const model = window.PRESENTATION_DATA;
const geography = window.COUNTRIES;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const money = n => '$' + Math.round(n).toLocaleString('en-US');
const km = n => Math.round(n).toLocaleString('en-US') + ' km';
const put = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
let globeInitialized = false, isGlobeRenderingActive = false;
let scene, camera, renderer, controls, earthMesh, routeGroup, atmosphere;
let selectedRoute = 'lhr-hnd', mapMode = false, spin = !reducedMotion.matches, webglLost = false;
let cameraFailure = '';
let airportLabels = [], geographicLabels = [], movingMarker, movingPoints = [], lastFrame = 0;
let currentStrategy = 'reroute';
const R = 12;
// Shared CSS tokens keep 3D, 2D and HTML legends consistent. No model parameters here.
const theme = getComputedStyle(document.documentElement);
const visual = Object.freeze({baseline:theme.getPropertyValue('--route-baseline').trim(),detour:theme.getPropertyValue('--route-detour').trim()});
const regionCodes = { russia: ['RUS','UKR'], mideast: ['IRN','IRQ','ISR','JOR','LBN'] };
const countryNames = { RUS:'Russia', UKR:'Ukraine', IRN:'Iran', IRQ:'Iraq', ISR:'Israel', JOR:'Jordan', LBN:'Lebanon' };
const countryCenters = {RUS:[95,61],UKR:[31,49],IRN:[54,32],IRQ:[44,33],ISR:[35,31],JOR:[37,29],LBN:[36,34]};

function modelCost(hours, price) {
  const a = model.assumptions;
  return hours * (a.fuelKgPerHour / a.densityKgPerLitre / a.litresPerUSGallon * price + a.otherUSDPerHour);
}
function routePoints(route) { return [route.origin, ...route.waypoints, route.destination]; }
function updateRouteMetrics() {
  if (!model) return;
  selectedRoute = document.getElementById('routeSelector').value;
  const r = model.routes[selectedRoute];
  if (!r) return;
  put('dispDirectDist', km(r.directKm)); put('dispDetourDist', km(r.detourKm));
  put('dispDistDelta', '+'+km(r.extraKm)+' ('+r.extraPercent.toFixed(1)+'%)');
  put('dispTimeDelta', '+'+r.extraHours.toFixed(2)+' hours'); put('dispCostDelta', '+'+money(r.extraCostUSD));
  put('routeReading',`${km(r.extraKm)} farther · ${r.extraPercent.toFixed(1)}% longer · ${r.extraHours.toFixed(2)} extra modeled hours. Both bars start at zero.`);
  put('routeWaypoints', routePoints(r).map(p=>p.code || p.name).join(' → '));
  put('globeDistanceSummary',km(r.directKm)+' baseline → '+km(r.detourKm)+' illustrative detour');
  document.querySelector('.route-chart').setAttribute('aria-label',`${km(r.directKm)} baseline; ${km(r.detourKm)} illustrative detour. Extra ${km(r.extraKm)}, ${r.extraPercent.toFixed(1)} percent. Both bars start at zero.`);
  document.getElementById('baselineBar').style.width = (100*r.directKm/r.detourKm)+'%';
  put('baselineBarValue',km(r.directKm)); put('detourBarValue',km(r.detourKm));
  document.getElementById('globeRouteSelect').value = selectedRoute;
  put('useRouteHours','Use '+r.origin.code+'–'+r.destination.code+' hours');
  renderScenarioRoutes(r.scenario);
}
function recalcCostSimulator() {
  if (!model) return;
  const price = Number(document.getElementById('inputFuelPrice').value);
  const hours = Number(document.getElementById('inputExtraHours').value);
  if (!Number.isFinite(price) || !Number.isFinite(hours) || price < 0 || hours < 0) return;
  const a = model.assumptions, cost = modelCost(hours, price);
  put('valFuelPrice', '$'+price.toFixed(2)); put('valExtraHours',hours.toFixed(1)+' hrs');
  put('resFlightCost',money(cost)); put('resAnnualCost',money(cost*a.annualSectors));
  put('resCO2',(hours*a.fuelKgPerHour*a.co2KgPerKgFuel/1000).toFixed(1)+' tonnes CO₂');
  const fuel=hours*a.fuelKgPerHour/a.densityKgPerLitre/a.litresPerUSGallon*price;
  const other=hours*a.otherUSDPerHour;
  document.getElementById('fuelCostBar').style.width=(cost>0?100*fuel/cost:0)+'%';
  document.getElementById('otherCostBar').style.width=(cost>0?100*other/cost:0)+'%';
  put('fuelCostValue',money(fuel));put('otherCostValue',money(other));
  document.getElementById('costBreakdown').setAttribute('aria-label',`Incremental expense per flight: fuel ${money(fuel)}, other operations ${money(other)}, total ${money(cost)}. Assumptions, not actual airline costs.`);
  put('costReading',`Incremental expense; annual estimate = one flight × ${a.annualSectors} identical sectors.`);
}
function useSelectedRouteHours(){
  const input=document.getElementById('inputExtraHours');
  input.value=Math.max(Number(input.min),Math.min(Number(input.max),Number(model.routes[selectedRoute].extraHours.toFixed(1))));
  recalcCostSimulator();
  put('costReading',`Using ${selectedRoute.toUpperCase()} extra hours, rounded to the slider's 0.1-hour step. Model assumptions are unchanged.`);
}
function resetCostInputs(){
  document.getElementById('inputFuelPrice').value='2.8';document.getElementById('inputExtraHours').value='3.2';recalcCostSimulator();
}
function selectSimOption(card, strategy) {
  document.querySelectorAll('.sim-option-card').forEach(c=>{
    c.classList.toggle('selected',c===card); c.setAttribute('aria-pressed',String(c===card));
  });
  currentStrategy = strategy; runSimulation();
}
function runSimulation() {
  if (!model) return;
  const route = model.routes[document.getElementById('simScenarioSelect').value === 'siberia' ? 'lhr-hnd':'fra-sin'];
  const price = {moderate:2.2, high:2.8, spike:3.8}[document.getElementById('simOilPrice').value];
  const base = modelCost(route.extraHours,price);
  // These scores are explicitly hypothetical teaching inputs, not forecasts.
  const short = route.scenario === 'mideast';
  const strategies = {
    reroute: {cost:base, reliability:short?84:74, retention:short?91:88, title:'Continue with an illustrative detour', text:'Preserves nonstop service, but adds fuel and operating expense. Feasibility still depends on aircraft, crew, permissions and a separate safety assessment.'},
    techstop: {cost:base+modelCost(0.5,price)+4500, reliability:short?72:62, retention:short?78:68, title:'Add a technical stop', text:'Assumes 0.5 additional airborne hours, a 75-minute ground stop and a $4,500 handling charge. Possible payload benefits are not quantified; no automatic crew exemption is assumed.'},
    suspend: {cost:0, reliability:null, retention:0, title:'Suspend the modeled service', text:'No flight is operated, so punctuality is not applicable. Zero refers only to incremental flight cost; refunds, fixed costs and lost revenue are excluded. Slot outcomes depend on applicable rules and relief.'},
    codeshare: {cost:8500+(short?0:1500), reliability:short?86:82, retention:short?65:55, title:'Arrange partner carriage', text:'Assumes an $8,500 partner fee plus $1,500 for the long-haul scenario. Partner availability, permissions and safety review remain necessary; this is not a way to bypass restrictions.'}
  };
  const s = strategies[currentStrategy];
  put('simContext',`${route.origin.code} → ${route.destination.code} · +${route.extraHours.toFixed(2)} modeled hours · $${price.toFixed(2)}/US gal fuel`);
  const difference=s.cost-base;
  put('simTradeoff',currentStrategy==='suspend'?'No flight operated; zero flying expense excludes wider business losses.':difference===0?'Reference response: the modeled nonstop detour.':`Expense vs nonstop detour: ${money(Math.abs(difference))} ${difference<0?'less':'more'} (estimate).`);
  const body=document.getElementById('strategyComparison');body.replaceChildren();
  for(const [key,value] of Object.entries(strategies)){
    const row=document.createElement('tr');row.dataset.strategy=key;row.setAttribute('aria-current',String(key===currentStrategy));
    for(const text of [{reroute:'A · Detour',techstop:'B · Stop',suspend:'C · Suspend',codeshare:'D · Partner'}[key],money(value.cost),value.reliability===null?'N/A':value.reliability+'%',value.retention+'%']){
      const cell=document.createElement('td');cell.textContent=text;row.appendChild(cell);
    }
    body.appendChild(row);
  }
  put('simStatCost',money(s.cost)); put('simStatReliability',s.reliability===null?'N/A':s.reliability+'%');
  put('simStatMarket',s.retention+'%'); put('simRatingBadge','Simulated outcome'); put('simDebriefTitle',s.title);
  const summaries={reroute:'Preserve nonstop service; accept extra flying time and expense. Feasibility needs a separate review.',techstop:'Add a stop, flying time and handling fees. No automatic payload or crew benefit is assumed.',suspend:'Operate no flight. Refunds, fixed costs and lost revenue are outside the model.',codeshare:'Use partner carriage with assumed fees. Permissions, availability and safety still need review.'};
  put('simDebriefText',summaries[currentStrategy]);put('simFullFeedback',s.text);
  put('simAssumptions',`${route.origin.code} → ${route.destination.code}: ${route.extraHours.toFixed(2)} modeled extra hours. Jet fuel $${price.toFixed(2)}/US gal; 7,500 kg/h; density 0.8 kg/L; other operations $2,200/h. Reliability and retention are invented scenario scores, not measured probabilities. No revenue or profit is calculated.`);
}

function latLonToVector3(lat,lon,radius=R) {
  const phi=lat*Math.PI/180, theta=lon*Math.PI/180;
  return new THREE.Vector3(radius*Math.cos(phi)*Math.cos(theta),radius*Math.sin(phi),-radius*Math.cos(phi)*Math.sin(theta));
}
function sphericalPoints(a,b,elevation=0) {
  const av=latLonToVector3(a.lat,a.lon,1), bv=latLonToVector3(b.lat,b.lon,1);
  const angle=Math.acos(THREE.MathUtils.clamp(av.dot(bv),-1,1)), points=[];
  const tangent=bv.clone().addScaledVector(av,-av.dot(bv));
  if(tangent.length()<1e-8) tangent.crossVectors(av,Math.abs(av.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0));
  tangent.normalize();
  for(let i=0;i<=100;i++) {
    const t=i/100;
    points.push(av.clone().multiplyScalar(Math.cos(angle*t)).addScaledVector(tangent,Math.sin(angle*t)).normalize().multiplyScalar(R+.06+Math.sin(Math.PI*t)*elevation));
  }
  return points;
}
function rings(feature) {
  return feature.geometry.type==='Polygon' ? [feature.geometry.coordinates] : feature.geometry.coordinates;
}
function countryCode(feature) { return feature.properties.ADM0_A3; }
function drawGeography(ctx,width,height,scenario) {
  const project=([lon,lat])=>[(lon+180)/360*width,(90-lat)/180*height];
  const ocean=ctx.createLinearGradient(0,0,0,height); ocean.addColorStop(0,'#09203b'); ocean.addColorStop(.5,'#123957'); ocean.addColorStop(1,'#09203b');
  ctx.fillStyle=ocean; ctx.fillRect(0,0,width,height);
  ctx.strokeStyle='#73b9d522'; ctx.lineWidth=1;
  for(let lon=-180;lon<=180;lon+=30){const x=(lon+180)/360*width;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}
  for(let lat=-60;lat<=60;lat+=30){const y=(90-lat)/180*height;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
  if(!geography) return;
  for(const feature of geography.features) {
    const selected=regionCodes[scenario]?.includes(countryCode(feature));
    ctx.fillStyle=selected?'#8c354b':'#345d70'; ctx.strokeStyle=selected?'#ff8c89':'#95c6c9'; ctx.lineWidth=selected?1.5:.65;
    for(const polygon of rings(feature)) {
      ctx.beginPath();
      for(const ring of polygon) ring.forEach((point,i)=>{const [x,y]=project(point); if(i===0)ctx.moveTo(x,y); else ctx.lineTo(x,y);});
      ctx.fill('evenodd'); ctx.stroke();
    }
  }
}
function earthTexture(scenario) {
  const canvas=document.createElement('canvas');canvas.width=2048;canvas.height=1024;
  drawGeography(canvas.getContext('2d'),2048,1024,scenario);
  const texture=new THREE.CanvasTexture(canvas);texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
  return texture;
}
function globeMessage(text) { put('globeStatus',text); }
function hasUsableCamera(){
  return !!(globeInitialized&&camera&&controls&&renderer&&!webglLost&&!renderer.getContext().isContextLost());
}
function updateCameraControls(){
  const usable=hasUsableCamera(),enabled=usable&&!mapMode;
  document.querySelectorAll('[data-globe-only],#rotateGlobe').forEach(button=>button.disabled=!enabled);
  if(enabled)globeMessage('');
  else if(cameraFailure)globeMessage(cameraFailure);
  else if(webglLost)globeMessage('3D rendering was lost. Camera controls are disabled; the 2D map still works. Reload to retry 3D.');
  else if(mapMode&&usable)globeMessage('2D map view: camera controls are disabled. Choose Show 3D globe to rotate, zoom or reset the camera.');
  else globeMessage('3D camera controls are unavailable. Use the 2D map, or reload to retry 3D.');
}
function requireCameraControls(){
  if(hasUsableCamera()&&!mapMode)return true;
  updateCameraControls();return false;
}
function initThreeGlobe() {
  if(globeInitialized) return;
  if(!model || !geography || !window.THREE || typeof THREE.OrbitControls!=='function') {
    cameraFailure=!model||!geography?'Globe data is unavailable. Restore the local geographic data and reload.':!window.THREE?'The 3D library is unavailable. Camera controls are disabled; use the 2D map or reload to retry.':'3D camera controls are unavailable because the control library could not load. The 2D map still works; reload to retry 3D.';
    mapMode=true; updateViewMode(); return;
  }
  try {
    scene=new THREE.Scene();
    camera=new THREE.PerspectiveCamera(42,1,.1,200);
    renderer=new THREE.WebGLRenderer({canvas:document.getElementById('globeCanvas'),antialias:true,alpha:true});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));renderer.outputEncoding=THREE.sRGBEncoding;
    scene.add(new THREE.AmbientLight(0xffffff,.85));
    const key=new THREE.DirectionalLight(0xd8f4ff,.65);key.position.set(15,20,35);scene.add(key);
    earthMesh=new THREE.Mesh(new THREE.SphereGeometry(R,96,64),new THREE.MeshPhongMaterial({map:earthTexture('russia'),shininess:10,specular:0x234257}));
    scene.add(earthMesh);
    const glow=new THREE.ShaderMaterial({transparent:true,side:THREE.BackSide,depthWrite:false,
      uniforms:{},vertexShader:'varying vec3 n; varying vec3 v; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); n=normalize(normalMatrix*normal); v=normalize(-p.xyz); gl_Position=projectionMatrix*p; }',
      fragmentShader:'varying vec3 n; varying vec3 v; void main(){float a=pow(1.0-abs(dot(normalize(n),normalize(v))),3.0); gl_FragColor=vec4(0.18,0.65,1.0,a*0.45);}' });
    atmosphere=new THREE.Mesh(new THREE.SphereGeometry(R*1.035,64,48),glow);scene.add(atmosphere);
    if(THREE.OrbitControls) {
      controls=new THREE.OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.enablePan=false;
      controls.minDistance=19;controls.maxDistance=60;controls.autoRotate=spin;controls.autoRotateSpeed=.35;
    }
    routeGroup=new THREE.Group();scene.add(routeGroup);
    globeInitialized=true;isGlobeRenderingActive=true;
    renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();webglLost=true;mapMode=true;updateViewMode();});
    renderScenarioRoutes(model.routes[selectedRoute].scenario);onWindowResizeGlobe();
    cameraFailure='';mapMode=false;updateViewMode();
    requestAnimationFrame(animateGlobe);
  } catch(error) {
    globeInitialized=false;isGlobeRenderingActive=false;
    controls?.dispose();renderer?.dispose();
    cameraFailure='3D rendering (WebGL) could not initialize. Camera controls are disabled; the 2D map still works. Reload to retry 3D.';
    mapMode=true;updateViewMode();
  }
}
function disposeRoutes() {
  if(!routeGroup)return;
  routeGroup.traverse(obj=>{obj.geometry?.dispose();if(obj.material)obj.material.dispose();});
  routeGroup.clear();airportLabels=[];geographicLabels=[];document.getElementById('globeLabels').replaceChildren();
}
function addRoute(points,color,dashed) {
  if(dashed) {
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineDashedMaterial({color,dashSize:.22,gapSize:.13}));
    line.computeLineDistances();routeGroup.add(line);
  } else {
    const geometry=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),100,.04,5,false);
    routeGroup.add(new THREE.Mesh(geometry,new THREE.MeshBasicMaterial({color})));
  }
}
function renderScenarioRoutes(scenario) {
  if(!model) return;
  const r=model.routes[selectedRoute];
  put('hudScenarioName',r.scenario==='russia'?'Russia / Ukraine context':'Middle East · April 2024 context');
  put('hudRoutePair',r.origin.code+' → '+r.destination.code);
  document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===r.scenario)));
  put('globeRouteDescription',routePoints(r).map(p=>p.code||p.name).join(' → '));
  if(globeInitialized) {
    disposeRoutes();earthMesh.material.map.dispose();earthMesh.material.map=earthTexture(r.scenario);
    addRoute(sphericalPoints(r.origin,r.destination,.55),visual.baseline,true);
    movingPoints=[];
    const waypoints=routePoints(r);
    for(let i=1;i<waypoints.length;i++) {
      const pts=sphericalPoints(waypoints[i-1],waypoints[i],.28);addRoute(pts,visual.detour,false);movingPoints.push(...pts.slice(i===1?0:1));
    }
    for(const p of waypoints) {
      const position=latLonToVector3(p.lat,p.lon,R+.12);
      const marker=new THREE.Mesh(new THREE.SphereGeometry(p.code ? 0.12 : 0.065,12,8),new THREE.MeshBasicMaterial({color:p.code?0xffffff:visual.detour}));
      marker.position.copy(position);routeGroup.add(marker);
      if(p.code) {
        const el=document.createElement('span');el.className='airport-label';el.textContent=p.code;el.title=p.name;
        document.getElementById('globeLabels').appendChild(el);airportLabels.push({position,el});
      }
    }
    for(const code of regionCodes[r.scenario]) {
      // Small adjacent countries share a regional label to avoid unreadable collisions.
      if(['ISR','JOR','LBN'].includes(code)) continue;
      const [lon,lat]=countryCenters[code],el=document.createElement('span');
      el.className='airport-label country-label';el.textContent=countryNames[code];
      document.getElementById('globeLabels').appendChild(el);
      geographicLabels.push({position:latLonToVector3(lat,lon,R+.08),el});
    }
    movingMarker=new THREE.Mesh(new THREE.SphereGeometry(.1,12,8),new THREE.MeshBasicMaterial({color:0xf4f6f8}));routeGroup.add(movingMarker);
    resetGlobeCamera();
  }
  drawMap();
}
function setGlobeScenario(type) {
  chooseGlobeRoute(type==='mideast'?'fra-sin':'lhr-hnd');
}
function chooseGlobeRoute(key) {
  if(!model?.routes[key])return;
  document.getElementById('routeSelector').value=key;updateRouteMetrics();
}
function resetGlobeCamera() {
  if(!requireCameraControls())return;
  const r=model.routes[selectedRoute];
  const halfAngle=Math.atan(Math.tan(camera.fov*Math.PI/360)*Math.min(camera.aspect,1));
  const distance=Math.max(38,R/Math.sin(halfAngle)*1.12);
  const center=latLonToVector3(r.scenario==='russia'?43:23,r.scenario==='russia'?65:48,distance);
  controls.maxDistance=Math.max(65,distance*1.5);
  const damping=controls.enableDamping,autoRotate=controls.autoRotate;
  controls.enableDamping=false;controls.autoRotate=false;
  // Flush OrbitControls' pending rotation/pan/zoom before installing the default.
  controls.update();
  controls.target.set(0,0,0);camera.position.copy(center);camera.zoom=1;
  camera.updateProjectionMatrix();camera.lookAt(0,0,0);controls.update();controls.saveState();
  controls.enableDamping=damping;controls.autoRotate=autoRotate;
  updateCameraControls();
}
function onWindowResizeGlobe() {
  const box=document.querySelector('.globe-stage-container');
  if(renderer&&camera&&box.clientWidth&&box.clientHeight){camera.aspect=box.clientWidth/box.clientHeight;camera.updateProjectionMatrix();renderer.setSize(box.clientWidth,box.clientHeight);resetGlobeCamera();}
  drawMap();
}
function toggleGlobeRotation() {
  spin=!spin;if(controls)controls.autoRotate=spin;
  document.getElementById('rotateGlobe').setAttribute('aria-pressed',String(spin));put('rotateGlobe',spin?'Pause rotation':'Resume rotation');
}
function zoomGlobe(factor){
  if(!requireCameraControls()||!Number.isFinite(factor)||factor<=0)return;
  const offset=camera.position.clone().sub(controls.target);
  offset.setLength(Math.max(controls.minDistance,Math.min(controls.maxDistance,offset.length()*factor)));
  camera.position.copy(controls.target).add(offset);controls.update();updateCameraControls();
}
function toggleMapView(){if(mapMode&&!hasUsableCamera()){updateCameraControls();return;}mapMode=!mapMode;updateViewMode();}
function updateViewMode(){
  document.getElementById('globeCanvas').style.display=mapMode?'none':'block';
  document.getElementById('mapCanvas').style.display=mapMode?'block':'none';
  document.getElementById('globeLabels').style.display=mapMode?'none':'block';
  put('mapToggle',mapMode?'Show 3D globe':'Show 2D map');
  document.getElementById('mapToggle').disabled=mapMode&&!hasUsableCamera();
  document.getElementById('mapToggle').setAttribute('aria-pressed',String(mapMode));drawMap();
  updateCameraControls();
}
function drawMap(){
  if(!model||!geography)return;
  const canvas=document.getElementById('mapCanvas'),box=canvas.parentElement;
  if(!box.clientWidth)return;
  canvas.width=box.clientWidth*2;canvas.height=box.clientHeight*2;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height,r=model.routes[selectedRoute];
  // Letterbox a 2:1 equirectangular map to preserve geographic proportions.
  const mw=Math.min(w,h*2),mh=mw/2,ox=(w-mw)/2,oy=(h-mh)/2;
  ctx.fillStyle='#050e1d';ctx.fillRect(0,0,w,h);ctx.save();ctx.translate(ox,oy);
  drawGeography(ctx,mw,mh,r.scenario);
  const project=p=>[(p.lon+180)/360*mw,(90-p.lat)/180*mh];
  function path(points,color,dashed){
    ctx.strokeStyle=color;ctx.lineWidth=4;ctx.setLineDash(dashed?[12,8]:[]);ctx.beginPath();let last;
    for(const p of points){const xy=project(p);if(!last||Math.abs(xy[0]-last[0])>mw/2)ctx.moveTo(...xy);else ctx.lineTo(...xy);last=xy;}ctx.stroke();ctx.setLineDash([]);
  }
  // Geographic interpolation matches the 3D great-circle paths.
  function interpolate(a,b){
    const rad=Math.PI/180, av=[Math.cos(a.lat*rad)*Math.cos(a.lon*rad),Math.cos(a.lat*rad)*Math.sin(a.lon*rad),Math.sin(a.lat*rad)],bv=[Math.cos(b.lat*rad)*Math.cos(b.lon*rad),Math.cos(b.lat*rad)*Math.sin(b.lon*rad),Math.sin(b.lat*rad)];
    const angle=Math.acos(Math.max(-1,Math.min(1,av.reduce((s,v,i)=>s+v*bv[i],0))));
    if(angle<1e-8)return[a,b];
    return Array.from({length:101},(_,i)=>{const t=i/100,v=av.map((x,j)=>(x*Math.sin((1-t)*angle)+bv[j]*Math.sin(t*angle))/Math.sin(angle));return{lat:Math.atan2(v[2],Math.hypot(v[0],v[1]))/rad,lon:Math.atan2(v[1],v[0])/rad};});
  }
  path(interpolate(r.origin,r.destination),visual.baseline,true);
  const pts=routePoints(r);for(let i=1;i<pts.length;i++)path(interpolate(pts[i-1],pts[i]),visual.detour,false);
  ctx.font='bold 22px sans-serif';
  for(const p of [r.origin,r.destination]){const [x,y]=project(p);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();ctx.fillText(p.code,x+10,y-12);}
  ctx.font='18px sans-serif';ctx.fillStyle='#ffd7d4';
  for(const code of regionCodes[r.scenario]){if(['ISR','JOR','LBN'].includes(code))continue;const [lon,lat]=countryCenters[code];ctx.fillText(countryNames[code],...project({lon,lat}));}
  ctx.restore();
}
function animateGlobe(time){
  requestAnimationFrame(animateGlobe);
  if(!isGlobeRenderingActive||document.hidden||mapMode||time-lastFrame<1000/30)return;
  lastFrame=time;controls?.update();
  if(movingMarker&&movingPoints.length)movingMarker.position.copy(movingPoints[reducedMotion.matches||!spin?0:Math.floor(time/45)%movingPoints.length]);
  renderer.render(scene,camera);
  const box=renderer.domElement.getBoundingClientRect();
  const placed=[];
  for(const {position,el} of [...airportLabels,...geographicLabels]){
    const visible=position.dot(camera.position.clone().sub(position))>0;
    const projected=position.clone().project(camera);
    el.hidden=!visible||Math.abs(projected.x)>1||Math.abs(projected.y)>1;
    if(el.hidden)continue;
    const left=Math.max(5,Math.min(box.width-el.offsetWidth-5,(projected.x+1)/2*box.width+8));
    let top=(-projected.y+1)/2*box.height-16;
    for(let attempt=0;attempt<3;attempt++) {
      if(!placed.some(p=>left<p.right+4&&left+el.offsetWidth>p.left-4&&top<p.bottom+4&&top+el.offsetHeight>p.top-4))break;
      top+=el.offsetHeight+5;
    }
    top=Math.max(5,Math.min(box.height-el.offsetHeight-5,top));
    el.style.left=left+'px';el.style.top=top+'px';
    placed.push({left,right:left+el.offsetWidth,top,bottom:top+el.offsetHeight});
  }
}
window.addEventListener('resize',onWindowResizeGlobe);
window.addEventListener('DOMContentLoaded',()=>{
  initNavigation();
  if(!model){document.querySelectorAll('.stat-value').forEach(el=>el.textContent='Unavailable');put('dataStatus','Model data missing. Restore data/presentation-data.js or run py analysis.py.');return;}
  updateRouteMetrics();recalcCostSimulator();runSimulation();
  const first=model.routes['lhr-hnd'];put('heroDistance','+'+Math.round(first.extraKm).toLocaleString('en-US'));put('heroCost','+'+money(first.extraCostUSD));
  document.querySelectorAll('.sim-option-card').forEach(card=>{
    card.setAttribute('role','button');card.tabIndex=0;card.setAttribute('aria-pressed',String(card.classList.contains('selected')));
    card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();card.click();}});
  });
  document.getElementById('rotateGlobe').setAttribute('aria-pressed',String(spin));put('rotateGlobe',spin?'Pause rotation':'Resume rotation');
  document.getElementById('globeCanvas').addEventListener('keydown',event=>{
    if(event.ctrlKey||event.metaKey||event.altKey||event.isComposing)return;
    if(!camera||!controls||mapMode||webglLost)return;
    const key=event.key.toLowerCase();
    if(!['w','a','s','d','+','=','-'].includes(key))return;
    event.preventDefault();event.stopPropagation();
    if(['+','=','-'].includes(key)){zoomGlobe(key==='-'?1.15:.85);return;}
    const spherical=new THREE.Spherical().setFromVector3(camera.position);
    if(key==='a'||key==='d')spherical.theta+=(key==='a'?-1:1)*.12;
    else spherical.phi=THREE.MathUtils.clamp(spherical.phi+(key==='w'?-1:1)*.12,.1,Math.PI-.1);
    camera.position.setFromSpherical(spherical);camera.lookAt(0,0,0);controls.update();
  });
  reducedMotion.addEventListener('change',event=>{if(event.matches&&spin)toggleGlobeRotation();});
});
