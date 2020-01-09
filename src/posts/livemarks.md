---
title: Livemarks
date: 2004-07-14
tags:
- tech
---
So, apparently the most recent Firefox nightly builds have been implementing something called ‘Livemarks’; that is, a combination of an RSS feed and a bookmark. I’m terrible at explaining this idea, and someone else has already done a good job in explaining this, so feel free to read what the author of [redemption in a blog](http://blog.codefront.net/archives/2004/07/13/rss_feed_integration_in_firefox.php) has to say. I have to say this: when I first read about it, I absolutely *hated* the idea, and now that I’ve tested it out on the most recent nightly, I love it. In order for Firefox to detect if a site has a valid RSS feed for this service, however, the weblog’s header must have the line

`<link rel="alternate" type="application/rss+xml" title="RSS" href="http://url-to-rss-feed" />`

or else it won’t detect the feed; sites with this correctly done in the header of the site will show a little yellow lightning bolt at the bottom right corner of the browser window. (Most modern weblog software will put this code in for you, but I’ve noticed on most of the Movable Type sites I read, I haven’t been able to bookmark, and Cindy, I’m getting an error when trying to add your site, which is weird.) Check out *redemption in a blog* for a better explanation and screenshots, as I’ve bastardized this enough already!
