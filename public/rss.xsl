<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />
    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title><xsl:value-of select="/rss/channel/title" /> - RSS Feed</title>
                <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;0,500;1,300;1,400&amp;family=DM+Mono:wght@300;400;500&amp;display=swap" rel="stylesheet" />
                <style>
                    :root {
                        --background: #faf6ef;
                        --foreground: #2a2722;
                        --card: #fffdf8;
                        --border: #e5ddcd;
                        --ink-soft: #4a443c;
                        --ink-mute: #807668;
                        --ink-faint: #b5ab9b;
                        --paper-deep: #f4eee3;
                        --peach-deep: #c69a72;
                    }

                    @media (prefers-color-scheme: dark) {
                        :root {
                            --background: #1f1c18;
                            --foreground: #f2ead8;
                            --card: #262218;
                            --border: #3a342a;
                            --ink-soft: #d6ccb6;
                            --ink-mute: #948b79;
                            --ink-faint: #5d5649;
                            --paper-deep: #181511;
                            --peach-deep: #e8bd8b;
                        }
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family: "Newsreader", ui-serif, Georgia, serif;
                        line-height: 1.7;
                        color: var(--foreground);
                        background-color: var(--background);
                        margin: 0;
                        padding: 0;
                        min-height: 100vh;
                    }

                    .container {
                        max-width: 720px;
                        margin: 0 auto;
                        padding: 3rem 1.5rem;
                    }

                    .header {
                        margin-bottom: 2.5rem;
                    }

                    .header h1 {
                        font-family: "Newsreader", ui-serif, Georgia, serif;
                        font-size: 2.5rem;
                        font-weight: 500;
                        margin: 0 0 0.5rem 0;
                        color: var(--foreground);
                        letter-spacing: -0.02em;
                        line-height: 1.05;
                    }

                    .header p {
                        font-size: 1.1rem;
                        color: var(--ink-soft);
                        margin: 0 0 1.25rem 0;
                        font-weight: 300;
                    }

                    .rss-info {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.375rem;
                        padding: 0.375rem 0.75rem;
                        border: 1px solid var(--border);
                        border-radius: 2px;
                        font-family: "DM Mono", ui-monospace, monospace;
                        font-size: 0.7rem;
                        color: var(--ink-mute);
                        text-decoration: none;
                        letter-spacing: 0.03em;
                        transition: color 0.15s, border-color 0.15s;
                    }

                    .rss-info:hover {
                        color: var(--foreground);
                        border-color: var(--ink-mute);
                    }

                    .posts {
                        display: flex;
                        flex-direction: column;
                    }

                    .post {
                        padding: 1.25rem 0;
                        border-bottom: 1px dotted var(--border);
                    }

                    .post:first-child {
                        padding-top: 0;
                    }

                    .post h2 {
                        font-family: "Newsreader", ui-serif, Georgia, serif;
                        font-size: 1.35rem;
                        font-weight: 500;
                        margin: 0 0 0.25rem 0;
                        line-height: 1.25;
                    }

                    .post h2 a {
                        color: var(--foreground);
                        text-decoration: none;
                    }

                    .post h2 a:hover {
                        text-decoration: underline;
                    }

                    .post-meta {
                        font-family: "DM Mono", ui-monospace, monospace;
                        font-size: 0.7rem;
                        color: var(--ink-mute);
                        margin-bottom: 0.5rem;
                        letter-spacing: 0.03em;
                    }

                    .post-content {
                        font-size: 0.95rem;
                        color: var(--ink-soft);
                        font-weight: 300;
                        line-height: 1.6;
                    }

                    .categories {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.375rem;
                        margin-top: 0.75rem;
                    }

                    .category {
                        display: inline-flex;
                        align-items: center;
                        padding: 0.125rem 0.5rem;
                        border: 1px solid var(--border);
                        border-radius: 2px;
                        font-family: "DM Mono", ui-monospace, monospace;
                        font-size: 0.65rem;
                        color: var(--ink-soft);
                        background: var(--card);
                    }

                    .category::before {
                        content: "#";
                        margin-right: 0.1rem;
                    }

                    @media (max-width: 640px) {
                        .container {
                            padding: 2rem 1rem;
                        }

                        .header h1 {
                            font-size: 2rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1><xsl:value-of select="/rss/channel/title" /></h1>
                        <p><xsl:value-of select="/rss/channel/description" /></p>
                        <a href="{/rss/channel/link}" class="rss-info">
                            Visit Website &#x203A;
                        </a>
                    </div>

                    <div class="posts">
                        <xsl:for-each select="/rss/channel/item">
                            <article class="post">
                                <div class="post-meta">
                                    <xsl:value-of select="substring(pubDate, 1, 16)" />
                                </div>
                                <h2>
                                    <a href="{link}">
                                        <xsl:value-of select="title" />
                                    </a>
                                </h2>

                                <div class="post-content">
                                    <xsl:value-of select="description" />
                                </div>

                                <xsl:if test="category">
                                    <div class="categories">
                                        <xsl:for-each select="category">
                                            <span class="category">
                                                <xsl:value-of select="." />
                                            </span>
                                        </xsl:for-each>
                                    </div>
                                </xsl:if>
                            </article>
                        </xsl:for-each>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
