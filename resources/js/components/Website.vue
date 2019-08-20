<template>
    <tile :position="position">
       
        <div v-if="ws_status">
        <ul class="grid" style="grid-auto-rows: auto;">
            <li class="overflow-hidden pb-4 mb-4 border-b-2 border-screen" v-for="(full_lists, index) in full_lists" :key="index" >
                
                <website-tab :web="full_lists.name" :status="full_lists.statusCode" :time="full_lists.time" :online="full_lists.status" :url="full_lists.url"></website-tab>

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
import Website_tab from './atoms/Website_tab';
import moment from 'moment';
import { diffInSeconds } from '../helpers';
import config from '../config.json';

export default {
    components: {    
        Tile,
        'website-tab':Website_tab, 
    },

    props: {   
        position: String,
    },

    data() {
        return {
           full_lists : [],
           ws_status : false,
           ws:'',
           lists:[],
        };
    },

    created() {
        this.lists = config.list;
        this.websocket();
        this._set();
        this.message_webstatus();
        setInterval(this.request_webstatus, 60000);
    },

    methods: {
        websocket(){
      
        //var ws_url =  'ws://'+window.location.hostname+':3031/';
        this.ws = new WebSocket(config.ws,'echo-protocol');
     
        },
        _set(){
            var tmp_lists = this.lists;
            var full_lists = [];
            tmp_lists.forEach(function(data) {

                var name_str = data.replace('https://', '').replace('http://', '').replace('www.', '').replace('.com', '');
                var name_arr = name_str.split('/');
             
                var list = {url:data,status:false,name:name_arr[0],statusCode:0,time:moment().format('HH:mm')};
                full_lists.push(list);
               
            });

            return this.full_lists = full_lists;
        },
        message_webstatus(){
            var gb = this;
            this.ws.onmessage = function(message) { 
              try {
                var json = JSON.parse(message.data);
                
                if(json.connection){
                    var data = {func:'get_web',data:gb.lists}
                    gb.ws.send(JSON.stringify(data));
                }else if(json.func=='get_web'){

                    var tmp_full_lists = gb.full_lists;

                    tmp_full_lists.forEach(function(data) {
                        
                        var n = json.url.indexOf(data.url);
                       
                        if(n>-1){
                          
                            data.status = json.status;
                            data.statusCode = json.statusCode;
                            data.time = moment().format('HH:mm');

                        }
                    });

                    return gb.full_lists = tmp_full_lists;

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
            var data = {func:'get_web',data:this.lists};
            this.ws.send(JSON.stringify(data));
        }
    },

    computed: {
       
    },
};
</script>
