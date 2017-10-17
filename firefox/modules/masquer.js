"use strict";

var liste_masquer = [];

if (localStorage['init'] == undefined) {
  browser.storage.sync.set({'liste_masquer': []});
  localStorage['init'] = 1;
}

$(function(){
  masquer_init();
});

function masquer_init()
{
  browser.storage.sync.get('liste_masquer',function(o){
    liste_masquer = o['liste_masquer'];
    for(var i in liste_masquer)
    {
      $('.list').find('.list_item[href="'+liste_masquer[i]+'"]').parent().remove();
    }
  });


  var delete_button = $('<div class="mediumgrey remove_it" style="position: absolute;top: 45px;right: 4px;z-index: 99;" title="supprimer l\'annonce"><i class="icon-delete icon-2x"></i></div>');
  $('.list').find('.list_item').append(delete_button);

  $('body').on('click','.remove_it',function(e){
    e.preventDefault();
    var parent = $(this).parent('.list_item');
    liste_masquer.push(parent.attr('href'));
    console.log([liste_masquer]);
    browser.storage.sync.set({'liste_masquer': liste_masquer},function(){
      parent.remove();
    });
  });
}
