"use strict";

var regex = /o=([0-9]+)/g;
var url = location.href;

$(function(){

  $('footer.pagination').hide();

  var trigger = false;

  $(window).on('scroll',function() {
    if($('.list.mainList').height() - $(window).height() < $(window).scrollTop() && trigger == false)
    {
      console.log('----------------------');
      trigger = true;
      var next_url = url;
      var page = '';
      console.log(next_url);
      if(next_url.indexOf('o=') > -1)
      {
        var m = $_GET(next_url,'o');
        console.log(m);
        if(m != null)
        {
          m = parseInt(m)+1;
          page = m;
          next_url = next_url.replace(/o=([0-9]+)/,'o='+m);
        }
      }
      else
      {
        page = 2;
        if(next_url.indexOf('&') > -1)
        {
          next_url += '&o=2';
        }
        else
        {
          next_url += '?o=2';
        }
      }
      console.log(next_url);
      $.get(next_url,function(data){
        // Suppression des sauts de ligne
        data = data.replace(/(\r\n|\n|\r)/gm,"");
        var content = data.substr(data.indexOf('<section class="tabsContent block-white dontSwitch">')+'<section class="tabsContent block-white dontSwitch">'.length);
        content = content.substr(0, content.indexOf('<!-- Check'));
        content = content.substr(0, content.lastIndexOf('</section>'));
        console.log(content);
        if(content != "")
        {
          $('.tabsContent').append('<hr style="margin-bottom:12px"><h2 style="padding-left:20px;">Page '+page+'</h2><hr>'+content);
          masquer_init();
          map_init();
          url = next_url;
          console.log(url);
          setTimeout(function(){
            trigger = false;
          },2000);
        }
        else
        {
          $('.tabsContent').append('<hr><div style="text-align:center"><h2>FIN DE LA LISTE</h2></div>');
        }
      })
    }
  });
});

function $_GET(url,param) {
  var vars = {};
  url.replace( location.hash, '' ).replace(
    /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
    function( m, key, value ) { // callback
      vars[key] = value !== undefined ? value : '';
    }
  );

  if ( param ) {
    return vars[param] ? vars[param] : null;
  }
  return vars;
}
