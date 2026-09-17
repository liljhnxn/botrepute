/**
 * BotNS Identity Resolution Abstraction
 * Prepares the UI for future BotNS (.bot) name resolution.
 * If BotNS resolution is unavailable, falls back to shortened wallet address format.
 * Never invents mock or fake .bot domains.
 */

export async function resolveIdentity(address: string): Promise<{
  displayName: string;
  hasBotNS: boolean;
  botNSName?: string;
  address: string;
}> {
  if (!address || address.length < 10) {
    return {
      displayName: address || "Unknown",
      hasBotNS: false,
      address: address || "",
    };
  }

  try {
    // In future iterations, query BotNS registry contract on Botchain.
    // Currently no BotNS contract deployed, so return shortened address as specified in requirements.
    const shortened = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return {
      displayName: shortened,
      hasBotNS: false,
      address,
    };
  } catch {
    const shortened = `${address.slice(0, 6)}...${address.slice(-4)}`;
    return {
      displayName: shortened,
      hasBotNS: false,
      address,
    };
  }
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
