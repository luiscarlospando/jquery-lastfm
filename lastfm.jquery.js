/*


simple last.fm jQuery plugin
shows recently played tracks

Options:

apikey:			(string) Last.fm API key - get it from here: http://www.lastfm.com/api/account
username:		(string) username
limit:			(int) Number of tracks to load
cover:			(bool) show covers
datetime:		(bool) show date and time
refresh:		(int) number of seconds to check for new tracks


Usage:

$(document).ready(function() {
	$('#lastBox').lastplayed({
		apikey:		'b25b959554ed76058ac220b7b2e0a026',
		username:	'Username',
		limit:		5,
		cover:		true,
		datetime:	true,
		refresh:	30
	});
});



############## BUGS ####################
- tell me if you find some



*/

(function($){
	$.fn.extend({
		lastplayed:function(options){
			
			username	= options['username']	|| undefined;
			lasttime	= 0;
		
			if(username == undefined) {return false;}
			
			return $(this).each(function(){
				
				var $myDiv = $(this);
				
				var username	= options['username']	|| undefined;
				var limit		= options['limit']		|| 20;
				var refresh		= options['refresh']	|| false;
				var apikey		= options['apikey']		|| false;
				var cover		= options['cover']		|| false;
				var datetime	= options['datetime']	|| false;
				var grow		= options['grow']		|| false;
				
				if(parseInt(refresh)>0) {
					var timer = setInterval(function(){doLastPlayedStuff();}, parseInt(refresh)*1000);
				}
				doLastPlayedStuff();
			
				function doLastPlayedStuff() {

					//create URL
					var url_base =		'http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&callback=?';
					var url_limit =		'&limit='+limit;
					var url_user =		'&user='+username;
					var url_apikey =	'&api_key='+apikey;
					var url =			url_base+url_limit+url_user+url_apikey;
					
					//sending request
					$.getJSON(url, function(data) {
						
						//create ul if not exists
						if($myDiv.children('ul').length == 0) {
							list = document.createElement('ul');
							$myDiv.html('');
							$(list).appendTo($myDiv);
						}
						
						//walk through each Track - reversed to fill up list from latest to newest
						$(data.recenttracks.track.reverse()).each(function() {
							
							//getting timestamp from latestentry
							if(this.date && this.date.uts > lasttime) {
								tracktime = parseInt(this.date.uts);
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
								
								lasttime = tracktime;
								//console.log(this);
							}
							
						});
						
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

			});
			
		}
	});
})(jQuery);