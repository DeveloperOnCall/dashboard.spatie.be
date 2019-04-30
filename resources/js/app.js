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
import Website from './components/Website';
import Git_angietenant from './components/Git_angietenant';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck,faTimes,faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithubSquare } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faCheck,faTimes,faExternalLinkAlt,faGithubSquare);

Vue.component('font-awesome-icon', FontAwesomeIcon);

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
        Website,
        'git-angietenant':Git_angietenant,
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
            }
          
        }
    }
});
