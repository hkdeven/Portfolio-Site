(function ($) {
    'use strict';

    $(window).load(function () {

        /* Preloader */
        $('#preloader').fadeOut('slow', function () {
            $(this).remove();
        });

        /* Background loading full-size images */
        $('.gallery-item').each(function() {
            var src = $(this).attr('href');
            var img = document.createElement('img');

            img.src = src;
            $('#image-cache').append(img);
        });

        /* Scroll for mobile nav */
        setTimeout (function() {
            if (document.documentElement.clientWidth < 768) {
                var body = $("html, body");
                body.stop().animate({scrollTop:$('#nav').offset().top}, '500', 'swing');
                $.pjax.defaults.scrollTo = $('#nav').offset().top;
            }
        }, 100);

    });

    $(document).ready(function () {

        commonScripts();

        pageScripts();

        /* Ajax page load settings */
        $(document).on('pjax:end', pageScripts);
    });

    /* Set of common scripts */
    function commonScripts() {
        /* Animated Title */
        (function () {
            //set animation timing
            var animationDelay = 3500,
            //loading bar effect
                barAnimationDelay = 3800,
                barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
            //letters effect
                lettersDelay = 50,
            //type effect
                typeLettersDelay = 150,
                selectionDuration = 500,
                typeAnimationDelay = selectionDuration + 800,
            //clip effect
                revealDuration = 600,
                revealAnimationDelay = 2500;

            initHeadline();


            function initHeadline() {
                //insert <i> element for each letter of a changing word
                singleLetters($('.cd-headline.letters').find('b'));
                //initialise headline animation
                animateHeadline($('.cd-headline'));
            }

            function singleLetters($words) {
                $words.each(function(){
                    var word = $(this),
                        letters = word.text().split(''),
                        selected = word.hasClass('is-visible');
                    for (var i in letters) {
                        if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                        letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
                    }
                    var newLetters = letters.join('');
                    word.html(newLetters).css('opacity', 1);
                });
            }

            function animateHeadline($headlines) {
                var duration = animationDelay;
                $headlines.each(function(){
                    var headline = $(this);

                    if(headline.hasClass('loading-bar')) {
                        duration = barAnimationDelay;
                        setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
                    } else if (headline.hasClass('clip')){
                        var spanWrapper = headline.find('.cd-words-wrapper'),
                            newWidth = spanWrapper.width() + 10
                        spanWrapper.css('width', newWidth);
                    } else if (!headline.hasClass('type') ) {
                        //assign to .cd-words-wrapper the width of its longest word
                        var words = headline.find('.cd-words-wrapper b'),
                            width = 0;
                        words.each(function(){
                            var wordWidth = $(this).width();
                            if (wordWidth > width) width = wordWidth;
                        });
                        headline.find('.cd-words-wrapper').css('width', width);
                    };

                    //trigger animation
                    setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
                });
            }

            function hideWord($word) {
                var nextWord = takeNext($word);

                if($word.parents('.cd-headline').hasClass('type')) {
                    var parentSpan = $word.parent('.cd-words-wrapper');
                    parentSpan.addClass('selected').removeClass('waiting');
                    setTimeout(function(){
                        parentSpan.removeClass('selected');
                        $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
                    }, selectionDuration);
                    setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);

                } else if($word.parents('.cd-headline').hasClass('letters')) {
                    var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
                    hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
                    showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

                }  else if($word.parents('.cd-headline').hasClass('clip')) {
                    $word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
                        switchWord($word, nextWord);
                        showWord(nextWord);
                    });

                } else if ($word.parents('.cd-headline').hasClass('loading-bar')){
                    $word.parents('.cd-words-wrapper').removeClass('is-loading');
                    switchWord($word, nextWord);
                    setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
                    setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

                } else {
                    switchWord($word, nextWord);
                    setTimeout(function(){ hideWord(nextWord) }, animationDelay);
                }
            }

            function showWord($word, $duration) {
                if($word.parents('.cd-headline').hasClass('type')) {
                    showLetter($word.find('i').eq(0), $word, false, $duration);
                    $word.addClass('is-visible').removeClass('is-hidden');

                }  else if($word.parents('.cd-headline').hasClass('clip')) {
                    $word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){
                        setTimeout(function(){ hideWord($word) }, revealAnimationDelay);
                    });
                }
            }

            function hideLetter($letter, $word, $bool, $duration) {
                $letter.removeClass('in').addClass('out');

                if(!$letter.is(':last-child')) {
                    setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);
                } else if($bool) {
                    setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
                }

                if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
                    var nextWord = takeNext($word);
                    switchWord($word, nextWord);
                }
            }

            function showLetter($letter, $word, $bool, $duration) {
                $letter.addClass('in').removeClass('out');

                if(!$letter.is(':last-child')) {
                    setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration);
                } else {
                    if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
                    if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
                }
            }

            function takeNext($word) {
                return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
            }

            function takePrev($word) {
                return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
            }

            function switchWord($oldWord, $newWord) {
                $oldWord.removeClass('is-visible').addClass('is-hidden');
                $newWord.removeClass('is-hidden').addClass('is-visible');
            }

        })();

        /* Back to top */
        (function () {
            $("#back-top").hide();

            $(window).scroll(function () {
                if ($(this).scrollTop() > 100) {
                    $('#back-top').fadeIn();
                } else {
                    $('#back-top').fadeOut();
                }
            });

            $('#back-top a').click(function () {
                $('body,html').animate({
                    scrollTop: 0
                }, 600);
                return false;
            });
        })();
    }

    /* Set of page scripts */
    function pageScripts() {

        /* Home page blocks */
        (function() {
            if ($('#homesection').length) {
                var resizeHomeBlocks = function() {
                    var rows = $('#homesection').find('>.row');
                    $.each(rows, function(key, row) {
                        var maxHeight = 0;
                        var columns = $(row).find('>div');
                        $.each(columns, function(key, column) {
                            $(column).css("height", "");
                            if ($(columns[0]).css("float") == 'left') {
                                if ($(column).height() > maxHeight) {
                                    maxHeight = $(column).height();
                                }
                            }
                        });
                        $.each(columns, function(key, column) {
                            if ($(columns[0]).css("float") == 'left') {
                                $(column).height(maxHeight);
                            }
                        });
                    })
                };

                resizeHomeBlocks();
                $(window).resize(resizeHomeBlocks);
            }
        })();

        /* Animated Counter */
        $('.count-container span').counterUp({
            delay: 10, // the delay time in ms
            time: 3000 // the speed time in ms
        });


        /* Magnific Popup */
        $('.gallery-item').magnificPopup({
            type: 'image',
            gallery: {
                enabled: true
            }
        });

        /* Isotope Portfolio */
        (function () {
            var grid = $('.grid').isotope({
                itemSelector: '.grid-item',
                percentPosition: true,
                masonry: {
                    // use outer width of grid-sizer for columnWidth
                    columnWidth: '.grid-sizer'
                }
            });

            grid.imagesLoaded(function () {
                grid.isotope();
            });

            grid.isotope({filter: '*'});

            // filter items on button click
            $('#isotope-filters').on('click', 'a', function () {
                var filterValue = $(this).attr('data-filter');
                grid.isotope({filter: filterValue});
            });

            // filter items on tag click
            $('.post-tag').on('click', 'a', function () {
                var filterValue = $(this).attr('data-filter');
                grid.isotope({filter: filterValue});
                $('#isotope-filters a[data-filter="' + filterValue + '"]').focus();
            });

        })();

        /* Circle Progress */

        $.circleProgress = {
            // Default options (you may override them)
            defaults: {
                /**
                 * This is the only required option. It should be from 0.0 to 1.0
                 * @type {float}
                 */
                value: 0,

                /**
                 * Size of the circle / canvas in pixels
                 * @type {int}
                 */
                size: 120,

                /**
                 * Initial angle for 0.0 value in radians
                 * @type {float}
                 */
                startAngle: -Math.PI,

                /**
                 * Width of the arc. By default it's calculated as 1/14 of size, but you may set it explicitly in pixels
                 * type {int|'auto'}
                 */
                thickness: 'auto',

                /**
                 * Fill of the arc. You may set it to:
                 *   - solid color:
                 *     - { color: '#3aeabb' }
                 *     - { color: 'rgba(255, 255, 255, .3)' }
                 *   - linear gradient (left to right):
                 *     - { gradient: ['#3aeabb', '#fdd250'] }
                 *     - { gradient: ['red', 'green', 'blue'] }
                 *   - image:
                 *     - { image: 'http://i.imgur.com/pT0i89v.png' }
                 *     - { color: 'lime', image: 'http://i.imgur.com/pT0i89v.png' } - color displayed until the image is loaded
                 */
                fill: {
                    color: ['#ffffff']
                },

                /**
                 * Color of the "empty" arc. Only a color fill supported by now
                 * @type {string}
                 */
                emptyFill: 'rgba(255, 255, 255, .3)',

                /**
                 * Animation config (see jQuery animations: http://api.jquery.com/animate/)
                 */
                animation: {
                    duration: 1200,
                    easing: 'circleProgressEasing'
                }
            }
        };

        // Renamed ease-in-out-cubic
        $.easing.circleProgressEasing = function(x, t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };

        /**
         * Draw animated circular progress bar.
         *
         * Appends <canvas> to the element or updates already appended one.
         *
         * If animated, throws 3 events:
         *
         *   - circle-animation-start(jqEvent)
         *   - circle-animation-progress(jqEvent, animationProgress, stepValue) - multiple event;
         *                                                                        animationProgress: from 0.0 to 1.0;
         *                                                                        stepValue: from 0.0 to value
         *   - circle-animation-end(jqEvent)
         *
         * @param options Example: { value: 0.75, size: 50, animation: false };
         *                you may set any of default options (see above);
         *                `animation` may be set to false;
         *                you may also use .circleProgress('widget') to get the canvas
         */
        $.fn.circleProgress = function(options) {
            if (options == 'widget')
                return this.data('circle-progress');

            options = $.extend({}, $.circleProgress.defaults, options);

            return this.each(function() {
                var el = $(this),
                    size = options.size,
                    radius = size / 2,
                    thickness = size / 14,
                    value = options.value,
                    startAngle = options.startAngle,
                    emptyArcFill = options.emptyFill,
                    arcFill;

                if ($.isNumeric(options.thickness))
                    thickness = options.thickness;

                // Prepare canvas
                var canvas = el.data('circle-progress');

                if (!canvas) {
                    canvas = $('<canvas>').prependTo(el)[0];
                    el.data('circle-progress', canvas);
                }

                canvas.width = size;
                canvas.height = size;

                var ctx = canvas.getContext('2d');

                if (!options.fill)
                    throw Error("The fill is not specified!");

                if (options.fill.color)
                    arcFill = options.fill.color;

                if (options.fill.gradient) {
                    var gr = options.fill.gradient;
                    if (gr.length == 1) {
                        arcFill = gr[0];
                    } else if (gr.length > 1) {
                        var lg = ctx.createLinearGradient(0, 0, size, 0);
                        for (var i = 0; i < gr.length; i++)
                            lg.addColorStop(i / (gr.length - 1), gr[i]);
                        arcFill = lg;
                    }
                }

                if (options.fill.image) {
                    var img = new Image();
                    img.src = options.fill.image;
                    img.onload = function() {
                        var bg = $('<canvas>')[0];
                        bg.width = size;
                        bg.height = size;
                        bg.getContext('2d').drawImage(img, 0, 0, size, size);
                        arcFill = ctx.createPattern(bg, 'no-repeat');

                        // we need to redraw static value
                        if (!options.animation)
                            draw(value);
                    }
                }

                if (options.animation)
                    drawAnimated(value);
                else
                    draw(value);

                function draw(v) {
                    ctx.clearRect(0, 0, size, size);
                    drawArc(v);
                    drawEmptyArc(v);
                }

                function drawArc(v) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(radius, radius, radius - thickness / 2, startAngle, startAngle + Math.PI * 2 * v);
                    ctx.lineWidth = thickness;
                    ctx.strokeStyle = arcFill;
                    ctx.stroke();
                    ctx.restore();
                }

                function drawEmptyArc(v) {
                    ctx.save();
                    if (v < 1) {
                        ctx.beginPath();
                        if (v <= 0)
                            ctx.arc(radius, radius, radius - thickness / 2, 0, Math.PI * 2);
                        else
                            ctx.arc(radius, radius, radius - thickness / 2, startAngle + Math.PI * 2 * v, startAngle);
                        ctx.lineWidth = thickness;
                        ctx.strokeStyle = emptyArcFill;
                        ctx.stroke();
                    }
                    ctx.restore();
                }

                function drawAnimated(v) {
                    el.trigger('circle-animation-start');

                    $(canvas).css({ progress: 0 }).animate({ progress: v },
                        $.extend({}, options.animation, {
                            step: function(p) {
                                draw(p);
                                el.trigger('circle-animation-progress', [p / v, p]);
                            },

                            complete: function() {
                                el.trigger('circle-animation-end');
                            }
                        })
                    );
                }
            });
        };

        (function () {
            function animateElements() {
                $('.progressbar').each(function () {
                    var elementPos = $(this).offset().top;
                    var topOfWindow = $(window).scrollTop();
                    var percent = $(this).find('.circle').attr('data-percent');
                    var percentage = parseInt(percent, 10) / parseInt(100, 10);
                    var animate = $(this).data('animate');
                    if (elementPos < topOfWindow + $(window).height() - 30 && !animate) {
                        $(this).data('animate', true);
                        $(this).find('.circle').circleProgress({
                            startAngle: -Math.PI / 2,
                            value: percent / 100,
                            thickness: 3,
                            fill: {
                                color: '#ffffff'
                            }
                        }).on('circle-animation-progress', function (event, progress, stepValue) {
                            $(this).find('div').text((stepValue * 100).toFixed(1) + "%");
                        }).stop();
                    }
                });
            }

            // Show animated elements
            animateElements();
            $(window).scroll(animateElements);
        })();

        /* Contact Form */
        (function () {
            // Get the form.
            var form = $('#ajax-contact');

            // Get the messages div.
            var formMessages = $('#form-messages');

            // Set up an event listener for the contact form.
            $(form).submit(function (e) {
                // Stop the browser from submitting the form.
                e.preventDefault();

                // Serialize the form data.
                var formData = $(form).serialize();

                // Submit the form using AJAX.
                $.ajax({
                        type: 'POST',
                        url: $(form).attr('action'),
                        data: formData
                    })
                    .done(function (response) {
                        // Make sure that the formMessages div has the 'success' class.
                        $(formMessages).removeClass('alert alert-danger');
                        $(formMessages).addClass('alert alert-success');

                        // Set the message text.
                        $(formMessages).text(response);

                        // Clear the form.
                        $('#name').val('');
                        $('#email').val('');
                        $('#message').val('');
                    })
                    .fail(function (data) {
                        // Make sure that the formMessages div has the 'error' class.
                        $(formMessages).removeClass('alert alert-success');
                        $(formMessages).addClass('alert alert-danger');

                        // Set the message text.
                        if (data.responseText !== '') {
                            $(formMessages).text(data.responseText);
                        } else {
                            $(formMessages).text('Oops! An error occured and your message could not be sent.');
                        }
                    });
            });

        })();

        /* Google map */
        (function () {
            if (!$('#google-map').length) {
                return false;
            }

            initGmap();

            function initGmap() {

                // Create an array of styles.
                var styles = [
                    {
                        stylers: [
                            {saturation: -50}
                        ]
                    }, {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [
                            {lightness: 100},
                            {visibility: "simplified"}
                        ]
                    }, {
                        featureType: "road",
                        elementType: "labels",
                        stylers: [
                            {visibility: "off"}
                        ]
                    }
                ];

                ;

            }

        })();

    }


    /* Wow */
    new WOW().init();

})(jQuery);
