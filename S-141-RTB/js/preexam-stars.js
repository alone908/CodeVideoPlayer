function showStars(order, total) {

	var travelDestY = ($('.preexam-star-destination').offset()).top - ($('.preexam-star-container').offset()).top;//30;
	var initialDestX = (($('.preexam-star-destination').width() - 48 * Number($('.preexam-star-container img.preexam-star').length)) / 2) + ($('.preexam-star-destination').offset()).left;
	initialDestX = 0 - (($('.preexam-star-container').offset()).left - initialDestX);

	if (order <= total) {
		var calNewTravelX = Number(initialDestX + 48 * (order - 1));

		$('.preexam-star-container .preexam-star:eq(' + (order - 1) + ')').css({
			'width': 48,
			'height': 48,
			'-webkit-transform': 'translate(' + calNewTravelX + 'px, ' + travelDestY + 'px)',
			'-o-transform': 'translate(' + calNewTravelX + 'px, ' + travelDestY + 'px)',
			'-moz-transform': 'translate(' + calNewTravelX + 'px, ' + travelDestY + 'px)',
			'-ms-transform': 'translate(' + calNewTravelX + 'px, ' + travelDestY + 'px)',
			'transform': 'translate(' + calNewTravelX + 'px, ' + travelDestY + 'px)'
		});
		/*
		 $('.preexam-star-container .preexam-star:eq('+(order-1)+')').on('transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd', function(e){
		 e = e.originalEvent;
		 //console.log(e.propertyName);
		 if(e.propertyName === 'transform'){
		 var targetStar = $(e.target);
		 $('.preexam-star-destination .preexam-firework:eq('+ (Number($(targetStar).data('order'))-1) +')').css({
		 'left': ($(targetStar).offset().left - $(targetStar).parent().offset().left) +'px',
		 'top': ($(targetStar).offset().top - $(targetStar).parent().offset().top + 24) +'px'
		 });
		 
		 setTimeout(function(){
		 $('.preexam-star-destination .preexam-firework:eq('+ (Number($(targetStar).data('order'))-1) +')').addClass('preexam-shoot');
		 },5);
		 //console.log($(targetStar).data('order') + ':' + ($(targetStar).offset()).left);
		 }
		 });
		 */
		setTimeout(function () {
			order++;
			showStars(order, total);
		}, 300);
	}
}
