'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Image as ImageIcon, Save } from 'lucide-react';

export default function AdAdminPage() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await fetch('/api/ad', { cache: 'no-store' });
    const j = await res.json();
    setCurrentUrl(j?.url ?? null);
  }

  useEffect(() => {
    load();
  }, []);

  async function upload() {
    if (!file) return null;
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const j = await res.json();
    if (!res.ok) throw new Error(j.error || 'Upload failed');
    return j.url as string;
  }

  async function onSave() {
    try {
      setSaving(true);
      const url = file ? await upload() : currentUrl;
      if (!url) return alert('Wybierz obraz lub podaj URL.');
      const res = await fetch('/api/ad', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const j = await res.json();
      if (!res.ok || !j.ok) throw new Error(j?.error || `Save failed (${res.status})`);
      await load(); // odśwież podgląd po zapisie
      setFile(null);
      alert('Zapisano reklamę ✅');
    } catch (e) {
      console.error(e);
      alert('Nie udało się zapisać reklamy.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/cars"><ArrowLeft className="h-4 w-4 mr-2" />Lista samochodów</Link>
          </Button>
          <h1 className="text-2xl font-bold">Reklama (globalna)</h1>
        </div>

        <Card>
          <CardHeader><CardTitle>Ustaw obraz reklamy</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="mb-2 block">Aktualna reklama</Label>
                <div className="rounded-xl border overflow-hidden bg-zinc-50">
                  {currentUrl ? (
                    <img
                      src={currentUrl}
                      alt="Reklama"
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="h-64 grid place-items-center text-zinc-400">
                      <ImageIcon className="h-10 w-10" />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Label className="mb-2 block">Nowy plik (opcjonalnie)</Label>
                <Input type="file" accept="image/*" onChange={(e) => setFile((e.target.files?.[0]) || null)} />
                {file && <p className="text-sm text-zinc-500 mt-2">{file.name}</p>}
                <Button className="mt-4" onClick={onSave} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />{saving ? 'Zapisywanie…' : 'Zapisz reklamę'}
                </Button>
              </div>
            </div>

            <p className="text-xs text-zinc-500">
              Ten obraz pojawi się na każdej karcie samochodu (prawy panel).
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
