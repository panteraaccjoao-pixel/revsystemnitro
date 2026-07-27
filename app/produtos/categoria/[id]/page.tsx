import { supabase } from '@/lib/supabase';
import VariationClient from './VariationClient';
import { notFound } from 'next/navigation';
import { CartBadge } from '@/components/CartBadge';

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', resolvedParams.id)
    .single();

  if (error) {
    console.error('Supabase error:', error);
  }

  if (error || !product) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-500/30 relative">
      {/* Background Glow */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.15),transparent_50%)] pointer-events-none z-0"></div>



      {/* Main Content (padded for header) */}
      <main className="relative z-10 pt-24 pb-16">
        <VariationClient product={product} />
      </main>
    </div>
  );
}
