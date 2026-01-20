import chalk from "chalk";

import { getVersion } from "./version.js";

const d = chalk.dim;

// Cloudflare color palette
const cfOrange = chalk.hex("#F6821F");
const cfDeepOrange = chalk.hex("#F38020");
const cfDarkBlue = chalk.hex("#1F2937");
const cfGray = chalk.hex("#6B7280");

// Create Cloudflare-style gradient using orange tones
function cfGradient(text: string): string {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    const ratio = i / (lines.length - 1 || 1);
    // Transition from deep orange to bright orange
    if (ratio < 0.5) {
      return cfDeepOrange(line);
    } else {
      return cfOrange(line);
    }
  }).join('\n');
}

export const CONTINUE_ASCII_ART = `
${cfGradient(`   ██████╗███████╗     ██████╗ ██████╗ ██████╗ ███████╗██████╗
  ██╔════╝██╔════╝    ██╔════╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗
  ██║     █████╗      ██║     ██║   ██║██║  ██║█████╗  ██████╔╝
  ██║     ██╔══╝      ██║     ██║   ██║██║  ██║██╔══╝  ██╔══██╗
  ╚██████╗██║         ╚██████╗╚██████╔╝██████╔╝███████╗██║  ██║
   ╚═════╝╚═╝          ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝`)}
                                                    ${d("v" + getVersion())}`;

// ASCII art for just "CF" (first two letters)
const CF_ASCII_ART = `
${cfGradient(`   ██████╗███████╗
  ██╔════╝██╔════╝
  ██║     █████╗
  ██║     ██╔══╝
  ╚██████╗██║
   ╚═════╝╚═╝`)}
  ${d("v" + getVersion())}`;

// Minimum terminal width required to display ASCII art properly
const MIN_WIDTH_FOR_ASCII_ART = 70;

/**
 * Returns the ASCII art only if the terminal is wide enough to display it properly.
 * If terminal is too narrow, returns just the version string.
 */
export function getDisplayableAsciiArt(): string {
  const terminalWidth = process.stdout.columns || 80;

  if (terminalWidth >= MIN_WIDTH_FOR_ASCII_ART) {
    return CONTINUE_ASCII_ART;
  }

  // If terminal is too narrow, show just "CF" ASCII art
  return CF_ASCII_ART;
}

// Cloudflare logo-inspired ASCII art
export const CONTINUE_LOGO_ASCII_ART = `
${cfOrange(`                   ╔════════════════════════════════════════╗
                   ║                                        ║
                   ║     ${cfDeepOrange('▄▄▄  ▄▄▄    ▄▄▄  ▄▄▄  ▄▄▄  ▄▄▄ ▄▄▄')}    ║
                   ║    ${cfDeepOrange('█   ██     █    █ █  █ █   █ █  █')}   ║
                   ║    ${cfDeepOrange('█    █▄▄▄  █    █ █  █ ███ █ █▄▄█')}   ║
                   ║    ${cfOrange('█       █  █    █ █  █ █   █ █  █')}   ║
                   ║     ${cfOrange('▀▀▀  ▀▀▀    ▀▀▀   ▀▀▀  ▀▀▀   ▀  ▀')}    ║
                   ║                                        ║
                   ║      ${cfGray('Powered by Cloudflare')}          ║
                   ║                                        ║
                   ╚════════════════════════════════════════╝`)}
`;

// Theme colors export for use in other parts of the app
export const CF_THEME = {
  primary: cfOrange,
  secondary: cfDeepOrange,
  accent: cfDarkBlue,
  muted: cfGray,
  dim: d,
} as const;
