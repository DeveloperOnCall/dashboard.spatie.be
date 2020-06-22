<template>
    <tile :position="position">
        
        <div class="align-self-center" align="center">
           
            <span class="align-self-center font-bold text-mini capitalize"><font-awesome-icon icon="database"/> {{type}}</span>
           
        </div>

        <div v-if="ws_status">
        <ul class="grid" style="grid-auto-rows: auto;">
            <li class="overflow-hidden pb-4 mb-4 border-b-2 border-screen" v-for="(list, index) in log" :key="index" >
               
               <div class="grid gap-padding h-full markup">
                    <ul class="align-self-center">
                    <li>
                        <span class="font-bold variant-tabular text-mini">{{list.table}} </span>
                        <span class="text-dimmed text-mini" v-if="type=='mysql'" > {{list.mb}} MB.  </span>
                    </li>
                    <li>
                        <span class="text-dimmed text-mini">last update : {{ log.time }}</span>
                        <span class="text-mini">{{list.rows}} row. </span>
                    </li>
                    </ul>
                </div>

            </li>
        </ul>
        </div>
        <div v-else>
            <div class="flex z-10" style="--bg-tile: transparent" no-fade>  
            <div class="px-2 mx-auto font-black text-invers bg-error rounded-full shadow-lg">
               WSS: failed
            </div>
            </div> 
        </div>

    </tile>
</template>

<script>

import Tile from './atoms/Tile';
import moment from 'moment';
import { diffInSeconds } from '../helpers';
import config from '../config.json';

export default {
   
    components: {    
        Tile,
    },
    props: {   
        position: String,
        type: String,
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
                    var data = {func:'logHistory'}
                    if(gb.type!='mysql'){
                        var data = {func:'logHistoryMongoDB'};
                    }
                    gb.ws.send(JSON.stringify(data));

                }else if(json.func=='logHistory'){
                    
                    var tmp_log = json.data;
                    tmp_log[0].table = 'Days';
                    tmp_log[1].table = 'Hours';
                    tmp_log[2].table = 'Minutes';
                    tmp_log.time = moment().format('HH:mm');

                    gb.log = tmp_log;

                }else if(json.func=='logHistoryMongoDB'){

                    var tmp_log = [{table:'Days',rows:json.data.Days},{table:'Hours',rows:json.data. Hours},{table:'Minutes',rows:json.data.Minutes}];

                    tmp_log.time = moment().format('HH:mm');

                    gb.log = tmp_log;

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
            var data = {func:'logHistory'};
            if(this.type!='mysql'){
                var data = {func:'logHistoryMongoDB'};
            }
            this.ws.send(JSON.stringify(data));
        }
    },

    computed: {
       
    },
};
</script>
