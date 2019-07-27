var $ = require('jquery');

function getState()
{
  console.log("Aqui empieza");
  var request = $.ajax
  ({
      type       : "GET",
      url        : "http://192.254.0.66:8080/rest/items/amazonechocontrol:account:G090VC0784051T5U/status"
  });
  request.done( function(data)
  {
      console.log( "Success: Status=" + data );
  });
  request.fail( function(jqXHR, textStatus )
  {
      console.log( "Failure: " + textStatus );
  });
}
//getState();
