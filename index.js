// Toboggan : construire des circuits à billes : rampes, entonnoirs, trampolines, aiguillages et tunnels.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Toboggan</span><span class="hint">clic : poser · re-clic : tourner ou enlever · Entrée : lancer · flèches et Espace au clavier</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="tgCanvas" width="240" height="150" role="img" aria-label="Toboggan"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="tgStats"></div></div>
      <div class="row"><button class="btn main" id="tgNew">NOUVELLE PARTIE</button></div>
      <div class="hint">Des distributeurs lâchent des billes en haut du panneau. Choisis une pièce en bas (rampe, entonnoir, trampoline, aiguillage) et pose-la sur une case vide ; re-clique pour la tourner, puis pour l'enlever (ou clic droit). Lance : les billes roulent, rebondissent et s'entrechoquent pour de vrai. Mène-les toutes dans les pots, de la bonne couleur quand il y en a, sans les faire tomber sur les pics. Les tunnels violets et verts téléportent de l'entrée (trou noir) à la sortie. Moins tu poses de pièces, plus tu gagnes d'étoiles ; une étoile ouvre le niveau suivant.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:0 0 auto;position:relative}
.gameBox canvas{height:min(72vh,600px);width:auto;aspect-ratio:240/150;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}


export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "TOBOGGAN", T: {"k": "#0c0a12", "k2": "#16121e", "fill": "#221c2c", "fillOn": "#2e263a", "hl": "#3a3046", "line": "#62566e", "acc": "#f0a030", "accL": "#ffe0a0", "accS": "#a05a10", "accD": "#2a1808", "rivet": "#f0f0f8", "btn": "#3a3046", "btnHi": "#62566e", "btnLo": "#16121e", "btnHov": "#443852", "btnHovHi": "#82768e", "text": "#f4f0f8", "muted": "#c0b8cc", "acc2": "#7ee07a", "gold": "#ffd84a", "orange": "#ff8a3a", "red": "#ff4a3a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#100c16", "bgDot": "#221c2c", "bgDot2": "#16121e", "spark": "#2a1808", "spark2": "#f0a030", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["............", ".kkk........", ".kaak.......", "..kaak......", "...kaak.....", "....kaak....", ".....kaak...", "......kaak..", ".......kk.k.", "........kwwk", "........kwwk", ".........kk."],
  icons: [[/^NOUVELLE/, 'play'], [/^RECORDS/, 'crown']] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (v > (b ?? 0)) {  // un score nul n'est jamais un record
    games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

/* ---------- Toboggan : construis un circuit à billes. Des distributeurs lâchent des billes en haut ; pose des rampes, des entonnoirs,
   des trampolines et des aiguillages sur le panneau pour les mener dans les pots, en évitant les pics et en passant par les tunnels.
   Puis lance : les billes roulent, rebondissent et s'entrechoquent pour de vrai. Moins de pièces = plus d'étoiles ---------- */
const TG = {W: 240, H: 150, TS: 16, COLS: 15, ROWS: 8, R: 3.5, G: .08, SUB: 4, VMAX: 5, EVERY: 40, PER: 3, MAXT: 3600};
// une nouvelle partie garde le même objet : la boucle du jeu (gameLoop) continue de tourner dessus
const renew = (old, o) => { if (!old) return o; for (const k of Object.keys(old)) if (k !== 'raf') delete old[k]; return Object.assign(old, o); };
const tgs = gstore('toboggan', {best: {}, stars: {}, level: 0, wins: 0});
let tg = null, tgac = null, tgMute = false;
function tgBeep(f, d, type = 'square', slide = 0, vol = .03) { if (tgMute) return; try { tgac ??= new AudioContext(); const o = tgac.createOscillator(), g = tgac.createGain(), t = tgac.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g).connect(tgac.destination); o.start(t); o.stop(t + d); } catch {} }
// les pièces : segments dans la case (0 à 16), le 5e nombre = rebond (trampoline)
const TG_SEG = {
  '#': [[0, 0, 16, 0], [16, 0, 16, 16], [16, 16, 0, 16], [0, 16, 0, 0]],
  R: [[0, 2, 16, 14]], L: [[16, 2, 0, 14]],
  F: [[0, 1, 4, 13], [16, 1, 12, 13]],
  B: [[2, 12, 14, 12, 1]],
  U: [[1, 3, 1, 15], [1, 15, 15, 15], [15, 15, 15, 3]],
  S0: [[14, 3, 2, 13]], S1: [[2, 3, 14, 13]],
};
// le panneau : . vide (on peut y poser), # mur, H distributeur, U pot, X pics, r l f b pièces fixes, A→a et C→c tunnels (entrée → sortie)
const TG_PIECES = {R: 'Rampe', F: 'Entonnoir', B: 'Trampoline', S: 'Aiguillage'};
const TG_PK = Object.keys(TG_PIECES);
const TG_LEVELS = [
  {name: 'Première pente', hop: 'r', cups: '*', inv: {R: 2}, par: 1, sol: [[1, 1, 'R']], map: [
    '.H.............', '...............', '...............', '...............', '...............', '...............', '...............', '###########U###']},
  {name: 'Le saut', hop: 'r', cups: '*', inv: {R: 2, B: 1}, par: 2, sol: [[2, 2, 'B'], [1, 1, 'R']], map: [
    '.H.............', '...............', '...............', '...............', '...............', '...............', '...............', '####XXXX###U###']},
  {name: 'Face à face', hop: 'rgb', cups: '*', inv: {R: 3}, par: 2, sol: [[1, 6, 'R'], [13, 6, 'L']], map: [
    '.H.....H.....H.', '...............', '...............', '...............', '...............', '...............', '...............', '#######U#######']},
  {name: 'Corniche', hop: 'r', cups: '*', inv: {R: 3, B: 1}, par: 2, sol: [[1, 1, 'R'], [5, 4, 'B']], map: [
    '.H.............', '...............', '...............', '####...........', '...............', '...............', '...............', 'XXXXXXXXXXXU###']},
  {name: 'Le tunnel', hop: 'g', cups: '*', inv: {R: 2}, par: 1, sol: [[1, 1, 'R']], map: [
    '.H.............', '..........###..', '..........#a#..', '..........#.#..', '..........#.#..', '..........#.#..', '.....A....#.#..', '###########U###']},
  {name: 'Chassé-croisé', hop: 'rb', cups: 'br', inv: {R: 4, B: 2}, par: 3, sol: [[1, 2, 'R'], [14, 1, 'B'], [13, 1, 'R']], map: [
    '.H...........H.', '...............', '...............', '...............', '...............', '...............', '...............', '##U#########U##']},
  {name: 'Aiguillage', hop: 'x', cups: 'rb', inv: {R: 2, S: 1}, par: 1, sol: [[7, 1, 'S0']], map: [
    '.......H.......', '...............', '...............', '...............', '...............', '...............', '...............', '####U#####U####']},
  {name: 'Trampolines', hop: 'y', cups: '*', inv: {R: 2, B: 2}, par: 2, sol: [[1, 3, 'R'], [3, 5, 'B']], map: [
    '.H.............', '...............', '...............', '...............', '............U..', '...........###.', '...............', '###############']},
  {name: 'Labyrinthe', hop: 'g', cups: '*', inv: {R: 4, F: 1}, par: 3, sol: [[1, 1, 'R'], [5, 3, 'L'], [13, 6, 'L']], map: [
    '.H.............', '...............', '#####.#########', '..A............', '###########....', '.............a.', '...............', 'XXXXXXXXXXXU###']},
  {name: 'Grande machine', hop: 'x', cups: 'rb', inv: {R: 4, B: 1, F: 1, S: 1}, par: 3, sol: [[7, 1, 'S0'], [4, 6, 'F'], [9, 5, 'R']], map: [
    '.......H.......', '...............', '...............', '.C.............', '####.......####', '...............', '.............c.', 'XU##XXXXXXX##UX']},
];
const tgUnlocked = li => li === 0 || (tgs.stars[li - 1] || 0) >= 1;
const tgFixed = c => '#HUXrlfbAaCc'.includes(c);
const tgKind = c => ({r: 'R', l: 'L', f: 'F', b: 'B', s: 'S'})[c] || c;
// une partie : le plan, les pièces posées, l'inventaire ; tgLaunch prépare une descente, tgStep la fait avancer d'une image
function tgNew(li = tgs.level) {
  const g = tg?.g, L = TG_LEVELS[li];
  tg = renew(tg, {g, li, L, mode: 'ready', tick: 0, seen: 0, dead: 0, put: new Map(), cur: {x: 7, y: 3}, sel: TG_PK.find(k => L.inv[k]), balls: [], msg: null,
    run: null, stars: 0, record: false, fx: [], kb: false, hover: null});
  tgInfo();
}
const tgUsed = k => [...tg.put.values()].filter(v => v[0] === k).length;
const tgLeft = k => (tg.L.inv[k] || 0) - tgUsed(k);
function tgCell(x, y) { if (x < 0 || y < 0 || x >= TG.COLS || y >= TG.ROWS) return ''; const p = tg.put.get(y * TG.COLS + x); return p || tg.L.map[y][x]; }
function tgPrep() {  // les distributeurs (avec leurs couleurs), les pots (avec la leur), les tunnels
  const L = tg.L, hops = [], cups = [], tun = {}; let h = 0, u = 0;
  L.map.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === 'H') hops.push({x: x * 16 + 8, y: y * 16 + 10, c: L.hop[h++] || L.hop[0], n: 0});
    if (c === 'U') cups.push({x, y, c: L.cups[u++] ?? L.cups[0]});
    if ('AaCc'.includes(c)) tun[c] = {x: x * 16 + 8, y: y * 16 + 8};
  }));
  return {hops, cups, tun};
}
function tgLaunch() {
  const P = tgPrep();
  tg.run = {...P, t: 0, still: 0, done: false, flip: new Map()};
  tg.balls = []; tg.fx = []; tg.msg = null;
  for (const [k, v] of tg.put) if (v[0] === 'S') tg.run.flip.set(k, v === 'S1' ? 1 : 0);
}
function tgSegs(tx, ty) {
  const c = tgCell(tx, ty); if (!c || c === '.') return null;
  let k = tgKind(c); if (k === 'S' || k === 'S0' || k === 'S1') k = 'S' + (tg.run?.flip.get(ty * TG.COLS + tx) ?? (c === 'S1' ? 1 : 0));
  return TG_SEG[k];
}
function tgHit(b, s, ox, oy) {
  const R = TG.R, ax = s[0] + ox, ay = s[1] + oy, dx = s[2] - s[0], dy = s[3] - s[1], L2 = dx * dx + dy * dy;
  const t = Math.max(0, Math.min(1, ((b.x - ax) * dx + (b.y - ay) * dy) / L2)), ex = b.x - ax - dx * t, ey = b.y - ay - dy * t, d2 = ex * ex + ey * ey;
  if (d2 >= R * R) return;
  const d = Math.sqrt(d2) || .001, nx = ex / d, ny = ey / d; b.x += nx * (R - d); b.y += ny * (R - d);
  const vn = b.vx * nx + b.vy * ny; if (vn >= 0) return;
  const tx = -ny, ty = nx, vt = b.vx * tx + b.vy * ty, nvn = s[4] ? Math.max(-vn, 3.3) : -vn * .25;
  b.vx = nx * nvn + tx * vt * .997; b.vy = ny * nvn + ty * vt * .997;
  if (s[4]) { if (-vn > .5) { tg.fx.push({x: b.x, y: b.y + 3, t: 0, k: 'boing'}); tgBeep(300, .12, 'square', 700); } }
  else if (-vn > 1.2) tgBeep(900 + Math.random() * 300, .03, 'triangle', 0, .02);
}
function tgStep() {
  const r = tg.run, {R, G, SUB, VMAX, TS} = TG; r.t++;
  for (const h of r.hops) if (h.n < TG.PER && r.t % TG.EVERY === 1 + r.hops.indexOf(h) * 8) { tg.balls.push({x: h.x, y: h.y, vx: 0, vy: .3, c: h.c === 'x' ? 'rb'[h.n % 2] : h.c, st: 'go', still: 0, cool: 0, tile: -1}); h.n++; }
  for (let s = 0; s < SUB; s++) {
    for (const b of tg.balls) {
      if (b.st !== 'go') continue;
      b.vy += G / SUB; const v = Math.hypot(b.vx, b.vy); if (v > VMAX) { b.vx *= VMAX / v; b.vy *= VMAX / v; }
      b.x += b.vx / SUB; b.y += b.vy / SUB;
      const tx = Math.floor(b.x / TS), ty = Math.floor(b.y / TS);
      for (let y = ty - 1; y <= ty + 1; y++) for (let x = tx - 1; x <= tx + 1; x++) { const S = tgSegs(x, y); if (S) for (const sg of S) tgHit(b, sg, x * TS, y * TS); }
    }
    // les billes se cognent entre elles
    const B = tg.balls;
    for (let i = 0; i < B.length; i++) for (let j = i + 1; j < B.length; j++) {
      const a = B[i], b = B[j]; if (a.st !== 'go' || b.st !== 'go') continue;
      const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy; if (d2 >= 4 * R * R || d2 === 0) continue;
      const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, o = (2 * R - d) / 2; a.x -= nx * o; a.y -= ny * o; b.x += nx * o; b.y += ny * o;
      const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny; if (vn < 0) { const j2 = -vn * .6; a.vx -= nx * j2; a.vy -= ny * j2; b.vx += nx * j2; b.vy += ny * j2; }
    }
  }
  for (const b of tg.balls) {
    if (b.st !== 'go') continue;
    const tx = Math.floor(b.x / TS), ty = Math.floor(b.y / TS), k = ty * TG.COLS + tx, c = tgCell(tx, ty);
    if (b.y > TG.ROWS * TS + 8 || b.x < -8 || b.x > TG.W + 8) { b.st = 'lost'; tgBeep(160, .2, 'square', 60); continue; }
    if (c === 'X' && b.y % TS > 7) { b.st = 'lost'; tg.fx.push({x: b.x, y: b.y, t: 0, k: 'pop', c: b.c}); tgBeep(200, .15, 'sawtooth', 80); continue; }
    if (b.cool > 0) b.cool--;
    else for (const [e, x] of [['A', 'a'], ['C', 'c']]) { const T = r.tun[e], O = r.tun[x]; if (T && O && Math.hypot(b.x - T.x, b.y - T.y) < 5) { b.x = O.x; b.y = O.y; b.cool = 20; b.vx = 0; b.vy = .5; /* le tunnel est un tuyau : la bille ressort en tombant droit */ tg.fx.push({x: O.x, y: O.y, t: 0, k: 'warp', c: x}); tgBeep(500, .15, 'sine', 1200); } }
    // un aiguillage bascule quand une bille le quitte
    if (b.tile !== k) { const p = tg.put.get(b.tile) || ''; if (p[0] === 'S' || tg.L.map[Math.floor(b.tile / TG.COLS)]?.[b.tile % TG.COLS] === 's') { r.flip.set(b.tile, 1 - (r.flip.get(b.tile) ?? 0)); tgBeep(700, .04); } b.tile = k; }
    const sp = Math.hypot(b.vx, b.vy); b.still = sp < .06 ? b.still + 1 : 0;
    // une bille qui tombe dans un pot y reste : elle est rangée au fond (le pot ne déborde jamais)
    const ly = b.y - ty * TS, cy = c === 'U' && ly > 5 ? ty : tgCell(tx, ty + 1) === 'U' && ly >= 12 ? ty + 1 : -1;  // la bouche du pot attrape aussi une bille qui roule juste au-dessus
    const cup = cy >= 0 && b.x % TS > 2 && b.x % TS < 14 ? r.cups.find(u => u.x === tx && u.y === cy) : null;
    if (cup) { b.st = cup.c === '*' || cup.c === b.c ? 'in' : 'bad'; b.cup = cup; b.k = cup.n = (cup.n || 0) + 1; tgBeep(b.st === 'in' ? 1200 : 220, .08); }
  }
  tg.fx = tg.fx.filter(f => ++f.t < 20);
  // fin : tout est sorti, et chaque bille est dans un pot, perdue ou immobile
  const out = r.hops.every(h => h.n >= TG.PER), calm = tg.balls.every(b => b.st !== 'go' || b.still > 90);
  if (out && calm || r.t > TG.MAXT) r.done = true;
}
const tgResult = () => ({n: TG.PER * tg.run.hops.length, ok: tg.balls.filter(b => b.st === 'in').length});
function tgPlace(x, y) {  // poser la pièce choisie ; re-cliquer une rampe ou un aiguillage le tourne, puis l'enlève
  if (tg.mode !== 'edit' || tg.L.map[y]?.[x] !== '.') return false;
  tgStop(); const k = y * TG.COLS + x, p = tg.put.get(k);
  if (p) { const next = {R: 'L', S0: 'S1'}[p]; if (next) tg.put.set(k, next); else tg.put.delete(k); tgBeep(next ? 600 : 300, .05); tgInfo(); return true; }
  if (!tg.sel || tgLeft(tg.sel) <= 0) { tg.msg = {txt: 'Plus de ' + (TG_PIECES[tg.sel] || 'pièce').toLowerCase() + ' : enlèves-en une', t: 120}; return false; }
  tg.put.set(k, tg.sel === 'S' ? 'S0' : tg.sel); tgBeep(800, .05); tgInfo(); return true;
}
function tgRemove(x, y) { if (tg.mode !== 'edit') return; tgStop(); if (tg.put.delete(y * TG.COLS + x)) { tgBeep(300, .05); tgInfo(); } }
function tgStop() { tg.run = null; tg.balls = []; }
function tgGo() { if (tg.mode !== 'edit') return; if (tg.run && !tg.run.done) { tgStop(); return; } tgLaunch(); tg.mode = 'play'; tgBeep(520, .1, 'square', 780); }
function tgUpdate() {  // appelée seulement pendant la descente (mode « play » de la boucle du jeu)
  tgStep();
  if (!tg.run.done) return;
  const {n, ok} = tgResult(), used = tg.put.size;
  if (ok === n) {
    tg.mode = 'over'; tg.dead = 0; tg.stars = used <= tg.L.par ? 3 : used <= tg.L.par + 2 ? 2 : 1; tgs.wins++;
    const b = tgs.best[tg.li]; tg.record = b != null && used < b; if (b == null || used < b) tgs.best[tg.li] = used;
    if (tg.stars > (tgs.stars[tg.li] || 0)) tgs.stars[tg.li] = tg.stars; if (tg.li + 1 < TG_LEVELS.length) tgs.level = tg.li + 1;
    saveGames(); tgInfo(); tgBeep(660, .5, 'square', 1320);
  } else { tg.mode = 'edit'; tg.run.done = true; tg.msg = {txt: ok + ' bille' + (ok > 1 ? 's' : '') + ' sur ' + n + ' : retouche ton circuit', t: 240}; tgBeep(220, .3, 'square', 110); }
}
// ---------- le dessin ----------
const TG_BALL = ['..kkk..', '.kcwck.', 'kcwccdk', 'kccccdk', 'kcccddk', '.kcddk.', '..kkk..'];
const TG_BCOL = {r: ['#e83a3a', '#a01a2a'], b: ['#3a7ae8', '#1a4aa0'], g: ['#3ac85a', '#1a8a3a'], y: ['#f8c830', '#b88a10']};
const tgBallSpr = (g, x, y, c) => sprite(g, TG_BALL, Math.round(x - 3.5), Math.round(y - 3.5), {k: '#120c18', c: TG_BCOL[c][0], d: TG_BCOL[c][1], w: '#ffffff'});
function tgLine(g, x0, y0, x1, y1, col, w = 1) { const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0))); for (let i = 0; i <= n; i++) px(g, col, x0 + (x1 - x0) * i / n - (w >> 1), y0 + (y1 - y0) * i / n - (w >> 1), w, w); }
// une rampe ou un rail : dessus clair, corps, dessous sombre
function tgRail(g, ox, oy, s, [hi, mid, lo]) {
  const [x0, y0, x1, y1] = s;
  tgLine(g, ox + x0, oy + y0 + 1, ox + x1, oy + y1 + 1, lo, 2); tgLine(g, ox + x0, oy + y0, ox + x1, oy + y1, mid, 2); tgLine(g, ox + x0, oy + y0 - 1, ox + x1, oy + y1 - 1, hi);
}
const TG_PLAST = {R: ['#ffe0a0', '#f0a030', '#a05a10'], F: ['#ffb0a0', '#e84a3a', '#901a1a'], S: ['#b0d8ff', '#3a8ae8', '#1a4a90']};
const TG_WOOD = ['#d8a870', '#9a6a3a', '#5a3a1a'];
function tgPiece(g, c, ox, oy, fixed, flip) {
  const k = tgKind(c), wood = fixed;
  if (k === '#') { px(g, '#2a2438', ox, oy, 16, 16); px(g, '#4a4058', ox, oy, 15, 15); px(g, '#5a5070', ox, oy, 15, 1); px(g, '#5a5070', ox, oy, 1, 15);
    px(g, '#3a3248', ox + 1, oy + 7, 14, 1); px(g, '#3a3248', ox + (oy % 32 ? 5 : 10), oy + 1, 1, 6); px(g, '#3a3248', ox + (oy % 32 ? 11 : 4), oy + 8, 1, 7); return; }
  if (k === 'R' || k === 'L') { const s = TG_SEG[k][0]; tgRail(g, ox, oy, s, wood ? TG_WOOD : TG_PLAST.R); return; }
  if (k === 'F') { for (const s of TG_SEG.F) tgRail(g, ox, oy, s, wood ? TG_WOOD : TG_PLAST.F); return; }
  if (k === 'B') { sprite(g, ['kkkkkkkkkkkkkk', 'kWWWWWWWWWWWWk', 'kggggggggggggk', 'kddddddddddddk', 'kkkkkkkkkkkkkk', '..s.s....s.s..', '...s......s...'], ox + 1, oy + 9, {k: '#120c18', W: wood ? '#d8a870' : '#a0f0a0', g: wood ? '#9a6a3a' : '#3ac85a', d: wood ? '#5a3a1a' : '#1a8a3a', s: '#b0b0c8'}); return; }
  if (k[0] === 'S') { const s = TG_SEG[flip ? 'S1' : 'S0'][0]; tgRail(g, ox, oy, s, wood ? TG_WOOD : TG_PLAST.S); px(g, '#120c18', ox + 6, oy + 6, 4, 4); px(g, '#e0e0f0', ox + 7, oy + 7, 2, 2); }
}
function tgDraw() {
  const g = tg.g, {W, H, TS, COLS, ROWS} = TG;
  for (; tg.seen < tg.tick; tg.seen++) { if (tg.mode === 'over') tg.dead++; if (tg.msg && --tg.msg.t <= 0) tg.msg = null; }
  g.imageSmoothingEnabled = false;
  // le panneau perforé
  px(g, '#1c1a2e', 0, 0, W, ROWS * TS);
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) { px(g, '#262438', x * TS + 7, y * TS + 7, 2, 2); px(g, '#141224', x * TS + 7, y * TS + 9, 2, 1); }
  const P = tg.run || tgPrep(), hopAt = new Map(P.hops.map(h => [Math.floor(h.y / TS) * COLS + Math.floor(h.x / TS), h])), cupAt = new Map(P.cups.map(u => [u.y * COLS + u.x, u]));
  for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
    const ox = x * TS, oy = y * TS, base = tg.L.map[y][x], k = y * COLS + x, put = tg.put.get(k);
    if (put) { tgPiece(g, put, ox, oy, false, (tg.run?.flip.get(k) ?? (put === 'S1' ? 1 : 0)) === 1); continue; }
    if (base === '.') continue;
    if (base === 'H') { const h = hopAt.get(k);  // le distributeur : une trémie avec les billes qui restent
      sprite(g, ['kkkkkkkkkkkkkk', 'kWwwwwwwwwwwdk', 'kWwwwwwwwwwwdk', '.kWwwwwwwwwdk.', '..kWwwwwwwdk..', '...kWwwwwdk...', '....kWwwdk....', '.....kwdk.....', '.....k..k.....'], ox + 1, oy, {k: '#120c18', w: '#7a809a', W: '#b8c0d8', d: '#4a4a62'});
      const left = TG.PER - (tg.run ? h.n : 0); for (let i = 0; i < left; i++) { const bc = h.c === 'x' ? 'rb'[(TG.PER - left + i) % 2] : h.c; sprite(g, ['.kk.', 'kcwk', 'kcck', '.kk.'], ox + 3 + i * 4, oy + 1, {k: '#120c18', c: TG_BCOL[bc][0], w: '#ffffff'}); } continue; }
    if (base === 'U') { const u = cupAt.get(k), col = u.c === '*' ? '#e8e4ff' : TG_BCOL[u.c][0];  // le pot : un bocal avec un ruban de sa couleur
      px(g, '#120c18', ox, oy + 2, 3, 14); px(g, '#120c18', ox + 13, oy + 2, 3, 14); px(g, '#120c18', ox, oy + 14, 16, 2);
      px(g, '#a8d0f0', ox + 1, oy + 3, 1, 12); px(g, '#6a8aa8', ox + 14, oy + 3, 1, 12); px(g, '#6a8aa8', ox + 1, oy + 14, 14, 1); px(g, '#203048', ox + 2, oy + 4, 12, 10);
      px(g, col, ox, oy + 2, 3, 2); px(g, col, ox + 13, oy + 2, 3, 2); continue; }
    if (base === 'X') { px(g, '#2a2438', ox, oy + 13, 16, 3); for (let i = 0; i < 4; i++) { px(g, '#8a8aa0', ox + i * 4 + 1, oy + 9, 3, 4); px(g, '#c8c8d8', ox + i * 4 + 2, oy + 7, 1, 6); px(g, '#ffffff', ox + i * 4 + 2, oy + 6, 1, 1); } continue; }
    if ('AaCc'.includes(base)) { const col = 'Aa'.includes(base) ? ['#c86ae8', '#6a2a90'] : ['#5ae0a0', '#1a8a5a'], ent = base === 'A' || base === 'C', t = tg.tick / 6;
      for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + (ent ? t : -t); px(g, i % 3 ? col[1] : col[0], ox + 7.5 + Math.cos(a) * 6, oy + 7.5 + Math.sin(a) * 6, 1, 1); }
      px(g, ent ? '#05010b' : col[1], ox + 5, oy + 5, 6, 6); if (!ent) px(g, col[0], ox + 7, oy + 7, 2, 2); continue; }
    tgPiece(g, base, ox, oy, true, base === 's' && tg.run?.flip.get(k) === 1);
  }
  for (const b of tg.balls) {
    if (b.st === 'go') tgBallSpr(g, b.x, b.y, b.c);
    else if (b.cup) { const i = b.k - 1, x = b.cup.x * TS + 3 + (i % 3) * 4, y = b.cup.y * TS + 11 - Math.floor(i / 3) * 3;  // rangée au fond du pot
      if (y > b.cup.y * TS + 3) { px(g, '#120c18', x - 1, y - 1, 4, 4); px(g, TG_BCOL[b.c][0], x, y, 2, 2); px(g, '#ffffff', x, y, 1, 1); }
      if (b.st === 'bad' && tg.tick % 30 < 15) px(g, '#ff3a3a', x, y - 1, 2, 1); }
  }
  for (const f of tg.fx) {
    if (f.k === 'pop') for (let i = 0; i < 6; i++) { const a = i * 1.05; px(g, TG_BCOL[f.c][0], f.x + Math.cos(a) * f.t * .6, f.y + Math.sin(a) * f.t * .6, 1, 1); }
    if (f.k === 'boing') px(g, '#a0f0a0', f.x - f.t / 2, f.y, f.t, 1);
    if (f.k === 'warp') for (let i = 0; i < 8; i++) { const a = i * .785; px(g, '#ffffff', f.x + Math.cos(a) * (8 - f.t * .4), f.y + Math.sin(a) * (8 - f.t * .4), 1, 1); }
  }
  // la case visée (clavier ou souris) avec l'aperçu de la pièce choisie
  const cur = tg.kb ? tg.cur : tg.hover;
  if (tg.mode === 'edit' && cur && !tg.run) { const ox = cur.x * TS, oy = cur.y * TS, free = tg.L.map[cur.y][cur.x] === '.', w = free ? '#ffffff' : '#ff6a5a';
    if (free && !tg.put.has(cur.y * COLS + cur.x) && tg.sel && tgLeft(tg.sel) > 0) { g.globalAlpha = .5; tgPiece(g, tg.sel === 'S' ? 'S0' : tg.sel, ox, oy, false, false); g.globalAlpha = 1; }
    for (const [a, b] of [[0, 0], [12, 0], [0, 15], [12, 15]]) px(g, w, ox + a, oy + b, 4, 1); for (const [a, b] of [[0, 0], [15, 0], [0, 12], [15, 12]]) px(g, w, ox + a, oy + b, 1, 4); }
  // en bas : les pièces à poser, les billes arrivées, le bouton
  const hy = ROWS * TS; px(g, '#141222', 0, hy, W, H - hy); px(g, '#2a2640', 0, hy, W, 1);
  TG_PK.filter(k => tg.L.inv[k]).forEach((k, i) => { const x = 2 + i * 30, on = tg.sel === k, n = tgLeft(k);
    px(g, on ? '#ffd84a' : '#2a2640', x, hy + 3, 29, 18); px(g, on ? '#2a2018' : '#1c1a2e', x + 1, hy + 4, 27, 16);
    tgPiece(g, k === 'S' ? 'S0' : k, x, hy + 4, false, false); pxFont(g, String(n), x + 27, hy + 18, n ? '#ffffff' : '#5a5068', 7, 'right'); });
  const res = tg.run ? tgResult() : null;
  pxFont(g, res ? 'Billes ' + res.ok + ' / ' + res.n : '3★ : ' + tg.L.par + ' pièce' + (tg.L.par > 1 ? 's' : ''), 186, hy + 15, res ? '#ffffff' : '#b8b0c8', 6, 'right');
  const running = tg.mode === 'play'; px(g, running ? '#e84a3a' : '#3ac85a', 190, hy + 4, 48, 16); px(g, running ? '#ff8a7a' : '#a0f0a0', 190, hy + 4, 48, 1); px(g, '#120c18', 190, hy + 19, 48, 1);
  pxFont(g, running ? 'STOP' : 'LANCER', 214, hy + 15, '#ffffff', 8, 'center');
  if (tg.msg) { px(g, 'rgba(14,10,20,.85)', 0, hy - 12, W, 12); pxFont(g, tg.msg.txt, W / 2, hy - 3, '#ffd84a', 7, 'center'); }
  if (tg.mode === 'pause') gameText(g, W, [['PAUSE', '#ffd84a', 12], ['Entrée : reprendre', '#b8b0c8']], 60);
  if (tg.mode === 'ready') { const cupsTxt = tg.L.cups === '*' ? 'Mène toutes les billes dans les pots' : 'Chaque bille dans le pot de sa couleur';
    gameText(g, W, [[(tg.li + 1) + '. ' + tg.L.name.toUpperCase(), '#ffd84a', 12], [cupsTxt, '#ffffff'], ['3 étoiles : ' + tg.L.par + ' pièce' + (tg.L.par > 1 ? 's' : '') + ' ou moins', '#ffd84a'],
      ['Clic : poser · re-clic : tourner ou enlever', '#b8d0ff'], ['← → : niveau · Espace : construire', '#b8b0c8']], 34); }
  if (tg.mode === 'over' && tg.dead > 20) {
    gameText(g, W, [['CIRCUIT RÉUSSI !', '#ffd84a', 12], [tg.put.size + ' pièce' + (tg.put.size > 1 ? 's' : '') + (tg.record ? ' · RECORD !' : ''), '#ffffff'], ['', ''], ['', ''],
      [tg.dead > 50 ? (tg.li + 1 < TG_LEVELS.length ? 'Espace : niveau suivant · R : refaire' : 'Espace : rejouer') : '', '#b8b0c8']], 40);
    tgStars(g, tg.stars, W / 2 - 25, 61);
  }
  if (tg.tick % 15 === 0) g.canvas.setAttribute('aria-label', 'Toboggan, niveau ' + (tg.li + 1) + ' ' + tg.L.name + ' : ' + {ready: 'présentation', edit: 'construction', play: 'en route', pause: 'pause', over: 'réussi'}[tg.mode] +
    ', ' + tg.put.size + ' pièces posées' + (res ? ', billes arrivées ' + res.ok + ' sur ' + res.n : '') + ', pièce choisie ' + (TG_PIECES[tg.sel] || 'aucune') + (tg.mode === 'over' ? ', ' + tg.stars + ' étoiles' : '') + '.');
}
const TG_STAR = ['...k...', '..kyk..', 'kkkyykk', 'kyyyyyk', '.kyyyk.', '.kykyk.', 'kk...kk'];
function tgStars(g, n, x, y) { for (let i = 0; i < 3; i++) TG_STAR.forEach((r, j) => [...r].forEach((c, k) => { const col = (i < n ? {k: '#1a1008', y: '#ffd84a'} : {k: '#5a5068', y: '#3a3046'})[c]; if (col) px(g, col, x + i * 18 + k * 2, y + j * 2, 2, 2); })); }
function tgInfo() {
  const li = tg ? tg.li : tgs.level, L = TG_LEVELS[li];
  $('tgStats').replaceChildren(...[['Niveau', (li + 1) + '. ' + L.name], ['Record', tgs.best[li] != null ? tgs.best[li] + ' pièces' : '--'], ['Étoiles', (tgs.stars[li] || 0) + ' / 3'], ['Pour 3 étoiles', L.par + ' pièces'],
    ['Circuits réussis', tgs.wins], ['Étoiles en tout', Object.values(tgs.stars).reduce((a, b) => a + b, 0) + ' / ' + TG_LEVELS.length * 3]].flatMap(([a, c]) => [el('span', '', a), el('b', '', String(c))]));
}
function tgPick(dir) { let li = tg.li; do li = (li + dir + TG_LEVELS.length) % TG_LEVELS.length; while (!tgUnlocked(li)); tgs.level = li; saveGames(); tgNew(li); }
function tgStart() { if (tg.mode === 'over') { if (tg.li + 1 < TG_LEVELS.length && tgUnlocked(tg.li + 1)) tgNew(tg.li + 1); else tgNew(tg.li); } tg.mode = 'edit'; }
function tgChoose(k) { if (!tg.L.inv[k]) return; tg.sel = k; tgBeep(660, .04); }
const tgHalt = () => { tg.mode = 'edit'; tgStop(); };
document.addEventListener('keydown', e => {
  if (!view.classList.contains('on') || !tg || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const k = e.key;
  if (tg.mode === 'ready' || tg.mode === 'over') {
    const ok = tg.mode === 'ready' || tg.dead > 50;
    if ((k === 'ArrowLeft' || k === 'ArrowRight') && ok) { e.preventDefault(); tgPick(k === 'ArrowLeft' ? -1 : 1); return; }
    if ((k === 'r' || k === 'R') && tg.mode === 'over' && ok) { tgHalt(); return; }
    if ((k === ' ' || k === 'Enter') && ok) { e.preventDefault(); tgStart(); }
    return;
  }
  if (tg.mode === 'pause') { if (k === 'Enter' || k === ' ' || k === 'p' || k === 'P') { e.preventDefault(); tg.mode = 'play'; } return; }
  const live = TG_PK.filter(q => tg.L.inv[q]);
  if (/^[1-4]$/.test(k) && live[k - 1]) { tgChoose(live[k - 1]); return; }
  if (k === 'Enter') { e.preventDefault(); if (tg.mode === 'play') tgHalt(); else tgGo(); return; }
  if (k === 'Escape' && tg.mode === 'play') { tgHalt(); return; }
  if (tg.mode !== 'edit') return;
  const d = {ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1]}[k];
  if (d) { e.preventDefault(); tg.kb = true; tg.cur.x = Math.max(0, Math.min(TG.COLS - 1, tg.cur.x + d[0])); tg.cur.y = Math.max(0, Math.min(TG.ROWS - 1, tg.cur.y + d[1])); return; }
  if (k === ' ') { e.preventDefault(); tg.kb = true; tgPlace(tg.cur.x, tg.cur.y); return; }
  if (k === 'Delete' || k === 'Backspace') { tgRemove(tg.cur.x, tg.cur.y); return; }
  if (k === 'r' || k === 'R') { tgStop(); tg.put.clear(); tgInfo(); }
});
{ const cv = $('tgCanvas'), at = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * TG.W, (e.clientY - r.top) / r.height * TG.H]; };
  // à la souris : clic sur une pièce en bas pour la choisir, sur une case pour poser, re-clic pour tourner puis enlever ; clic droit pour enlever
  cv.onpointerdown = e => {
    e.preventDefault(); if (!tg) return; const [x, y] = at(e);
    if (tg.mode === 'ready' || (tg.mode === 'over' && tg.dead > 50)) return tgStart();
    if (tg.mode === 'over') return;
    if (tg.mode === 'pause') { tg.mode = 'play'; return; }
    if (y >= TG.ROWS * TG.TS) { if (x >= 190) { if (tg.mode === 'play') tgHalt(); else tgGo(); return; }
      const live = TG_PK.filter(q => tg.L.inv[q]), i = Math.floor((x - 2) / 30); if (live[i]) tgChoose(live[i]); return; }
    const cx = Math.floor(x / TG.TS), cy = Math.floor(y / TG.TS); tg.kb = false;
    if (tg.mode === 'play') tgHalt();
    if (e.button === 2) tgRemove(cx, cy); else tgPlace(cx, cy);
  };
  cv.onpointermove = e => { if (!tg) return; const [x, y] = at(e); tg.hover = y < TG.ROWS * TG.TS ? {x: Math.floor(x / TG.TS), y: Math.floor(y / TG.TS)} : null; if (e.pointerType === 'mouse') tg.kb = false; };
  cv.onpointerleave = () => { if (tg) tg.hover = null; };
  cv.oncontextmenu = e => e.preventDefault(); }
$('tgNew').onclick = () => { tgNew(tg?.li ?? tgs.level); $('tgNew').blur(); };
setTimeout(() => {  // vérification, 2 s après le chargement : chaque niveau est bien dessiné, ne se résout pas tout seul, et sa solution le résout avec « par » pièces
  const bad = [], keep = tg, keepS = JSON.stringify(tgs); tg = null; tgMute = true;
  TG_LEVELS.forEach((L, li) => {
    if (L.map.length !== TG.ROWS || L.map.some(r => r.length !== TG.COLS)) { bad.push(L.name + ' : plan'); return; }
    const play = put => { tgNew(li); tg.put = new Map(put.map(([x, y, k]) => [y * TG.COLS + x, k])); tgLaunch(); while (!tg.run.done) tgStep(); const r = tgResult(); return r.ok === r.n; };
    if (play([])) bad.push(L.name + ' : réussi sans pièce');
    if (L.sol.length !== L.par || !play(L.sol)) bad.push(L.name + ' : la solution ne marche pas');
    const need = {}; for (const [, , k] of L.sol) { const q = k === 'L' ? 'R' : k[0]; need[q] = (need[q] || 0) + 1; } if (Object.keys(need).some(q => need[q] > (L.inv[q] || 0))) bad.push(L.name + ' : pas assez de pièces');
  });
  console.assert(!bad.length, 'toboggan', bad);
  Object.assign(tgs, JSON.parse(keepS)); for (const k of Object.keys(tgs)) if (!(k in JSON.parse(keepS))) delete tgs[k];
  tg = keep; tgMute = false; if (tg) tgInfo();
}, 2000);
ctx.onOpen(() => {
  if (!tg || !tg.g) { tgNew(tgUnlocked(tgs.level) ? tgs.level : 0); tg.g = $('tgCanvas').getContext('2d'); }
  gameLoop(tg, 'toboggan', tgUpdate, tgDraw); tgInfo();
});
}
