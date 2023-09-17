import { Outfit as Font } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
export const bodyFont = Font({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
