(function( $ ){
 
  var methods = {
    init : function( options, initLink ) { 
		$.cookie.json = true;

		lastSettings = $.cookie('sver-last-options')||{};
		var settings = $.extend( {
			'base-style' : '',
			'default-background' : '#fff',
			'default-text-color' : '#000',
			'back-link-text' : 'Обычная версия',
			'container' : 'body'
			}, lastSettings, options);
		
		$.cookie('sver-last-options',settings, { path: '/' });

		if (settings['base-style' ]){
			$("head").append($("<link rel='stylesheet' id='special-version-base-style' href='"+settings['base-style' ]+"' type='text/css' media='screen' />"));
			}
		
		container = $('<div id="special-version-container"></div>');
		$(settings['container']).children().each(function(){
			$(this).appendTo(container);
			});
		$(settings['container']).html('').append(container);


		$.fn.specialVersion('changeParams',settings['default-text-size'],settings['default-text-color'],settings['default-background']);

		$('<div id="special-version-controls"></div>').prependTo('body');
		$('<div id="crfont-style">Размер шрифта: <a href="#" a-font-size="16" style="font-size:16px">A</a><a href="#" a-font-size="20" style="font-size:20px">A</a><a href="#" a-font-size="24" style="font-size:24px">A</a><a href="#" a-font-size="28" style="font-size:28px">A</a></div>').appendTo('#special-version-controls');
		$('<div>Цветовая схема: <a href="#" a-bg-color="#fff" a-color="#000" style="background-color:#fff;color:#000">A</a><a href="#" a-bg-color="#000" a-color="#fff" style="background-color:#000;color:#fff">A</a><a href="#" a-bg-color="#9DD1FF" a-color="#063462" style="background-color:#9DD1FF;color:#063462">A</a></div>').appendTo('#special-version-controls');
		
		
		$('#special-version-controls a').click(function(event){
			event.preventDefault();
			size=$(this).attr('a-font-size')||false;
			color=$(this).attr('a-color')||false;
			bgColor=$(this).attr('a-bg-color')||false;

			$.fn.specialVersion('changeParams',size,color,bgColor);

			});

		initLink.hide();

		backLink = $(initLink).clone().appendTo('#special-version-controls');
		backLink.text(settings['back-link-text']).show();
		backLink.click(function(event){event.preventDefault();
		$.fn.specialVersion('return',backLink, initLink);});
		
		
	},
    bind : function(options) {
		
		this.click(function(event){
			event.preventDefault();
			initLink = $(this);
			$.cookie('sver-initLinkId', initLink.attr('id'), { path: '/' });
			return methods.init(options, initLink);
		});
      
    },
    return : function(backLink, initLink) {
		$('#special-version-container').children().each(function(){$(this).insertBefore($('#special-version-container'))})
		 $('#special-version-container').remove();
		 $('#special-version-base-style').remove();
		 $('#special-version-controls').remove();
		 

		 $('*').each(function(){
			if ($(this).attr('original-font-size'))
				$(this).css('font-size',$(this).attr('original-font-size'));
			if ($(this).attr('original-line-height'))
				$(this).css('line-height',$(this).attr('original-line-height'));
			
			$(this).css('background-color',$(this).attr('original-bg-color'));
			$(this).css('color',$(this).attr('original-text-color'));
			});

		 backLink.remove();
		 initLink.show();

		 $.cookie.json = false;
		 $.removeCookie('sver-size', { path: '/' });
		 $.removeCookie('sver-color', { path: '/' }); 
		 $.removeCookie('sver-bgColor', { path: '/' }); 
		 $.removeCookie('sver-initLinkId', { path: '/' }); 
		 $.removeCookie('sver-last-options', { path: '/' }); 
	
		},
    changeParams : function(size,color,bgColor) {
		if (size) $.cookie('sver-size', size, { path: '/' });
		if (color) $.cookie('sver-color', color, { path: '/' });
		if (bgColor) $.cookie('sver-bgColor', bgColor, { path: '/' });
      
		$('#special-version-container *').each(function(){
			if (!$(this).attr('original-font-size')) $(this).attr('original-font-size',$(this).css('font-size'));
			if (!$(this).attr('original-line-height'))$(this).attr('original-line-height',$(this).css('line-height'));
			});
		$('*').each(function(){
			if (!$(this).attr('original-bg-color'))$(this).attr('original-bg-color',$(this).css('background-color'));
			if (!$(this).attr('original-text-color'))$(this).attr('original-text-color',$(this).css('color'));
			});

		if (size){		
			$('#special-version-container *').each(function(){
				if ($(this).css('font-weight')=='bold')
					$(this).css({'font-size':(Math.round(size*1.2)) + 'px','line-height':Math.round(size*1.4) + 'px'});
				else
					$(this).css({'font-size':size + 'px','line-height':Math.round(size*1.4) + 'px'});
				});
			}
		if (color){	
			$('*').not('#special-version-controls,#special-version-controls *').each(function(){
				$(this).css({'color':color});
				});
			}
		if (bgColor){	
			$('*').not('#special-version-controls,#special-version-controls *').each(function(){
				$(this).css({'background-color':bgColor});
				});
			}
    },
    newMethod : function( ) {
     
    }
  };

  $.fn.specialVersion = function( method ) {
    if ( methods[method] ) {
      return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.bind.apply( this, arguments );
    } else {
      $.error( 'Method named ' +  method + ' exists for jQuery.specialVersion' );
    } 
  };

})( jQuery );

jQuery( document ).ready(function( $ ) {
  if($.cookie('sver-initLinkId')&&( $.cookie('sver-size')|| $.cookie('sver-color')|| $.cookie('sver-bgColor'))){

	$.fn.specialVersion('init',{
		'default-background' : $.cookie('sver-bgColor'),
		'default-text-color' : $.cookie('sver-color'),
		'default-text-size' : $.cookie('sver-size')
		}, $('#'+$.cookie('sver-initLinkId')));
		
	};
});

jQuery( document ).ready( function() {
			jQuery('#cr_version_link').specialVersion({'base-style' : '/wp-content/plugins/comfortable-reading/css/styles.css'}); 
});