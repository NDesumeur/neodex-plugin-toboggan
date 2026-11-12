// lancé par le test « local » de NeoDex : ouvre le premier niveau, pose une rampe au clavier, lance, et vérifie que les billes
// arrivent toutes dans le pot (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const key = k => pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: '${k}', bubbles: true})), 0`);
  const label = () => pj(`document.getElementById('tgCanvas').getAttribute('aria-label') || ''`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('tgCanvas').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'toboggan-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await sleep(600); await shot('0-niveau');
  let l = await label(); if (!/niveau 1 .*: présentation, 0 pièces/.test(l)) throw new Error('le premier niveau devait se présenter : « ' + l + ' »');
  await key(' '); await sleep(200);
  for (let i = 0; i < 6; i++) await key('ArrowLeft'); for (let i = 0; i < 2; i++) await key('ArrowUp');
  await key(' '); await sleep(400); await shot('1-rampe');
  l = await label(); if (!/: construction, 1 pièces posées, pièce choisie Rampe/.test(l)) throw new Error('la rampe devait être posée : « ' + l + ' »');
  await key('Enter'); await sleep(2500); await shot('2-descente');
  for (let i = 0; i < 30 && !/: réussi,/.test(await label()); i++) await sleep(300);
  await sleep(800); await shot('3-reussi');
  l = await label(); if (!/: réussi, 1 pièces posées, billes arrivées 3 sur 3/.test(l)) throw new Error('les trois billes devaient arriver dans le pot : « ' + l + ' »');
  return l;
};
