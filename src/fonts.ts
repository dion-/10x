import {
  Outfit as Font,
  Outfit as HeaderFont,
  Fraunces as FancyFont,
} from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
export const bodyFont = Font({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const headerFont = HeaderFont({
  weight: ["500"],
  subsets: ["latin"],
});

export const fancyFont = FancyFont({
  weight: ["400"],
  subsets: ["latin"],
});
