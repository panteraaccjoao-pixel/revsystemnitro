import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper to clean price format
const getNumericPrice = (p: string | number) => {
  if (typeof p === 'object' || p === null || p === undefined) return 0;
  if (typeof p === 'number') return p;
  
  let clean = p.replace(/[^\d,.]/g, '').trim();
  if (!clean) return 0;
  
  if (clean.includes(',') && clean.includes('.')) {
    if (clean.indexOf('.') < clean.indexOf(',')) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      clean = clean.replace(/,/g, '');
    }
  } else if (clean.includes(',')) {
    clean = clean.replace(',', '.');
  }
  
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { payerName, payerDocument, items } = body;

    if (!payerName || !payerDocument || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios para processar o checkout.' }, { status: 400 });
    }

    // Recalcular preço no servidor de forma segura contra manipulações
    let calculatedTotal = 0;

    for (const item of items) {
      const { productId, variationName, quantity } = item;
      
      if (!productId || !quantity || quantity < 1) {
        return NextResponse.json({ error: 'Itens do carrinho inválidos.' }, { status: 400 });
      }

      // Buscar produto no Supabase
      const { data: product, error: dbError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (dbError || !product) {
        console.error('[Checkout API] Error fetching product:', productId, dbError);
        return NextResponse.json({ error: 'Um ou mais produtos selecionados não foram encontrados no estoque.' }, { status: 400 });
      }

      let itemPrice = 0;

      if (product.name === 'Combo Assinaturas') {
        // Preço fixado para o combo de 3 streamings
        itemPrice = 15.99;
      } else if (product.has_variations && product.variations && variationName) {
        // Encontrar variação correspondente
        const variation = product.variations.find((v: any) => v.name === variationName);
        if (!variation) {
          return NextResponse.json({ error: `Variação "${variationName}" não encontrada para o produto "${product.name}".` }, { status: 400 });
        }
        itemPrice = getNumericPrice(variation.price);
      } else {
        // Preço padrão do produto
        itemPrice = getNumericPrice(product.price);
      }

      calculatedTotal += itemPrice * quantity;
    }

    console.log('[Checkout API] Recalculated amount (BRL):', calculatedTotal);
    console.log('[Checkout API] Sending amount (cents):', Math.round(calculatedTotal * 100));

    if (calculatedTotal <= 0) {
      return NextResponse.json({ error: 'O valor da compra deve ser maior que zero.' }, { status: 400 });
    }

    const VELORAPAY_API_KEY = process.env.VELORAPAY_API_KEY;
    const VELORAPAY_API_SECRET = process.env.VELORAPAY_API_SECRET;

    if (!VELORAPAY_API_KEY || !VELORAPAY_API_SECRET) {
      return NextResponse.json({ error: 'Chaves da VeloraPay não configuradas no servidor.' }, { status: 500 });
    }

    // Gerar cobrança na VeloraPay com o preço verificado no servidor
    const response = await fetch('https://api.velorapay.com.br/payments/create', {
      method: 'POST',
      headers: {
        'x-api-key': VELORAPAY_API_KEY,
        'x-api-secret': VELORAPAY_API_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: calculatedTotal,
        payerName,
        payerDocument,
        description: 'Compra na loja'
      })
    });

    const data = await response.json();

    console.log('[VeloraPay] Status:', response.status);
    console.log('[VeloraPay] Response:', JSON.stringify(data));

    if (!response.ok) {
      console.error('[VeloraPay] Error details:', JSON.stringify(data));
      return NextResponse.json({ error: 'Erro na VeloraPay', details: data }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao gerar PIX:', error);
    return NextResponse.json({ error: 'Erro interno ao processar pagamento' }, { status: 500 });
  }
}
