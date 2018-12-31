# Facebook OC (Unofficial)
## Original Content

Facebook OC is a chrome extension to filter the sea of shares and group posts
that we've grown accustomed to seeing in our news feeds, in order to see
our friends' (and pages') original content posts. It is easily toggled,
and only requires chrome storage permissions in order to save its on/off
setting.

Note that shares are still allowed as long as the sharer has written more than
a few words in the post body. In my experience, these shares are few and far
between.

It works by scanning stories in the newsfeed and setting their `display`
property to `none` if they are found to not be Original Content.

I am not a web developer, or anything close to one. This is a for-fun project
with what is probably bad-style javascript.
