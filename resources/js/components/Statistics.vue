<template>

    <tile :position="position">
    
        <div class="grid gap-padding h-full markup">
            <ul class="align-self-center">

                <!-- <li>
                    <span v-html="emoji('✨')" />
                    <span class="font-bold variant-tabular">{{ formatNumber(githubStars) }}</span>
                </li> -->
                <li>
                    <span class="font-bold variant-tabular">{{channel}}</span>
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
                                   
                    <span class="text-sm text-dimmed">{{ status }}</span>
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
            githubStars: 0,
            time:moment().format('HH:mm'),
            date:moment(),
            status:'connect ..',
            offline: false
        };
    },
    created() {
        this.websocket_xhub();
        setInterval(this.determineConnectionStatus, 1000);
    },
    methods: {
        emoji,
        relativeDateTime,
        // getEventHandlers() {
        //     return {
        //         'Statistics.GitHubTotalsFetched': response => {
        //             this.githubStars = response.stars;
        //             this.githubIssues = response.issues;
        //             this.githubPullRequests = response.pullRequests;
        //             this.githubContributors = response.contributors;
        //         },

        //         'Statistics.PackagistTotalsFetched': response => {
        //             this.packagistTotal = response.total;
        //             this.packagistMonthly = response.monthly;
        //         },
        //     };
        // },

        // getSaveStateConfig() {
        //     return {
        //         cacheKey: 'statistics',
        //     };
        // },
        determineConnectionStatus() {
            const lastHeartBeatReceivedSecondsAgo = moment().diff(
                this.date,
                'seconds'
            );
           //125
            this.offline = lastHeartBeatReceivedSecondsAgo > 60;
            if(this.offline){
                this.status = relativeDateTime(this.date);
            }
        },
        websocket_xhub(){
        //var ws_url = 'wss://ws.hubx.cc:3000/bigone';
        //var ws_url =  'ws://'+window.location.hostname+':3031/';
        var ws_url =  'wss://ws.hubx.cc:3000/'+this.channel;
        var gb = this;
        var ws = new WebSocket(ws_url,'echo-protocol');
        ws.onopen = function () {  
          console.warn('[Connecting] Start');
        };

        ws.onerror = function () {
          console.warn('[Connecting] False : RE-Connecting');
        };

        ws.onmessage = function(message) {  
          try {
            // var json = JSON.parse(message.data);
            gb.time = moment().format('HH:mm');
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
