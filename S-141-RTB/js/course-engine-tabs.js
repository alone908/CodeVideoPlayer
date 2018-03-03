/*
 * IEngine5
 * IEngine5 Video Engine
 *
 * Copyright (c) Inspired eLearning Inc. 2003-2017.  All Rights Reserved.
 * This source file is proprietary property of Inspired eLearning Inc.
 * http://http://www.inspiredelearning.com/inspired/License
 *
 * @version 5.0
 */

$.fn.IEngineTabs = function (style_prefixX, tabSpeedX, WidthX, PanelHeightX) {

	//check if function has already run

//		console.log($(this).data("newtabs")=="1");
	if ($(this).data("newtabs") == "1")
	{

	} else
	{
		$(this).data("newtabs", "1");

		var style_prefix = style_prefixX;
		var tabSpeed = tabSpeedX;
		var mainDiv = $(this);

		mainDiv.css('width', WidthX + "px");
		var tabs = mainDiv.children('ul').children('li');
		var panels = mainDiv.children('div');
		panels.css('height', PanelHeightX + "px");

		var selectedTab = panels.first();

		mainDiv.addClass(style_prefix + '-mainDiv');
		tabs.first().addClass('active');

		panels.addClass(style_prefix + '-panel').hide().first().show().addClass(style_prefix + '-panel-selected');

		var MainWidth = $(this).width();


		mainDiv.children('div').each(function (idx, itm) {
			var bordT = $(this).outerWidth() - $(this).innerWidth();
			var paddT = $(this).innerWidth() - $(this).width();
			var margT = $(this).outerWidth(true) - $(this).outerWidth();

			//				console.log($(this).attr("id"));
			$(this).css('width', (MainWidth - (bordT + paddT + margT)) + "px");
		});

		var TabCount = 0;
		mainDiv.children('ul').children('li').each(function (idx, itm) {
			TabCount++;
		});

		//loop through all tabs save their widths
		var temptabWidth = [];
		tempCounter = 0;
		mainDiv.children('ul').children('li').each(function (idx, itm) {
			var bordT = $(this).outerWidth() - $(this).innerWidth();
			var paddT = $(this).innerWidth() - $(this).width();
			var margT = $(this).outerWidth(true) - $(this).outerWidth();
			tempCounter++;
			temptabWidth[tempCounter] = $(this).width() + bordT + paddT + margT;
			//				console.log(tempCounter+" "+temptabWidth[tempCounter]);
		});

		var TotalWidthX = 0;
		for (var i = 1, l = temptabWidth.length; i < l; i++)
		{
			TotalWidthX = TotalWidthX + temptabWidth[i];
		}

		while (TotalWidthX < (MainWidth - 1))
		{
			TotalWidthX = 0;
			for (var i = 1, l = temptabWidth.length; i < l; i++)
			{
				TotalWidthX = TotalWidthX + (temptabWidth[i] + 1);
				if (TotalWidthX < (MainWidth)) {
					temptabWidth[i] = temptabWidth[i] + 1;
				}
			}
		}

		tempCounter = 0;
		mainDiv.children('ul').children('li').each(function (idx, itm) {
			tempCounter++;
			bordT = $(this).outerWidth() - $(this).innerWidth();
			paddT = $(this).innerWidth() - $(this).width();
			margT = $(this).outerWidth(true) - $(this).outerWidth();
			$(this).css('width', (temptabWidth[tempCounter] - (bordT + paddT + margT)) + "px"); //((MainWidth/TabCount)-(bordT+paddT+margT) ) +"px");
			//				console.log(tempCounter+" "+temptabWidth[tempCounter]);
		});

		TempTop = (tabs.first().position().top + tabs.first().outerHeight());
		TempLeft = (tabs.first().position().left + (tabs.first().outerWidth() / 2) - 8);

		$(mainDiv).append('<div id="' + $(mainDiv).attr("id") + '_activetab" class="activearrow" style="top:' + TempTop + 'px; left:' + TempLeft + 'px"></div>');

		//			console.log(TabCount);
		//			console.log((MainWidth/TabCount));


		tabs.click(function () {
			selectedTab = $(this).children('a').attr('href');

			tabs.removeClass('active');
			$(this).addClass('active');
			$("#" + $(mainDiv).attr("id") + "_activetab").remove();
			$(mainDiv).append('<div id="' + $(mainDiv).attr("id") + '_activetab" class="activearrow" style="top:' + ($(this).position().top + $(this).outerHeight()) + 'px; left:' + ($(this).position().left + ($(this).outerWidth() / 2) - 8) + 'px"></div>');

			$("." + style_prefix + "-panel-selected").fadeOut(tabSpeed, function () {
				panels.removeClass(style_prefix + '-panel-selected');
			});
			$(selectedTab).fadeIn(tabSpeed, function () {
				$(selectedTab).addClass(style_prefix + '-panel-selected');
			});

		}).children('a').click(function (event) {
			event.preventDefault();
		});
	}
}