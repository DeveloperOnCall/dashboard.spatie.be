<template>
    <tile :position="position">
        

        <div v-if="ws_status">

            <div class="align-self-center" align="center">
                <span class="align-self-center font-bold text-header capitalize"><font-awesome-icon icon="hand-holding-usd"/> last 5 transaction</span>
            </div>
            <br>
            <ul class="grid" style="grid-auto-rows: auto;">
                <li class="overflow-hidden pb-1 mb-4 border-b-2 border-screen" v-for="(list, index) in transactions" :key="index" >
                   
                    <div class="grid gap-padding h-full markup">
                        <ul class="align-self-center">
                        <li style="border-bottom-width: 0px;">
                            <span class="font-bold variant-tabular"> <span class="text-success text-header">+ {{formatPrice(list.value)}}</span> <span class="text-small">{{list.coin}}</span></span>
                            <span class="text-small">{{relativeDateTime(list.created_at)}}</span>
                            <!-- <span class="text-small">{{list.hash}}</span> -->
                        </li>
                        </ul>
                    </div>

                </li>
            </ul>

            <div class="align-self-center" align="center">
                <span class="align-self-center font-bold text-small capitalize"><font-awesome-icon icon="list"/> have <span class="text-danger">{{queue}}</span> queue in store</span>
            </div>

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
import { relativeDateTime } from '../helpers';

export default {
   
    components: {    
        Tile,
    },
    props: {   
        position: String,
    },

    data() {
        return {
           transactions : [],
           queue : 0,
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
        relativeDateTime,
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
                    
                    gb.ws.send(JSON.stringify({func:'logSweepTransactions'}));
                    gb.ws.send(JSON.stringify({func:'logSweepQueue'}));

                }else if(json.func=='logSweepTransactions'){
                    
                    gb.transactions = json.data;

                }else if(json.func=='logSweepQueue'){
                    
                    gb.queue = json.data;

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
            this.ws.send(JSON.stringify({func:'logSweepTransactions'}));
            this.ws.send(JSON.stringify({func:'logSweepQueue'}));
        },
        formatPrice(value,full=false){

            if((typeof value != 'undefined')&&(value.toString().indexOf('e')>-1)){ 
                return value;
            }else{

                let val = (value/1);
                let m = -Math.floor( Math.log(val) / Math.log(10) + 1);

                if(isNaN(val)){
                  return 0;
                }else{

                  if(val.toString().indexOf('.')==-1){

                    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

                  }else{

                      if(!full){

                        if((m>-1)&&(m<6)){
                          val = val.toFixed(m+2);
                        }else if(m>6){
                          val = val.toFixed(6);
                        }else if(isNaN(m)){
                          val = val.toFixed(6);
                        }

                        if(val>1){
                          val = val.toFixed(2);
                        }

                      }else{
                        val = val.toFixed(8)*1;
                      }
                      
                      var val_arr = val.toString().split('.');
                      return val_arr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +'.'+val_arr[1];
                      
                  }

                }
                
            }
        },
    },

    computed: {
       
    },
};
</script>
