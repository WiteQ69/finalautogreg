'use client';

export default function ErrorCarPage({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center py-16">
          <h1 className="text-2xl font-bold mb-3">Coś poszło nie tak</h1>
          <p className="text-zinc-600 mb-6">Nie udało się wczytać szczegółów samochodu.</p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 rounded-lg bg-zinc-900 text-white"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    </div>
  );
}
