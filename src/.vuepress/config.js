require('dotenv').config();
const webpack = require('webpack');

const websiteUrl = 'https://immudb.io';
const title = 'immudb - The lightweight, high-speed immutable database';
const description = 'immudb - the lightweight, high-speed immutable database for systems and applications. Open Source and easy to integrate into any existing application.';

const schemaOrg = `{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "publisher": {
        "@type": "Organization",
        "name": "${title}",
        "url": "${websiteUrl}",
        "logo": {
            "@type": "ImageObject",
            "url": {
                "@type": "ImageObject",
                "url": "https://immudb.io/logo.png",
                "width": 1036,
                "height": 367
            }
        }
    },
    "url": "${websiteUrl}",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${websiteUrl}"
    },
    "description": "${description}"
}`;

const googleAnalytics = `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-168112067-1');`;

const tawkTo = `var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/5f1966f77258dc118beec8d6/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();`;

const vgo = `(function(e,t,o,n,p,r,i){e.visitorGlobalObjectAlias=n;e[e.visitorGlobalObjectAlias]=e[e.visitorGlobalObjectAlias]||function(){(e[e.visitorGlobalObjectAlias].q=e[e.visitorGlobalObjectAlias].q||[]).push(arguments)};e[e.visitorGlobalObjectAlias].l=(new Date).getTime();r=t.createElement("script");r.src=o;r.async=true;i=t.getElementsByTagName("script")[0];i.parentNode.insertBefore(r,i)})(window,document,"https://diffuser-cdn.app-us1.com/diffuser/diffuser.js","vgo");
vgo('setAccount', '66487182');
vgo('setTrackByDefault', true);
vgo('process');`;

module.exports = {
    base: '/',
    dest: 'docs',
    title,
    description,
    head: [
        ['link', { rel: "canonical", href: websiteUrl }],
        ['link', { rel: "shortcut icon", type: "image/png", href: "/favicon/favicon.ico" }],
        ['link', { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon/apple-touch-icon.png" }],
        ['link', { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon/favicon-32x32.png" }],
        ['link', { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon/favicon-16x16.png" }],
        ['link', { rel: "manifest", href: "/favicon/site.webmanifest" }],
        ['link', { rel: "mask-icon", href: "/favicon/safari-pinned-tab.svg", color: "#4d4d4d" }],
        ['meta', { name: "apple-mobile-web-app-title", content: "immudb" }],
        ['meta', { name: "application-name", content: "immudb" }],
        ['meta', { name: "msapplication-TileColor", content: "#ffffff" }],
        ['meta', { name: "theme-color", content: "#ffffff" }],
        ['meta', { name: "referrer", content: "no-referrer-when-downgrade" }],
        ['meta', { property: "og:site_name", content: "immudb" }],
        ['meta', { property: "og:type", content: "website" }],
        ['meta', { property: "og:title", content: title }],
        ['meta', { property: "og:description", content: description }],
        ['meta', { property: "og:url", content: websiteUrl }],
        ['meta', { property: "article:publisher", content: websiteUrl }],
        ['meta', { name: "twitter:card", content: "summary" }],
        ['meta', { name: "twitter:title", content: title }],
        ['meta', { name: "twitter:description", content: description }],
        ['meta', { name: "twitter:url", content: websiteUrl }],
        ['meta', { name: "twitter:site", content: "@immudb" }],
        ['meta', { name: "HandheldFriendly", content: "True" }],
        ['meta', { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
        ['script', { type: "application/ld+json" }, schemaOrg],
        ['script', { type: "text/javascript" }, tawkTo],
        ['script', { type: "text/javascript" }, vgo],
    ].concat(process.env.NODE_ENV === 'production' ? [
        ['script', { async: true, src: "https://www.googletagmanager.com/gtag/js?id=UA-168112067-1" }],
        ['script', { async: true, src: "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit" }]
    ] : []),
    themeConfig: {
        logo: '/logo.png',
        nav: [
            { text: 'Home', link: 'https://codenotary.io/technologies/immudb' },
            { text: 'Blog', link: 'https://codenotary.io/blog' },
            { text: 'Documentation', link: '/' },
            { text: 'Immutable Data Science', link: 'https://codenotary.io/technologies/immudb/immutable-data-science' },
            { text: 'Playground', link: 'https://play.codenotary.com' },
            { text: 'Github', link: 'https://github.com/codenotary/immudb' },
        ],
        algolia: {
            apiKey: 'e581ef004c097d1f0ff49391645be669',
            indexName: 'immudb'
        }
    },
    plugins: [
        ['sitemap', {
            hostname: 'https://immudb.io'
        }],
        ['@vuepress/google-analytics', {
            ga: 'UA-168112067-1'
        }],
        ['vuepress-plugin-reading-time'],
        ['vuepress-plugin-element-tabs']
    ],
    configureWebpack: {
        plugins: [
            new webpack.EnvironmentPlugin({ ...process.env })
        ]
    },
};
