// Petites fonctions de chorégraphie au défilement (reprises du template Crimson Reach, MIT).

export const clamp = (v: number, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
/** 0 → 1 quand p va de a à b */
export const seg = (p: number, a: number, b: number) => clamp((p - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** niveau d'allumage du mot i sur n quand le manifeste est révélé à r */
export const wordLevel = (i: number, n: number, r: number) => clamp(r * (n + 4) - i, 0, 1);

/** décalage signé le plus court de l'élément i par rapport à l'actif, sur une boucle de n */
export const loopOffset = (i: number, active: number, n: number) => {
  let d = (((i - active) % n) + n) % n;
  if (d > n / 2) d -= n;
  return d;
};

export const countAt = (target: number, p: number) => Math.round(target * easeOut(clamp(p)));

/** La dune se découpe en trois panneaux qui se retournent en cartes puis s'éventaillent. */
export function journeyFrame(p: number, w: number, h: number, reduced = false) {
  const phone = w < 760;
  const F = phone ? w * 0.92 : Math.min(1100, w * 0.78);
  const H0 = phone ? Math.min(h * 0.36, F * 0.62) : Math.min(520, h * 0.6);
  const Hs = phone ? H0 : Math.min(464, h * 0.53);
  const g = phone ? 8 : 36;
  const cw = phone ? Math.min(w * 0.46, 210) : (F - 2 * g) / 3;
  const ch = phone ? cw * 1.41 : Hs;
  const fan = phone ? w * 0.27 : cw * 0.98;
  const split = reduced ? 1 : easeInOut(seg(p, 0.26, 0.4));
  const tilt = reduced ? 1 : easeInOut(seg(p, 0.6, 0.76));
  const panels = [0, 1, 2].map((i) => {
    const flip = reduced ? 1 : easeInOut(seg(p, 0.43 + i * 0.03, 0.62 + i * 0.03));
    const gap = g * split;
    const pw = (F - 2 * gap) / 3;
    const pwF = mix(pw, cw, flip);
    const phF = mix(mix(H0, Hs, split), ch, flip);
    const x0 = (i - 1) * (pw + gap);
    const x = mix(x0, (i - 1) * fan, flip) * (1 + 0.04 * tilt);
    const rz = [-12, 0, 8][i] * tilt;
    const y = [26, 0, 12][i] * tilt * (phone ? 0.6 : 1);
    return { x, y, w: pwF, h: phF, ry: 180 * flip, rz, cut: split, bgX: -(i * (F / 3) + (F / 3 - pwF) / 2) };
  });
  return { F, H0, panels, titleO: reduced ? 1 : mix(0.3, 1, seg(p, 0.2, 0.4)) };
}

/** Le grand titre « Projets phares » rétrécit vers le haut pendant que le carrousel monte. */
export function featuredFrame(p: number, big: number, reduced = false) {
  const t = reduced ? 1 : easeInOut(seg(p, 0.46, 0.84));
  const c = reduced ? 1 : easeOut(seg(p, 0.6, 0.94));
  return { scale: mix(big, 1, t), lift: 1 - t, carY: 1 - c, carO: c, subO: reduced ? 1 : seg(p, 0.8, 0.94) };
}

/**
 * Les deux mains (humaine en haut à gauche, IA en bas à droite) se rapprochent au défilement.
 * Le bout de chaque index est un point connu de l'image détourée (en fraction de sa largeur/hauteur) :
 * on place chaque main pour que son index vise le point de rencontre M, l'écart diminuant avec p (0 → 1).
 */
export const HAND_TIPS = {
  human: { x: 0.997, y: 0.847, ratio: 1011 / 1200 },
  ai: { x: 0.002, y: 0.023, ratio: 1039 / 1200 },
};

export function handsFrame(p: number, w: number, h: number, reduced = false) {
  const phone = w < 760;
  const t = reduced ? 1 : easeInOut(clamp(p));
  const hw = phone ? w * 0.62 : Math.min(w * 0.4, h * 0.74);
  const M = { x: w * 0.5, y: h * (phone ? 0.34 : 0.37) };
  // écart de départ (en diagonale) puis écart final : les doigts se frôlent sans se toucher
  const dx = mix(phone ? w * 0.2 : w * 0.24, w * (phone ? 0.012 : 0.007), t);
  const dy = mix(h * (phone ? 0.14 : 0.2), h * 0.004, t);
  const hh = hw * HAND_TIPS.human.ratio;
  const ah = hw * HAND_TIPS.ai.ratio;
  return {
    hw,
    M,
    human: { x: M.x - dx - HAND_TIPS.human.x * hw, y: M.y - dy - HAND_TIPS.human.y * hh },
    ai: { x: M.x + dx - HAND_TIPS.ai.x * hw, y: M.y + dy - HAND_TIPS.ai.y * ah },
    spark: seg(t, 0.55, 1),
  };
}
