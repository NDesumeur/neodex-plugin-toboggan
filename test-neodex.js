// lancé par le test « local » de NeoDex : ouvre le premier niveau, pose une rampe au clavier, lance, et vérifie que les billes
// arrivent toutes dans le pot (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('tgCanvas').getAttribute('aria-label') || ''`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('tgCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'toboggan-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(600);
  // le plein écran remplit l'écran, puis la place prise dans la fenêtre
  await pj(`document.getElementById('tgFs').click(), 0`); await sleep(700);
  const fsOk = await pj(`(() => { const c = document.getElementById('tgCanvas'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fsOk) throw new Error('le plein écran ne remplit pas l’écran');
  const Lw = await pj(`(() => { const r = document.getElementById('tgCanvas').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('tgCanvas').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (Lw.bottom > Lw.wh + 1 || Lw.sw > Lw.ww + 1 || Lw.h < 300) throw new Error('le jeu dépasse la fenêtre ou reste petit : ' + JSON.stringify(Lw));
await shot('0-niveau');
  let l = await label(); if (!/niveau 1 .*: présentation, 0 pièces/.test(l)) throw new Error('le premier niveau devait se présenter : « ' + l + ' »');
  await key(' '); await sleep(200);
  for (let i = 0; i < 6; i++) await key('ArrowLeft'); for (let i = 0; i < 2; i++) await key('ArrowUp');
  await key(' '); await sleep(400); await shot('1-rampe');
  l = await label(); if (!/: construction, 1 pièces posées, pièce choisie Rampe/.test(l)) throw new Error('la rampe devait être posée : « ' + l + ' »');
  await key('Enter'); await sleep(2500); await shot('2-descente');
  for (let i = 0; i < 30 && !/: réussi,/.test(await label()); i++) await sleep(300);
  await sleep(800); await shot('3-reussi');
  l = await label(); if (!/: réussi, 1 pièces posées, billes arrivées 3 sur 3/.test(l)) throw new Error('les trois billes devaient arriver dans le pot : « ' + l + ' »');
  // un niveau des nouvelles pièces (ventilateur, aimants, deux couleurs), avec sa solution
  await pj(`document.getElementById('tgCanvas').__tg.sol(29), 0`); await sleep(1200); await shot('4-final');
  for (let i = 0; i < 30 && !/: réussi,/.test(await label()); i++) await sleep(300);
  const f = await label(); if (!/niveau 30 Grand final : réussi, 3 pièces posées, pots rouge, bleue, billes arrivées 6 sur 6/.test(f)) throw new Error('le grand final devait réussir : « ' + f + ' »');
  await sleep(1500);
  return l + ' · ' + f;
};
