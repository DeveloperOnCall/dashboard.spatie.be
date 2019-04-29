<?php

namespace App\Http\Controllers;

use Artisan;

class GitHubApiController
{
    public function gitGetRepo()
    {

        $Path = '../resources/js/services/AngieTenant.txt';
        if(file_exists($Path)){
            $string = file_get_contents($Path);   
            $json_file = json_decode($string, true);

            echo $json_file;
        }else{
           
            echo '{"action": "error"}';
        }
        

    }

  
}



