"""Independent invariants for geography, units, and the reproducible model."""
from copy import deepcopy
from unittest.mock import patch
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

# Absolute numerical comparison budgets, not scientific model uncertainty.
# Input coordinates, waypoints, assumptions and metadata still compare exactly.
DERIVED_ABS_TOL = {
    'directKm':1e-9, 'detourKm':1e-9, 'extraKm':1e-9,  # one micrometre
    'extraPercent':1e-11, 'extraHours':1e-12,  # percentage points; 3.6 ns
    'extraCostUSD':1e-7, 'extraFuelKg':1e-7, 'extraCO2Kg':1e-7,
}

def assert_reproducible(test, actual, expected):
    actual,expected=deepcopy(actual),deepcopy(expected)
    test.assertEqual(set(actual['routes']),set(expected['routes']))
    for key,route in expected['routes'].items():
        candidate=actual['routes'][key]
        for field,tolerance in DERIVED_ABS_TOL.items():
            test.assertIn(field,candidate)
            value,reference=candidate.pop(field),route.pop(field)
            test.assertIn(type(value),(int,float))
            test.assertTrue(math.isfinite(value),f'{key}.{field}: non-finite output')
            test.assertTrue(math.isclose(value,reference,rel_tol=0,abs_tol=tolerance),
                f'{key}.{field}: actual={value!r}, expected={reference!r}, '
                f'delta={value-reference!r}, absolute budget={tolerance!r}')
    test.assertEqual(actual,expected,'Inputs, assumptions, metadata and schema must match exactly')

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
        assert_reproducible(self,generate(),expected)
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

    def test_independent_reference_costs_and_annual_co2(self):
        # Hand-calculated scalar reference independent of model constants lookup.
        cases=[(.5,1.5,2957.459743147529),(2,2.8,18269.03274881788),(5,4.5,66723.79229442586)]
        for hours,price,expected in cases:
            self.assertAlmostEqual(cost(hours,price),expected,delta=.0001)
        data=json.loads((ROOT/'data/scenarios.json').read_text())
        for route in data['routes'].values():
            self.assertAlmostEqual(route['extraHours']*7500*3.16,route['extraCO2Kg'],places=6)
        self.assertAlmostEqual(cost(3.2,2.8)*730,21338230.25161929,delta=.01)

    def test_reproducibility_accepts_last_bit_roundoff_and_sequential_sum(self):
        expected=json.loads((ROOT/'data/scenarios.json').read_text())
        adjacent=deepcopy(expected)
        for route in adjacent['routes'].values():
            for field in DERIVED_ABS_TOL:route[field]=math.nextafter(route[field],math.inf)
        assert_reproducible(self,adjacent,expected)
        # Controlled arithmetic experiment, not execution of another interpreter.
        def sequential_sum(values,start=0):
            for value in values:start+=value
            return start
        with patch('analysis.sum',sequential_sum,create=True):
            sequential=generate()
        assert_reproducible(self,sequential,expected)
        for key,route in sequential['routes'].items():
            reference=expected['routes'][key]
            for field in ['directKm','detourKm','extraKm','extraCostUSD']:
                self.assertEqual(round(route[field]),round(reference[field]),field)
            self.assertEqual(f"{route['extraHours']:.2f}",f"{reference['extraHours']:.2f}")
            self.assertEqual(f"{route['extraPercent']:.1f}",f"{reference['extraPercent']:.1f}")

    def test_reproducibility_rejects_out_of_budget_or_nonfinite_values(self):
        expected=json.loads((ROOT/'data/scenarios.json').read_text())
        for key in expected['routes']:
            for field,tolerance in DERIVED_ABS_TOL.items():
                altered=deepcopy(expected);altered['routes'][key][field]+=tolerance*10
                with self.assertRaises(AssertionError,msg=f'{key}.{field}'):
                    assert_reproducible(self,altered,expected)
        for value in [float('nan'),float('inf'),float('-inf'),'30186',True]:
            altered=deepcopy(expected);altered['routes']['lhr-hnd']['extraCostUSD']=value
            with self.assertRaises(AssertionError):assert_reproducible(self,altered,expected)

    def test_reproducibility_requires_exact_inputs_and_structure(self):
        expected=json.loads((ROOT/'data/scenarios.json').read_text())
        mutations=[lambda d:d['assumptions'].__setitem__('speedKmh',860.000000001),
            lambda d:d['routes']['lhr-hnd']['origin'].__setitem__('lat',51.470748001),
            lambda d:d['routes']['lhr-hnd']['waypoints'][0].__setitem__('name','Changed'),
            lambda d:d['routes']['lhr-hnd'].pop('detourKm'),
            lambda d:d['routes'].pop('fra-sin')]
        for mutate in mutations:
            altered=deepcopy(expected);mutate(altered)
            with self.assertRaises(AssertionError):assert_reproducible(self,altered,expected)

class GitHistoryChecks(unittest.TestCase):
    def test_version_one_preserved_in_git(self):
        version_one='9a9ce56dfe23dc5f06a501c3e7582c605c540362'
        subprocess.run(['git','merge-base','--is-ancestor',version_one,'HEAD'],cwd=ROOT,check=True)
        data=subprocess.check_output(['git','show',version_one+':index.html'],cwd=ROOT)
        self.assertEqual(hashlib.sha256(data).hexdigest(),'317d8dd07589417d5883b00849e5bbe818c62f26bb68aec01f9eff1a52021c6e')

    def test_version_two_tag_and_history_preserved(self):
        version_two='1dd228500b5ba5708412495f1c43704468728b75'
        tag_object='1e66b7c1a80c3b12f62979bed9a8e78a25962b80'
        def git(*args):return subprocess.check_output(['git',*args],cwd=ROOT).decode().strip()
        self.assertEqual(git('cat-file','-t','refs/tags/v2.0'),'tag')
        self.assertEqual(git('rev-parse','refs/tags/v2.0'),tag_object)
        self.assertEqual(git('rev-parse','v2.0^{commit}'),version_two)
        subprocess.run(['git','merge-base','--is-ancestor',version_two,'HEAD'],cwd=ROOT,check=True)

    def test_version_three_tag_and_validated_files_preserved(self):
        commit='ef15a06038502f249bd702255401e1f09dc738ee'
        def git(*args):return subprocess.check_output(['git',*args],cwd=ROOT)
        self.assertEqual(git('rev-parse','v3.0').decode().strip(),'dd43ea3d8b5ac7ec3fd35b2ea17791696bd2d675')
        self.assertEqual(git('rev-parse','v3.0^{commit}').decode().strip(),commit)
        subprocess.run(['git','merge-base','--is-ancestor',commit,'HEAD'],cwd=ROOT,check=True)
        # Git stores LF for text; compare normalized text, exact bytes for assets.
        for name in ['analysis.py','data/scenarios.json','data/presentation-data.js','data/airports.json','data/airport-references.json','data/coordinate-validation.json','data/asset-manifest.json']:
            expected=git('show',commit+':'+name).decode('utf-8').replace('\r\n','\n')
            self.assertEqual((ROOT/name).read_text(encoding='utf-8'),expected,name)
        # Pinned files also remain byte-identical to the release baseline.
        for name in ['assets/vendor/three.min.js','assets/vendor/OrbitControls.js','assets/vendor/THREE-LICENSE.txt','data/countries.geojson']:
            self.assertEqual((ROOT/name).read_bytes(),git('show',commit+':'+name),name)

if __name__=='__main__':unittest.main()
