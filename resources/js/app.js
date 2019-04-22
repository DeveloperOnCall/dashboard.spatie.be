import './bootstrap.js';

import Vue from 'vue';

import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import Statistics from './components/Statistics';
import InternetConnection from './components/InternetConnection';
import TeamMember from './components/TeamMember';
import TimeWeather from './components/TimeWeather';
import Trains from './components/Trains';
import Twitter from './components/Twitter';
import Uptime from './components/Uptime';
import Velo from './components/Velo';
import TileTimer from './components/TileTimer';

new Vue({
    el: '#dashboard',

    components: {
        Dashboard,
        Calendar,
        Statistics,
        InternetConnection,
        TeamMember,
        TimeWeather,
        Trains,
        Twitter,
        Uptime,
        Velo,
        TileTimer,
    },

    created() {

        // let config = {
        //     broadcaster: 'socket.io',
          
        //     host: window.location.hostname + ':3000',
    
        // }
      
        // window.echo = new Echo(config);
        this.featureDetect();
        this.websocket();
      
    },
    methods: {
        websocket(){
        //var ws_url = 'wss://ws.hubx.cc:3000/bigone';
        //var ws_url =  'ws://'+window.location.hostname+':3031/';
        var ws_url =  'ws://178.128.83.160:3031/';
        console.log(ws_url);
     
        window.ws = new WebSocket(ws_url,'echo-protocol');
        ws.onopen = function () {  
          console.warn('[Connecting] Start');
        };

        ws.onerror = function () {
          console.warn('[Connecting] False : RE-Connecting');
        };

        ws.onmessage = function(message) {  
          try {
            var json = JSON.parse(message.data);
            console.log(json);
          } catch (e) {
            return;
          }
            

        };



        },

        featureDetect(){
            var vueTest = ('__defineSetter__' in Object.prototype);
            var svgTest = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
            var transitionTest = ('transition' in document.documentElement.style) || ('WebkitTransition' in document.documentElement.style);
            var WebSocket = window.WebSocket;
            if(!vueTest&&!svgTest&&!transitionTest&&!WebSocket){
                alert('browser not support !!');
            }
          
        }
    }
});
