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
- shownowplaying: (bool) shows currently playing tracks - optional, default is true

Now Playing
-----------

Usage:

	$('#nowPlayingBox').nowplaying({
		apikey:			'b25b9595...',
		username:		'Username',
		refresh:		30,
		icon:			'http://cdn.last.fm/flatness/global/icon_eq.gif'
	});

Options

apikey:         (string) Last.fm API key - get it from here: http://www.lastfm.com/api/account
username:       (string) username
refresh:        (int) number of seconds to check for new tracks - optional, default is 0 (no refresh)
icon:			(string) url of a Icon showed beside the text - optional, default is false
hide:			(bool) hides the element when nothing is playing - optional, default is false
notplayingtext:	(string) text that is shown when nothing is played - optional, default is 'nothing playing'