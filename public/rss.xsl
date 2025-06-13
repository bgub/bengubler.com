<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />
    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title><xsl:value-of select="/rss/channel/title" /> - RSS Feed</title>
                <style>
                    :root {
                        --color-background: #ffffff;
                        --color-foreground: #0a0a0a;
                        --color-muted: #6b7280;
                        --color-muted-foreground: #6b7280;
                        --color-card: #ffffff;
                        --color-border: #e5e7eb;
                        --color-primary: #3b82f6;
                        --color-primary-foreground: #ffffff;
                        --color-accent: #f3f4f6;
                    }

                    @media (prefers-color-scheme: dark) {
                        :root {
                            --color-background: #0a0a0a;
                            --color-foreground: #fafafa;
                            --color-muted: #1f2937;
                            --color-muted-foreground: #9ca3af;
                            --color-card: #1f2937;
                            --color-border: #374151;
                            --color-primary: #60a5fa;
                            --color-primary-foreground: #1e40af;
                            --color-accent: #1f2937;
                        }
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
                        line-height: 1.6;
                        color: var(--color-foreground);
                        background-color: var(--color-background);
                        margin: 0;
                        padding: 0;
                        min-height: 100vh;
                    }

                    .container {
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 2rem 1rem;
                    }

                    .header {
                        text-align: center;
                        margin-bottom: 3rem;
                        padding: 2rem;
                        background-color: var(--color-card);
                        border: 1px solid var(--color-border);
                        border-radius: 0.75rem;
                    }

                    .header h1 {
                        font-size: 2.5rem;
                        font-weight: 700;
                        margin: 0 0 0.5rem 0;
                        color: var(--color-foreground);
                    }

                    .header p {
                        font-size: 1.125rem;
                        color: var(--color-muted-foreground);
                        margin: 0 0 1.5rem 0;
                    }

                    .rss-info {
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.5rem 1rem;
                        background-color: var(--color-accent);
                        border: 1px solid var(--color-border);
                        border-radius: 0.5rem;
                        font-size: 0.875rem;
                        color: var(--color-muted-foreground);
                        text-decoration: none;
                    }

                    .rss-info:hover {
                        background-color: var(--color-primary);
                        color: var(--color-primary-foreground);
                    }

                    .posts {
                        display: flex;
                        flex-direction: column;
                        gap: 1.5rem;
                    }

                    .post {
                        background-color: var(--color-card);
                        border: 1px solid var(--color-border);
                        border-radius: 0.75rem;
                        padding: 1.5rem;
                        transition: all 0.2s ease;
                    }

                    .post:hover {
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    }

                    .post h2 {
                        font-size: 1.5rem;
                        font-weight: 600;
                        margin: 0 0 0.75rem 0;
                        line-height: 1.3;
                    }

                    .post h2 a {
                        color: var(--color-foreground);
                        text-decoration: none;
                    }

                    .post h2 a:hover {
                        color: var(--color-primary);
                    }

                    .post-meta {
                        display: flex;
                        align-items: center;
                        gap: 1rem;
                        margin-bottom: 1rem;
                        font-size: 0.875rem;
                        color: var(--color-muted-foreground);
                    }

                    .post-date {
                        display: flex;
                        align-items: center;
                        gap: 0.25rem;
                    }

                    .post-content {
                        color: var(--color-muted-foreground);
                        margin-bottom: 1rem;
                    }

                    .categories {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 0.5rem;
                        margin-top: 1rem;
                    }

                    .category {
                        display: inline-flex;
                        align-items: center;
                        padding: 0.25rem 0.75rem;
                        background-color: var(--color-accent);
                        border: 1px solid var(--color-border);
                        border-radius: 0.375rem;
                        font-size: 0.75rem;
                        font-weight: 500;
                        color: var(--color-muted-foreground);
                    }

                    .category::before {
                        content: "#";
                        margin-right: 0.125rem;
                    }

                    @media (max-width: 640px) {
                        .container {
                            padding: 1rem 0.5rem;
                        }

                        .header {
                            padding: 1.5rem;
                            margin-bottom: 2rem;
                        }

                        .header h1 {
                            font-size: 2rem;
                        }

                        .post {
                            padding: 1rem;
                        }

                        .post h2 {
                            font-size: 1.25rem;
                        }

                        .post-meta {
                            flex-direction: column;
                            align-items: flex-start;
                            gap: 0.5rem;
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
                            🌐 Visit Website
                        </a>
                    </div>

                    <div class="posts">
                        <xsl:for-each select="/rss/channel/item">
                            <article class="post">
                                <h2>
                                    <a href="{link}">
                                        <xsl:value-of select="title" />
                                    </a>
                                </h2>
                                
                                <div class="post-meta">
                                    <div class="post-date">
                                        📅 <xsl:value-of select="substring(pubDate, 1, 16)" />
                                    </div>
                                </div>

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