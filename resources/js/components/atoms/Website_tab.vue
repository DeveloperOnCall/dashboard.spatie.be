<template>
    <!-- <div class="flex-none overflow-hidden w-10 h-10 rounded-full">
        <img class="filter-grey block w-10 h-10" style="object-fit: cover;" />
        <div class="absolute pin bg-accent opacity-25"></div>
    </div> -->
    <div class="grid gap-padding h-full markup">
    	
    	<span class="font-bold variant-tabular">{{web}}</span> 
    	<span class="text-sm text-dimmed">{{status}}</span>
    	<span class="text-sm text-dimmed">{{time}}</span>
    		
    	
    	</ul>
    </div>

</template>

<script>
export default {
    props: ['web','status','time'],
};
</script>