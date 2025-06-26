import type { APIContext } from 'astro';

// このAPIルートを動的なサーバーサイドレンダリングに設定します
export const prerender = false;

export async function GET(context: APIContext) {
  try {
    const kv: KVNamespace = context.locals.runtime.env.marukazuk;
    const current_score = (await kv.get('current_score')) || 0;
    const high_score = (await kv.get('high_score')) || 0;

    return new Response(
      JSON.stringify({
        current_score: Number(current_score),
        high_score: Number(high_score),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('GET Error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}

export async function POST(context: APIContext) {
  try {
    const kv: KVNamespace = context.locals.runtime.env.marukazuk;
    const { score } = (await context.request.json()) as { score: number };

    const current_score_str = await kv.get('current_score');
    const high_score_str = await kv.get('high_score');

    let current_score = Number(current_score_str) || 0;
    let high_score = Number(high_score_str) || 0;

    if (score > current_score) {
      current_score = score;
      await kv.put('current_score', current_score.toString());
    }

    if (score > high_score) {
      high_score = score;
      await kv.put('high_score', high_score.toString());
    }

    return new Response(
      JSON.stringify({
        current_score,
        high_score,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('POST Error:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), { status: 500 });
  }
}