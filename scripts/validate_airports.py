"""Check airport identity/location against independently published references."""
from pathlib import Path
import json
import math
ROOT=Path(__file__).resolve().parents[1]

def distance_km(a,b):
    lat1,lat2=math.radians(a['lat']),math.radians(b['lat'])
    h=math.sin((lat2-lat1)/2)**2+math.cos(lat1)*math.cos(lat2)*math.sin(math.radians(b['lon']-a['lon'])/2)**2
    return 12742*math.asin(math.sqrt(max(0,min(1,h))))

def validate_airports(airports):
    refs=json.loads((ROOT/'data/airport-references.json').read_text())['airports']
    if set(airports)!=set(refs):raise ValueError('Expected exactly six referenced airports')
    results={}
    for code,p in airports.items():
        ref=refs[code]
        if not(-90<=p['lat']<=90 and -180<=p['lon']<=180):raise ValueError(f'{code}: invalid geographic range')
        dist=distance_km(p,ref)
        if dist>ref['maxDistanceKm']:raise ValueError(f'{code}: {dist:.1f} km from independent airport reference')
        results[code]=round(dist,3)
    return results

if __name__=='__main__':
    print(json.dumps(validate_airports(json.loads((ROOT/'data/airports.json').read_text())['airports']),indent=2))
