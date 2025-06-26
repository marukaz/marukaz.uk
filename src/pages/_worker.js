export default {
  async scheduled(event, env, ctx) {
    // JSTの深夜0時（UTC 15:00）に実行されるcronジョブを処理
    if (event.cron === '0 15 * * *') {
      try {
        // wrangler.jsonで定義されたKVバインディング 'marukazuk' を使用
        const kv = env.marukazuk;
        // 'current_score' を '0' にリセット
        await kv.put('current_score', '0');
        console.log('Cron job: Daily high score has been reset successfully.');
      } catch (e) {
        console.error('Cron job failed to reset the daily high score:', e);
      }
    }
  },
};