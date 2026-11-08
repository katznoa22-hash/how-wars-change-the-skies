"""Correct only demonstrably reversed records; preserve the original import."""
import json
import shutil
from validate_airports import ROOT, distance_km, validate_airports

path=ROOT/'data/airports.json'
data=json.loads(path.read_text())
refs=json.loads((ROOT/'data/airport-references.json').read_text())['airports']
changes=[]
for code,p in data['airports'].items():
    ref=refs[code];old=distance_km(p,ref)
    if -90<=p['lat']<=90 and -180<=p['lon']<=180 and old<=ref['maxDistanceKm']:
        print(code,'already correct; left unchanged');continue
    candidate=dict(p,lat=p['lon'],lon=p['lat']);corrected=distance_km(candidate,ref)
    if not(-90<=candidate['lat']<=90 and -180<=candidate['lon']<=180 and corrected<=ref['maxDistanceKm']):
        raise ValueError(code+': neither coordinate order matches the airport; refusing correction')
    changes.append(dict(code=code,before=dict(p),after=candidate,originalDistanceKm=round(old,3),correctedDistanceKm=round(corrected,3),reference=ref))
    data['airports'][code]=candidate
validate_airports(data['airports'])
if changes:
    backup=(ROOT/'backups/coordinate-import/airports.json').resolve();assert backup.is_relative_to(ROOT)
    if not backup.exists():backup.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(path,backup)
    else:raise SystemExit('Original-import backup already exists; refusing to overwrite or repeat correction.')
    path.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
    (ROOT/'data/coordinate-validation.json').write_text(json.dumps(dict(method='Reverse only when original fails and candidate is within 5 km of independently published airport location',changes=changes),indent=2)+'\n',encoding='utf-8')
    for c in changes:print(f"{c['code']}: {c['originalDistanceKm']} km -> {c['correctedDistanceKm']} km from reference; corrected")
else:print('No coordinate corrections necessary.')
