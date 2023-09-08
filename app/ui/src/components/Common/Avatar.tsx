import color from "tinycolor2";

/**
 * It creates an SVG avatar.
 * @returns A SVG.
 */
function Avatar({ username = "admin" }: { username: string; w?: number; h?: number }) {
  let n = hash(username);
  let c1 = color({ h: n % 360, s: 0.95, l: 0.5 });
  let c1_ = c1.toHexString();
  let c2 = c1.triad()[1].toHexString();
  return (
    <svg
      className="rounded-full"
      width={32}
      height={32}
      viewBox="0 0 80 80"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        <linearGradient x1="0%" y1="0%" x2="100%" y2="100%" id="g">
          <stop stopColor={c1_} offset="0%"></stop>
          <stop stopColor={c2} offset="100%"></stop>
        </linearGradient>
      </defs>
      <g
        id="Page-1"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <rect
          id="Rectangle"
          fill="url(#g)"
          x="0"
          y="0"
          width="80"
          height="80"
        ></rect>
      </g>
    </svg>
  );
}

/**
 * Given a string, return a hash value for that string
 * @returns The hash value of the name.
 */
function hash(name: string) {
  let hashVal = 5381;
  let i = name.length;

  while (i) {
    hashVal = (hashVal * 33) ^ name.charCodeAt(--i);
  }

  return hashVal >>> 0;
}

export default Avatar;
