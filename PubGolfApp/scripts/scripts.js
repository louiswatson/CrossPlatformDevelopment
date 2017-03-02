$(document).ready(function() {
	console.log("hello");

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
	});
	$("#backButton").click(function(){
		$(':mobile-pagecontainer').pagecontainer('change', '#p1',{
			transition:'slidedown',
			changeHash:false
		});
	});
});