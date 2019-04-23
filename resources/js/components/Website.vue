<template>
    <tile :position="position">
        <ul class="grid" style="grid-auto-rows: auto;">
            <li class="overflow-hidden pb-4 mb-4 border-b-2 border-screen" v-for="(full_lists, index) in full_lists" :key="index" >
                
                <website-tab :web="full_lists.name" :status="full_lists.statusCode" :time="full_lists.time"></website-tab>

            </li>
        </ul>
    </tile>
</template>

<script>

import Tile from './atoms/Tile';
import Website_tab from './atoms/Website_tab';
import moment from 'moment';
import { diffInSeconds } from '../helpers';

export default {
    components: {    
        Tile,
        'website-tab':Website_tab, 
    },

    props: {   
        position: String,
        lists: Array,
    },

    data() {
        return {
           full_lists : [],
        };
    },

    created() {
       this._set();
       this.message_webstatus();
        setInterval(this.request_webstatus, 10000);
    },

    methods: {
    
        _set(){
            var tmp_lists = this.lists;
            var full_lists = [];
            tmp_lists.forEach(function(data) {

                var name_str = data.replace('https://', '').replace('www.', '').replace('.com', '');

                var list = {url:data+'/',status:false,name:name_str,statusCode:0,time:moment().format('HH:mm')};
                full_lists.push(list);
               
            });

            return this.full_lists = full_lists;
        },
        message_webstatus(){
            var gb = this;
            window.ws.onmessage = function(message) { 
              try {
                var json = JSON.parse(message.data);
               
                if(json.connection){
                    var data = {func:'get_web',data:gb.lists}
                    window.ws.send(JSON.stringify(data));
                }else if(json.func=='get_web'){
                    var tmp_full_lists = gb.full_lists;

                    tmp_full_lists.forEach(function(data) {
                        if(data.url==json.url){
                          
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

        },
        request_webstatus(){
            var data = {func:'get_web',data:this.lists};
            window.ws.send(JSON.stringify(data));
        }
    },

    computed: {
       
    },
};
</script>
