'use client';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type Props = { carId: string; initial?: boolean; onChanged?: (v: boolean) => void };

export default function ReservedBadgeToggle({ carId, initial = false, onChanged }: Props) {
  const [value, setValue] = useState(!!initial);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const save = async (val: boolean) => {
    setLoading(true); setErr(null);
    try {
      const res = await fetch(`/api/cars/${carId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reserved_badge: val }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'API error');
      setValue(val);
      onChanged?.(val);
    } catch (e: any) {
      setErr(e?.message || 'Błąd zapisu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <Label htmlFor="reserved_badge" className="text-sm">Stempel „ZAREZERWOWANY” na zdjęciu</Label>
      <div className="flex items-center gap-3">
        <Switch id="reserved_badge" checked={value} disabled={loading} onCheckedChange={(v)=>save(!!v)} />
        {err && <span className="text-xs text-red-600">{err}</span>}
      </div>
    </div>
  );
}
