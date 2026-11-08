"""One-time, reviewable migration of the original presentation to Version 2."""
from pathlib import Path
import re
import hashlib

ROOT=Path(__file__).resolve().parents[1]
path=ROOT/'index.html'
html=path.read_text(encoding='utf-8')
if 'assets/v2.js' in html:
    raise SystemExit('Version 2 migration already applied; refusing to apply twice.')
backup=ROOT/'backups/version-1/index.html'
expected='317d8dd07589417d5883b00849e5bbe818c62f26bb68aec01f9eff1a52021c6e'
if not backup.exists() or hashlib.sha256(backup.read_bytes()).hexdigest()!=expected:
    raise SystemExit('Verified Version 1 index.html backup required before migration.')

def replace(old,new):
    global html
    if old not in html:
        raise ValueError('Expected original content missing: '+old[:100])
    html=html.replace(old,new)

def section(index,content):
    global html
    pattern=rf'<section class="slide(?: active)?" id="slide-{index}">.*?</section>'
    html,count=re.subn(pattern,lambda _:f'<section class="slide" id="slide-{index}">\n{content}\n    </section>',html,flags=re.S)
    assert count==1

def header(category,title,subtitle):
    return f'<div class="slide-header"><div class="slide-category">{category}</div><h2 class="slide-title">{title}</h2><p class="slide-subtitle">{subtitle}</p></div>'

def card(title,text):
    return f'<div class="glass-card"><h3 style="margin-bottom:12px">{title}</h3><p style="color:var(--text-muted)">{text}</p></div>'

convention='https://www.icao.int/sites/default/files/2024-12/7300_9ed.pdf'
easa='https://www.easa.europa.eu/en/newsroom-and-events/news/latest-developments-middle-east'
finnair='https://www.finnair.com/fr-en/flight-information/travel-updates/changes-in-finnair-flights-to-asia-and-russia-2548118'
corsia='https://www.icao.int/sites/default/files/environmental-protection/CORSIA/CORSIA-FAQ.html'
def source(url,title):return f'<a href="{url}" target="_blank" rel="noopener">{title}</a>'

# Remove external runtime dependencies. The local map uses sourced country geometry.
html=re.sub(r'  <link rel="preconnect".*?\n','',html)
html=re.sub(r'  <link href="https://fonts.googleapis.com/[^\n]+\n','',html)
replace('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','assets/vendor/three.min.js')
replace('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js','assets/vendor/OrbitControls.js')
replace('</head>','  <link rel="stylesheet" href="assets/v2.css">\n  <script src="data/presentation-data.js"></script>\n</head>')
replace('Academic Project</span>','Version 2</span>')
replace('<span class="stat-value" style="color: var(--accent-cyan);">+3,200</span>','<span class="stat-value" id="heroDistance" style="color: var(--accent-cyan);">—</span>')
replace('<span class="stat-value" style="color: var(--accent-amber);">+$34,000</span>','<span class="stat-value" id="heroCost" style="color: var(--accent-amber);">—</span>')
replace('Average detour distance on Europe–East Asia routes post-closure.','Model estimate · LHR–HND illustrative detour, not an industry average.')
replace('Incremental operating cost for long-haul widebody aircraft.','Model estimate · same route; assumed fuel price $2.80/US gallon.')
replace('Python Haversine Physics','Python Distance Model')
replace('Interactive 3D Simulation Platform','Geography shapes every decision')

section(1,header('Aviation Network Fundamentals','The Invisible Highways of the Sky','A route connects airports through airspace. Geography gives a starting point; permissions, weather and air traffic services shape the flight.')+
    '<div class="grid-3">'+
    card('Great-circle distance','On a spherical Earth, a great-circle arc is the shortest surface path between two points. It often looks curved on a flat map. Our model uses this as a theoretical baseline, not a recorded flight path.')+
    card('Sovereign airspace','The Chicago Convention recognizes state sovereignty over territorial airspace (Article 1). Scheduled international services need the relevant state authorization (Article 6). Different rules apply to non-scheduled flights.')+
    card('FIR: Flight Information Region','An FIR is an area where flight information and alerting services are provided. Its boundary need not match a country border. A restriction may cover only part of an FIR, selected altitudes or specific operators.')+
    '</div><div class="provenance"><span class="evidence-badge">Verified legal reference</span>'+source(convention,'ICAO · Chicago Convention, Articles 1, 5, 6 and 9')+'</div>'+
    '<div class="glass-card"><strong>Follow the chain:</strong> conflict → airspace restrictions → rerouting → extra operating demands → airline decisions.</div>')

section(2,header('Operational Mechanics','What Happens When Airspace Closes?','Closures, regulator advice and an airline’s own risk assessment are different inputs. None can be replaced by choosing the cheapest route.')+
    '<div class="process-timeline">'+''.join(f'<div class="step-box"><div class="step-number">STEP {i:02}</div><h3>{title}</h3><p class="source-note">{text}</p></div>' for i,title,text in [
        (1,'Identify the disruption','Conflict may create hazards or trigger restrictions on particular operators.'),
        (2,'Read the notices','A NOTAM is an official notice of operational information. States publish restrictions; EASA also publishes conflict-zone advice and bulletins.'),
        (3,'Review affected flights','Airlines and air traffic services assess whether departures, rerouting, holding or diversions are needed.'),
        (4,'Replan the operation','A feasible alternative must account for permissions, aircraft performance, fuel, crew and airport availability.')])+
    '</div><div class="split-compare">'+card('Baseline: theoretical shortest path','The cyan route is a geometric reference. Actual flights also respond to winds, weather, airways, traffic and permissions.')+card('Detour: illustrative waypoint path','The amber route shows how a longer path changes distance and estimated cost. It is not a verified historical track or an operationally approved alternative.')+'</div>'+
    '<p class="source-note">Historical example: '+source(easa,'EASA, 14 April 2024')+' reported temporary closures issued by the relevant airspace owners through NOTAMs.</p>')

section(3,header('Dated Historical Case Studies','Two Conflicts, Global Consequences','Two documented examples explain the mechanism. The route models on the following slides are separate teaching scenarios, not reconstructions of these events.')+
    '<div class="tab-bar"><button class="tab-btn active" onclick="switchCaseTab(\'russia\')">Case A · Russia / Ukraine context</button><button class="tab-btn" onclick="switchCaseTab(\'mideast\')">Case B · 13–14 April 2024</button></div>'+
    '<div class="tab-content active" id="case-russia"><div class="grid-2">'+
    card('Airline-reported route changes','Finnair reports bypassing Russian airspace on services to Asia. This is an operator-specific example: access and restrictions differ between airlines and dates. It does not establish a single global average detour.')+
    card('Why the geography matters','A northern European hub can lose access to short eastbound paths. Longer alternatives affect flying time, aircraft rotations and fuel requirements. Our LHR–HND and HEL–ICN examples quantify chosen hypothetical waypoint paths.')+
    '</div><div class="provenance"><span class="evidence-badge">Airline-reported fact</span>'+source(finnair,'Finnair · Flights to Asia bypass Russian airspace')+'<span>Retrieved 8 November 2026; advisory is subject to updates.</span></div></div>'+
    '<div class="tab-content" id="case-mideast"><div class="grid-2">'+
    card('A short-lived regional disruption','EASA’s 14 April 2024 notice described temporary airspace closures in Israel, Lebanon, Jordan, Iraq and Iran during military exchanges on 13–14 April. The notice said the relevant NOTAMs had expired during 14 April.')+
    card('Keep the time window visible','Temporary closures can disrupt connectivity even when a destination is elsewhere. The presentation does not claim those April 2024 closures remain active. Red country shading is geographic context, not an exact closure footprint.')+
    '</div><div class="provenance"><span class="evidence-badge">Verified historical event</span>'+source(easa,'EASA · Latest developments in the Middle East, 14 April 2024')+'</div></div>')

replace('Compare baseline great-circle trajectories with mandatory conflict circumnavigations across representative global routes.','Compare calculated great-circle baselines with illustrative waypoint detours. Every displayed route uses the same data as the globe.')
replace('<label style="font-weight: 600; color: var(--text-muted);">Select Analyzed Route:</label>','<label for="routeSelector" style="font-weight: 600; color: var(--text-muted);">Select illustrative route:</label>')
replace('[Russia Closure]','[Illustrative Russia bypass]')
replace('[Middle East Closure]','[Illustrative regional bypass]')
replace('[Siberian Bypass]','[Illustrative southern bypass]')
replace('Assumes 860 km/h B777 cruise','Assumed average ground speed: 860 km/h')
pattern=r'Distances are computed using the spherical.*?ATC holding vectors\.'
html,count=re.subn(pattern,'<span class="evidence-badge model">Model estimate</span> Python sums spherical Haversine distances (Earth radius 6,371 km). Extra hours = extra distance / 860 km/h. Default cost assumes 7,500 kg fuel/h, density 0.8 kg/L, $2.80/US gallon and $2,200/h other operating costs. Waypoints are hypothetical; weather, permissions, crew and aircraft feasibility are not modeled.\n          <br><strong>Waypoints:</strong> <span id="routeWaypoints"></span>',html,flags=re.S)
assert count==1
replace('    <!-- SLIDE 6: 3D GLOBE INTERACTIVE VISUALIZATION -->','    <!-- SLIDE 6: 3D GLOBE INTERACTIVE VISUALIZATION -->')
# Add a readable distance chart within the existing fifth slide.
needle='    </section>\n\n    <!-- SLIDE 6:'
replace(needle,'      <div class="route-chart" role="img" aria-label="Calculated distance comparison; both bars share a zero origin and the detour defines the maximum."><div class="route-chart-row"><span>Baseline</span><div class="route-chart-track"><span id="baselineBar" style="background:var(--accent-cyan)"></span></div><strong id="baselineBarValue"></strong></div><div class="route-chart-row"><span>Detour</span><div class="route-chart-track"><span style="width:100%;background:var(--accent-amber)"></span></div><strong id="detourBarValue"></strong></div></div>\n'+needle)
replace('Drag to rotate the planet, scroll to zoom. Toggle between scenarios to observe how conflict exclusion zones bend commercial flight paths.','Drag to rotate, scroll to zoom. Compare a theoretical shortest path with an illustrative detour. Country shading provides historical context, not live restrictions.')
replace('<canvas id="globeCanvas"></canvas>','<canvas id="globeCanvas" role="img" aria-label="Interactive Earth with country outlines, airport markers, baseline and illustrative detour routes"></canvas><canvas id="mapCanvas" role="img" aria-label="Equirectangular world map with the same countries, airports and routes"></canvas><div id="globeLabels" aria-hidden="true"></div><div id="globeStatus" role="status">Local geographic data · no live airspace feed</div>')
replace('Original Baseline Path (Great Circle)','Theoretical baseline · dashed cyan')
replace('Conflict Rerouting Detour Arc','Illustrative detour · solid amber')
replace('Restricted Conflict FIR Airspace Zone','Country context · red (not FIRs)')
replace('<button class="action-btn" onclick="setGlobeScenario(\'russia\')">Russia Closure</button>','<button class="action-btn" data-scenario="russia" aria-pressed="true" onclick="setGlobeScenario(\'russia\')">Russia context</button>')
replace('<button class="action-btn" onclick="setGlobeScenario(\'mideast\')">Middle East Closure</button>','<button class="action-btn" data-scenario="mideast" aria-pressed="false" onclick="setGlobeScenario(\'mideast\')">Middle East context</button><button class="action-btn" id="rotateGlobe" onclick="toggleGlobeRotation()">Pause rotation</button><button class="action-btn" id="mapToggle" aria-pressed="false" onclick="toggleMapView()">Show 2D map</button>')
needle='    </section>\n\n    <!-- SLIDE 7:'
replace(needle,'      <div class="provenance"><label for="globeRouteSelect">Route:</label><select id="globeRouteSelect" onchange="chooseGlobeRoute(this.value)"><option value="lhr-hnd">LHR → HND</option><option value="fra-sin">FRA → SIN</option><option value="hel-icn">HEL → ICN</option></select><span class="evidence-badge model">Illustrative scenario</span></div><p class="source-note" id="globeRouteDescription"></p><p class="source-note">Natural Earth v5.1.2, 1:110m country geometry. Generalized boundaries are not FIR boundaries, territorial-water limits or verified restriction polygons. No route is represented as operationally safe or approved.</p>\n'+needle)

replace('A 3-hour flight extension is not merely inconvenient—it fundamentally destabilizes aircraft economics, crew rostering, and carbon emissions.','Explore how assumed extra hours and jet fuel prices change incremental cost and direct combustion CO₂. These are model estimates, not airline invoices.')
replace('Jet Fuel Consumption ($4,200 / hr)','Fuel assumption · 7,500 kg/hour')
replace('A Boeing 777-300ER burns ~7,500 kg of fuel per hour. To carry fuel for 3 extra hours, the plane burns extra fuel just carrying the weight of that extra fuel (compounded fuel burn).','A constant 7,500 kg/hour is a teaching assumption, not an aircraft performance specification. Fuel cost and CO₂ use the same mass. The model excludes fuel-to-carry-fuel effects, winds and climb/descent.')
replace('Crew Duty Rest & Relief Limits ($1,800 / hr)','Other operations assumption · $2,200/hour')
replace('Commercial aviation regulations (FAA Part 117 / EASA FTL) cap two-pilot crew duty at 14 hours. Crossing 15 hours requires a four-pilot augmented crew and dedicated sleeping bunks.','This illustrative combined crew and maintenance allowance is not a published airline rate. Real crew limits depend on reporting time, sectors, augmentation and the applicable rules; there is no universal threshold used here.')
replace('Every extra ton of reserve jet fuel tankered reduces allowable revenue belly cargo by 1 ton. Airlines lose tens of thousands of dollars in commercial cargo per flight.','Additional fuel may reduce payload when weight limits bind. The effect depends on aircraft, route and loading; this model does not assign an unsupported cargo revenue loss.')
replace('Assumed Jet Fuel Price ($/gallon):','Assumed Jet Fuel Price ($/US gallon):')
replace('Annual Penalty (Daily Roundtrip):','Annual estimate (730 identical sectors):')
replace('Added CO₂ Emissions / Flight:','Direct combustion CO₂ / flight:')
needle='    </section>\n\n    <!-- SLIDE 8:'
replace(needle,'      <div class="provenance"><span class="evidence-badge model">Linear model</span><span>Fuel mass = extra hours × 7,500 kg/h. US gallons = kg / 0.8 / 3.785411784. CO₂ = fuel kg × 3.16.</span></div><p class="source-note">'+source(corsia,'ICAO CORSIA FAQ · 3.16 kg CO₂/kg conventional jet fuel')+'. Factor verified; fuel burn, price, density and other costs are assumptions. Emissions exclude lifecycle and non-CO₂ climate effects. Annual estimate assumes identical detours both directions, every day.</p>\n'+needle)

section(7,header('Executive Management Strategy','Airlines Under Pressure: The Four Dilemmas','Safety and legal feasibility are prerequisites. Within those constraints, managers compare costs, schedule resilience and passenger needs.')+
    '<div class="grid-4">'+card('1 · Operating expense','Longer flights consume more fuel and can increase crew and maintenance costs. The size of the effect depends on the operation; Slide 7 lets you vary selected assumptions.')+
    card('2 · Aircraft rotations','Extra flight time can reduce time available for the next departure. Whether delays spread depends on schedule buffers, spare aircraft and connection timing.')+
    card('3 · Network continuity','Suspension may reduce connectivity, while partner carriage can preserve some service. Airport slot implications depend on the jurisdiction, season and any applicable relief.')+
    card('4 · Passenger trust','Clear communication, rebooking and refund arrangements matter during disruption. No cost comparison establishes that a flight is safe to operate.')+
    '</div><div class="glass-card" style="margin-top:24px"><span class="evidence-badge model">Managerial interpretation</span><p>There is no universal winning strategy. The next slide provides a transparent teaching exercise rather than a forecast of airline performance.</p></div>')

replace('Select a scenario, choose your managerial strategy, and evaluate the financial, punctuality, and strategic consequences.','Choose a hypothetical scenario and response. Compare modeled incremental expenses and explicitly invented reliability and retention scores.')
replace('Eurasian Crisis: Siberian Corridor Indefinitely Closed','Illustrative LHR–HND southern detour')
replace('Middle East Crisis: Levant & Gulf Airspace Restricted','Illustrative FRA–SIN regional detour')
replace('Absorb maximum flight time and fuel burn. Keep direct nonstop flights operating.','Keep nonstop service using the modeled detour; add flying time and expense.')
replace('Stop in Anchorage or Baku. Avoid double pilot crew and protect revenue cargo capacity.','Assume an extra stop: 0.5 airborne hours, 75 ground minutes and $4,500 handling.')
replace('Halt flights, reallocate widebody aircraft to Transatlantic routes, risk market share.','Halt the modeled service. Lost revenue, refunds and fleet redeployment are not valued.')
replace('Transfer passengers onto neutral / non-restricted alliance partner carriers.','Assume available partner carriage with separate permissions and safety review.')
replace('Step 3: Crude Oil Environment','Step 3: Assumed Jet Fuel Price')
replace('Moderate Crude ($75 / barrel)','Lower jet fuel price ($2.20/US gal)')
replace('High Volatility ($105 / barrel)','Default jet fuel price ($2.80/US gal)')
replace('Geopolitical Spike ($135 / barrel)','Higher jet fuel price ($3.80/US gal)')
replace('Direct Cost Impact','Incremental expense')
replace('On-Time Reliability','Simulated reliability')
replace('Market Share Retained','Simulated retention')
replace('Slot punctuality','Teaching score, not measured')
replace('Customer retention','Teaching score, not measured')
replace('Note: All simulation calculations are illustrative models for educational comparative analysis.','<span class="evidence-badge model">Simulated scenario</span> Safety and legality must be assessed independently. Costs exclude revenue, fixed costs and disruption compensation.<details><summary>Show assumptions and scoring</summary><p id="simAssumptions"></p><p>Reliability / retention inputs: long-haul detour 74/88; stop 62/68; partner 82/55. Regional detour 84/91; stop 72/78; partner 86/65. Suspension: reliability N/A, retention 0. Scores are invented percentages for comparing assumptions; they are not fitted to airline data.</p></details>')

section(9,header('Synthesis & Sources','The Future of Aviation Resilience','Restrictions change the usable network. Longer routes can raise operating demands, but the result depends on geography, the airline and the assumptions.')+
    '<div class="grid-3">'+card('Plan flexible networks','Consider alternative routings, partners and recovery plans. Aircraft range alone does not resolve permissions, crew, airport or safety constraints.')+card('Keep evidence visible','Separate dated historical events from current conditions and theoretical models. A country outline does not establish which airspace was closed.')+card('Test assumptions','Distance is reproducible; costs depend on inputs. Use sensitivity analysis and avoid presenting invented scores as measured airline performance.')+'</div>'+
    '<div class="glass-card" style="margin-top:18px"><h3>Sources, dates and credits</h3><ul style="padding-left:20px;line-height:1.9">'+
    '<li>'+source(convention,'ICAO · Chicago Convention (1944), Articles 1, 5, 6, 9')+' — airspace sovereignty and authorizations.</li>'+
    '<li>'+source(finnair,'Finnair · Flights to Asia bypass Russian airspace')+' — airline-reported service changes; retrieved 8 November 2026.</li>'+
    '<li>'+source(easa,'EASA · Latest developments in the Middle East (14 April 2024)')+' — temporary closures and expiry on that date.</li>'+
    '<li>'+source(corsia,'ICAO · CORSIA FAQ, fuel conversion factors')+' — 3.16 kg CO₂/kg conventional jet fuel.</li>'+
    '<li>'+source('https://www.naturalearthdata.com/about/terms-of-use/','Natural Earth v5.1.2 · public-domain country data')+'; '+source('https://github.com/datasets/airport-codes','Airport Codes / OurAirports community dataset')+' — airport coordinates, snapshot 8 November 2026.</li>'+
    '</ul><p class="source-note">Three.js r128 / OrbitControls · MIT license included. Cartographic texture is rendered locally from Natural Earth geometry. Version 2 implemented with Codex; exact prompts and actual results are in the prompts folder.</p></div>'+
    '<p class="source-note"><strong>Limitations:</strong> spherical Earth; illustrative waypoints; constant speed and fuel burn; no winds, certified performance, live notices, FIR dataset, safety assessment or historical track reconstruction. See <a href="SOURCES.md">source and model audit</a>.</p><button class="nav-btn" onclick="goToSlide(0)">⟲ Return to Start</button>')

# Retain the original navigation and tab switcher; replace the old data/globe engines.
start=html.index('    const routeDataset = {')
end=html.index('  </script>',start)
html=html[:start]+html[end:]
replace('  </script>\n</body>','  </script>\n  <script src="assets/v2.js"></script>\n</body>')
replace('const dot = document.createElement("div");','const dot = document.createElement("button");\n        dot.type = "button";\n        dot.setAttribute("aria-label", `Go to slide ${i+1}: ${slideTitles[i]}`);')
replace('dot.classList.add("active");','dot.classList.add("active");\n          dot.setAttribute("aria-current", "step");')
replace('dot.classList.remove("active");','dot.classList.remove("active");\n          dot.removeAttribute("aria-current");')
replace('      // Don\'t intercept when inside an input or select','      if (document.getElementById("shortcutsModal").classList.contains("active")) {\n        if (e.key === "Escape") closeShortcutsModal();\n        return;\n      }\n      // Don\'t intercept when inside an input or select')
# Let native controls use Space/Enter without triggering deck navigation.
replace('if (["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)) return;','if (["INPUT", "SELECT", "TEXTAREA", "SUMMARY"].includes(document.activeElement.tagName)) return;\n      if (e.key === " " && document.activeElement.closest("button, [role=button]")) return;')
replace('<main class="slide-deck" id="slideDeck">','<main class="slide-deck" id="slideDeck"><div id="dataStatus" role="status"></div>')
# Dynamic fields start with a neutral placeholder; avoid stale claims if data fails.
dynamic_ids=['dispDirectDist','dispDetourDist','dispDistDelta','dispTimeDelta','dispCostDelta','resFlightCost','resAnnualCost','resCO2','simStatCost','simStatReliability','simStatMarket','simDebriefText']
for ident in dynamic_ids:
    html=re.sub(rf'(<[^>]+id="{ident}"[^>]*>).*?(</[^>]+>)',r'\1—\2',html,flags=re.S)
assert len(re.findall(r'<section class="slide(?: active)?" id="slide-\d+"',html))==10
path.write_text(html,encoding='utf-8')
print('Version 2 HTML migration complete; 10 slides preserved.')
