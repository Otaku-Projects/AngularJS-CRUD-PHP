app.run(function($rootScope, $transitions, $timeout, $q, $trace){
    // http://prismjs.com/extending.html#highlight-all
    // Rerun Prism syntax highlighting on the current page
    // http://prismjs.com/plugins/normalize-whitespace/
    Prism.plugins.NormalizeWhitespace.setDefaults({
        // 'remove-trailing': true,
        // 'remove-indent': true,
        'left-trim': true,
        // 'right-trim': true,
        /*'break-lines': 80,
        'indent': 2,
        'remove-initial-line-feed': false,
        'tabs-to-spaces': 4,
        'spaces-to-tabs': 4*/
    });
		
	$rootScope.imageShowcaseCounter = 0;

    // multi-language setting
    // $rootScope.langInstance = new Lang();
    // $rootScope.langInstance.init({
    //     defaultLang: 'en',
    //     currentLang: 'en',
    // });

    // $rootScope.switchLanguage = function(langCode_iso639){
    //     $rootScope.langInstance.change(langCode_iso639)
    // }
    
    // initial the menu after the ng-include finished
    $rootScope.$on("$includeContentLoaded", function(event, templateName){
    });
    // https://docs.angularjs.org/api/ng/service/$location#events
    $rootScope.$on("$locationChangeStart", function(event, nUrl, oUrl, newState, oldState){
    });
    $rootScope.$on("$locationChangeSuccess", function(event, nUrl, oUrl, newState, oldState){
    });
  
    // https://docs.angularjs.org/api/ngRoute/directive/ngView#event-$viewContentLoaded
    $rootScope.$on("$viewContentLoaded", function(targetScope){
        Prism.highlightAll();
        Prism.fileHighlight();

        $('.nav-tabs a').click(function (e) {
            e.preventDefault()
            $(this).tab('show')
        })
    
        // if add <base target="_self"> in index.html, no effect.
        $('.nav-tabs a').attr('target','_self');
		
    });

    // https://ui-router.github.io/guide/transitions#lifecycle-events
    $transitions.onFinish({}, function(transition) {
        // console.dir("onFinish Transition from " + transition.from().name +
        //   " to " + transition.to().name)
    });

    $transitions.onSuccess({}, function(transition) {
        load_sbAdmin2Js(transition);
		create_custom_modal_listner();
        var pageName = transition.to().name;
		
		
		$(".nav-item a").removeClass("active");
		$(".nav-item").removeClass("active");
		$("[ui-sref="+pageName+"]").addClass("active");
		$("[ui-sref="+pageName+"]").parent(".nav-item").addClass("active");

        // multi-language setting
        // $rootScope.langInstance.dynamic('en', '../demo/lang/demoHome.en.json');
        // $rootScope.langInstance.dynamic('zh-hans', '../demo/lang/demoHome.zh-hans.json');
        // $rootScope.langInstance.dynamic('zh-hant', '../demo/lang/demoHome.zh-hant.json');
        
        // $rootScope.langInstance.dynamic('en', '../demo/lang/'+pageName+'.en.json');
        // $rootScope.langInstance.dynamic('zh-hans', '../demo/lang/'+pageName+'.zh-hans.json');
        // $rootScope.langInstance.dynamic('zh-hant', '../demo/lang/'+pageName+'.zh-hant.json');
        // $rootScope.langInstance.loadPack($rootScope.langInstance.currentLang, function(err, lang, path){
        //     if (!err) {
        //     } else {
        //         console.log("load language pack failure")
        //         console.log(err)
        //         console.log(lang)
        //         console.log(path)
        //     }
        // });
    })
  
    function load_sbAdmin2Js(transition){
        var toID = transition.$id;
        var toName = transition.to().name;
        var childName = toName.split(".");
		
		var t = jQuery;
		t("#sidebarToggle, #sidebarToggleTop").on("click",function(o){t("body").toggleClass("sidebar-toggled"),t(".sidebar").toggleClass("toggled"),t(".sidebar").hasClass("toggled")&&t(".sidebar .collapse").collapse("hide")}),t(window).resize(function(){t(window).width()<768&&t(".sidebar .collapse").collapse("hide")}),t("body.fixed-nav .sidebar").on("mousewheel DOMMouseScroll wheel",function(o){if(768<t(window).width()){var e=o.originalEvent,l=e.wheelDelta||-e.detail;this.scrollTop+=30*(l<0?1:-1),o.preventDefault()}}),t(document).on("scroll",function(){100<t(this).scrollTop()?t(".scroll-to-top").fadeIn():t(".scroll-to-top").fadeOut()}),t(document).on("click",".scroll-to-top",function(o){var e=t(this);var h=e.attr('href')||e.data('href');t("html, body").stop().animate({scrollTop:t(h).offset().top},1e3,"easeInOutExpo"),o.preventDefault()});
		
		// 20191016, keithpoon, change all header color
		$("h1").addClass("text-gray-900");
		$("h2").addClass("text-gray-900");
		$("h3").addClass("text-gray-900");
		$("h4").addClass("text-gray-900");
		$("h5").addClass("text-gray-800");
		$("h6").addClass("text-gray-800");
    }
	
	function create_custom_modal_listner(){
		$(document).on('click', '[data-toggle="lightbox"]', function(event){
			event.preventDefault();
			var jqObj = $(this);
			var jsObj = this;
			
			var modalObj = extract_modal_info(jqObj, jsObj);
			
			load_custom_modal(modalObj);
		});
	}
	
	function extract_modal_info(jqObj, jsObj){
		var modalObj = {
			modalTitle: "",
			modalContent: "",
			modalFooter: ""
		};
			
		var elementContent = jqObj.html();
		var elementTitle = "";
		var elementFooter = "";
		
		$.each(this.attributes, function() {
		// this.attributes is not a plain object, but an array
		// of attribute nodes, which contain both the name and value
			if(this.specified) {
				var attrName = this.name;
				var attrValue = this.value;
				
				if(attrName == "data-title") elementTitle = attrValue;
			}
		});
		
		modalObj.modalContent = elementContent;
		modalObj.modalTitle = elementTitle;
		modalObj.modalFooter = elementFooter;
			
		return modalObj;
	}
	
	function load_custom_modal(modalObj){
		remove_modal();
		create_modal(modalObj);
	}
	
	function remove_modal(){
		$(".imageShowcaseModal").off();
		$(".imageShowcaseModal").remove();
		$(".modal-backdrop").off();
		$(".modal-backdrop").remove();
	}
	
	/*
	function create_modal(modalContent, modalTitle, modalFooter){
		if (typeof(modalTitle) == "undefined") modalTitle = "";
		if (typeof(modalFooter) == "undefined") modalFooter = "";
		*/
	function create_modal(modalObj){
		var modalContent = modalObj.modalContent;
		var modalTitle = modalObj.modalTitle;
		var modalFooter = modalObj.modalFooter;
		
		$rootScope.imageShowcaseCounter += 1;
		
		var modal_id = "imageShowcase_"+$rootScope.imageShowcaseCounter;
		
		var modal = ''+
'<div class="modal fade imageShowcaseModal" id="'+modal_id+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">'+
  '<div class="modal-dialog modal-full" role="document">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<h5 class="modal-title" id="exampleModalLabel">'+modalTitle+'</h5>'+
        '<button type="button" class="close" data-dismiss="modal" aria-label="Close">'+
          '<span aria-hidden="true">&times;</span>'+
        '</button>'+
      '</div>'+
      '<div class="modal-body">'+
	  modalContent+
      '</div>'+
      '<div class="modal-footer">'+
      modalFooter+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>';
		$("body").append(modal);
		
		$("#"+modal_id).modal('show');
		$("#"+modal_id+" button.close").click(function(){
			$("#"+modal_id).modal('hide');
		})
	}

});