document.addEventListener("deviceready", setupPush, false);
function setupPush() {
	var push = PushNotification.init({
	"android": {
	"senderID": "436479437581"
},
	"ios": {
	"sound": true,
	"alert": true,
	"badge": true,
	"categories": {
	"invite": {
	"yes": {
	"callback": "app.accept", "title": "Accept", "foreground": true, "destructive": false
},
	"no": {
	"callback": "app.reject", "title": "Reject", "foreground": true, "destructive": false
},
	"maybe": {
	"callback": "app.maybe", "title": "Maybe", "foreground": true, "destructive": false
}
},
	"delete": {
	"yes": {
	"callback": "app.doDelete", "title": "Delete", "foreground": true, "destructive": true
},
	"no": {
	"callback": "app.cancel", "title": "Cancel", "foreground": true, "destructive": false
}
}
}
},
	"windows": {}
});
	push.on('registration', function(data) {
	console.log("registration event: " + data.registrationId);
	var oldRegId = localStorage.getItem('registrationId');
	if (oldRegId !== data.registrationId) {
// Save new registration ID
	localStorage.setItem('registrationId', data.registrationId);
// Post registrationId to your app server as the value has changed
}
});
		push.on('error', function(e) {
		console.log("push error = " + e.message);
});
		push.on('notification', function(data) {
		console.log('notification event');
		navigator.notification.alert(
		data.message, // message
		null, // callback
		data.title, // title
		'Ok' // buttonName
);
});
}


$(document).ready(function() {

	console.log("hello");

	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge:0
	};
	
	function success(pos){
		var crd =pos.coords;

		localStorage.setItem("lat", crd.latitude);
		localStorage.setItem("lng", crd.longitude);

		$('#lat').text(crd.latitude);
		$('lng').text(crd.longitude);

		console.log('Your current location is:');
		console.log("Lat: " + crd.latitude);
		console.log("Lng: " + crd.longitude);
		console.log("Acc: " + crd.accuracy + " meters.");
	};
	function error(err){
		console.warn('error($(err.code}): $err.message}');
	};
	navigator.geolocation.getCurrentPosition(success, error, options);

	

	$(".difficulty").click(function() {	

		var drinks1 = ["JagerBomb", "Apple Sourz", "VK", "Sambuca", "Gin and Tonic", "Single Vodka Mixer", "Half a Pint of Beer/Cider"];
		var drinks2 = ["JagerBomb", "2 Apple Sourz", "Pint of Beer/Cider)", "Double Vodka Mixer", "VK and a shot", "Shot of Sambuca", "Gin Lime and Soda"];
		var drinks3 = ["2 shots of Jager", "4 Apple Sourz", "2 shots of Sambuca", "Treble Vodka Mixer", "2 Sambuca shots", "Down a Pint of Beer", "Tequila Slammer"];

		$("#golfballimage").css("display", "inline");
		//$("#golfball").removeClass('box_rotate box_transition');
		$(".golfball").toggleClass('box_rotate');
		//$("#golfball").toggleClass('box_rotate2 box_transition2');
		//$("#golfballtext").slideUp(200);
		
		//$(".difficulty").css("opacity", 0.8);
		$(".difficulty").css("background", "white");
		$(".difficulty").css("color", "#131313");

		$(this).css("opacity", 1);
		$(this).css("color", "white");

		if($(this).text() == "Amateur"){
			$(this).css("background", "green");
			localStorage.setItem("difficultyMultiplier", drinks1);
		}
		if($(this).text() == "Semi-Pro"){
			$(this).css("background", "orange");
			localStorage.setItem("difficultyMultiplier", drinks2);
		}
		if($(this).text() == "Pro"){
			$(this).css("background", "red");
			localStorage.setItem("difficultyMultiplier", drinks3);
		}
		
	});



	$("#golfballimage").click(function() {
		
		$(':mobile-pagecontainer').pagecontainer('change', '#p2',{
			transition:'slidedown',
			changeHash:false
		});

		$(".pubTitles").remove();

		$.ajax({
			type: "GET",
			crossDomain :true,
			dataType :"json",
			url: "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location="+localStorage.lat+","+localStorage.lng+"&radius=500&type=bar&key=AIzaSyDQpJbU4Rosens_809DjMOU6O9L74a7eFI",
			success: function(data){
				console.log(data);
				
				map = new google.maps.Map(document.getElementById('map'), {
					zoom: 16,
					center: {lat: parseFloat(localStorage.lat), lng: parseFloat(localStorage.lng)},
					gestureHandling: 'greedy'
				});

				var myLatLng = new google.maps.LatLng(localStorage.lat,localStorage.lng);
				
				marker = new google.maps.Marker({
			    	position: myLatLng,
			    	map: map,
			    	icon: 'images/person.png'
				});

				marker.setMap(map);
				markers = {};
				$.each(data.results, function(key, value) {
					
					openBox = $('#open');

					if(value.opening_hours){
						console.log(value.open_now);
						if(value.opening_hours.open_now == true){
							open = "Open";
						} else {
							open = "Closed";
						}
					} else {
						open = "Unavailable";
					}

					$('#pubList').append(
						"<div class='pubTitles' id='" + key + "'>" + value.name + " </div>" +
						"<div class='pubInfo'>" + 
								"<div class='infoDiv' id='ratingDiv'>" + value.rating + "<i class='material-icons rating'>grade</i></div>" +
								"<div class='infoDiv' id='openDiv'>"+ open +"</div>" + 
								"<div class='infoDiv' id='typeDiv'>"+ value.types["0"] +"</div>" + 
								"<div class='infoDiv' place_id='" + value.place_id + "' id='buttonDiv'><span>Go Here</span><i class='material-icons rating'>keyboard_arrow_right</i></div></div>" + 
							"</div>" + 
						"</div>"
					);
					
					localStorage.setItem("publat"+key, value.geometry.location.lat);
					localStorage.setItem("publng"+key, value.geometry.location.lng);

			 		markers["marker"+key] = new google.maps.Marker({
			    		position: {lat: value.geometry.location.lat, lng: value.geometry.location.lng},
			    		map: map,
			    		icon: 'images/flag.png'
		    		});

					markers["marker"+key].setMap(map);
					return key<3;
				})
			}
		});
	});

	$(document).on('click', '.pubTitles', function() {

		var $info = $(this).next();

		if($info.children("#openDiv").text() == "Closed"){
			$info.children("#openDiv").css({"background" : "red"});
		}

		if($info.children("#openDiv").text() == "Unavailable"){
			$info.children("#openDiv").css({"background" : "orange"});
		}
	
		$('.pubInfo').slideUp();
		// $('.pubInfo').removeClass("open");

		// $info.addClass("open");

		var pubID = $(this).attr("id");
		// var pubLng = "publat" + $(this).attr("id");

		// var pubLat = localStorage.pub+pubID+lat;
		// var pubLng = localStorage.pub+pubID+lng;

		//console.log(localStorage.getItem("publng"+));

		map.setCenter({lat: parseFloat(localStorage.getItem("publat"+pubID)), lng: parseFloat(localStorage.getItem("publng"+pubID))});
		map.setZoom(18);

		$.each(markers, function(key, value) {
			value.setAnimation(google.maps.Animation.DROP);
		})
		
		markers["marker"+pubID].setAnimation(google.maps.Animation.BOUNCE);	

		if($info.hasClass("open")) {
			$('.pubInfo').slideUp();
			$('.pubInfo').removeClass("open");
		} else {
			$('.pubInfo').removeClass("open");
			$info.addClass("open");
			$info.slideDown();
		}
	});

	$(document).on('click', '.pubAttr', function() { 
		localStorage.setItem("selectedPub", ($(this).attr("place_id")));


	});

	$(document).on('click', '#buttonDiv', function() { 
		localStorage.setItem("selectedPub", ($(this).attr("place_id")));

		console.log("TEST");
			$(':mobile-pagecontainer').pagecontainer('change', '#p3',{
				transition:'slidedown',
				changeHash:false
			});

			$.ajax({
			type: "GET",
			crossDomain :true,
			dataType :"json",
			url: "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + localStorage.selectedPub + "&key=AIzaSyDQpJbU4Rosens_809DjMOU6O9L74a7eFI",
			success: function(data){
				console.log(data);
				$('#hello').text(data.result.name);
				$('#addressInfo').html(data.result.adr_address);
			}
		});

	});

	$('#beerImages').click(function() {

		$( "#beerFill" ).animate({
				height: "100%"
			}, 500, function() {
    // Animation complete.
  		});

		$( "#beerFill" ).animate({
				height: "0%"
			}, 2000, function() {
    // Animation complete.
  		});
	})
});