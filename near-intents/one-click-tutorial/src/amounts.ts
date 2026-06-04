/**
 * デジル表記の金額を、指定された小数点以下の桁数に基づいて整数の文字列（ベースユニット）に変換するメソッド
 * @param value 
 * @param decimals 
 * @returns 
 */
export function decimalToBaseUnits(value: string, decimals: number): string {
  const normalized = value.trim();
  if (!/^\d+(\.\d+)?$/.test(normalized)) {
    throw new Error(`Invalid decimal amount: ${value}`);
  }

  const [whole, fraction = ''] = normalized.split('.');
  if (fraction.length > decimals) {
    throw new Error(
      `Too many decimal places for ${decimals}-decimal token: ${value}`,
    );
  }

  const paddedFraction = fraction.padEnd(decimals, '0');
  const raw = `${whole}${paddedFraction}`.replace(/^0+(?=\d)/, '');
  return raw || '0';
}

/**
 * Units in base (integer) form to decimal string with given decimals. 
 */
export function baseUnitsToDecimal(value: string, decimals: number): string {
  if (!/^\d+$/.test(value)) {
    throw new Error(`Invalid base-unit amount: ${value}`);
  }

  const padded = value.padStart(decimals + 1, '0');
  const whole = padded.slice(0, -decimals) || '0';
  const fraction =
    decimals > 0 ? padded.slice(-decimals).replace(/0+$/, '') : '';
  return fraction ? `${whole}.${fraction}` : whole;
}
