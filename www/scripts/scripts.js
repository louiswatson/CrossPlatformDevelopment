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