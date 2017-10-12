"use strict";


$(function(){
  var div = $('<div id="mapdiv" style="cursor:pointer;position:fixed;0;top:0;bottom:0;left:0;right:0;background: rgba(126,126,126,0.5);z-index:10000"><div style="position:fixed; border:1px solid #A1A1A1; top: calc(50vh - 240px); left: calc(50vw - 300px); z-index: 10001; padding: 25px; background: white;width: 600px; height: 480px;" id="map" width="600" height="480"> </div></div>');

  $('body').append(div);

  var map = L.map('map').setView([47,2], 12);
  $('#mapdiv').hide();

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> <a href="http://www.github.com/sanscostard">SansCostard</a>'
  }).addTo(map);

  var marker = L.marker([51.5, -0.09],{icon : L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.2.0/dist/images/marker-icon.png'}) });
  marker.addTo(map);

  $('.list_item').find('[itemprop="availableAtOrFrom"]').css({'text-decoration': 'underline', 'color': 'blue','cursor':'pointer'});

  $('.list_item').on('click','p[itemprop="availableAtOrFrom"]',function(e){
    e.preventDefault();
    var item = $(this).parent().parent();
    var self = this;

    var adresse = "";
    $(item).find('meta[itemprop=address]').each(function(){
      adresse += $(this).attr('content')+ " ";
    });

    $.get('http://nominatim.openstreetmap.org/search.php?q='+encodeURIComponent(adresse)+'&format=json',function(data){
      console.log(data);
      if(data.length > 0)
      {
        var loc = data.shift();

        map.setView([loc.lat,loc.lon]);
        marker.setLatLng([loc.lat,loc.lon]);

        if(loc.boundingbox.length == 4)
        {
          console.log([
            [loc.boundingbox[0], loc.boundingbox[2]],
            [loc.boundingbox[1], loc.boundingbox[3]]
          ]);
        }
        $('#mapdiv').show();
      }
    });
  });

  $('body').on('click','#mapdiv',function(e){
    e.preventDefault();
    $(this).hide();
  });
});
