import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function createServer() {
  const app = express();

  // Load JSON data into memory for sub-millisecond responses
  const articlesPath = path.resolve(__dirname, 'public/data/articles.json');
  const transcriptPath = path.resolve(__dirname, 'public/data/transcript.json');
  const referencesPath = path.resolve(__dirname, 'public/data/references.json');

  let articles: any[] = [];
  let transcriptSections: any[] = [];
  let references: any[] = [];

  try {
    if (fs.existsSync(articlesPath)) {
      articles = JSON.parse(fs.readFileSync(articlesPath, 'utf-8'));
    }
    if (fs.existsSync(transcriptPath)) {
      transcriptSections = JSON.parse(fs.readFileSync(transcriptPath, 'utf-8'));
    }
    if (fs.existsSync(referencesPath)) {
      references = JSON.parse(fs.readFileSync(referencesPath, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading initial JSON files:', err);
  }

  // Set up Vite or static serving
  let vite: any;
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
  }

  // Parse JSON bodies
  app.use(express.json());

  // ==========================================
  // REST API Endpoints (Data from JSON files)
  // ==========================================

  // GET /api/articles (List all articles with optional category & search filter)
  app.get('/api/articles', (req: Request, res: Response) => {
    const { category, search, tag } = req.query;
    let result = [...articles];

    if (category && category !== 'all') {
      result = result.filter(a => a.category === category);
    }
    if (tag) {
      result = result.filter(a => a.tags?.includes(String(tag)));
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(a =>
        a.title?.toLowerCase().includes(q) ||
        a.subtitle?.toLowerCase().includes(q) ||
        a.summary?.toLowerCase().includes(q) ||
        a.author?.name?.toLowerCase().includes(q) ||
        a.tags?.some((t: string) => t.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      total: result.length,
      data: result,
    });
  });

  // GET /api/articles/:slug (Single article by slug)
  app.get('/api/articles/:slug', (req: Request, res: Response) => {
    const { slug } = req.params;
    const article = articles.find(a => a.slug === slug || a.id === slug);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'مضمون نہیں ملا (Article not found)',
      });
    }

    res.json({
      success: true,
      data: article,
    });
  });

  // GET /api/transcript (Full transcript sections)
  app.get('/api/transcript', (_req: Request, res: Response) => {
    res.json({
      success: true,
      totalSections: transcriptSections.length,
      duration: '42:37',
      data: transcriptSections,
    });
  });

  // GET /api/references (Hadith and Scholarly references)
  app.get('/api/references', (_req: Request, res: Response) => {
    res.json({
      success: true,
      totalReferences: references.length,
      data: references,
    });
  });

  // GET /api/health
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      engine: 'Express SSR + Vite Full-Stack',
      articlesCount: articles.length,
      timestamp: new Date().toISOString(),
    });
  });

  // ==========================================
  // SSR & SEO Pre-rendering Engine
  // Injects full dynamic HTML, OpenGraph, Twitter,
  // and Schema.org JSON-LD for crawlers & humans
  // ==========================================
  app.use('*', async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;

    // Skip API and static asset requests
    if (url.startsWith('/api/') || url.match(/\.(js|css|json|ico|png|jpg|svg|woff2)$/)) {
      return next();
    }

    try {
      let template: string;
      if (!isProduction) {
        template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
      } else {
        template = fs.readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
      }

      // Check if URL targets a specific article (e.g. /article/irsal-al-yadayn-namaz-transcript)
      const articleMatch = url.match(/^\/article\/([^/?]+)/);
      const articleSlug = articleMatch ? articleMatch[1] : null;
      const targetArticle = articleSlug
        ? articles.find(a => a.slug === articleSlug || a.id === articleSlug)
        : null;

      let renderedTitle = 'فکر و قلم – جامع اردو مضامین، مقالات اور صوتی ٹرانسکرپٹ پورٹل';
      let renderedDesc =
        'فکر و قلم پر مستند اسلامی مضامین، تحقیقی مقالات اور صوتی ٹرانسکرپٹس پڑھیں۔ ارسال الیدین، تاریخ اسلام اور فقہی مباحث کے مستند دلائل و نصوص۔';
      let renderedKeywords =
        'اردو مضامین, ارسال الیدین, وضع الیدین, انجینئر محمد علی مرزا, فقہ مالکی, عبد اللہ بن زبیر, سنن ابی داؤد, صحیح مسلم, اسلامی تاریخ, تحقیقی مقالات';
      let articleLdJson = '';
      let serverRenderedContent = '';

      if (targetArticle) {
        renderedTitle = `${targetArticle.title} | فکر و قلم`;
        renderedDesc = targetArticle.summary;
        renderedKeywords = targetArticle.tags?.join(', ') || renderedKeywords;

        // Structured Data for Googlebot (Schema.org Article)
        articleLdJson = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": ${JSON.stringify(targetArticle.title)},
      "description": ${JSON.stringify(targetArticle.summary)},
      "articleSection": ${JSON.stringify(targetArticle.category)},
      "keywords": ${JSON.stringify(targetArticle.tags?.join(', '))},
      "author": {
        "@type": "Person",
        "name": ${JSON.stringify(targetArticle.author?.name || 'فکر و قلم محقق')}
      },
      "publisher": {
        "@type": "Organization",
        "name": "فکر و قلم ریسرچ پورٹل"
      },
      "datePublished": "2026-01-01",
      "inLanguage": "ur"
    }
    </script>`;

        // Server-rendered fallback HTML body for search engine crawlers & no-JS
        serverRenderedContent = `
        <noscript>
          <article style="max-width: 800px; margin: 40px auto; padding: 20px; font-family: sans-serif; direction: rtl; text-align: right; line-height: 2;">
            <header>
              <span style="background: #e6f4ea; color: #137333; padding: 4px 10px; border-radius: 4px; font-size: 14px;">${targetArticle.category}</span>
              <h1 style="font-size: 28px; margin: 15px 0;">${targetArticle.title}</h1>
              <p style="color: #666; font-size: 16px;">${targetArticle.subtitle}</p>
              <div style="font-size: 13px; color: #888; border-top: 1px solid #ddd; padding-top: 8px; margin-top: 10px;">
                <span>مقالہ نگار: ${targetArticle.author?.name} (${targetArticle.author?.role})</span> |
                <span>تاریخ اشاعت: ${targetArticle.publishedDate}</span> |
                <span>مطالعہ: ${targetArticle.readTimeMinutes} منٹ</span>
              </div>
            </header>
            <div style="margin: 20px 0; background: #fff8e1; border: 1px solid #ffe082; padding: 12px; border-radius: 8px; font-size: 13px;">
              <strong>قانونی و علمی وضاحت (Disclaimer):</strong> یہ مضمون اس کے اصل مصنف کے ذاتی افکار و تحقیق پر مبنی ہے۔ ویب سائٹ اس کی کسی بھی قانونی یا غیر قانونی ذمہ دار نہیں۔
            </div>
            <div style="margin-top: 20px; font-size: 18px; line-height: 2.2;">
              ${targetArticle.content ? targetArticle.content.replace(/\n\n/g, '<br/><br/>') : targetArticle.summary}
            </div>
          </article>
        </noscript>
        `;
      }

      // Inject dynamic SSR tags into HTML
      let html = template
        .replace(/<title>.*?<\/title>/, `<title>${renderedTitle}</title>`)
        .replace(
          /<meta name="description" content=".*?" \/>/,
          `<meta name="description" content="${renderedDesc.replace(/"/g, '&quot;')}" />`
        )
        .replace(
          /<meta property="og:title" content=".*?" \/>/,
          `<meta property="og:title" content="${renderedTitle.replace(/"/g, '&quot;')}" />`
        )
        .replace(
          /<meta property="og:description" content=".*?" \/>/,
          `<meta property="og:description" content="${renderedDesc.replace(/"/g, '&quot;')}" />`
        )
        .replace(
          /<meta name="twitter:title" content=".*?" \/>/,
          `<meta name="twitter:title" content="${renderedTitle.replace(/"/g, '&quot;')}" />`
        )
        .replace(
          /<meta name="twitter:description" content=".*?" \/>/,
          `<meta name="twitter:description" content="${renderedDesc.replace(/"/g, '&quot;')}" />`
        );

      if (articleLdJson) {
        html = html.replace('</head>', `${articleLdJson}\n</head>`);
      }

      if (serverRenderedContent) {
        html = html.replace('<div id="root"></div>', `<div id="root"></div>\n${serverRenderedContent}`);
      }

      res.status(200).set({ 'Content-Type': 'text/html; charset=utf-8' }).send(html);
    } catch (e: any) {
      if (!isProduction && vite) {
        vite.ssrFixStacktrace(e);
      }
      console.error('SSR Render Error:', e);
      res.status(500).end(e.stack || e.message);
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Fikr-o-Qalam Full-Stack Server running at http://0.0.0.0:${PORT}`);
    console.log(`📦 Serving ${articles.length} articles from JSON data`);
  });
}

createServer();
