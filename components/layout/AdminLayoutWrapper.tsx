'use client';

import { useEffect, useState } from 'react';

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean | null>(null);

  useEffect(() => {
    setIsAdminRoute(window.location.pathname.startsWith('/__admin-auto-greg'));
  }, []);

  // do czasu pierwszego renderu po stronie klienta
  if (isAdminRoute === null) return <>{children}</>;

  if (isAdminRoute) {
    // w trybie admina: NIE pokazujemy Header/Footer (dodane w layout)
    // tylko sam main (Layout przekazuje <Header/><Footer/> jako children – pomijamy je)
    return (
      <main className="min-h-screen bg-white">
        {/* wyłuskaj faktyczne dzieci z layoutu – tu najprościej
            przyjmujemy, że admin pages renderują swój <main> */}
        {children}
      </main>
    );
  }

  // public: renderujemy wszystko co layout podał (Header, main, Footer)
  return <>{children}</>;
}
