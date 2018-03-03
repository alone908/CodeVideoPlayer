var screenSize = {portrait: [], landscape: []};
var controlPanelIdleTimer;
var is_iPhone_iPad = false;

if (/iPhone|iPad/i.test(navigator.userAgent)) {
  is_iPhone_iPad = true;
}

if (screen.width < screen.height) {
  screenSize.portrait = [screen.width, screen.height];
  screenSize.landscape = [screen.height, screen.width];
}
else if (screen.width > screen.height) {
  screenSize.portrait = [screen.height, screen.width];
  screenSize.landscape = [screen.width, screen.height];
}


$(document).ready(function () {

  $('#ControlPanel').css('width', (screenSize.landscape[0]).toString() + 'px');
  $('#ControlPanel').css('height', (screenSize.landscape[1]).toString() + 'px');
  $('#progress-bar').css('visibility', 'hidden');

  $('#resume-btn').on('click', function () {
    if (isPlay === 0) {
      $("#play-button").trigger('click');
      $("#play-button").removeClass('play-button-style').addClass('pause-button-style');
      isPlay = 1;
    }
    $('.get-ready-cover-style').css('display', 'none');
    $('#get-ready-text').text('Are you ready to continue ? ');
    $('#resume-btn').text('Resume');
    $('#skin-container').css('display', 'block');
  });

  $('#page').on('tap', function (e, data) {
    var fullWidth = $("#template-place").width() * MobileScaleRatio;
    var clickX = data[0].offset.x;
    if ((clickX >= (fullWidth - 20)) && (clickX <= fullWidth )) {
      //    console.log(data[0].offset);
      //    console.log(data);
      //    console.log($("#template-place").width() * MobileScaleRatio);
      if (!SequencerIsDragging) {
        if (data[0].target.id === 'ControlPanel') {
          closeControlPanel('closeAnyway', 'slideup')
        }
        else {
          openControlPanel();
        }

      }
    }
  });

  $('#page').on('swipedown', function (e, data) {
    if (!SequencerIsDragging) openControlPanel();
  });

  $('#page').on('swipeleft', function (e, data) {
    if (!SequencerIsDragging) $('#forward-button').trigger('click');
  });

  $('#page').on('swiperight', function (e, data) {
    if (!SequencerIsDragging) $('#backward-button').trigger('click');
  });

  $('#ControlPanel').on('swipeup', function (e, data) {
    if (data.startEvnt.target.id === 'ControlPanel') {
      closeControlPanel('closeAnyway', 'slideup')
    }
  });

  $('#tool-bar').on('tapend', function (e, data) {
    if (data.target.hasAttribute('closePanel')) closeControlPanel('closeAnyway', 'fadeout');
  });

  $('#page-select-text').on('tap', function (e, data) {
    setTimeout(function () {
      closeControlPanel('closeAnyway', 'slideup');
    }, 250)
  });

  $('#ControlPanel').click(function (e) {
    setPanelIdleTimer();
  });

  $(window).on("orientationchange", function () {
    closeControlPanel('closeAnyway', 'slideup');
  });
});

function pauseCourse() {
  if (isPlay === 1) {
    $("#play-button").trigger('click');
    $("#play-button").removeClass('pause-button-style').addClass('play-button-style');
    isPlay = 0;
  }
}

var moveExitButton = true;

function openControlPanel() {

  $("#version-text").css({'left': (($("#template-place").width() - 120) * MobileScaleRatio) + "px"});

  if (admin_DisableExit && moveExitButton) {
    moveExitButton = false;
    var tempX = parseInt($("#glossary-button").css("left"), 10);
    $("#glossary-button").css({'left': (parseInt($("#exit-button").css("left"), 10)  ) + "px"});
    $("#help-button").css({'left': tempX + "px"});
    $("#exit-button").hide();

  }

  $('#ControlPanel').css('opacity', 1);
  $('#ControlPanel').animate({top: '0px'}, 500);
  setPanelIdleTimer();
}

function closeControlPanel(reason, way) {
  var close = false;

  if (reason === 'idleTimer') {
    if ($('.page-select-style').css('display') !== 'block' && $('.help-window-style').css('display') !== 'block' && $('.glossary-select-style').css('display') !== 'block') {
      close = true;
    }
  }
  else if (reason === 'closeAnyway') {
    close = true;
  }

  if (close) {
    switch (way) {
      case 'slideup':

        $('#ControlPanel').animate({top: -485}, 500, function () {
          $('#ControlPanel').css('opacity', 0);
        });
        $('.page-select-style').css('display', 'none');
        $("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
        $('.glossary-select-style').css('display', 'none');
        $('.help-window-style').css('display', 'none');
        $('#help-button').removeClass('help-button-style-active').addClass('help-button-style');
        $('#glossary-button').removeClass('glossary-button-style-active').addClass('glossary-button-style');
        isPageComboOpen = false;
        isGlossaryOpen = false;
        isHelpOpen = false;

        break;

      case 'fadeout':

        $('#ControlPanel').animate({opacity: 0}, 500, function () {
          $('#ControlPanel').css('top', '-485px');
        });
        $('.page-select-style').css('display', 'none');
        $("#page-combo").addClass("page-combo-style").removeClass("page-combo-style-active");
        $('.glossary-select-style').css('display', 'none');
        $('.help-window-style').css('display', 'none');
        $('#help-button').removeClass('help-button-style-active').addClass('help-button-style');
        $('#glossary-button').removeClass('glossary-button-style-active').addClass('glossary-button-style');
        isPageComboOpen = false;
        isGlossaryOpen = false;
        isHelpOpen = false;

        break;
    }
  }
  if (controlPanelIdleTimer !== undefined) clearTimeout(controlPanelIdleTimer);
}

function setPanelIdleTimer() {
  if (controlPanelIdleTimer !== undefined) clearTimeout(controlPanelIdleTimer);
  controlPanelIdleTimer = setTimeout(function () {
    closeControlPanel('idleTimer', 'fadeout');
  }, 15000);
}

var mobileCourseXMLAdjustRule, mobilePreExamXMLAdjustRule, mobileFinalXMLAdjustRule, mobileBranchingXMLAdjustRule;

function MobilePositionRuleConfig(RegularTplTop, RegularTplLeft) {

  mobileCourseXMLAdjustRule = [
    {
      tag: ['Rule', 'Intro', 'Answer', 'BookmarkDialog', 'IncompleteBox', 'SuccessBox', 'InvalidBox', 'IntroText', 'AnswerBox', 'StandardDialog', 'QuizDialog'],
      conditions: [
        {
          verify: {
            hasAttr: {
              Top: '_any',
              Left: '_any'
            }
          },
          adjust: {
            Top: '-' + RegularTplTop.toString(),
            Left: '-' + RegularTplLeft.toString()
          }
        }
      ]
    },
    {
      tag: 'Sequence',
      conditions: [
        {
          verify: {
            parentIs: 'Sequencer',
            hasAttr: {
              Operation: 'script',
            }
          },
          adjust: {
            TextContent: [
              {
                pattern: 'top:\\s*"\\s*77px\\s*"',
                replace: 'top: "0px"'
              },
              {
                pattern: 'left:\\s*"\\s*12px\\s*"',
                replace: 'left: "0px"'
              },
              {
                pattern: '{\\s*"top"\\s*:\\s*77\\s*[+]\\s*"px"\\s*}',
                replace: '{"top": 0 + "px"}'
              },
              {
                pattern: '{\\s*"left"\\s*:\\s*12\\s*[+]\\s*"px"\\s*}',
                replace: '{"left": 0 + "px"}'
              }
            ]
          }
        }
      ]
    }
  ];

  mobilePreExamXMLAdjustRule = [
    {
      tag: ['PreEndDialog', 'AdaptiveTrainingDialog', 'Intro', 'AdaptiveIntro', 'Rule'],
      conditions: [
        {
          verify: {
            hasAttr: {
              Top: '_any',
              Left: '_any'
            }
          },
          adjust: {
            Top: '-' + RegularTplTop.toString(),
            Left: '-' + RegularTplLeft.toString()
          }
        }
      ]
    }
  ];

  mobileFinalXMLAdjustRule = [
    {
      tag: ['SubFinalPass', 'SubFinalFail', 'SubFinalResetFail', 'FinalPass', 'FinalFullFail', 'Intro', 'Rule'],
      conditions: [
        {
          verify: {
            hasAttr: {
              Top: '_any',
              Left: '_any'
            }
          },
          adjust: {
            Top: '-' + RegularTplTop.toString(),
            Left: '-' + RegularTplLeft.toString()
          }
        }
      ]
    }
  ];

  mobileBranchingXMLAdjustRule = [
    {
      tag: 'BranchDialog',
      conditions: [
        {
          verify: {
            parentIs: 'Branch',
            hasAttr: {
              Top: '_any',
              Left: '_any'
            }
          },
          adjust: {
            Top: '-' + RegularTplTop.toString(),
            Left: '-' + RegularTplLeft.toString()
          }
        }
      ]
    }
  ];

}

// Adjust absolute position for mobile -----------------------------------------------------------------------------
function AdjustPositionForMobile(xml, Rule) {

  // Rule object example -----------------------------------------------------------------------------------------
  // var Rule = [
  //     {
  //         tag: 'tag',						// tag for search, 'tag' or ['tag1','tag2','tag3']
  //         conditions: [					// An array contains condition, all fields are verified then make adjustment.
  //             {
  //                 verify: {				// Contain fields need to be verified.
  //                     parentIs: 'parent',	// Verify parent node is 'parent'.
  //                     hasAttr: {			// Verify this tag has attribute.
  //                         Top: '_any',		// Top attribute can be any value.
  //                         Left: '255'		// Left attribute need to be exactly '255'.
  //                     }
  //                 },
  //                 adjust: {				// Contain fields need to be adjust. Top, Left, Bottom, Right, or TextContent
  //                     Top: -1,				// +1 plus 1, -1 minus 1, 1 set value to 1.
  //                     Left: +1, 			// +1 plus 1, -1 minus 1, 1 set value to 1.
  //                     Right: 1, 			// +1 plus 1, -1 minus 1, 1 set value to 1.
  //                     TextContent: [		// An array, use regex replace textContent of this node
  //                         {
  //                             pattern: 'top:\\s*"\\s*77px\\s*"',	// regex pattern
  //                             replace: 'top: "0px"'				// replace string
  //                         }
  //                     ]
  //                 }
  //             }
  //         ]
  //     }
  // ];

  if (Rule === undefined || xml === undefined) {
    return false;
  }

  Rule.forEach(function (rule, index) {
    if (rule.tag !== undefined && typeof rule.tag === 'string') {
      $(xml).find(rule.tag).each(function (key, node) {
        if (rule.conditions !== undefined) {
          rule.conditions.forEach(function (condi, index) {
            if (isVerified(node, condi.verify)) {
              adjust(node, condi.adjust);
            }
          })
        }
      })
    }
    if (rule.tag !== undefined && typeof rule.tag === 'object') {
      rule.tag.forEach(function (tagName, index) {
        $(xml).find(tagName).each(function (key, node) {
          if (rule.conditions !== undefined) {
            rule.conditions.forEach(function (condi, index) {
              if (isVerified(node, condi.verify)) {
                adjust(node, condi.adjust);
              }
            })
          }
        })
      })
    }
  })

  function isVerified(node, verify) {
    for (var index in verify) {
      if (index === 'parentIs') {
        if (node.parentNode.tagName !== verify.parentIs) return false;
      }
      if (index === 'hasAttr') {
        for (var attr in verify.hasAttr) {
          if (verify.hasAttr[attr] === '_any') {
            if (node.getAttribute(attr) === null) return false;
          }
          if (verify.hasAttr[attr] !== '_any') {
            if (node.getAttribute(attr) !== verify.hasAttr[attr]) return false;
          }
        }
      }
    }

    return true;
  }

  function adjust(node, adjust) {
    for (var index in adjust) {
      if (index === 'Top' || index === 'Left' || index === 'Bottom' || index === 'Right' ||
        index === 'top' || index === 'left' || index === 'bottom' || index === 'right') {

        if (adjust[index].toString().indexOf('+') === 0 || adjust[index].toString().indexOf('-') === 0) {
          var newValue = Number(node.getAttribute(index)) + Number(adjust[index]);
        }
        else {
          var newValue = Number(adjust[index]);
        }

        node.setAttribute(index, newValue);
      }
      if (index === 'TextContent') {
        adjust.TextContent.forEach(function (reg_rule, key) {
          var re = new RegExp(reg_rule.pattern, "g");
          node.textContent = node.textContent.replace(re, reg_rule.replace);
        })
      }
    }
  }

  return xml;
}