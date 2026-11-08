"""Independent invariants for geography, units, and the reproducible model."""
import hashlib
import json
import math
from pathlib import Path
import sys
import subprocess
import unittest

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from analysis import ASSUMPTIONS, cost, generate, haversine
from scripts.validate_airports import validate_airports

class ModelChecks(unittest.TestCase):
    def test_known_distances_and_symmetry(self):
        a=dict(lat=0,lon=0); b=dict(lat=0,lon=90)
        self.assertAlmostEqual(haversine(a,b),math.pi*6371/2,places=6)
        self.assertEqual(haversine(a,a),0)
        self.assertAlmostEqual(haversine(a,b),haversine(b,a),places=9)
        self.assertAlmostEqual(haversine(a,dict(lat=0,lon=180)),math.pi*6371,places=6)

    def test_airport_coordinates(self):
        data=json.loads((ROOT/'data/airports.json').read_text())['airports']
        checked=validate_airports(data)
        self.assertEqual(len(checked),6)
        self.assertTrue(all(km<5 for km in checked.values()))
        self.assertEqual(set(data),{'LHR','HND','FRA','SIN','HEL','ICN'})
        # Bounds catch swapped lon/lat and mistaken city coordinates.
        bounds={'LHR':(51,52,-1,0),'HND':(35,36,139,140),'FRA':(49,51,8,9),'SIN':(1,2,103,105),'HEL':(60,61,24,26),'ICN':(37,38,126,127)}
        for code,(lo,hi,west,east) in bounds.items():
            p=data[code];self.assertTrue(lo<p['lat']<hi);self.assertTrue(west<p['lon']<east)

    def test_reversed_records_are_rejected(self):
        data=json.loads((ROOT/'data/airports.json').read_text())['airports']
        for code in data:
            reversed_data={key:dict(p) for key,p in data.items()}
            p=reversed_data[code];p['lat'],p['lon']=p['lon'],p['lat']
            with self.assertRaises(ValueError,msg=code):validate_airports(reversed_data)

    def test_reproducibility_and_route_units(self):
        expected=json.loads((ROOT/'data/scenarios.json').read_text(encoding='utf-8'))
        self.assertEqual(generate(),expected)
        for r in expected['routes'].values():
            self.assertGreater(r['detourKm'],r['directKm'])
            self.assertAlmostEqual(r['extraKm'],r['detourKm']-r['directKm'])
            self.assertAlmostEqual(r['extraHours']*860,r['extraKm'])
            self.assertAlmostEqual(r['extraCO2Kg'],r['extraFuelKg']*3.16)
            self.assertAlmostEqual(cost(r['extraHours']),r['extraCostUSD'])

    def test_cost_behavior(self):
        self.assertEqual(cost(0),0)
        self.assertGreater(cost(2,3.8),cost(2,2.2))
        # 7,500 kg / .8 kg/L / 3.785411784 L/US gal.
        self.assertAlmostEqual(cost(1,2.8),9134.5163744,delta=.0001)

    def test_version_one_preserved_in_git(self):
        version_one='9a9ce56dfe23dc5f06a501c3e7582c605c540362'
        subprocess.run(['git','merge-base','--is-ancestor',version_one,'HEAD'],cwd=ROOT,check=True)
        data=subprocess.check_output(['git','show',version_one+':index.html'],cwd=ROOT)
        self.assertEqual(hashlib.sha256(data).hexdigest(),'317d8dd07589417d5883b00849e5bbe818c62f26bb68aec01f9eff1a52021c6e')

if __name__=='__main__':unittest.main()
