/**
 * Bot Commands Configuration
 *
 * CRITICAL: Commands must be registered for webhook verification to succeed!
 *
 * Define your bot's slash commands here. These will appear in the Towns UI
 * and are REQUIRED for the webhook handshake to work properly.
 */

export default [
  {
    name: "help",
    description: "Show bot help and available features",
  },
  {
    name: "info",
    description: "Display bot information",
  },
  {
    name: "joke",
    description: "Tell a joke",
  },
  // Add your custom commands here
  // {
  //   name: 'stats',
  //   description: 'Show server statistics',
  // },
];

/*

  {
    name: "trade"
    description: "ask for a trade idea",
  },
  
  // example: "i want to buy ethereum for 200 usdc"


*/
