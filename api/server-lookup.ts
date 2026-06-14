import type { VercelRequest, VercelResponse } from '@vercel/node';
import { resolve } from 'dns';
import { promisify } from 'util';

const dnsResolve = promisify(resolve);

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^0\./,
  /^::1$/,
  /^fc00:/i,
  /^fd00:/i,
  /^fe80:/i,
  /^169\.254\./,
];

const BLOCKED_HOSTNAMES = ['localhost', 'localhost.localdomain'];

function isPrivateIP(ip: string): boolean {
  return PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(ip));
}

function isBlockedHostname(hostname: string): boolean {
  return BLOCKED_HOSTNAMES.includes(hostname.toLowerCase());
}

function isIPAddress(value: string): boolean {
  // IPv4
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value)) return true;
  // IPv6
  if (value.includes(':')) return true;
  return false;
}

async function resolveHostname(hostname: string): Promise<string[]> {
  try {
    const addresses = await dnsResolve(hostname);
    return addresses;
  } catch {
    return [];
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers consistent with other API routes
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { ip, port } = req.body;

  if (!ip || typeof ip !== 'string') {
    return res.status(400).json({ error: 'A valid IP or hostname is required.' });
  }

  if (port === undefined || port === null || typeof port !== 'number' || port < 1 || port > 65535) {
    return res.status(400).json({ error: 'A valid port number (1-65535) is required.' });
  }

  const trimmedIP = ip.trim();

  // Block known bad hostnames
  if (isBlockedHostname(trimmedIP)) {
    return res.status(400).json({ error: 'Private or reserved addresses are not allowed.' });
  }

  // If it's an IP address, check directly
  if (isIPAddress(trimmedIP)) {
    if (isPrivateIP(trimmedIP)) {
      return res.status(400).json({ error: 'Private or reserved addresses are not allowed.' });
    }
  } else {
    // It's a hostname — resolve it and check all resolved addresses
    const resolved = await resolveHostname(trimmedIP);
    if (resolved.some(isPrivateIP)) {
      return res.status(400).json({ error: 'Private or reserved addresses are not allowed.' });
    }
  }

  try {
    const upstream = await fetch(
      `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(trimmedIP)}:${port}`
    );

    if (!upstream.ok) {
      return res.status(502).json({ error: 'Upstream server returned an error.' });
    }

    const data = await upstream.json();
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: 'Failed to reach upstream server.' });
  }
}
