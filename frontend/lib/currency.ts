export function getCurrency(): 'INR' | 'USD' {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const region = locale.split('-')[1]?.toUpperCase();
    if (region === 'IN') return 'INR';
  } catch {}
  return 'USD';
}

export function formatPrice(priceUSD: number, priceINR: number, currency: 'INR' | 'USD'): string {
  if (currency === 'INR') return `₹${priceINR.toLocaleString('en-IN')}`;
  return `$${priceUSD.toFixed(2)}`;
}

// Prices
export const PRICES = {
  free:    { USD: 0,     INR: 0 },
  starter: { USD: 9.99,  INR: 899 },
  pro:     { USD: 14.99, INR: 1299 },
};

// Display names
export const displayNames = {
  free:    'Free',
  starter: 'Early Bird Starter',
  pro:     'Early Bird Pro',
};
