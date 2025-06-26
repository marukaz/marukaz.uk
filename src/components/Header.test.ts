import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Header from './Header.astro';

test('Header component', async () => {
	const container = await AstroContainer.create();
	const html = await container.renderToString(Header);

	// サイトタイトルの確認
	expect(html).toContain('marukaz.uk');
	expect(html).toContain('href="/"');

	// ナビゲーションリンクの確認
	expect(html).toContain('Home');
	expect(html).toContain('href="/blog"');
	expect(html).toContain('Blog');
	expect(html).toContain('href="/about"');
	expect(html).toContain('About');
	expect(html).toContain('href="/kani"');
	expect(html).toContain('Game');

	// ソーシャルリンクの確認
	expect(html).toContain('https://x.com/jh');
	expect(html).toContain('https://github.com/marukaz');
	expect(html).toContain('https://www.linkedin.com/in/kazuki-matsumaru-142590153/');

	// ハンバーガーメニューの確認
	expect(html).toContain('aria-label="メニューを開く"');
});

