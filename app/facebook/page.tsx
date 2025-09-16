'use client';

import { motion } from 'framer-motion';
import FacebookPageEmbed from '@/components/social/FacebookPageEmbed';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function FacebookPage() {
  return (
    <div className="min-h-screen bg-white pt-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-3 tracking-tight">
            Aktualności (Facebook)
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Najświeższe posty z naszego profilu na Facebooku.
          </p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Facebook</CardTitle>
          </CardHeader>
          <CardContent>
            <FacebookPageEmbed />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}