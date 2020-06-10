const port = 3031;
const mysql = require('mysql');
const config = require('./config');

const connection_table_schema = mysql.createConnection({
    host: config.database.AngieTenant.host,
    user: config.database.AngieTenant.user,
    password: config.database.AngieTenant.password,
    database: 'information_schema'
});

connection_table_schema.connect();


const WebSocketServer = require('websocket').server;

const http = require('http');
var request = require('request');
var list;
const server = http.createServer(function(request, response) {
    //console.log((new Date()) + ' Received request for ' + request.url);
    response.writehead(400);
    response.end();
});
server.listen(port, function() {
  console.log();
  console.log((new Date()) + ' Server is listening on port '+port);
});

wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: false
});

function getLog(connection){

  connection_table_schema.query('SELECT table_name AS `table`, round(((data_length + index_length) / 1024 / 1024), 2) `mb` , table_rows AS `rows` FROM TABLES WHERE table_schema = "'+config.database.AngieTenant.logDB.main+'" AND table_name in ("'+config.database.AngieTenant.logDB.minutes+'","'+config.database.AngieTenant.logDB.hours+'","'+config.database.AngieTenant.logDB.days+'")', function (error, results, fields) {
  if (error) throw error;
    connection.sendUTF(JSON.stringify({func:'logHistory',data:results}));
  });


}
 
function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

function call_webStatus(connection){
 
  for (i = 0; i < list.length; i++) {

  var timeoutInMilliseconds = 10*1000;
  var opts = {
    url: list[i],
    timeout: timeoutInMilliseconds
  };

  request(opts, function (err, res, body) {
    if (err) {
      //console.dir(err);
      return;
    }
    // console.log(JSON.stringify(res.request.url.href));
    if(res.statusCode==200){
      var status_boolean = true;
    }else{
      var status_boolean = false;
    }
    connection.sendUTF(JSON.stringify({func:'get_web',url:res.request.uri.href,status:status_boolean,statusCode:res.statusCode}));
   
  });

  }

}

function call_api(url,connection){

  var timeoutInMilliseconds = 10*1000;
  var opts = {
    url: url,
    timeout: timeoutInMilliseconds
  };

  request(opts, function (err, res, body) {
    if (err) {
      //console.dir(err);
      return;
    }
    // console.log(JSON.stringify(res.request.url.href));
    var n = res.body.indexOf("<!DOCTYPE html>");
    if((res.body!='')&&(n==-1)){

      var data_re =  JSON.parse(res.body.replace('payload=',''));
      //console.log('re');
      connection.sendUTF(JSON.stringify({func:'github',data:data_re,statusCode:res.statusCode}));
    
    }
   
  });

  
}

wsServer.on('request', function(request) {
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
     //console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
   
    connection.sendUTF(JSON.stringify({connection:true}));
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // console.log('Received Message: ' + message.utf8Data);
            var json = JSON.parse(message.utf8Data);
            //connection.sendUTF(message.utf8Data);
            switch(json.func){
              case 'get_web' : 
                list = json.data;
                call_webStatus(connection);
              break;
              case 'github' :                
                call_api(json.data,connection);
              break;
              case 'logHistory' :
                getLog(connection);
              break;
            }

        }
        
    });
    connection.on('close', function(reasonCode, description) {
        //console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  
    });
});