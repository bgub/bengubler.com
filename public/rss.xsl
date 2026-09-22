<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />
    <xsl:template match="/">
        <html lang="{/rss/channel/language}">
            <xsl:if test="/rss/channel/language = 'ar'">
                <xsl:attribute name="dir">rtl</xsl:attribute>
            </xsl:if>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title><xsl:value-of select="/rss/channel/title" /> - RSS Feed</title>
                <link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;600&amp;family=Piazzolla:ital,wght@0,400;0,500;0,600;1,400&amp;display=swap" rel="stylesheet" />
                <style>
                    :root {
                        color-scheme: light dark;
                        --background: #faf6ef;
                        --card: #fffdf8;
                        --foreground: #2a2722;
                        --ink-soft: #4a443c;
                        --ink-mute: #766e63;
                        --blue: #557da8;
                        --rule: #77716a;
                        --hover: #edf2f4;
                    }

                    @media (prefers-color-scheme: dark) {
                        :root {
                            --background: #1f1c18;
                            --card: #262218;
                            --foreground: #f2ead8;
                            --ink-soft: #d6ccb6;
                            --ink-mute: #a9a092;
                            --blue: #8199bd;
                            --rule: #a89f90;
                            --hover: #303943;
                        }
                    }

                    * { box-sizing: border-box; }

                    html { background: var(--background); }

                    body {
                        margin: 0;
                        min-height: 100vh;
                        color: var(--foreground);
                        background-color: var(--background);
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cpath d='M0 0H24M0 0V24' fill='none' stroke='%23557da8' stroke-opacity='.07'/%3E%3C/svg%3E");
                        background-attachment: fixed;
                        font-family: Piazzolla, Georgia, serif;
                        line-height: 1.55;
                    }

                    [dir='rtl'] body { font-family: 'Noto Naskh Arabic', Piazzolla, serif; }

                    .container {
                        width: min(100% - 2.5rem, 880px);
                        margin: 2.5rem auto 4rem;
                    }

                    .header, .posts {
                        background: var(--card);
                        border: 1px solid var(--rule);
                    }

                    .header {
                        margin-bottom: 1.5rem;
                        padding: clamp(1.5rem, 4vw, 3.5rem);
                    }

                    .header h1 {
                        margin: 0;
                        font-size: clamp(2.75rem, 6vw, 4.5rem);
                        font-weight: 400;
                        line-height: 1.05;
                        letter-spacing: -0.045em;
                    }

                    .header p {
                        max-width: 45rem;
                        margin: 1rem 0 0;
                        color: var(--ink-soft);
                        font-size: 1.15rem;
                    }

                    .rss-info {
                        display: inline-block;
                        margin-top: 1.5rem;
                        padding-top: .65rem;
                        color: var(--foreground);
                        border-top: 1px dashed var(--blue);
                        font-size: .9rem;
                        font-weight: 600;
                        text-decoration: underline;
                        text-decoration-color: var(--blue);
                        text-underline-offset: .25rem;
                    }

                    .rss-info:hover { text-decoration-color: currentColor; }

                    .posts { padding: .25rem; }

                    .post {
                        padding: 1rem .75rem;
                        border-bottom: 1px dashed var(--rule);
                    }

                    .post:last-child { border-bottom: 0; }

                    .post:hover { background: var(--hover); }

                    .post-meta {
                        margin-bottom: .35rem;
                        color: var(--ink-mute);
                        font-size: .8rem;
                    }

                    .post h2 {
                        margin: 0;
                        font-size: clamp(1.25rem, 2vw, 1.5rem);
                        font-weight: 600;
                        line-height: 1.25;
                    }

                    .post h2 a { color: var(--foreground); text-decoration: none; }
                    .post h2 a:hover { text-decoration: underline; text-decoration-color: var(--blue); }

                    .post-content {
                        margin-top: .25rem;
                        color: var(--ink-soft);
                        font-size: 1rem;
                    }

                    .categories {
                        display: flex;
                        flex-wrap: wrap;
                        gap: .65rem;
                        margin-top: .5rem;
                    }

                    .category {
                        color: var(--ink-mute);
                        font-size: .8rem;
                    }

                    .category::before { content: '#'; }

                    @media (max-width: 640px) {
                        .container { width: min(100% - 2rem, 880px); margin-top: 1.25rem; }
                        .header { padding: 1.5rem; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <header class="header">
                        <h1><xsl:value-of select="/rss/channel/title" /></h1>
                        <p><xsl:value-of select="/rss/channel/description" /></p>
                        <a href="{/rss/channel/link}" class="rss-info">Visit Website &#x203A;</a>
                    </header>

                    <main class="posts">
                        <xsl:for-each select="/rss/channel/item">
                            <article class="post">
                                <div class="post-meta"><xsl:value-of select="substring(pubDate, 1, 16)" /></div>
                                <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
                                <div class="post-content"><xsl:value-of select="description" /></div>
                                <xsl:if test="category">
                                    <div class="categories">
                                        <xsl:for-each select="category">
                                            <span class="category"><xsl:value-of select="." /></span>
                                        </xsl:for-each>
                                    </div>
                                </xsl:if>
                            </article>
                        </xsl:for-each>
                    </main>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
