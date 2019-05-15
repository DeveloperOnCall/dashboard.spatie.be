<template>
    <!-- <div class="flex-none overflow-hidden w-10 h-10 rounded-full">
        <img class="filter-grey block w-10 h-10" style="object-fit: cover;" />
        <div class="absolute pin bg-accent opacity-25"></div>
    </div> -->
    <div class="grid gap-padding h-full markup">
    	
    	<span class="font-bold variant-tabular">{{web}}</span> 
    	<span class="text-sm text-dimmed">status code : 
    		<span :class="{ 'text-danger': !online,'text-success':online }">
    		{{status}}
    		<span v-if="online"><font-awesome-icon :icon="['fas', 'check']"/></span>
    		<span v-else><font-awesome-icon :icon="['fas', 'times']"/></span>
    		</span> 
    	</span>
    	
    	
    	<div v-if="online">    		
           <span class="text-sm text-dimmed">{{ time }}</span>
        </div>
        <div v-else>   
        	<div class="flex z-10" style="--bg-tile: transparent" no-fade>  
            <div class="px-2 mx-auto font-black text-invers bg-error rounded-full shadow-lg" v-on:click="open_issue()" style="cursor: pointer;">
                Failed:{{ time }} (click) 
            </div>
            </div> 
        </div>

       
    	
    	
    </div>

</template>

<script>
export default {
    props: ['web','status','time','online','url'],
    methods: {
        open_issue(){
           window.open(this.url);
        },
    }
};
</script>