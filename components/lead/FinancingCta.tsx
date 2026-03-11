"use client";

import { useState } from "react";
import Image from "next/image";
import FinancingModal from "./FinancingModal";
import Link from "next/link";
export default function FinancingCta() {
  const [open, setOpen] = useState(false);

  return (
    <>
     <div className="mt-6 flex justify-center">
  <Link href="/finansowanie" aria-label="Sprawdź okres finansowania">
    <Image
      src="/FINANSOWANIE.png"
      alt="Sprawdź okres finansowania"
      width={350}
      height={100}
      className="hover:opacity-90 transition cursor-pointer"
    />
  </Link>
</div>

      <FinancingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}