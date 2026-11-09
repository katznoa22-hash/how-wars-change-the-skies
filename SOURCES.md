# Version 2 — Sources and model audit

Reviewed with Codex on 8 November 2026. Historical statements are paraphrases, not direct quotations. Runtime assets are local; reference links require an internet connection. This is an educational presentation, not flight planning or a live airspace service.

## Evidence and provenance

| Subject | Source | Use and limits |
|---|---|---|
| Airspace sovereignty and international services | [ICAO Chicago Convention, Articles 1, 5, 6 and 9](https://www.icao.int/sites/default/files/2024-12/7300_9ed.pdf) | Legal background. Scheduled and non-scheduled flights have different provisions. No operational permission is inferred. |
| Russia-related route changes | [Finnair: Flights to Asia bypass Russian airspace](https://www.finnair.com/fr-en/flight-information/travel-updates/changes-in-finnair-flights-to-asia-and-russia-2548118) | Operator-reported service changes, retrieved 8 November 2026. Mutable advisory, not an industry-wide dataset. No quoted average detour or fuel penalty. |
| Middle East event | [EASA: Latest developments in the Middle East, 14 April 2024](https://www.easa.europa.eu/en/newsroom-and-events/news/latest-developments-middle-east) | Dated temporary closures in Israel, Lebanon, Jordan, Iraq and Iran. The notice reports expiry during 14 April. The presentation does not imply these closures are current. |
| Fuel-to-CO₂ conversion | [ICAO CORSIA FAQ, section 3.59](https://www.icao.int/sites/default/files/environmental-protection/CORSIA/CORSIA-FAQ.html) | 3.16 kg CO₂ per kg conventional jet fuel. Sections 3.61–3.62 also document the standard density of 0.8 kg/L adopted by this model. Direct combustion only; not lifecycle or non-CO₂ climate effects. |
| Country geography | [Natural Earth v5.1.2](https://github.com/nvkelso/natural-earth-vector/tree/v5.1.2), [terms](https://www.naturalearthdata.com/about/terms-of-use/) | Public-domain 1:110m admin-0 country geometry. Generalized boundaries, not FIRs, territorial-water limits or actual closure polygons. Natural Earth's boundary conventions are not a political position of this project. |
| Airport input | [Airport Codes / OurAirports-derived community dataset](https://github.com/datasets/airport-codes) | Six-record snapshot from the approved CSV URL. Coordinates field was confirmed to be latitude, longitude; the initial importer reversed it. Corrected only after independent location checks. Main-branch URL is mutable. |
| Runtime libraries | [Three.js r128](https://github.com/mrdoob/three.js/tree/r128) | Vendored Three.js and OrbitControls, existing version retained. MIT license in assets/vendor. The downloader stores code; browser execution occurs when previewing index.html. |

## Coordinate validation

The original import is preserved in `backups/coordinate-import/airports.json`. Version 1 HTML is separately preserved in `backups/version-1/index.html`, SHA-256 `317d8dd07589417d5883b00849e5bbe818c62f26bb68aec01f9eff1a52021c6e`. Backups are deliberately ignored by Git and remain local.

`data/airport-references.json` contains independent published airport locations and exact source URLs. Checks compare geographic distance, not just latitude/longitude ranges. The 5 km tolerance allows different reference points within large airports and does not certify ARP precision.

| Airport | Corrected latitude | Corrected longitude | Reference | Separation |
|---|---:|---:|---|---:|
| LHR | 51.470748 | -0.459909 | [NATS Heathrow chart](https://www.aurora.nats.co.uk/htmlAIP/Publications/2023-05-18-AIRAC/graphics/229425.pdf), ARP 512839N 0002741W | 0.758 km |
| HND | 35.549678 | 139.786958 | [Japan Meteorological Agency aerodrome publication](https://www.jma.go.jp/jma/kishou/know/kouku/2_kannsoku/28_kikohyo/RJTT_e.pdf) | 1.083 km |
| FRA | 50.026706 | 8.558350 | [Fraport airport venue location](https://b2b.frankfurt-airport.com/de/veranstaltungen-events/fra-lounge/kontakt-anreise.html), airport site, not ARP | 2.972 km |
| SIN | 1.350190 | 103.994003 | [CAAS Changi AIP](https://aim-sg.caas.gov.sg/aim-content/uploads/aip/17-SEP-2026/AIP/2026-09-03-000000/html/eAIP/SG-AD-2-WSSS-en-GB.html) | 1.130 km |
| HEL | 60.318363 | 24.963341 | [Fintraffic Helsinki AIP](https://beta.ais.fi/eaip/01%20OCT%202026_2026_10_01/eAIP/EF-AD%202%20EFHK%20-%20HELSINKI-VANTAA%201-fi-FI.html?amdt=show), ARP 601902N 0245748E | 0.127 km |
| ICN | 37.469101 | 126.450996 | [Korean AIP, 2021 RKSI entry](https://aim.koca.go.kr/eaipPub/Package/2021-04-08/html/eAIP/KR-AD-2.RKSI-en-GB.html), ARP 372745N 1262621E | 1.276 km |

TLV and JFK were requested as example checks but do not occur in the six-record model. [Israel's LLBG AIP](https://e-aip.azurefd.net/2026-08-06-AIRAC/html/eAIP/LL-AD-2.LLBG-en-GB.html) gives TLV near 32.0094°N, 34.8856°E. The [FAA JFK diagram](https://www.faa.gov/Air_traffic/Publications/media/2024-03-21_AIP_Basic_dtd_3-21-24.pdf) corroborates JFK near 40.64°N, 73.78°W. These examples demonstrate hemisphere and order conventions; no claim is made to have corrected absent records.

`data/coordinate-validation.json` records each actual before/after correction, distances and references. The correction utility leaves valid records unchanged and refuses a swap unless the candidate matches the independent location. `analysis.py` and the downloader reject incorrectly located inputs.

## Audit across all 10 slides

| Slide | Version 1 issue | Version 2 resolution |
|---|---|---|
| 1 | Unsupported average +3,200 km and +$34,000 | Hero numbers now use the LHR–HND hypothetical model and carry estimate labels. |
| 2 | Universal overflight-authorization statement; great-circle explanation mixed sphere and ellipsoid | Qualify scheduled service rules; explain spherical baseline and FIR/country distinction. |
| 3 | Conflated NOTAM issuers and CZIBs; categorical crew, payload and diversion claims | Describe state notices, regulator advice and airline assessment separately; replace universal consequences with conditional explanations. |
| 4 | Unsupported 17 million km², 36 countries, 3–4 hours, 25–35% fuel and +300% insurance figures; decorative quantitative bars | Remove unsupported numbers and bars. Use linked operator report and dated EASA event. |
| 5 | Hardcoded route distances/costs described as calculated | Generate Haversine distances, waypoint sums, time and cost through analysis.py. Matching data drives bars and globe. |
| 6 | Approximate continents, hazard spheres, Bézier arcs and approximate city coordinates | Natural Earth geometry, airport coordinates, spherical route interpolation, country context shading, legend, 2D map. No claim of exact FIR or closure coverage. |
| 7 | Different fuel inputs for dollars and CO₂, unsupported aircraft rate, compounded-burn claim but linear code, universal crew thresholds, cargo losses | One fuel mass and explicit unit conversion; all operating inputs labeled assumptions. Remove unsupported operational thresholds and cargo revenue figures. |
| 8 | Universal 80/20 slot statement applied across jurisdictions and certain network consequences | Conditional managerial interpretation; slot rules depend on jurisdiction, season and relief. |
| 9 | Scenario selector unused, fixed unexplained scores, crude-barrel proxy, suspension shown as 100% reliable, guaranteed crew/payload benefits and profit claims | Scenario-specific model; jet fuel price in US gallons; all 48 control combinations validated in browser suite when passing. Invented score table visible. Suspension reliability N/A. No profit prediction or automatic safety/crew exemption. |
| 10 | Broad unverifiable references and categorical recommendations | Direct claim-specific links, dates, license credits and explicit model limits. |

## Reproducible assumptions

All operating parameters below are teaching assumptions unless explicitly identified as a conversion or sourced factor. They are not certified aircraft performance or observed airline economics.

- Earth radius: 6,371 km; spherical Haversine. Alternative distance is the sum of the same waypoint segments rendered on the globe.
- Extra time = (detour km − baseline km) / 860 km/h assumed average ground speed.
- Added fuel = extra hours × 7,500 kg/h constant fuel burn.
- US gallons = fuel kg / (0.8 kg/L assumed density) / 3.785411784 L per US gallon (unit conversion).
- Cost = US gallons × assumed jet fuel price + extra hours × $2,200/h assumed other operating cost. Default price $2.80/US gal.
- Added direct combustion CO₂ = added fuel kg × 3.16 kg CO₂/kg fuel (ICAO factor).
- Annual estimate = unrounded per-sector cost × 730 sectors (two identical sectors daily for 365 days); rounded only for display. Opposite directions are deliberately assumed equal.
- Waypoints are educational choices, not verified flight tracks, approved airways or optimized paths. No live restrictions, winds, weather, aircraft-specific payload/range, terrain, crew certification, maintenance schedules, overflight permissions or revenue are modeled.

The simulator prices are $2.20, $2.80 and $3.80/US gallon. Detour expense comes from the selected route. A stop adds 0.5 airborne hours and $4,500 handling, with an illustrative 75-minute ground stop. Partner expense is $8,500 plus $1,500 for the LHR–HND scenario. Suspension has zero incremental flying cost, not zero total business cost. Reliability and retention are explicitly invented inputs, listed in the presentation, not fitted probabilities. Safety and legal feasibility remain independent prerequisites.

## Asset handling

The approved downloader uses exactly five reviewed HTTPS URLs and six output files. It validates all resolved destinations inside the project, backs up existing outputs before network access, and never executes downloads or invokes a shell. It can leave partial downloads on failure; hashes are recorded after retrieval, not verified against independently supplied expected digests. The airport CSV is parsed in memory, not saved in full. See scripts/fetch_assets.py and data/asset-manifest.json.

The globe's 2048×1024 cartographic texture is generated in memory from accurate local country polygons; it is not satellite imagery. This avoids an extra unapproved image download and keeps runtime self-contained. Country outlines and red fills follow Natural Earth conventions; no licensed FIR geometry was introduced. The 2D view uses a letterboxed equirectangular projection; distances still come from spherical calculations, not map pixel lengths.


## Version 4 visual provenance and evidence status — 9 November 2026

The original source/model audit above is retained. Version 4 preserves analysis.py, all validated source-data files, route waypoints, constants and pinned vendor/geography bytes. Cosmetic route colors changed to dashed pearl (baseline) and solid ice blue (illustrative detour); line style and text retain the distinction without depending on color.

Slide 1 uses assets/hero-v4.jpg, generated with the built-in OpenAI image-generation tool through Codex from the user's written composition description. The original selected reference bitmap was unavailable locally. It contains no essential text or UI. The exact generation prompt, tool, date and processing are recorded in assets/hero-v4-provenance.json. Converted locally from generated PNG to 1672×941 JPEG, quality 88; 197,684 bytes. Warm city lights and curved flight paths are artistic scene lighting; conflict glows are not sourced boundaries. This image is illustrative, not satellite imagery, historical evidence, validated route geography or a map for operational use. It is not a downloaded third-party stock image; no third-party license is asserted for the generated illustration.

Presentation captions explicitly identify that imagery as AI-generated, model outputs as estimates, dated historical events as historical, and reliability/retention scores as invented teaching inputs. Versions 2–4 used Codex; earlier Antigravity and ChatGPT records remain in the prompts folder. The cancelled gold proposal remains documented as history and is not the final design.

The browser regression report and ten 1366×768 screenshots for this candidate are stored separately under artifacts/v4/. Previous V3 evidence remains unchanged. External source availability is a separate check from the offline airport/model validation: a passing local coordinate test does not prove a source website is currently reachable. Actual link-check outcomes and any unavailable references are recorded in the V4 log.


## Pre-release re-audit — 9 November 2026

The six presentation source-register links were reopened successfully: ICAO legal PDF, Finnair advisory, EASA dated notice, ICAO CORSIA FAQ, Natural Earth terms and GitHub airport-codes. Historical dates, retrieval dates and illustrative-model labels were reviewed without changing their meanings. The NATS Heathrow chart explicitly includes ARP 512839N 0002741W; JMA Haneda, Fraport venue, CAAS Changi and Fintraffic Helsinki reference content was readable. Natural Earth v5.1.2, Three.js r128 and Israel's LLBG example links were readable too. The historical Korean RKSI AIP still timed out; its current remote content is not independently reconfirmed. The FAA JFK example PDF exceeds the web reader's approximately 39.5MB limit and was not independently inspected in this audit. These limitations do not establish that either URL is broken. The community-coordinate snapshot and local five-kilometre validation are not certified ARP evidence.

The asset manifest's four local hashes and the generated hero-image hash matched; this verifies local consistency, not independently authenticated remote digests or refreshed source data. No raw asset refresh or new dependency was fetched. The exact selected hero reference bitmap remains unavailable, so only the supplied description was used for visual comparison.

Numerical portability is distinct from scientific uncertainty: [Python's documented float-sum change in 3.12](https://docs.python.org/3.13/library/functions.html#sum) and [platform math / isclose behavior](https://docs.python.org/3.13/library/math.html) explain why exact float equality is not a portable numerical contract. The bounded test comparator applies only to derived outputs; inputs, assumptions, source files and formulas remain exact and unchanged. The independent review's precise traceback/environment was not provided, so its specific cause is unconfirmed. See the pre-release audit for measured deltas, strict rejection tests, test commands, source limitations and the proposed release file list.
