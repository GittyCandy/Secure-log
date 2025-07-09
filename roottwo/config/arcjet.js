import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from './env.js';

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    shield({
      mode: "LIVE",
      block: ["BLOCKLIST"] // Disabled IP blocking
    }),
    detectBot({
      mode: "LIVE",
      allow: ["GOOD_BOTS"] // Disabled bot blocking
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 100, // Increased to 100 as requested
      interval: 60,
      capacity: 100
    }),
  ],
});

export default aj;