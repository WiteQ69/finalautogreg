export function formatPrice(price: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('pl-PL').format(num);
}

export function formatMileage(mileage: number): string {
  return `${formatNumber(mileage)} km`;
}

export function formatYear(year?: number): string {
  return (year ?? '').toString();
}

export function getFuelTypeLabel(fuelType?: string): string {
  if (!fuelType) return '—';
  const labels: Record<string, string> = {
    gasoline: 'BENZYNA', benzyna: 'BENZYNA',
    diesel: 'DIESEL',
    hybrid: 'HYBRYDA', hybryda: 'HYBRYDA',
    electric: 'ELEKTRYCZNY', elektryczny: 'ELEKTRYCZNY',
    lpg: 'LPG', benzyna_lpg: 'BENZYNA + LPG',
  };
  return labels[fuelType] || fuelType;
}

export function getTransmissionLabel(transmission?: string): string {
  if (!transmission) return '—';
  const labels: Record<string, string> = {
    manual: 'Manualna', manualna: 'Manualna',
    automatic: 'AUTOMATYCZNA', automatyczna: 'AUTOMATYCZNA',
  };
  return labels[transmission] || transmission;
}

export function getBodyTypeLabel(bodyType: string): string {
  const labels: Record<string, string> = {
    sedan: 'SEDAN',
    estate: 'KOMBI',
    suv: 'SUV',
    coupe: 'COUPE',
    hatchback: 'HATCHBACK',
    convertible: 'CABRIO',
  };
  return labels[bodyType] || bodyType;
}

export function getDrivetrainLabel(drivetrain?: string): string {
  if (!drivetrain) return '—';
  const labels: Record<string, string> = {
    fwd: 'Na przód', 'przód': 'Na przód',
    rwd: 'Na tył', 'tył': 'Na tył',
    awd: '4x4', '4x4': '4x4',
  };
  return labels[drivetrain] || drivetrain;
}