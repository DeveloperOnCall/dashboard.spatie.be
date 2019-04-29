<template>

    <tile :position="position">

        <div class="grid gap-padding h-full markup">

            <ul class="align-self-center">
                <li>
                    <span v-html="emoji('✨')" />
                    <span class="font-bold variant-tabular">{{gitrespo_name}}</span>
                </li>
                <li>
                    <span class="font-bold variant-tabular">Pull Requests</span>
                    <span class="font-bold variant-tabular">{{ formatNumber(githubPullRequests) }}</span>
                </li>
                <li>
                    <span class="font-bold variant-tabular">Issues</span>
                    <span class="font-bold variant-tabular">{{ formatNumber(githubIssues) }}</span>
                </li>
                <li>
                    <span class="font-bold variant-tabular">Forks</span>
                    <span class="font-bold variant-tabular">{{ formatNumber(githubForks) }}</span>
                </li>
                <li>
                    <span class="font-bold variant-tabular">Watchers</span>
                    <span class="font-bold variant-tabular">{{ formatNumber(githubWatchers) }}</span>
                </li>

            </ul>
        </div>


    </tile>

</template>

<script>

import GitHub from 'github-api';
import Promise from 'es6-promise';
import { emoji,formatNumber} from '../helpers';
import moment from 'moment';
import Tile from './atoms/Tile';

export default {
    components: {
        Tile,
    },
    props: ['position','hook'],

    data() {
        return {
            gitrespo_name: 'Name Respository',
            githubIssues: 0,
            githubPullRequests: 0,
            githubForks: 0,
            githubWatchers: 0,
            ws_github:'',
        };
    },
    created() {
        this.websocket();
        this.message_();
        setInterval(this.request_github, 10000);
        //this.github();
    },
    methods: {
        emoji,
        formatNumber,
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
        request_github(){
            var data = {func:'github',data:this.hook};
            this.ws_github.send(JSON.stringify(data));
        },
        message_(){
            var gb = this;
            this.ws_github.onmessage = function(message) { 
              try {
                var json = JSON.parse(message.data);
                console.log(json);
                if(json.connection){
                    var data = {func:'github',data:gb.hook}
                    gb.ws_github.send(JSON.stringify(data));
                }else if(json.func=='github'){
                    var pull_request_count = 0;
                    var open_issues_count = json.data.repository.open_issues_count;
                    console.log(json.data.repository);
                    if(typeof json.data.pull_request !='undefined'){
                        console.log(json.data.pull_request);
                    
                         if(typeof json.data.pull_request.length == 'undefined'){
                            pull_request_count = 1;
                            open_issues_count = open_issues_count-1;
                         }
                
                    }
                    // commits
                    // pull_request
                    // pull_request.title
                    // pull_request.user
                    // pull_request.user.avatar_url
                    // pull_request.user.login
                    // pull_request.created_at
                    // pull_request.body
                    // pull_request.changed_files
                    return [
                    gb.gitrespo_name = json.data.repository.name ,
                    gb.githubIssues =  open_issues_count,
                    gb.githubPullRequests = pull_request_count ,
                    gb.githubForks = json.data.repository.forks_count ,
                    gb.githubWatchers = json.data.repository.watchers_count ,
                    ];
                }
              } catch (e) {
                return;
              }
                

            };

            // this.ws.onopen = function () {  
            //     gb.ws_status = true;
            // };

            // this.ws.onerror = function () {
            //     gb.ws_status = false;
            // };

        

        },
        websocket(){
        //var ws_url =  'ws://'+window.location.hostname+':3031/';
        var ws_url =  'ws://178.128.83.160:3031/';
        this.ws_github = new WebSocket(ws_url,'echo-protocol');
     
        },
        github(){


            var gh = new GitHub({
            
                token: '3533b8f4174a9a530fb835bce44375a9c53391ed'
              
            });

             var me = gh.getUser('Supparerk23');

             me.getProfile(function(err, res) {
                 console.log(res);
             });
   
       
            me.listRepos(function(err, repos) {
                //List public repositories
                console.log(repos);
                var name = repos[0].name;
                console.log(name);
                // this.gitrespo_name = name;
            });

        
        }

    },
};
</script>
