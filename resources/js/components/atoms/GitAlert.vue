<template>

   <div class="grid h-full markup" style="border-bottom-width: 2px; border-color: rgb(240, 240, 240); padding: .35rem 0;" >
        <div class="grid gap-2 items-center w-full bg-tile z-10"style="grid-template-columns: auto 1fr" >
            <div class="flex-none overflow-hidden w-5 h-5 rounded-full">
			    <img class="block w-5 h-5" :src="src" style="object-fit: cover;" />
			   <!--  <div class="absolute pin bg-accent opacity-25"></div> -->
			</div>
            <div class="leading-tight">
                <h2 class="truncate capitalize text-header">{{ name }} <span style="font-weight: 300;font-size: 0.5em;color:rgba(33, 116, 208, 0.9);width: 6rem;">#{{action}}</span></h2>                
            </div>
            
        </div>

        <div class="align-self-center">

        	<p style="font-weight: 600;font-size:60%;cursor: pointer;" class="capitalize" v-on:click="open_git">{{title}} <font-awesome-icon :icon="['fas', 'external-link-alt']" style="font-size:0.6em;color:rgba(33, 116, 208, 0.9);" /></p> 
        	<p style="font-size:0.8em;">{{body}}</p> 
        	
        </div>

        <div class="grid items-center w-full" style="grid-template-columns: auto 1fr;">
            <span style="font-weight: 300;font-size: 0.4em;width: 6rem;">{{createdat}}</span>
        	<span style="font-weight: 300;font-size: 0.5em;color:rgba(33, 116, 208, 0.9);width: 6rem;" align="right">Change {{countfile}} file.</span>
        </div>

    </div>

</template>

<script>
export default {

    props: {
    	src: String,
        name: String,
        title: String,
        body: String,
        createdat: String,
        countfile: Number,
        action: String,
        link: String,
    },
    methods: {
        open_git(){
            window.open(this.link);
        }
    }
};
</script>
