"""Convert design px (428px artboard) to scalable units: Npx -> calc(N * var(--u)).
Usage: python3 tools/build-css.py   (reads css/main.src.css, writes css/main.css,
and converts px inside style="" attributes of index.html in place)."""
import re, os
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PX = re.compile(r'(?<![\w.-])(-?\d*\.?\d+)px\b')
conv = lambda t: PX.sub(lambda m: m.group(0) if float(m.group(1)) == 0 else f'calc({m.group(1)} * var(--u))', t)

src = open(os.path.join(root, 'css/main.src.css')).read()
out = '\n'.join(l if '--u:' in l else conv(l) for l in src.split('\n'))
open(os.path.join(root, 'css/main.css'), 'w').write('/* GENERATED from main.src.css by tools/build-css.py — edit the source. */\n' + out)

html_p = os.path.join(root, 'index.html')
html = open(html_p).read()
html = re.sub(r'style="([^"]*)"', lambda m: 'style="' + conv(m.group(1)) + '"', html)
open(html_p, 'w').write(html)
