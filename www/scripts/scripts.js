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
		console.log("again");
		
		$("#golfballtext").css("display", "inline");
		$(".difficulty").css("opacity", 0.5);
		$(this).css("opacity", 1);
	});

	$("#golfballtext").click(function() {
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
						zoom: 12,
						center: {lat: parseFloat(localStorage.lat), lng: parseFloat(localStorage.lng)}
					});

					var myLatLng = new google.maps.LatLng(localStorage.lat,localStorage.lng);
					
					var marker = new google.maps.Marker({
				    	position: myLatLng,
				    	map: map,
				    	title: 'Hello World!'
				    });

					marker.setMap(map);

					$.each(data.results, function(key, value) {
						$('#pubList').append("<div class='pubTitles' id='title" + key + "'>" + value.name + "</div><div class='pubInfo'>" + value.rating+ value.vicinity+ value.types[+"0"]+" <div place_id='"+value.place_id+ "' class='pubAttr'>test</div></div>");
						return key<3;
					})
				}

		});

		$("h1").click(function(){
			$(':mobile-pagecontainer').pagecontainer('change', '#p1',{
				transition:'slidedown',
				changeHash:false

			});


		});

	

	}); 

	$(document).on('click', '.pubTitles', function() {

		var $info = $(this).next();
	
		$('.pubInfo').slideUp();
		// $('.pubInfo').removeClass("open");

		// $info.addClass("open");

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
});