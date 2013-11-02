---
layout: post
title: My CSS Wishlist (Fall 2013)
---

CSS has come a long way in the past few years, with features like media queries, 3D transforms, multiple backgrounds, column layouts, and more finally becoming usable in real-world applications. This is in part due to advancing standards, of course, but moreso due to the past couple of IE releases making great strides to catch up with the competition. However, this doesn't mean all is well in CSS-land; there are still a handful of incredibly useful CSS features I'm eagerly awaiting. In no particular order:


Flexbox support in Firefox
==========================

Flexbox provides a [new way to arrange elements](http://www.adobe.com/devnet/html5/articles/working-with-flexbox-the-new-spec.html) within pages. Traditionally, layout has been mostly done using floats to stick elements to one side or the other of the parent element, with many layers of floated elements often being necessary for complex sites. While this is certainly better than table-based layouts, this style is needlessly verbose and brittle; if one element happens to overflow the available area for the float, the entire layout can come crashing down, leaving the entire page mangled. Although this risk can be mitigated with careful design, flexbox is a much more robust tool for complex layouts.

Unfortunately, [Firefox doesn't support the latest revision of flexbox](http://caniuse.com/#search=flexbox). It is the only major browser (not counting the Android Browser, but I suspect most Android users use Chrome anyways) not to support flexbox; even IE11 supports it! Worse still, there is no suitable polyfill for flexbox as of yet. [Some work](https://github.com/doctyper/reflexie/tree/develop) ecists on creating a polyfill, but it unfortunately isn't ready for real-world use yet. Thankfully, the Mozilla team is working on this, and I've got my fingers crossed that [proper flexbox support will make it into Firefox in early 2014](https://bugzilla.mozilla.org/show_bug.cgi?id=702508#c47). Until then, the best we can do is stage changes and explore flexbox within the confines of Chrome and IE.


Independent Axes for `fixed` & `absolute` Positioning
=====================================================

This may sound like a niche feature, but the web is in fact [littered](http://www.killersites.com/community/index.php?/topic/7858-fixed-element-messing-everything-up-when-you-zoom-on-a-mobile-device/) [with](http://stackoverflow.com/questions/13886763/disable-zoom-on-a-div-but-allow-zoom-on-the-page-an-alternate-div) [questions](http://stackoverflow.com/questions/11850237/ios-prevent-position-fixed-element-from-zooming) [from](http://stackoverflow.com/questions/15233076/prevent-that-a-fixed-element-resizes-when-zooming-on-touchscreen) [people](http://bradfrostweb.com/blog/mobile/fixed-position/) [trying](http://dbushell.com/2013/09/10/css-fixed-positioning-and-mobile-zoom/) to get fixed positioning to cooperate with zooming, usually in the context of mobile browsers where zooming into text is incredibly common. The infamous ppk of quirksmode even [advocates adding a new `device-fixed` position](http://www.quirksmode.org/blog/archives/2010/12/the_fifth_posit.html) to work around this issue.

My hypothetical solution for this situation is a bit different: just allow an element to be `fixed` on one axis and `absolute` on the other. In the case of my sidebar, I want it to be fixed in the vertical direction and absolute in the horizontal direction. This way it would always be pinned to the top of the viewport, but horizontal scrolling would put it out of view, since absolute positioning would pin it to side of the document, not the viewport. Zooming would also work properly, since the sidebar would be able to grow outside the viewport rather than growing within the viewport to obscure content. This method is inferior to ppk's solution for the case of a fixed full-width header, however.


`:nth-descendant` Pseudo-classes
================================

There is currently no way to select an element based on depth in CSS. Sure, you can do things like `#spam > div > div > div` to get at an element 3 levels below, but this is horribly cumbersome, terrible for selector performance, and doesn't scale to arbitrary depths. Examples of where this matters are deep forum quotes or email threads which are heavily nested. It might be nice to mark each reply level with a slightly different color for legibility purposes. With current CSS selectors, each level of depth must be manually defined, and there's no way to make the highlighting start over at a certain depth; *everything* must be directly specified. With these descendant selectors, we might do something like this to get a repeating rainbow pattern where every descendant is the next color:

{% highlight css %}
.quote:nth-descendant(6n+1) { color: red; }
.quote:nth-descendant(6n+2) { color: orange; }
.quote:nth-descendant(6n+3) { color: yellow; }
.quote:nth-descendant(6n+4) { color: green; }
.quote:nth-descendant(6n+5) { color: blue; }
.quote:nth-descendant(6n+6) { color: violet; }
{% endhighlight %}

This would repeat to any depth without repetitive CSS. While this example is a somewhat special case, similar uses exist anytime elements might nest to an unpredictable depth. This idea [was suggested a decade ago](http://lists.w3.org/Archives/Public/www-style/2003Dec/0034.html) with a few extra pseudo-classes, but sadly never seems to have caught on.


`::marker` Pseudo-elements for List Styles
========================================

Less game-changing than the rest of these features, but being able to directly select and style list bullets would be wonderful, rather than all the kludges and alternatives currently used like wrapper elements to style bullets and content separately or altogether removing bullets and re-adding them via `::before`. This is [actually a part of CSS3](http://www.w3.org/TR/css3-lists/#marker-pseudoelement), along with features like counters and `list-style-type` which are actually implemented, but unfortunately no major browser currently supports `::marker`. [Can I Use](http://caniuse.com/) doesn't even seem to have a section for it, so this appears to be another hugely useful feature left by the wayside for now.
