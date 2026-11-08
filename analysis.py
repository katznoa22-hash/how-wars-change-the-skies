"""Reproducible educational aviation model. Standard library only; no network."""
from pathlib import Path
import json
import math
from scripts.validate_airports import validate_airports

ROOT = Path(__file__).resolve().parent
ASSUMPTIONS = dict(earthRadiusKm=6371, speedKmh=860, fuelKgPerHour=7500,
                   densityKgPerLitre=0.8, litresPerUSGallon=3.785411784,
                   fuelUSDPerGallon=2.8, otherUSDPerHour=2200,
                   co2KgPerKgFuel=3.16, annualSectors=730)

def haversine(a, b):
    lat1, lat2 = math.radians(a['lat']), math.radians(b['lat'])
    h = math.sin((lat2-lat1)/2)**2 + math.cos(lat1)*math.cos(lat2)*math.sin(math.radians(b['lon']-a['lon'])/2)**2
    return 2*ASSUMPTIONS['earthRadiusKm']*math.asin(math.sqrt(max(0, min(1, h))))

def cost(hours, price=2.8):
    a = ASSUMPTIONS
    return hours*(a['fuelKgPerHour']/a['densityKgPerLitre']/a['litresPerUSGallon']*price+a['otherUSDPerHour'])

def generate():
    airports = json.loads((ROOT/'data/airports.json').read_text(encoding='utf-8'))['airports']
    validate_airports(airports)
    # Deliberately chosen teaching waypoints, not approved airways or actual tracks.
    definitions = [
        ('lhr-hnd', 'russia', ['LHR', 'HND'], [('Istanbul vicinity',40,29), ('South Caspian',37,51), ('Central Asia',39,70), ('Northern China',38,105), ('Korea Strait',34,129)]),
        ('fra-sin', 'mideast', ['FRA', 'SIN'], [('Mediterranean',34,25), ('Egypt',27,32), ('Saudi Arabia',22,43), ('Arabian Sea',16,62), ('Bay of Bengal',10,90)]),
        ('hel-icn', 'russia', ['HEL', 'ICN'], [('Baltic',56,18), ('Black Sea south',40,30), ('South Caspian',37,51), ('Central Asia',39,70), ('Northern China',38,105)]),
    ]
    routes = {}
    for key, scenario, codes, waypoints in definitions:
        origin, dest = [dict(code=c, **airports[c]) for c in codes]
        via = [dict(name=n, lat=lat, lon=lon) for n,lat,lon in waypoints]
        points = [origin, *via, dest]
        direct = haversine(origin,dest)
        detour = sum(haversine(a,b) for a,b in zip(points,points[1:]))
        extra = detour-direct
        hours = extra/ASSUMPTIONS['speedKmh']
        routes[key] = dict(scenario=scenario, origin=origin, destination=dest, waypoints=via,
            directKm=direct, detourKm=detour, extraKm=extra, extraPercent=extra/direct*100,
            extraHours=hours, extraCostUSD=cost(hours), extraFuelKg=hours*ASSUMPTIONS['fuelKgPerHour'],
            extraCO2Kg=hours*ASSUMPTIONS['fuelKgPerHour']*ASSUMPTIONS['co2KgPerKgFuel'])
    return dict(version=2, model='Illustrative spherical waypoint model; not operational flight planning', assumptions=ASSUMPTIONS, routes=routes)

def main():
    data = generate()
    serialized = json.dumps(data, indent=2, ensure_ascii=False)
    (ROOT/'data/scenarios.json').write_text(serialized+'\n', encoding='utf-8')
    countries = json.loads((ROOT/'data/countries.geojson').read_text(encoding='utf-8'))
    (ROOT/'data/presentation-data.js').write_text('window.PRESENTATION_DATA = '+serialized+';\nwindow.COUNTRIES = '+json.dumps(countries,separators=(',',':'))+';\n',encoding='utf-8')
    for key,r in data['routes'].items():
        print(f"{key}: {r['directKm']:.1f} -> {r['detourKm']:.1f} km; +{r['extraHours']:.2f} h; ${r['extraCostUSD']:,.0f}")

if __name__ == '__main__':
    main()
