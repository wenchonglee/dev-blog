import exhibitStyles from "../exhibit.module.css";
import styles from "./styles.module.css";

export const Squiggle = ({ title }: { title: string }) => {
  return (
    <div className={exhibitStyles.container}>
      <div className={styles.squiggle}>
        <h1>{title}</h1>
      </div>

      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={0} height={0}>
        <defs>
          <filter id="squiggle-0">
            <feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" seed="0" />
            <feDisplacementMap id="displacement" in="SourceGraphic" in2="noise" scale="8" />
          </filter>
          <filter id="squiggle-100">
            <feTurbulence id="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" seed="4" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
          </filter>
        </defs>
      </svg>
    </div>
  );
};
