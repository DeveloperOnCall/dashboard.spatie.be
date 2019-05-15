<template>

    <tile :position="position">

        <div class="grid gap-padding h-full markup">
            <ul class="align-self-center">

                <li>
                    <span class="font-bold variant-tabular capitalize">{{channel}}</span>
                </li>
                <li>

                    <div v-if="offline" class="flex z-10" style="--bg-tile: transparent" no-fade>
                        <div class="px-2 mx-auto font-black text-invers bg-error rounded-full shadow-lg">
                            No connection
                        </div>
                    </div>
                    <div v-else>
                        <span class="text-sm text-dimmed">{{ time }}</span>  
                    </div>

                    <div v-if="counttmp>60">
                        <span class="text-sm text-dimmed" style="color:rgb(255, 172, 51) !important;"><font-awesome-icon :icon="['fa', 'exclamation-circle']"/> Third party issue</span>
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
            timezone:'',
            counttmp:0,
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
            const lastHeartBeatReceivedSecondsAgo = moment().diff(
                this.date,
                'seconds'
            );
           //125
            this.offline = lastHeartBeatReceivedSecondsAgo > 10;
            if(this.offline){
                this.status = relativeDateTime(this.date);
            }
        },
        websocket_xhub(){
      
        var ws_url =  'wss://wss.hubx.cc:3000/'+this.channel;
        var gb = this;
        this.timezone = moment.tz.guess();
        var ws = new WebSocket(ws_url,'echo-protocol');
        
        ws.onmessage = function(message) {  
          try {
     
            var json = JSON.parse(message.data);
            var dateString = moment(json.datetime).tz(gb.timezone).format('HH:mm');
            var dateString_now = moment().format('HH:mm');
            if(dateString!=dateString_now){
                gb.counttmp = gb.counttmp + 1;
            }else{    
                gb.counttmp = 0;
            }
            
            gb.time = dateString;
            var now = moment();
            gb.date = now;
            gb.status = relativeDateTime(now);
          } catch (e) {
            return;
          }
            

        };



        },
    },
};
</script>
