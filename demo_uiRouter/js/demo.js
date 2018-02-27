app.run(function($rootScope, $transitions, $timeout, $q, $trace){
  // initial the menu after the ng-include finished
 //  $rootScope.$on("$includeContentLoaded", function(event, templateName){
	// load_sbAdmin2Js();
 //  });

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

 $rootScope.$on("$viewContentLoaded", function(targetScope){
    Prism.highlightAll();
    Prism.fileHighlight();
 });

// https://ui-router.github.io/guide/transitions#lifecycle-events
$transitions.onFinish({}, function(transition) {
    // console.dir("onFinish Transition from " + transition.from().name +
    //   " to " + transition.to().name)
    // console.dir(transition.exiting())
    // console.dir(transition.retained())
    // console.log(transition.entering())
});

$transitions.onSuccess({}, function(transition) {

    // angular.element(function() {
    //     Prism.highlightAll();
    //     Prism.fileHighlight();
    // });

    load_sbAdmin2Js(transition);
})
  
  function load_sbAdmin2Js(transition){
    var toID = transition.$id;
    var toName = transition.to().name;
    var childName = toName.split(".");

    // initial the menu after the ng-include finished
    $('#side-menu').metisMenu('dispose');
    $('ul.nav a[class="active"]').removeClass("active")
    $('#side-menu').metisMenu();

    $(window).bind("load resize", function() {
        var topOffset = 50;
        var width = (this.window.innerWidth > 0) ? this.window.innerWidth : this.screen.width;
        if (width < 768) {
            $('div.navbar-collapse').addClass('collapse');
            topOffset = 100; // 2-row-menu
        } else {
            $('div.navbar-collapse').removeClass('collapse');
        }

        var height = ((this.window.innerHeight > 0) ? this.window.innerHeight : this.screen.height) - 1;
        height = height - topOffset;
        if (height < 1) height = 1;
        if (height > topOffset) {
            $("#page-wrapper").css("min-height", (height) + "px");
        }
    });

    // keithpoon, 20180221, remove all class for single page application
    var element = $('ul.nav a[ui-sref]').filter(function() {
        var uiSref = $(this).attr('ui-sref')

        if(toName == uiSref)
            return true;
        if(childName.length>0)
        {
            if(uiSref.indexOf('.') == 0)
                return uiSref.substring(1) == childName[childName.length-1];
        }

        return false;
    }).addClass('active').parent();

    while (true) {
        if (element.is('li')) {
            element = element.parent().addClass('in').parent();
        } else {
            break;
        }
    }
  }
});