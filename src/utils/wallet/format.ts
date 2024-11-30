export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function validateAddress(address: string): boolean {
  return /^[A-Fa-f0-9]{64}$/.test(address);
}