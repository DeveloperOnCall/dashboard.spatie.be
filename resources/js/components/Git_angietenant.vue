<template>

    <tile :position="position">

        <div class="grid gap-padding markup" style="height: 50%;">

            <ul class="align-self-center">
                <li>
                    <span style="font-size: 1.5em;"><font-awesome-icon :icon="['fab', 'github-square']"/></span>
                    <span class="font-bold variant-tabular">{{gitrespo_name}}</span>
                </li>
                <li>
                    <span class="font-bold variant-tabular text-header">Pull Requests</span>
                    <span class="font-bold variant-tabular text-header">{{ formatNumber(githubPullRequests) }}</span>
                </li>
                <li>
                    <span class="font-bold variant-tabular text-header">Issues</span>
                    <span class="font-bold variant-tabular text-header">{{ formatNumber(githubIssues) }}</span>
                </li>
                <li>
                    <span class="font-bold variant-tabular text-header">Forks</span>
                    <span class="font-bold variant-tabular text-header">{{ formatNumber(githubForks) }}</span>
                </li>
                <li>
                    <span class="font-bold variant-tabular text-header">Watchers</span>
                    <span class="font-bold variant-tabular text-header">{{ formatNumber(githubWatchers) }}</span>
                </li>
                <li class="text-small">
                    <span>Branch</span>
                    <span class="capitalize" style="color:rgba(33, 116, 208, 0.9);">{{ githubbranch }}</span>
                </li>

            </ul>
        </div>

        <div class="grid gap-padding markup">
         
            <git-alert v-for="(pull_request, index) in pull_requests" 
            :key="index" 
            :src="pull_request.src" 
            :name="pull_request.name" 
            :title="pull_request.title" 
            :body="pull_request.body"
            :createdat="pull_request.createdat"
            :countfile="pull_request.countfile"
            :action="pull_request.action"
            :link="pull_request.link"
            />
         
        </div>

    </tile>


</template>

<script>

import { emoji,formatNumber,relativeDateTime} from '../helpers';
import moment from 'moment';
import Tile from './atoms/Tile';
import GitAlert from './atoms/GitAlert';
import config from '../config.json';

export default {
    components: {
        Tile,
        GitAlert,
    },
    props: ['position'],

    data() {
        return {
            gitrespo_name: 'Name Respository',
            githubIssues: 0,
            githubPullRequests: 0,
            githubForks: 0,
            githubWatchers: 0,
            githubbranch:'',
            ws_github:'',
            pull_requests:[],
            hook:null,
        };
    },
    created() {
        this.hook = config.repo_hook;
        this.websocket();
        this.message_();
        setInterval(this.request_github, 10000);
    },
    methods: {
        emoji,
        formatNumber,
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
        request_github(){
            var data = {func:'github',data:this.hook};
            this.ws_github.send(JSON.stringify(data));
        },
        message_(){
            var gb = this;
            this.ws_github.onmessage = function(message) { 
              try {
                var json = JSON.parse(message.data);
              
                if(json.connection){
                    var data = {func:'github',data:gb.hook}
                    gb.ws_github.send(JSON.stringify(data));
                }else if(json.func=='github'){
                    var pull_request_count = 0;
                    var open_issues_count = json.data.repository.open_issues_count;
                    var pull_requests = [];
                  
                    if(typeof json.data.pull_request !='undefined'){
                        //console.log(json.data.pull_request);
                    
                         if(typeof json.data.pull_request.length == 'undefined'){
                            pull_request_count = 1;
                            open_issues_count = open_issues_count-1;
                            var user = {
                                src:json.data.pull_request.user.avatar_url,
                                name:json.data.pull_request.user.login,
                                title:json.data.pull_request.title,
                                body:json.data.pull_request.body ,
                                createdat:relativeDateTime(moment(json.data.pull_request.created_at)) ,
                                countfile:json.data.pull_request.changed_files ,
                                action:'pull request',
                                link:json.data.pull_request.html_url,
                            }

                            pull_requests.push(user);

                         }else if(json.data.pull_request.length>0){
                            for (i = 0; i < json.data.pull_request.length; i++) {
                                pull_request_count = pull_request_count+1;
                                open_issues_count = open_issues_count-pull_request_count;
                                var user = {
                                    src:json.data.pull_request[i].user.avatar_url,
                                    name:json.data.pull_request[i].user.login,
                                    title:json.data.pull_request[i].title,
                                    body:json.data.pull_request[i].body ,
                                    createdat:relativeDateTime(moment(json.data.pull_request[i].created_at)) ,
                                    countfile:json.data.pull_request[i].changed_files ,
                                    action:'pull request',
                                    link:json.data.pull_request[i].html_url,
                                }

                                pull_requests.push(user);

                            }
                         }
                
                    }
                    // commits
                  
                    return [
                    gb.gitrespo_name = json.data.repository.name ,
                    gb.githubIssues =  open_issues_count,
                    gb.githubPullRequests = pull_request_count ,
                    gb.githubForks = json.data.repository.forks_count ,
                    gb.githubWatchers = json.data.repository.watchers_count ,
                    gb.pull_requests = pull_requests ,
                    gb.githubbranch = json.data.repository.default_branch,
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
            
        this.ws_github = new WebSocket(config.ws,'echo-protocol');
     
        }
    

    },
};
</script>
