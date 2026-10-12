# Film d'ouverture — « Intelligence artificielle »

Film hero du portfolio, fabriqué avec **/motionbykelly** (HyperFrames + GSAP), 16:9, voix off.
Le site joue déjà une version animée en code sur le même texte (`components/Hero.tsx`) ;
dès que le MP4 est rendu, il suffit de renseigner `heroFilm` dans `lib/site.ts`.

## Version A — le texte exact (≈ 9 s)

| Voix | À l'écran |
|---|---|
| Depuis l'intelligence artificielle, | Nuit, réseau de points qui dérive. Les mots arrivent flous et trop grands, puis se posent. |
| nous touchons aujourd'hui | Poussée de caméra lente ; les liaisons du réseau s'allument. |
| quelque chose d'incroyable… | Tout le réseau est aspiré au centre (silence ~0,8 s). |
| L'intelligence artificielle. | Flash, explosion du réseau, **INTELLIGENCE / ARTIFICIELLE** en dégradé cyan → violet, puis respiration lente. |

### À coller dans ElevenLabs (Eleven v4, langue réglée sur **Français**)

```
Depuis l'intelligence artificielle...
nous touchons aujourd'hui quelque chose d'incroyable.

L'intelligence artificielle.
```

Réglages : Stabilité 40-50 %, Similarité 80-90 %, tout le texte d'un coup, 2 ou 3 prises.
Voix grave et posée, ton « bande-annonce ».

## Version B — avec signature (≈ 13 s)

```
Depuis l'intelligence artificielle...
nous touchons aujourd'hui quelque chose d'incroyable.

L'intelligence artificielle.

Et moi, je la maîtrise.
```

La dernière phrase fait le pont avec la section suivante (« Et je suis l'un des meilleurs »).

## Livraison

1. Déposer la meilleure prise en `public/audio/hero-voix.mp3` → le hero du site l'utilise
   immédiatement (bouton « Activer la voix »).
2. Le film rendu va en `public/videos/hero.mp4` (+ `hero-poster.jpg`), puis dans `lib/site.ts` :
   `heroFilm: { src: "/videos/hero.mp4", poster: "/videos/hero-poster.jpg" }`.
