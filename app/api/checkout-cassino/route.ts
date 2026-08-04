import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { price, name, payerName, payerDocument } = body;

    if (!price || !name || !payerName || !payerDocument) {
      return NextResponse.json({ error: 'Faltam dados obrigatórios para processar o checkout do cassino.' }, { status: 400 });
    }

    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return NextResponse.json({ error: 'Preço inválido.' }, { status: 400 });
    }

    const VELORAPAY_API_KEY = process.env.VELORAPAY_API_KEY;
    const VELORAPAY_API_SECRET = process.env.VELORAPAY_API_SECRET;

    if (!VELORAPAY_API_KEY || !VELORAPAY_API_SECRET) {
      return NextResponse.json({ error: 'Chaves da VeloraPay não configuradas no servidor.' }, { status: 500 });
    }

    // Gerar cobrança na VeloraPay para o saldo/rodada do cassino
    const response = await fetch('https://api.velorapay.com.br/payments/create', {
      method: 'POST',
      headers: {
        'x-api-key': VELORAPAY_API_KEY,
        'x-api-secret': VELORAPAY_API_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: numericPrice,
        payerName,
        payerDocument,
        description: `Créditos Cassino - ${name}`
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[VeloraPay Cassino] Error:', JSON.stringify(data));
      return NextResponse.json({ error: 'Erro na VeloraPay', details: data }, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Erro ao gerar PIX do cassino:', error);
    return NextResponse.json({ error: 'Erro interno ao processar pagamento do cassino' }, { status: 500 });
  }
}
