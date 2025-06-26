import { env } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import worker from './_worker.js';

describe('Worker scheduled handler', () => {
  it('should reset current_score to 0 on cron trigger', async () => {
    const kv = env.marukazuk;

    // 初期状態を設定
    await kv.put('current_score', '100');
    let score = await kv.get('current_score');
    expect(score).toBe('100');

    // スケジュールされたイベントを模倣してハンドラを直接呼び出す
    await worker.scheduled(
      { cron: '0 15 * * *' } as ScheduledEvent,
      env,
      { waitUntil: () => Promise.resolve() } as ExecutionContext
    );

    // 結果を確認
    score = await kv.get('current_score');
    expect(score).toBe('0');
  });
});