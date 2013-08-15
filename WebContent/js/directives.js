calendar.directive('draggable', function() {
   return {
       // Restrict it to be an attribute in this case
       restrict: 'A',
       
       // responsible for registering DOM listeners as well as updating the DOM
       link: function(scope, element, attrs) {
          
          angular.element('.external-event').each(function() {
             // make the event draggable using jQuery UI
             angular.element(this).draggable({
                zIndex : 999,
                revert : true, // will cause the event to go back to its
                revertDuration : 0
             // original position after the drag
             });
          });

       }
   };
});

calendar.directive('jqbutton', function() {
   return {
       // Restrict it to be an attribute in this case
       restrict: 'A',
       
       // responsible for registering DOM listeners as well as updating the DOM
       link: function(scope, element, attrs) {
          element.button();
       }
   };
});

