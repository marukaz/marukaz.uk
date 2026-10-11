export default {
  async scheduled(event, env) {
    // JSTの深夜0時（UTC 15:00）に日次・月次のリセットを処理する。
    if (event.cron !== '0 15 * * *') return;

    const kv = env.marukazuk;
    await kv.put('current_score', '0');
    console.log('Cron job: Daily high score has been reset successfully.');

    // 実行が遅れても、予定時刻の日本時間で月初を判定する。
    const scheduledDateJst = new Date(event.scheduledTime + 9 * 60 * 60 * 1000);
    if (scheduledDateJst.getUTCDate() === 1) {
      await kv.put('monthly_high_score', '0');
      console.log('Cron job: Monthly high score has been reset successfully.');
    }
  },
};
