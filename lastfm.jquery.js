/*

simple last.fm jQuery plugin
shows recently played tracks

Athor: Ringo Rohe
       - with much help from Douglas Neiner

Options:

apikey:         (string) Last.fm API key - get it from here: http://www.lastfm.com/api/account
username:       (string) username
limit:          (int) Number of tracks to load - optional, default is 20
cover:          (bool) show covers - optional, default is true
datetime:       (bool) show date and time - optional, default is true
refresh:        (int) number of seconds to check for new tracks - optional, default is 0 (no refresh)
grow:           (bool) if true new tracks extend the box, if false older tracks will be removed - optional, default is false


Usage:

$(document).ready(function() {
	$('#lastBox').lastplayed({
		apikey:     'b25b9595...',
		username:   'Username',
		limit:      5,
		cover:      true,
		datetime:   true,
		refresh:    30,
		grow:       true
	});
});



############## BUGS ####################
- tell me if you find some



*/

(function ($) {

	/* ###################################### Class definition ################################# */

	var recentTracksClass = function (elem, options) {

		var $myDiv	 = elem,
			lasttime = 0,
			refresh	 = parseInt(options['refresh'], 10),
			$list,
			timer;
		
		if (refresh > 0) {
			timer = window.setInterval(function(){ 
				doLastPlayedStuff();
			}, refresh * 1000);
		}
		
		doLastPlayedStuff();
	
		function doLastPlayedStuff() {

			// remove error div if exists
			
			$myDiv.children('.error').remove();

			//create URL
			var url = 'http://ws.audioscrobbler.com/2.0/?callback=?',
				params = {
					method:  "user.getrecenttracks",
					format:  "json",
					limit:   options.limit,
					user:    options.username,
					api_key: options.apikey
				};
			
			//sending request
			$.getJSON(url, params, function(data) {
				
				if ( !data || !data.recenttracks ) {
					return error('Username "' + options.username + '" does not exist!');
				} else if( !data.recenttracks.track ) {
					return error('"' + options.username + '" has no tracks to show!');
				}
				
				//create ul if not exists
				$list = $myDiv.children('ul');
				if (!$list.length) {
					$list = $("<ul>").appendTo( $myDiv.html('') );
				}
				
				//walk through each Track - reversed to fill up list from latest to newest
				$(data.recenttracks.track.reverse()).each(function(i, track) {
					var tracktime, tracknowplaying, ts, listitem, dateCont;

					//getting timestamp from latestentry
					if(track.date && track.date.uts > lasttime) {
						tracktime = parseInt(track.date.uts, 10);
					}
					
					//check if entry is currently playing
					tracknowplaying = track['@attr'] && track['@attr'].nowplaying == 'true';
					
					//remove old nowplaying entry
					$list.children('li.nowplaying').remove();
					
					if(tracktime > lasttime || tracknowplaying) {
						
						// ------------ create list item -----------
						listitem = $( "<li>", { 
							// add nowplaying class
							className: tracknowplaying ? "nowplaying" : ""
						});
						
						// ----------------- IMAGE -----------------
						if (options.cover) {
							if (track.image[2]['#text']) {
								$("<img>", {
									src: track.image[2]['#text'],
									width: "64"
								}).appendTo(listitem);
							}
						}
						
						// ---------------- DATE -------------------
						if (options.datetime) {
							
							if (tracknowplaying) {
								dateCont = 'now';
							} else {
								ts = new Date(tracktime * 1000);
								dateCont = makeTwo(ts.getDate())+'.'+makeTwo(ts.getMonth()+1)+' - '+makeTwo(ts.getHours())+':'+makeTwo(ts.getMinutes());
							}
							
							$("<div>", {
								className: "date",
								html: dateCont
							}).appendTo(listitem);
						}
						
						
						// ----------------- TRACK -----------------
						$("<div>", {
							className: 'track',
							html: track.name
						}).appendTo(listitem);
						
						// ---------------- ARTIST -----------------
						$("<div>", {
							className: 'artist',
							html: track.artist['#text']
						}).appendTo(listitem);
						
						// ---------------- ALBUM ------------------
						$("<div>", {
							className: 'album',
							html: track.album['#text']
						}).appendTo(listitem);
						
						//add listitem to list
						$list.prepend(listitem);
						
						if(!tracknowplaying) {
							lasttime = tracktime;
						}
					}
					
				});
				
				//throw old entries away
				if (options.grow === false) {
					$list.children().filter(":gt(" + options.limit + ")").remove();
				}
			
			});

		}
		
		function makeTwo(i) {
			return i < 10 ? '0' + i : i;
		}
		
		function error( message ) {
			 $("<p>", {
					className: "error",
					html: message
				}).appendTo($myDiv);
				window.clearInterval(timer);
		}

	};

	/* ###################################### Class ends here ################################# */

	$.fn.lastplayed = function (options) {
		var opts = $.extend({}, $.fn.lastplayed.defaults, options);
		
		if (typeof(options.username) === "undefined") {
			return this;
		}
		
		return this.each(function(){
			recentTracksClass($(this), opts);
		});
		
	};
	
	$.fn.lastplayed.defaults = {
		limit:		20,
		refresh:	0,
		cover:		true,
		datetime:	true,
		grow:		false
	};

}(jQuery));