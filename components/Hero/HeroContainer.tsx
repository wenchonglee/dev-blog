import React from "react";

export const HeroContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="hero-container">{children}</div>;
};

// .hero-container {
//   height: 200px;
//   border-radius: 8px;
//   background-color: var(--color-primary);
// }
