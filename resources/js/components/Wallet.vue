<template>
    <tile :position="position">

        <div v-if="ws_status">
        <ul class="grid" style="grid-auto-rows: auto;">
            <li class="overflow-hidden pb-1 mb-4 border-b-2 border-screen" v-for="(list, index) in log" :key="index" >
               
                <div class="grid gap-padding h-full markup">
                    <ul class="align-self-center">
                    <li style="border-bottom-width: 0px;">
                        <span class="font-bold variant-tabular text-header">{{list._id}} </span>
                        <span class="text-small"> <span class="text-success">{{list.count}}</span> wallet. </span>
                    </li>
                    </ul>
                </div>

            </li>
        </ul>
        </div>
        <div v-else>
            <div class="flex z-10" style="--bg-tile: transparent" no-fade>  
            <div class="px-2 mx-auto font-black text-invers bg-error rounded-full shadow-lg text-header">
               WSS: failed
            </div>
            </div> 
        </div>

    </tile>
</template>

<script>

import Tile from './atoms/Tile';
import moment from 'moment';
import config from '../config.json';

export default {
   
    components: {    
        Tile,
    },
    props: {   
        position: String,
    },

    data() {
        return {
           log : [],
           ws_status : false,
           ws:'',
        };
    },

    created() {
      
        this.websocket();
     
        this.message_webstatus();
        setInterval(this.request_webstatus, 600000); //10mins
    },

    methods: {
        websocket(){
      
        //var ws_url =  'ws://'+window.location.hostname+':3031/';
        this.ws = new WebSocket(config.ws,'echo-protocol');
     
        },

        message_webstatus(){
            var gb = this;
            this.ws.onmessage = function(message) { 
              try {
                var json = JSON.parse(message.data);
               
                if(json.connection){
                    var data = {func:'logWallet'}
                    gb.ws.send(JSON.stringify(data));

                }else if(json.func=='logWallet'){
                    
                    gb.log = json.data;

                }

              } catch (e) {
                return;
              }
                

            };

            this.ws.onopen = function () {  
                gb.ws_status = true;
            };

            this.ws.onerror = function () {
                gb.ws_status = false;
            };

        

        },
        request_webstatus(){
            var data = {func:'logWallet'};
            this.ws.send(JSON.stringify(data));
        }
    },

    computed: {
       
    },
};
</script>
