export const Squiggly = () => {
  return (
    <>
      <div className="main-container">
        <div className="squiggly">
          <h1>Wen Chong</h1>
          <img src="/avatar.svg" alt="avatar" width={200} height={200} />
          {/* https://codepen.io/lbebber/pen/KwGEQv */}
        </div>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
        <defs>
          <filter id="squiggly-0">
            <feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" seed="0" />
            <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="8" />
          </filter>

          <filter id="squiggly-4">
            <feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" seed="4" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

// @keyframes squiggly-anim {
//   0% {
//     filter: url("#squiggly-0");
//   }
//   100% {
//     filter: url("#squiggly-4");
//   }
// }

// .squiggly {
//   animation: squiggly-anim 0.34s linear infinite;
// }
