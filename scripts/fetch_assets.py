"""Download pinned upstream assets; run explicitly when refreshing vendored files."""
from pathlib import Path
import urllib.request
import csv
import io
import json
import hashlib
import shutil
from datetime import datetime, timezone
from validate_airports import validate_airports

ROOT = Path(__file__).resolve().parents[1]
ASSETS = {
    'assets/vendor/three.min.js': 'https://raw.githubusercontent.com/mrdoob/three.js/r128/build/three.min.js',
    'assets/vendor/OrbitControls.js': 'https://raw.githubusercontent.com/mrdoob/three.js/r128/examples/js/controls/OrbitControls.js',
    'assets/vendor/THREE-LICENSE.txt': 'https://raw.githubusercontent.com/mrdoob/three.js/r128/LICENSE',
    'data/countries.geojson': 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_admin_0_countries.geojson',
}

def checked_path(name):
    path = (ROOT / name).resolve()
    if not path.is_relative_to(ROOT) or path == ROOT:
        raise ValueError(f'Destination outside project: {path}')
    return path

def main():
    destinations = [*ASSETS, 'data/airports.json', 'data/asset-manifest.json']
    # Validate every path before downloading or writing anything.
    paths = {name: checked_path(name) for name in destinations}
    backup_root = checked_path('backups/assets-' + datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ'))
    for name, path in paths.items():
        print('Validated:', path, flush=True)
        if path.exists():
            backup = checked_path(str((backup_root / name).relative_to(ROOT)))
            backup.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(path, backup)
            print('Backed up:', backup, flush=True)
    if not any(path.exists() for path in paths.values()):
        print('No existing destination files; no backup needed.', flush=True)
    manifest = []
    for name, url in ASSETS.items():
        payload = urllib.request.urlopen(url, timeout=30).read()
        path = paths[name]
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(payload)
        manifest.append(dict(file=name, url=url, sha256=hashlib.sha256(payload).hexdigest()))
        print(name, len(payload), flush=True)
    url = 'https://raw.githubusercontent.com/datasets/airport-codes/main/data/airport-codes.csv'
    rows = csv.DictReader(io.StringIO(urllib.request.urlopen(url, timeout=30).read().decode('utf-8')))
    airports = {}
    for row in rows:
        if row['iata_code'] in ['LHR', 'HND', 'FRA', 'SIN', 'HEL', 'ICN']:
            # This dataset's coordinates field is latitude, longitude.
            lat, lon = map(float, row['coordinates'].split(','))
            if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                raise ValueError('Invalid airport coordinates: ' + row['iata_code'])
            airports[row['iata_code']] = dict(name=row['name'], lat=lat, lon=lon, ident=row['ident'])
    assert len(airports) == 6
    validate_airports(airports)
    paths['data/airports.json'].write_text(json.dumps(dict(source=url, retrieved='2026-11-08', airports=airports), indent=2)+'\n', encoding='utf-8')
    paths['data/asset-manifest.json'].write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')

if __name__ == '__main__':
    main()
