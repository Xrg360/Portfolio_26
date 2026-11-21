// Shared drawing for the site's cartoon self-portrait (hero avatar + intro card).
// Original illustration: tall curly hair swept up, thick brows, big squarish
// glasses, full beard and moustache, warm brown skin, collared shirt.
// Coordinates are in the hero avatar's 180×122 viewBox.

export const ART = {
  skin: "#c08660",
  skinShade: "#8a5a3e",
  hairInk: "#231b16",
  hairTexture: "#5b4a3f",
  lens: "#f7f3ee",
  mouth: "#5b2018",
  lip: "#e8c2ab",

  ears: [
    { cx: 56, cy: 86 },
    { cx: 124, cy: 86 },
  ],
  face: { cx: 90, cy: 84, rx: 33, ry: 38 },
  hair:
    "M56 72 C52 62 52 52 58 46 C54 38 60 28 70 28 C70 20 80 14 88 18 C94 10 106 12 110 20 C118 16 128 24 126 34 C134 38 134 50 126 54 C130 62 126 70 124 74 C120 64 116 58 110 55 C102 51 96 52 90 50 C82 52 74 51 68 55 C63 58 59 64 56 72 Z",
  hairCurls: "M66 38 q4 -5 9 -1 M83 27 q4 -6 10 -2 M100 24 q5 -4 9 1 M113 33 q4 -2 7 3 M74 46 q4 -3 9 0 M93 38 q5 -4 10 0 M108 45 q4 -2 7 2 M60 56 q2 -4 6 -4",
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
