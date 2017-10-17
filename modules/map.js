"use strict";

var liste_adresses = {};

$(function(){
  var div = $('<div style="position:fixed; border:1px solid #A1A1A1; top: 0; left: 0; z-index: 10001; width: 250px; height: 250px;" id="map" width="250" height="250"> </div><div id="mapnotfound" style="position:fixed; border:1px solid #A1A1A1; padding:15px; top: 0; left: 0; z-index: 10001; background: #ff4d4d;">Adresse introuvable.</div>');

  $('body').append(div);

  var map = L.map('map',{animate : false}).setView([47,2], 8);
  $('#map').hide();
  $('#mapnotfound').hide();


  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> <a href="http://www.github.com/sanscostard">SansCostard</a>'
  }).addTo(map);

  L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.2.0/dist/images/';
  var marker = L.marker([51.5, -0.09]);
  marker.addTo(map);

  map_init();
  $('.value[itemprop="address"]').css({'text-decoration': 'underline', 'color': 'blue','cursor':'pointer','display':'inline'});
  $('body').on('mouseover click','p[itemprop="availableAtOrFrom"],.value[itemprop="address"]',function(e){

    // Placement de la carte
    var curX = e.clientX;
    var curY = e.clientY;
    $('#map').css({top:(curY-5)+'px',left:(curX-5)+'px'});
    $('#mapnotfound').css({top:(curY-5)+'px',left:(curX-5)+'px'});

    e.preventDefault();
    var item = $(this).parent().parent();

    // Composition de l'adresse
    var adresse = "";
    $(item).find('meta[itemprop=address],.value[itemprop="address"]').each(function(){
      if($(this).attr('content') != undefined )
      {
        adresse += $(this).attr('content').trim()+ " ";
      }
      else
      {
        if($(this).text() != "")
        {
          adresse += $(this).text().trim()+ " ";
        }
      }
    });

    adresse = adresse.trim();

    if(liste_adresses.hasOwnProperty())
    {
      map.setView(liste_adresses[adresse]['latlng']);
      marker.setLatLng(liste_adresses[adresse]['latlng']);
      if(liste_adresses[adresse]['bounds'] != null)
      {
        map.fitBounds(liste_adresses[adresse]['bounds']);
      }
      $('#map').show();
    }
    else
    {
      $.get('https://nominatim.openstreetmap.org/search.php?q='+encodeURIComponent(adresse)+'&format=json',function(data){
        if(data.length > 0)
        {
          var loc = data.shift();

          if(loc.hasOwnProperty('lat'))
          {
            // Définition de lat/lng
            liste_adresses[adresse] = { 'latlng': L.latLng(parseFloat(loc.lat), parseFloat(loc.lon)), bounds: null };
            map.setView(liste_adresses[adresse]['latlng']);
            marker.setLatLng(liste_adresses[adresse]['latlng']);

            if(loc.boundingbox.length == 4)
            {
              // Définition de la boundingbox
              liste_adresses[adresse]['bounds'] = L.latLngBounds( L.latLng(parseFloat(loc.boundingbox[0]),parseFloat(loc.boundingbox[2])),
                L.latLng(parseFloat(loc.boundingbox[1]), parseFloat(loc.boundingbox[3])));
              map.fitBounds(liste_adresses[adresse]['bounds']);
            }
            $('#map').show();
          }
          else
          {
            $('#mapnotfound').show();
          }
        }
        else
        {
          $('#mapnotfound').show();
        }
      });
    }
  });

  $('#map,#mapnotfound').on('mouseleave',function(){
    $(this).hide();
  });

  $('body').on('click','#mapdiv',function(e){
    e.preventDefault();
    $(this).hide();
  });
});

function map_init()
{
  $('.list_item').find('[itemprop="availableAtOrFrom"]').css({'text-decoration': 'underline', 'color': 'blue','cursor':'pointer','display':'inline'});
}
