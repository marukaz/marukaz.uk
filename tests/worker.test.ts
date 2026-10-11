import { env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';
import worker from '../worker.js';

describe('Worker scheduled handler', () => {
  beforeEach(async () => {
    await env.marukazuk.put('current_score', '100');
    await env.marukazuk.put('monthly_high_score', '500');
    await env.marukazuk.put('high_score', '1000');
  });

  it.each([
    ['ordinary day', '2026-10-10T15:00:00Z'],
    ['second day of the month in JST', '2026-10-01T15:00:00Z'],
  ])('resets only the daily score on %s', async (_name, scheduledTime) => {
    await worker.scheduled({ cron: '0 15 * * *', scheduledTime: Date.parse(scheduledTime) }, env);

    expect(await env.marukazuk.get('current_score')).toBe('0');
    expect(await env.marukazuk.get('monthly_high_score')).toBe('500');
    expect(await env.marukazuk.get('high_score')).toBe('1000');
  });

  it.each([
    ['30-day month', '2026-09-30T15:00:00Z'],
    ['31-day month', '2026-10-31T15:00:00Z'],
    ['February', '2026-02-28T15:00:00Z'],
    ['leap year', '2028-02-29T15:00:00Z'],
    ['new year', '2026-12-31T15:00:00Z'],
  ])('resets daily and monthly scores at the JST boundary after %s', async (_name, scheduledTime) => {
    await worker.scheduled({ cron: '0 15 * * *', scheduledTime: Date.parse(scheduledTime) }, env);

    expect(await env.marukazuk.get('current_score')).toBe('0');
    expect(await env.marukazuk.get('monthly_high_score')).toBe('0');
    expect(await env.marukazuk.get('high_score')).toBe('1000');
  });

  it('ignores unrelated schedules', async () => {
    await worker.scheduled({ cron: '0 0 * * *', scheduledTime: Date.parse('2026-10-01T00:00:00Z') }, env);

    expect(await env.marukazuk.get('current_score')).toBe('100');
    expect(await env.marukazuk.get('monthly_high_score')).toBe('500');
    expect(await env.marukazuk.get('high_score')).toBe('1000');
  });
});
