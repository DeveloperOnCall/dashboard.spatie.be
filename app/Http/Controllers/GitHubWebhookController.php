<?php

namespace App\Http\Controllers;

use Artisan;

class GitHubWebhookController
{
    public function gitRepoReceivedPush()
    {
        //abort_unless($this->requestSignatureIsValid(), 403);

        //Artisan::call('dashboard:fetch-tasks');

        $response = file_get_contents('php://input');
        $data = json_encode(urldecode($response));
        $Path = '../resources/js/services/AngieTenant.txt';

        $file = fopen($Path, "w") or die("Unable to open file!");
      
        fwrite($file, $data);
        fclose($file);

        return $data;
        //echo file_exists($Path);
        

    }

    // protected function requestSignatureIsValid(): bool
    // {
    //     $gitHubSignature = request()->header('X-Hub-Signature');

    //     [$usedAlgorithm, $gitHubHash] = explode('=', $gitHubSignature, 2);

    //     $payload = file_get_contents('php://input');

    //     $calculatedHash = hash_hmac($usedAlgorithm, $payload, config('services.github.hook_secret'));

    //     return $calculatedHash === $gitHubHash;
    // }
}



