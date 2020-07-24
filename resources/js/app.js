import './bootstrap.js';
import config from './config.json';
import Vue from 'vue';

import Dashboard from './components/Dashboard';
import Statistics from './components/Statistics';
import TeamMember from './components/TeamMember';
import TimeWeather from './components/TimeWeather';
import Wallet from './components/Wallet';
import Website from './components/Website';
import HistoryLog from './components/HistoryLog';
import Git_angietenant from './components/Git_angietenant';
import TrasactionReport from './components/TrasactionReport';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck,faTimes,faExternalLinkAlt,faExclamationCircle,faUserSlash,faDatabase,faHandHoldingUsd,faList } from '@fortawesome/free-solid-svg-icons';
import { faGithubSquare } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheck,faTimes,faExternalLinkAlt,faGithubSquare,faExclamationCircle,faUserSlash,faDatabase,faHandHoldingUsd,faList);

Vue.component('font-awesome-icon', FontAwesomeIcon);

new Vue({
    el: '#dashboard',

    components: {
        Dashboard,
        Statistics,
        TimeWeather,
        Wallet,
        Website,
        HistoryLog,
        'git-angietenant':Git_angietenant,
        'trasaction-report':TrasactionReport
    },

    created() {
        // let config = {
        //     broadcaster: 'socket.io',
          
        //     host: window.location.hostname + ':3000',
    
        // }
      
        // window.echo = new Echo(config);
        this.featureDetect();

    },
    methods: {
        featureDetect(){
            var vueTest = ('__defineSetter__' in Object.prototype);
            var svgTest = !!document.createElementNS && !!document.createElementNS("http://www.w3.org/2000/svg", "svg").createSVGRect;
            var transitionTest = ('transition' in document.documentElement.style) || ('WebkitTransition' in document.documentElement.style);
            var WebSocket = window.WebSocket;
            if(!vueTest&&!svgTest&&!transitionTest&&!WebSocket){
                alert('browser not support !!');
            }else{
                this.WebSocket_core();
            }
          
        },
        WebSocket_core(){
            window.connection_status = false;
            const xHubStream = require('deepstream.io-client-js');
           
            window.connection = xHubStream(config.stream,{ silentDeprecation: true });

            window.connection.login({email: config.email,password: config.password},function(success){
            
              if (success) {
                window.connection_status = true;
              }

            });
            
            window.connection.on('error', function( error, event, topic ){
                window.connection_status = true;
            });

        }
    }
});
