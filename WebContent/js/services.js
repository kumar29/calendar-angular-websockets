calendar.factory('calendarService', ['$q', '$rootScope', function($q, $rootScope) {
   
   var self = this;

   this.ws = new WebSocket("ws://" + window.location.hostname + ":8080/cal/websocket");
   console.log("Using a standard websocket");

   this.ws.onopen = function(e) {
     console.log('socket opened');
   };

   this.ws.onerror = function(e) {
   };

   this.ws.onmessage = function(e) {
      if(e.data != ""){
         var messagePacket = JSON.parse(e.data);
         if(messagePacket != undefined){
            $rootScope.$broadcast(messagePacket.service, messagePacket.data);
         }
      }
      else{
         alert("You did something wrong");
      }
   };

   this.ws.onclose = function(e) {
       console.log('socket closed');
   };
   
   this.send = function(json){
     self.ws.send(json);
   };
   
   this.disconnect = function(){
     if (self.ws != null) {
           self.ws.close();
           self.ws = null;
       }
   };
   
   return this;
   
}]);