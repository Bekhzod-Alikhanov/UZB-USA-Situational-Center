import { Lora } from "next/font/google";

/**
 * Editorial "voice" serif for the /brief exhibition page only.
 * The platform serif (Instrument Serif) ships latin-only; the brief page is
 * demoed primarily in Russian, so its one serif phrase needs real Cyrillic.
 * Loaded here (not in the root layout) so no other route pays for it.
 */
export const briefVoice = Lora({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--brief-font-voice",
  display: "swap",
  preload: false,
});
