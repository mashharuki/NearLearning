const decimalPattern = /^\d+(\.\d+)?$/;

export function decimalToBaseUnits(value: string, decimals: number): string {
  const normalized = value.trim();
  if (!decimalPattern.test(normalized)) {
    throw new Error('金額は0以上の数値で入力してください。');
  }

  const [whole = '0', fraction = ''] = normalized.split('.');
  if (fraction.length > decimals) {
    throw new Error(`小数点以下は最大${decimals}桁です。`);
  }

  const raw = `${whole}${fraction.padEnd(decimals, '0')}`.replace(
    /^0+(?=\d)/,
    '',
  );
  return raw || '0';
}

export function baseUnitsToDecimal(value: string, decimals: number): string {
  if (!/^\d+$/.test(value)) {
    throw new Error('Base unitsは整数で指定してください。');
  }

  const padded = value.padStart(decimals + 1, '0');
  const whole = padded.slice(0, -decimals) || '0';
  const fraction =
    decimals > 0 ? padded.slice(-decimals).replace(/0+$/, '') : '';
  return fraction ? `${whole}.${fraction}` : whole;
}

export function formatTokenAmount(value: string, maximumFractionDigits = 6) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return value;

  return new Intl.NumberFormat('ja-JP', {
    maximumFractionDigits,
  }).format(numeric);
}

export function formatUsd(value: string | number) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return '-';

  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: numeric < 1 ? 4 : 2,
  }).format(numeric);
}
