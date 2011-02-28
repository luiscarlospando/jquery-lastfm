Last.fm jQuery Plugin
=====================

Just a simple jQuery plugin that shows data of a given last.fm username.

See the demo [here](http://scripts.madewithco.de/jquery.lastfm/)

Recent Tracks
-------------

Here is an example to show the recently played tracks:

	$('#lastBox').lastplayed({
		apikey:		'f65b2b...',
		username:	'YourName'
	});

### Options

- apikey:         (string) Last.fm API key - get it from here: http://www.lastfm.com/api/account
- username:       (string) username
- limit:          (int) Number of tracks to load - optional, default is 20
- cover:          (bool) show covers - optional, default is true
- datetime:       (bool) show date and time - optional, default is true
- refresh:        (int) number of seconds to check for new tracks - optional, default is 0 (no refresh)
- grow:           (bool) if true new tracks extend the box, if false older tracks will be removed - optional, default is false
