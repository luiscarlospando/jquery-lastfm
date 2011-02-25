/*


simple last.fm jQuery plugin
shows recently played tracks

Options:

apikey:			(string) Last.fm API key - get it from here: http://www.lastfm.com/api/account
username:		(string) username
limit:			(int) Number of tracks to load - optional, default is 20
cover:			(bool) show covers - optional, default is true
datetime:		(bool) show date and time - optional, default is true
refresh:		(int) number of seconds to check for new tracks - optional, default is 0 (no refresh)
grow:			(bool) if true new tracks extend the box, if false older tracks will be removed - optional, default is false


Usage:

$(document).ready(function() {
	$('#lastBox').lastplayed({
		apikey:		'b25b9595...',
		username:	'Username',
		limit:		5,
		cover:		true,
		datetime:	true,
		refresh:	30,
		grow:		true
	});
});



############## BUGS ####################
- tell me if you find some



*/

(function($){

	/* ###################################### Class definition ################################# */

	var recentTracksClass = function (elem, options) {

		var $myDiv = elem;
		var lasttime = 0;
		var list;
		
		var username	= options['username'];
		var limit		= options['limit'];
		var refresh		= options['refresh'];
		var apikey		= options['apikey'];
		var cover		= options['cover'];
		var datetime	= options['datetime'];
		var grow		= options['grow'];
		
		if(parseInt(refresh)>0) {
			var timer = setInterval(function(){doLastPlayedStuff();}, parseInt(refresh)*1000);
		}
		doLastPlayedStuff();
	
		function doLastPlayedStuff() {

			//remove error div if exists
			if($myDiv.children('.error')) {
				$myDiv.children('.error').remove();
			}

			//create URL
			var url_base =		'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&callback=?';
			var url_limit =		'&limit='+limit;
			var url_user =		'&user='+username;
			var url_apikey =	'&api_key='+apikey;
			var url =			url_base+url_limit+url_user+url_apikey;
			
			//sending request
			$.getJSON(url, function(data) {
				
				if($(data.recenttracks).length < 1) {
					var error = document.createElement('p');
					$(error).addClass('error');
					$(error).html('Username "'+username+'" does not exist!');
					$myDiv.append(error);
					clearInterval(timer);
					return false;
				} else if($(data.recenttracks.track).length < 1) {
					var error = document.createElement('p');
					$(error).addClass('error');
					$(error).html('"'+username+'" has no tracks to show!');
					$myDiv.append(error);
					clearInterval(timer);
					return false;
				}
				
				//create ul if not exists
				if($myDiv.children('ul').length == 0) {
					list = document.createElement('ul');
					$myDiv.html('');
					$(list).appendTo($myDiv);
				} else {
					list = $myDiv.children('ul');
				}
				
				//walk through each Track - reversed to fill up list from latest to newest
				$(data.recenttracks.track.reverse()).each(function() {
					
					//getting timestamp from latestentry
					if(this.date && this.date.uts > lasttime) {
						var tracktime = parseInt(this.date.uts);
					}
					
					//check if entry is currently playing
					if(this['@attr'] && this['@attr'].nowplaying == 'true') {
						var tracknowplaying = true;
					} else {
						var tracknowplaying = false;
					}
					
					//remove old nowplaying entry
					$(list).children('li.nowplaying').remove();
					
					if(tracktime > lasttime || tracknowplaying) {
						
						// ------------ create list item -----------
						listitem	= document.createElement('li');
						//add nowplaying class
						if(tracknowplaying) {
							$(listitem).addClass('nowplaying');
						}
						
						// ----------------- IMAGE -----------------
						if(cover == true) {
							image		= document.createElement('img');
							//set source
							$(image).attr('src', this.image[2]['#text']);
							$(image).attr('width', 64);
							//add elements to listitem
							if($(image).attr('src') != "") {
								$(image).appendTo(listitem);
							}
						}
						
						// ---------------- DATE -------------------
						if(datetime) {
							date		= document.createElement('div');
							$(date).addClass('date');
							//create time string
							if(tracknowplaying) {
								dateCont = 'now';
							} else {
								var ts = new Date(tracktime*1000);
								dateCont = makeTwo(ts.getDate())+'.'+makeTwo(ts.getMonth()+1)+' - '+makeTwo(ts.getHours())+':'+makeTwo(ts.getMinutes());
							}
							$(date).html(dateCont);
							$(date).appendTo(listitem);
						}
						
						// ----------------- TRACK -----------------
						track		= document.createElement('div');
						$(track).addClass('track');
						$(track).html(this.name);
						$(track).appendTo(listitem);
						
						// ---------------- ARTIST -----------------
						artist		= document.createElement('div');
						$(artist).addClass('artist');
						$(artist).html(this.artist['#text']);
						$(artist).appendTo(listitem);
						
						// ---------------- ALBUM ------------------
						album		= document.createElement('div');
						$(album).addClass('album');
						$(album).html(this.album['#text']);
						$(album).appendTo(listitem);
						
						
						
						//add listitem to list
						$(list).prepend(listitem);
						
						if(tracknowplaying == false) {
							lasttime = tracktime;
						}
						//console.log(this);
					}
					
				});
					
				//alert(timer+': '+lasttime);
				
				//throw old entries away
				if(grow == false) {
					while($(list).children().length > limit) {
						$(list).children('li').last().remove();
					}
				}
			
			});

		}
		
		function makeTwo(int) {
			if(int < 10) {
				return '0'+int;
			} else {
				return int;
			}
		}

    };

	/* ###################################### Class ends here ################################# */

	$.fn.extend({
		lastplayed:function(options){
			
			un = options['username']	|| undefined;
		
			if(un == undefined) {return false;}
			
			var opts = $.extend({}, defaults, options);
			
			return $(this).each(function(){
				
				new recentTracksClass($(this), opts);

			});
			
		}
	});
	
	var defaults = {
		limit:		20,
		refresh:	0,
		cover:		true,
		datetime:	true,
		grow:		false
	}

})(jQuery);