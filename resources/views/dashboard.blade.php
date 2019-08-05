@extends('layouts/master')

@section('content')

@javascript(compact('pusherKey', 'clientConnectionPath', 'environment', 'openWeatherMapKey'))
<div id="dashboard">
   
    <dashboard class="font-sans">

       <!--  <twitter :initial-tweets="{{ json_encode($initialTweets) }}" position="a1:a24"></twitter>

        <tile-timer on="16:00" off="19:00">
            <trains position="a1:a24"></trains>
        </tile-timer> -->
 
      <!--   <team-member name="adriaan" avatar="{{ gravatar('adriaan@spatie.be') }}" birthday="1995-10-22" position="b1:b8"></team-member>
        <team-member name="alex" avatar="{{ gravatar('alex@spatie.be') }}" birthday="1996-02-05" position="c1:c8"></team-member>
        <team-member name="brent" avatar="{{ gravatar('brent@spatie.be') }}" birthday="1994-07-30" position="b9:b16"></team-member>
        <team-member name="freek" avatar="{{ gravatar('freek@spatie.be') }}" birthday="1979-09-22" position="c9:c16"></team-member>
        <team-member name="ruben" avatar="{{ gravatar('ruben@spatie.be') }}" birthday="1994-05-16" position="b17:b24"></team-member>
        <team-member name="seb" avatar="{{ gravatar('sebastian@spatie.be') }}" birthday="1992-02-01" position="c17:c24"></team-member>
        <team-member name="jef" avatar="{{ gravatar('jef@spatie.be') }}" birthday="1975-03-28" position="d11:d13"></team-member>
        <team-member name="wouter" avatar="{{ gravatar('wouter@spatie.be') }}" birthday="1991-03-15" position="d14:d16"></team-member>
        <team-member name="willem" avatar="{{ gravatar('willem@spatie.be') }}" birthday="1975-09-04" position="d17:d24"></team-member> -->
  
       <git-angietenant position="a1:a7" hook="http://dashboard.hubx.cc/api/github/AngieTenant"></git-angietenant>
        
        
        <statistics position="b1" channel="bleutradebook"></statistics>
        <statistics position="b2" channel="binancebook"></statistics>          
        <statistics position="b3" channel="krakenbook"></statistics>         
        <statistics position="b4" channel="poloniexbook"></statistics>         
        <statistics position="b5" channel="bitfinexbook"></statistics>         
        <statistics position="b6" channel="bitstampbook"></statistics>
        <statistics position="b7" channel="bitmexbook"></statistics>

        <statistics position="c1" channel="bittrexbook"></statistics>         
        <statistics position="c2" channel="deribitbook"></statistics>          
        <statistics position="c3" channel="okexbook"></statistics>
        <statistics position="c4" channel="hitbtcbook"></statistics>       
        <statistics position="c5" channel="lbankbook"></statistics>
        <statistics position="c6" channel="coinbaseprobook"></statistics>
        <statistics position="c7" channel="cexbook"></statistics>

        <statistics position="d1" channel="binance"></statistics>
        <statistics position="d2" channel="kraken"></statistics>
        <statistics position="d3" channel="bitmex"></statistics>
        <statistics position="d4" channel="okex"></statistics>
        <statistics position="d5" channel="bittrex"></statistics>
        <statistics position="d6" channel="bleutrade"></statistics>
        <statistics position="d7" channel="poloniex"></statistics>
        
        <!-- <statistics position="c3" channel="anybits"></statistics>  -->        
        <!-- <statistics position="c5" channel="bxinth"></statistics> -->         
        <!-- <statistics position="c6" channel="btcturk"></statistics>  -->         
        <!-- <statistics position="d2" channel="acx"></statistics>    -->
        <!-- <statistics position="d3" channel="hitbtc2"></statistics> --> 
        <!-- <statistics position="d4" channel="bitsane"></statistics>  -->        
        <!-- <statistics position="d5" channel="exmo"></statistics>  -->      

        <time-weather position="e1:e4" date-format="ddd DD/MM" time-zone="Asia/Bangkok" weather-city="Phuket"></time-weather>

        <!-- <internet-connection position="e5:e6"></internet-connection> -->
        <website position="e5:e7" :lists="['https://traders.fxstockbroker.com','http://dev.xhub.trade']"></website>
        
        
       

       <!--  <uptime position="d1:d10"></uptime>

        <calendar position="e7:e16"></calendar>

        <velo position="e17:e24"></velo> -->


    </dashboard>
</div>
@endsection
