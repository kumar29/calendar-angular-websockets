/** Controller to handle login page. Calendar service is injected 
 */
calendar.controller("LoginController", 
      ['calendarService', '$scope', '$location',
      function(calendarService, $scope, $location){
   
   var user = {
//         userName: "Kumar",
//         password: "password",
         loggedIn: false,
      };
   
   // Set an empty user on the scope
   $scope.user = user;
   
   // Called from the Login form
   $scope.authenticateUser = function(){
      
      // Call back for login
      $scope.$on("login", function(event, data){
         
         // User is logged in now
         $scope.user.loggedIn = data.loggedIn = true;
         
         // Save the logged in user on the service so that it
         // can be shared by other controllers, directives.
         calendarService.currentUser = data;
         
         // Change URL fragment 
         $location.path( "/showCal" );
         
         // Look at http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
         // to follow why I had to do this.
         $scope.$apply();
       });
      
      // Initiate login call
      calendarService.send(JSON.stringify(
            {"service": "login", 
             "data" : $scope.user}
             ));
   };
   
}]);

/** Controller for the Sub banner which displays the logged in
 * user and a thumbnail
 */
calendar.controller("SubbannerController", 
      ['$scope', 'calendarService', '$location',
       function($scope, calendarService, $location){

         // Watch for the currently logged in user. Once logged
         // in, set the user on the scope so that it can be used by the
         // sub banner html
         $scope.calendarService = calendarService;
         $scope.$watch('calendarService.currentUser', function(newVal, oldVal, scope){
            if(newVal) { 
               scope.user = newVal;
             }
         });
         
         // Logout function disconnects the service and redirects to login page.
         $scope.logout = function(){
            calendarService.currentUser = $scope.user = null;
            $location.path( "/login" );
         };
}]);
      
/** Controller for the Main page which contains the Calendar and 
 * draggable events. 
 */
calendar.controller("CalController", 
      ['calendarService', '$scope', '$location',
      function(calendarService, $scope, $location){
         
         var user = $scope.user = calendarService.currentUser; 
         
         // If for some reason, the user is not logged in, redirect to
         // login page
         if(user == undefined){
            $location.path( "/login" );
         }
         
         // Convert the logged in user's events to fullcalendar format 
         $scope.userEvents = utils.convertToCalendarEvents(user.events, user.color);
         
         /** Handler to create a new event */
         $scope.onEventDrop = function(date, allDay) {
            // retrieve the dropped element's stored Event Object
            var event = $(this);
   
            var calEvent = {};
            var value = prompt('Give a name for your event', "");
            if (value == null) {
               return;
            }
   
            calEvent.title = value + " " + user.userName;
            calEvent.type = event.text();
            calEvent.start = date;
            calEvent.newlyAdded = true;
   
            // If this is the first event being added, initialize events array
            if(user.events == undefined){
               user.events = [];
            }
            user.events.push(utils.convertToJsonEvent(calEvent));
            
            // Invoke "save" service 
            calendarService.send(JSON.stringify(
                  {"service": "save", 
                    "data" : user
                   }));
         };
         
         // Call back for "save" service. The call back is a result of 
         // a save on the current user or some other user.
         var usersMap = {};
         $scope.$on("save", function(event, data){
             
            if(data.userName == user.userName){
               $scope.userEvents.splice(0, $scope.userEvents.length);
               
               // Push an array into an array by using the apply method
               $scope.userEvents.push.apply($scope.userEvents, 
                     utils.convertToCalendarEvents(data.events, data.color));
            }
            else{
               // If all users' events are being displayed,
               if($scope.allEvents){
                  var userName = data.userName;
                  usersMap[userName].splice(0, usersMap[userName].length);
                  usersMap[userName].push.apply(usersMap[userName], 
                        utils.convertToCalendarEvents(data.events, data.color));
               }
            }
            $scope.$apply();
          });

         
         // Initially the calendar displays events of the current
         // user only
         $scope.allEvents = false;
         
         // Handler to toggle between displaying all events and displaying
         // current user events.
         $scope.toggleEvents = function(){
            $scope.allEvents = !($scope.allEvents);
            
            if(!$scope.allEvents){
               
               // Reset the map if only the currently logged in user's
               // events should be shown
               usersMap = {};
               $scope.eventSources.splice(1, $scope.eventSources.length);
            }
            else{
               // Get all the users and their events
               calendarService.send(JSON.stringify(
                  {"service": "getAll", 
                    "data" : user
                   }));
            }
         };
         
         // Store all users in a map and set each user's events as an event source
         // for the calendar
         $scope.$on("getAll", function(event, data){
            var users = data;
            if(Array.isArray(users)){
               angular.forEach(users, function(myUser){
                  
                  var currUserName = myUser.userName;
                  
                  // Ignore current user
                  if(user.userName != currUserName){
                     var calEvents = utils.convertToCalendarEvents(myUser["events"], myUser.color);
                     
                     usersMap[currUserName] = calEvents;
                     $scope.eventSources.push(calEvents);
                  }
               });
               $scope.$apply();
            }
          });
         
         // Set calendar options including the user's events
         $scope.uiConfig = {
               calendar:{
                  width : 900,
                  header : {
                     left : 'prev,next today',
                     center : 'title',
                     right : 'month,agendaWeek,agendaDay'
                  },
                  selectable : true,
                  droppable : true,
                  theme : true,
                  drop : $scope.onEventDrop
                  }
             };
         $scope.eventSources = [$scope.userEvents];
}]);

