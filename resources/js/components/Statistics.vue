<template>

    <tile :position="position">

        <div class="grid gap-padding h-full markup">
            <ul class="align-self-center">

                <li>
                    <span class="font-bold variant-tabular capitalize">{{channel}}</span>
                    <div v-if="!nomessage && !offline">    
                        <span class="text-sm text-dimmed">({{speeddata}} / sec.)</span>
                    </div>

                </li>
                <li>

                    <div v-if="offline" class="flex z-10" style="--bg-tile: transparent" no-fade>
                        <div class="px-2 mx-auto font-black text-invers bg-error rounded-full shadow-lg">
                            No connection
                        </div>
                    </div>

                    <div v-else>
                        <div v-if="nomessage" class="flex z-10" style="--bg-tile: transparent" no-fade>
                        <div class="px-2 mx-auto font-black text-invers bg-warn rounded-full shadow-lg">
                            No message
                        </div>
                        </div>
                        <div v-else>
                        <span class="text-sm text-accent">{{ time }}</span>
                        </div>
                    </div>

                    <div v-if="counttmp>3000">
                        <span class="text-sm text-dimmed" style="color:rgb(255, 172, 51) !important;"><font-awesome-icon :icon="['fa', 'exclamation-circle']"/> Issue Data</span>
                    </div>

                    <div v-else-if="banned_ip">
                        <span class="text-sm text-dimmed" style="color:rgb(112, 91, 247) !important;"><font-awesome-icon :icon="['fa', 'user-slash']"/> IP Banned</span>
                    </div>

                    <div v-else>           
                        <span class="text-sm text-dimmed">{{ status }}</span>
                    </div>
                </li>

            
            </ul>
        </div>


    </tile>

</template>

<script>
import { emoji,relativeDateTime} from '../helpers';
import moment from 'moment';
import Tile from './atoms/Tile';

export default {
    components: {
        Tile,
    },
    props: ['position','channel'],

    data() {
        return {
            time:moment().format('HH:mm'),
            date:moment(),
            status:'wait..',
            offline: false,
            nomessage: false,
            timezone:'',
            counttmp:0,
            banned_ip: false,
            speeddata:0,
        };
    },
    created() {
        this.websocket_xhub();
        setInterval(this.determineConnectionStatus, 1000);
    },
    methods: {
        emoji,
        relativeDateTime,
        
        determineConnectionStatus() {
            this.speeddata = 0;
            const lastHeartBeatReceivedSecondsAgo = moment().diff(
                this.date,
                'seconds'
            );
           
           //125
            this.nomessage = lastHeartBeatReceivedSecondsAgo > 10;
            if(this.nomessage){
                this.status = relativeDateTime(this.date);
            }
        },

        websocket_xhub(){
            var gb = this;
            this.timezone = moment.tz.guess();
            const xHubStream = require('deepstream.io-client-js');
           
            var cn = xHubStream('167.71.200.243:6020');
            cn.login(function(success){
            
              if (success) {
                
                cn.event.subscribe(gb.channel, eventCallback);
              }

            });
            
            cn.on('error', function( error, event, topic ){
                gb.offline = true;
            });

            function eventCallback(data) {
                
               
               try {
                //"binance 418 I'm a Teapot {\"code\":-1003,\"msg\":\"Way too many requests; IP banned until 1561352375598. Please use the websocket for live updates to avoid bans.\"}"
                // if((data.indexOf('Way too many requests; IP banned') > -1)){
                //     gb.banned_ip = true;
                // }else if(data!='{}'){

                var json = data;
                gb.speeddata = gb.speeddata + 1;
                var dateString = moment(json.datetime).tz(gb.timezone).format('HH:mm');
               
                var dateString_now = moment().format('HH:mm');
                if(dateString!=dateString_now){
                    gb.banned_ip = false;
                    gb.counttmp = gb.counttmp + 1;
                }else{    
                    gb.counttmp = 0;
                }
                
                gb.time = dateString;
                var now = moment();
                gb.date = now;
                gb.status = relativeDateTime(now);

                return gb.offline = false;

                // }

              } catch (data) {
                return;
              }
            }
        },

        // websocket_xhub(){
      
        // var ws_url =  'wss://wss.hubx.cc:3000/'+this.channel;
        // var gb = this;
        // this.timezone = moment.tz.guess();
        // var ws = new WebSocket(ws_url);
        // ws.onopen = function() { 
        //     gb.offline = false;
        // }
        // ws.onclose = function() { 
        //     gb.offline = true;
        // }
        // ws.onerror = function() { 
        //     gb.offline = true;
        // }
        // ws.onmessage = function(message) {  
        //   try {
        //     //"binance 418 I'm a Teapot {\"code\":-1003,\"msg\":\"Way too many requests; IP banned until 1561352375598. Please use the websocket for live updates to avoid bans.\"}"
        //     if((message.data.indexOf('Way too many requests; IP banned') > -1)){
        //         gb.banned_ip = true;
        //     }else if(message.data!='{}'){

        //     var json = JSON.parse(message.data);

        //     var dateString = moment(json.datetime).tz(gb.timezone).format('HH:mm');
        //     var dateString_now = moment().format('HH:mm');
        //     if(dateString!=dateString_now){
        //         gb.banned_ip = false;
        //         gb.counttmp = gb.counttmp + 1;
        //     }else{    
        //         gb.counttmp = 0;
        //     }
            
        //     gb.time = dateString;
        //     var now = moment();
        //     gb.date = now;
        //     gb.status = relativeDateTime(now);


        //     }

        //   } catch (e) {
        //     return;
        //   }
            

        // };



        // },
    },
};
</script>
