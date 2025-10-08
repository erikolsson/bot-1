/**
 * Bot Commands Configuration
 * Defines available slash commands for the Secret Word Hunt Bot
 */

export default [
  {
    name: 'addadmin',
    description: 'Add a new admin (first user becomes admin automatically)',
  },
  {
    name: 'setword',
    description: 'Set the secret word that users need to find',
  },
  {
    name: 'setprize',
    description: 'Set the prize description for winners',
  },
  {
    name: 'setdescription',
    description: 'Set the congratulations message for winners',
  },
  {
    name: 'status',
    description: 'View current game configuration and winner count (admin only)',
  },
];

