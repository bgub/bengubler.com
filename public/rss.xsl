<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:atom="http://www.w3.org/2005/Atom">
    <xsl:output method="html" encoding="UTF-8" indent="yes" />
    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title><xsl:value-of select="/rss/channel/title" /></title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                    }
                    h1 {
                        color: #2c3e50;
                    }
                    h2 {
                        margin-top: 30px;
                        color: #34495e;
                    }
                    a {
                        color: #3498db;
                        text-decoration: none;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .post {
                        margin-bottom: 40px;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 20px;
                    }
                    .post:last-child {
                        border-bottom: none;
                    }
                    .post-meta {
                        font-size: 0.9em;
                        color: #7f8c8d;
                    }
                    .post-content {
                        margin-top: 10px;
                    }
                    .categories {
                        margin-top: 10px;
                    }
                    .category {
                        display: inline-block;
                        background-color: #ecf0f1;
                        padding: 3px 8px;
                        border-radius: 3px;
                        font-size: 0.8em;
                        margin-right: 5px;
                    }
                </style>
            </head>
            <body>
                <h1><xsl:value-of select="/rss/channel/title" /></h1>
                <p><xsl:value-of select="/rss/channel/description" /></p>
                <xsl:for-each select="/rss/channel/item">
                    <div class="post">
                        <h2><a href="{link}"><xsl:value-of select="title" /></a></h2>
                        <div class="post-meta">
                            Published on <xsl:value-of select="substring(pubDate, 1, 16)" />
                        </div>
                        <div class="post-content">
                            <xsl:value-of select="description" disable-output-escaping="yes" />
                        </div>
                        <div class="categories">
                            <xsl:for-each select="category">
                                <span class="category"><xsl:value-of select="." /></span>
                            </xsl:for-each>
                        </div>
                    </div>
                </xsl:for-each>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>