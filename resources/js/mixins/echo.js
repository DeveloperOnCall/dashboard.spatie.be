import { forIn } from 'lodash';

export default {
    created() {
        forIn(this.getEventHandlers(), (handler, eventName) => {

        	// console.log(eventName);
        	// console.log(window.ws);
        	// console.log(handler);
        	// console.log(window.echo);
        	// console.log(this.$root.echo);
        	
        	
        	//handler(this.$root.echo.readyState);
            //this.$root.echo.private('dashboard').listen(eventName, response => handler(response));

         //    window.ws.onmessage = function(message) {  
	        //   try {
	        //     var json = JSON.parse(message.data);
	        //     // console.log(json);
	        //     handler(json);
	        //   } catch (e) {
	        //     return;
	        //   }
	            

	        // };


        });
    },
};
