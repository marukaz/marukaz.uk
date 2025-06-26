
/** @vitest-environment node */
import type { Env } from 'hono';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { getPlatformProxy, type PlatformProxy } from 'wrangler';
import { GET, POST } from '../../src/pages/api/scores';
import type { APIContext } from 'astro';

declare module 'hono' {
  interface Env extends Cloudflare.Env {}
}

describe('/api/scores', () => {
  let platform: PlatformProxy<Env>;

  beforeAll(async () => {
    platform = await getPlatformProxy<Env>();
  });

  beforeEach(async () => {
    await platform.env.marukazuk.delete('current_score');
    await platform.env.marukazuk.delete('high_score');
  });

  describe('GET', () => {
    it('should return scores', async () => {
      await platform.env.marukazuk.put('current_score', '100');
      await platform.env.marukazuk.put('high_score', '1000');

      const context = {
        request: new Request('http://localhost/api/scores'),
        locals: {
          runtime: {
            env: platform.env,
          },
        },
      } as APIContext;

      const res = await GET(context);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        current_score: 100,
        high_score: 1000,
      });
    });
  });

  describe('POST', () => {
    it('should update scores if new score is higher', async () => {
      await platform.env.marukazuk.put('current_score', '50');
      await platform.env.marukazuk.put('high_score', '500');

      const request = new Request('http://localhost/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: 150 }),
      });

      const context = {
        request,
        locals: {
          runtime: {
            env: platform.env,
          },
        },
      } as APIContext;

      const res = await POST(context);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        current_score: 150,
        high_score: 500, // high_score should not be updated
      });

      const updated_current_score = await platform.env.marukazuk.get('current_score');
      const updated_high_score = await platform.env.marukazuk.get('high_score');
      expect(updated_current_score).toBe('150');
      expect(updated_high_score).toBe('500');
    });

    it('should update both scores if new score is highest', async () => {
      await platform.env.marukazuk.put('current_score', '50');
      await platform.env.marukazuk.put('high_score', '500');

      const request = new Request('http://localhost/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: 600 }),
      });

      const context = {
        request,
        locals: {
          runtime: {
            env: platform.env,
          },
        },
      } as APIContext;

      const res = await POST(context);
      const json = await res.json();

      expect(res.status).toBe(200);
      expect(json).toEqual({
        current_score: 600,
        high_score: 600,
      });

      const updated_current_score = await platform.env.marukazuk.get('current_score');
      const updated_high_score = await platform.env.marukazuk.get('high_score');
      expect(updated_current_score).toBe('600');
      expect(updated_high_score).toBe('600');
    });
  });
});
