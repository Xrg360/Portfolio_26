// Shared drawing for the site's cartoon self-portrait (hero avatar + intro card).
// Original illustration: tall curly hair swept up, thick brows, big squarish
// glasses, full beard and moustache, light skin, collared shirt.
// Coordinates are in the hero avatar's 180×122 viewBox.

export const ART = {
  skin: "#fdf8f3",
  skinShade: "#c4a08a",
  hairInk: "#231b16",
  hairTexture: "#75645a",
  lens: "#f7f3ee",
  mouth: "#5b2018",
  lip: "#e8c2ab",

  ears: [
    { cx: 56, cy: 86 },
    { cx: 124, cy: 86 },
  ],
  face: { cx: 90, cy: 84, rx: 33, ry: 38 },
  // Scalloped curly outline: short sides, tall volume swept up off the forehead.
  hair:
    "M57 74 C53 68 52 60 55 54 C51 50 52 43 57 41 C55 35 59 30 65 30 C64 24 70 20 76 21 C78 15 86 13 90 17 C94 12 102 12 105 17 C110 14 117 17 118 23 C124 23 128 29 126 35 C131 38 132 45 128 49 C131 54 129 59 125 60 C127 65 126 70 123 74 C120 66 115 60 109 58 C103 55 97 55 91 54 C84 55 77 55 71 58 C65 61 60 66 57 74 Z",
  // Little spiral curls for texture.
  hairCurls:
    "M62 45 c2 -4 8 -4 8 1 c0 3 -4 3 -4 0 M73 33 c2 -4 8 -4 8 1 c0 3 -4 3 -4 0 M87 24 c2 -4 8 -4 8 1 c0 3 -4 3 -4 0 M102 25 c2 -4 8 -4 8 1 c0 3 -4 3 -4 0 M114 35 c2 -4 7 -3 7 1 c0 3 -4 3 -4 0 M81 41 c2 -4 8 -4 8 1 c0 3 -4 3 -4 0 M97 40 c2 -4 8 -4 8 1 c0 3 -4 3 -4 0 M69 51 c2 -3 7 -3 7 1 M108 49 c2 -3 7 -3 7 1 M119 47 c1 -3 5 -3 5 0",
  beard:
    "M56 82 C56 100 66 119 90 122 C114 119 124 100 124 82 C122 93 117 100 111 103 C104 101 97 100 90 101 C83 100 76 101 69 103 C63 100 58 93 56 82 Z",
  moustache: "M75 103 Q83 96 90 100 Q97 96 105 103 Q97 104.5 90 102.5 Q83 104.5 75 103 Z",
  brows: {
    calm: ["M62 68 Q73 63 85 67", "M95 67 Q107 63 118 68"],
    raised: ["M62 66 Q74 61 85 61", "M95 61 Q106 61 118 66"],
  },
  lenses: [
    { x: 60, y: 74, w: 27, h: 20 },
    { x: 93, y: 74, w: 27, h: 20 },
  ],
  bridge: "M87 82 Q90 79 93 82 M60 81 L55 79 M120 81 L125 79",
  pupils: [
    { cx: 73.5, cy: 84 },
    { cx: 106.5, cy: 84 },
  ],
  eyeLine: 84,
  nose: "M90 89 Q86 97 91 98",
  cheeks: [
    { cx: 67, cy: 98 },
    { cx: 113, cy: 98 },
  ],
  mouths: {
    delighted: { open: "M79 105 Q90 121 101 105 Z", teeth: "M81.5 105.6 L98.5 105.6 L97.5 108.4 L82.5 108.4 Z" },
    happy: { open: "M81 105 Q90 116 99 105 Z", teeth: "M83 105.5 L97 105.5 L96 107.6 L84 107.6 Z" },
    concerned: "M83 111 Q90 106 97 111",
    focused: "M83 106 Q90 111 97 106",
  },
  collar: "M68 122 L79 112 L90 119 L101 112 L112 122",
} as const;
