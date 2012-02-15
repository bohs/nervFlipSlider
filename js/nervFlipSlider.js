/*
	NervFlipSlider - Author Wojciech Jerczynski;

	Usage:
	
	Structure of a slider
	
	<div class="imagecontainer">
		<img src="myimage.jpg">
		<img src="myimage2.jpg">
	</div>
	
	Structure of js call
	
	var options = {
		width:numeric value for image width
		height:numeric value for image height
		touch: true/false - if you want it to react to touch events set to true (desktop browsers should have False)
	}
*/
(function($){
 
        $.fn.nervFlipSlider = function(options){
        $.fn.nervFlipSlider.options = $.extend({}, $.fn.nervFlipSlider.defaults, options);
        
	isDragged = false;
	isHolding = false;
	initX = 0;
	$wid = 0;
	$wide = $.fn.nervFlipSlider.options.width;
	index = 0;
	animInterval = null;
	movingRight = false;
	noflip = false;
	canDrag = true;
	
	return this.each(function(){
            $this = $(this);
	    $options = $.fn.nervFlipSlider.options;
	    $.fn.nervFlipSlider.init($this,$options)
	    
        })
     
        };
         
        $.fn.nervFlipSlider.init = function($this,$options){
		//initialise slider structure
		$images = $this.find('img');
		$zIndex = $images.length;
		$this.css({position:"relative",width:$options.width,height:$options.height,overflow:"hidden"})
		//wrap all the images in the structure
		$.each($images,function(){
			$(this).wrap('<div class="nervFlipImage">')
		});
		
		$(".nervFlipImage").first().addClass("tofold");
		
		$(".nervFlipImage").each(function(){
			$(this).css({zIndex:$zIndex,position:"absolute",top:0,left:0,overflow:"hidden",width:$options.width,height:$options.height});
			$zIndex--;
		});
		$this.append('<div class="pageflipL"></div>');
		$this.append('<div class="pageflip"></div>');
		$this.append('<div class="pagefold"></div>');
		$this.append('<div class="pagefoldShadow"></div>');
		$this.append('<div class="pagefoldShadowUnder"></div>');
		
		$(".pageflip").css({width:0,overflow:"hidden",height:$options.height,position:"absolute",zIndex:($images.length+2),top:0,right:0});
		$(".pagefold").css({width:0,overflow:"hidden",height:$options.height,position:"absolute",zIndex:($images.length+1),top:0,right:0});
		$(".pagefoldShadow").css({width:0,overflow:"hidden",height:$options.height,position:"absolute",zIndex:($images.length+1),top:0,right:0}).hide();
		$(".pagefoldShadowUnder").css({width:153,overflow:"hidden",height:$options.height,position:"absolute",zIndex:($images.length),top:0,right:0}).hide();
		
		$(".pagefold").html($(".nervFlipImage").first().html());
		$.fn.nervFlipSlider.attachEvents($options);
        };
        
	$.fn.nervFlipSlider.attachEvents = function($options){
		
		if($options.touch){
			BrowserEvents = ["touchstart","touchend","touchmove"]
		}else{
			BrowserEvents = ["mousedown","mouseup","mousemove"]
		}
		
		
		$(document).bind(BrowserEvents[0],function(e){e.preventDefault();
                    if(canDrag){   
                        isHolding = true;
			if($options.touch){
				initX = e.originalEvent.touches[0].pageX;
			}else{
				initX = e.pageX;
			}
                        
                    }
		});
        
		$(document).bind(BrowserEvents[1],function(e){
			    isDragged = false;
			    isHolding = false;
			    window.clearInterval(animInterval);
			    
			    //console.log($wid)
			    
			    if(!movingRight){
			       if($wid>($options.width/3)){
				    finishOffAnim($wid);
			       }
			       if($wid<=($options.width/3)){
				    animateBack($wid);
			       }
			    }else{
				if($wide<=($options.width/3)){
				    //animateback
				    animateBack($wide);
				}
				if($wide>($options.width/3) && $wide<$options.width){
				    //finish off
				    finishOffAnim($wide);
			       }
			    }
		});
        
		$(document).bind(BrowserEvents[2],function(e){if(isHolding){isDragged=true;}
                            if(isDragged){
				
				if($options.touch){
					distance = Math.abs(initX-e.originalEvent.touches[0].pageX);
				}else{
					distance = Math.abs(initX-e.pageX);
				}
				
                               
                                if(distance>10){
                                    
                                    if($(".tofold").index(".nervFlipImage") == $(".nervFlipImage").last().index()){
                                        noflip = true;
                                    }else{
                                        noflip = false;
                                    }
                                    if($options.touch){
					if(e.originalEvent.touches[0].pageX<initX){
					    movingRight = false;
					    if($(".being_dragged").length == 0)
						$(".tofold").addClass("being_dragged");
					}
					if(e.originalEvent.touches[0].pageX>initX){
					    movingRight = true;
					    if($(".being_dragged").length == 0)
					    $(".folded").last().addClass("being_dragged");
					}
				    }else{
					if(e.pageX<initX){
					    movingRight = false;
					    if($(".being_dragged").length == 0)
						$(".tofold").addClass("being_dragged");
					}
					if(e.pageX>initX){
					    movingRight = true;
					    if($(".being_dragged").length == 0)
					    $(".folded").last().addClass("being_dragged");
					}
				    }
                                    if(!$(".pagefoldShadowUnder").is(":visible") && isDragged){
                                        $(".pagefoldShadowUnder").show();
                                    }
                                    if(!$(".pagefoldShadow").is(":visible") && isDragged){
                                        $(".pagefoldShadow").show();
                                    }
                                    
                                    
                                    if(isDragged && !movingRight && !noflip ){
					if($options.touch){
						$wid = (initX-e.originalEvent.touches[0].pageX).limit(0,$options.width);
					}else{
						$wid = (initX-e.pageX).limit(0,$options.width);
					}
                                        
                                        animateFlip($wid);
                                    }
                                    
                                    if(isDragged && movingRight){
                                       
                                        if($wid == 0 && $(".folded").length>0){
                                            $wid = $options.width;
                                            $(".pagefold").html($(".folded").last().html());
                                        }
                                        
                                        $wide = ($wid - distance).limit(0,$options.width);
                                        animateFlip($wide,movingRight);
                                    }
                                    
                                }
                            }
                           
		});
	};
	
	function animateFlip($width,$unfolding){
                $(".pageflip").width($width);
                $(".pageflip").css("right",$width);
                $(".pagefoldShadowUnder").css("right",$width*2);
                $(".pagefold").width($width);
                $(".pagefoldShadow").width($width);
                $(".pagefold").css("right",$width);
                if($unfolding){
                    $(".being_dragged").width($options.width-$width);
                   
                }else{
                    $(".being_dragged").width($options.width-$width);
                }
                
	}
	
	function finishOffAnim($width){
	    canDrag = false;
	    animInterval = setInterval(function(){
		if($width>($options.width/3) && $width<$options.width){
		    $width+=25;
		}
		if($width>=$options.width){
		    window.clearInterval(animInterval);
		    animInterval = null;
		    $wid = $width = $options.width;
		    $(".pagefoldShadowUnder").hide();
		    $(".pagefoldShadow").hide();
		    $(".pageflip").width(0);
		    $(".pageflip").css("right",0);
		    $(".pagefold").width(0);
		    $(".pagefoldShadow").width(0);
		    $(".pagefoldShadowUnder").css("right",0);
		    $(".pagefold").css("right",0);
		    $wide = $wid = 0;
		    canDrag = true;
		}
		$(".pageflip").width($width);
		$(".pageflip").css("right",$width);
		$(".pagefold").width($width);
		$(".pagefoldShadow").width($width);
		$(".pagefoldShadowUnder").css("right",$width*2);
		$(".pagefold").css("right",$width);
		
		$(".being_dragged").last().width($options.width-$width);
		
		$(".nervFlipImage").each(function(){
		    if($(this).width() == 0){
			$(this).removeClass("tofold");
			$(this).addClass("folded");
			$(this).removeClass("being_dragged");
			$(this).next().addClass("tofold");
			$(".pagefold").html($(".tofold").html());
		    }else if($(this).width() >=$options.width && $(this).hasClass("folded")){
			$(this).removeClass("folded");
			$(this).addClass("tofold");
			$(this).removeClass("being_dragged");
			$(this).next().removeClass("tofold");
		    }
		    
		});
	    },1000/60)
	    
	}
	
	function animateBack($width){
	     canDrag = false;
	     animInterval = setInterval(function(){
		if($width>0 && $width<=($options.width/3)){
		    $width-=25;
		}
		
		if($width<=0){
		    window.clearInterval(animInterval);
		    animInterval = null;
		    $wid = $width = 0;
		    $(".pagefoldShadowUnder").hide();
		    $(".pagefoldShadow").hide();
		    canDrag = true;
		}
		
		
		$(".pageflip").width($width);
		$(".pageflip").css("right",$width);
		$(".pagefold").width($width);
		$(".pagefoldShadow").width($width);
		$(".pagefoldShadowUnder").css("right",$width*2);
		$(".pagefold").css("right",$width);
		$(".being_dragged").last().width($options.width-$width);
		
		$(".nervFlipImage").each(function(){
		    
		    if($(this).width() >=$options.width && $(this).hasClass("folded")){
			$(this).removeClass("folded");
			$(this).addClass("tofold");
			$(this).next().removeClass("tofold");
		    }
		    if($(this).width() >=$options.width){
		     $(this).removeClass("being_dragged");
		    }
		});
		
	    },1000/60)
	}
	Number.prototype.limit = function(min, max) {
	    return Math.min(max, Math.max(min, this));
	};
	
	
	$.fn.nervFlipSlider.defaults = {
		width:1024,
		height:768,
		touch:false
	}
     
})(jQuery);