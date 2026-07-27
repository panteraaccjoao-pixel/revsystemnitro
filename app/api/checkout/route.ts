import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, payerName, payerDocument } = body;

    console.log('[VeloraPay] Received amount (BRL):', amount);
    console.log('[VeloraPay] Sending amount (cents):', Math.round(amount * 100));

    if (!amount || !payerName || !payerDocument) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios' }, { status: 400 });
    }

    const VELORAPAY_API_KEY = process.env.VELORAPAY_API_KEY;
    const VELORAPAY_API_SECRET = process.env.VELORAPAY_API_SECRET;

    if (!VELORAPAY_API_KEY || !VELORAPAY_API_SECRET) {
      return NextResponse.json({ error: 'Chaves da VeloraPay não configuradas no servidor.' }, { status: 500 });
    }

    // Call VeloraPay API
    const response = await fetch('https://api.velorapay.com.br/payments/create', {
      method: 'POST',
      headers: {
        'x-api-key': VELORAPAY_API_KEY,
        'x-api-secret': VELORAPAY_API_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount,
        payerName,
        payerDocument,
        description: 'Compra na loja'
      })
    });

    const data = await response.json();

    // Log full response for debugging
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
