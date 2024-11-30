const adjectives = [
  'Happy', 'Bright', 'Swift', 'Clever', 'Noble', 'Brave', 'Wise', 'Kind', 'Quick', 'Calm',
  'Smart', 'Fresh', 'Eager', 'Jolly', 'Lively', 'Proud', 'Sunny', 'Sharp', 'Keen', 'Bold'
];

const nouns = [
  'Panda', 'Eagle', 'Tiger', 'Dolphin', 'Phoenix', 'Dragon', 'Lion', 'Falcon', 'Wolf', 'Bear',
  'Star', 'Moon', 'Sun', 'Comet', 'Planet', 'Galaxy', 'Nova', 'Nebula', 'Atlas', 'Titan'
];

export function generateUsername(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 900) + 100; // Random 3-digit number
  return `${adjective}${noun}${number}`;
}

export function isTemporaryUsername(username: string): boolean {
  return /^[A-Z][a-z]+[A-Z][a-z]+\d{3}$/.test(username);
}