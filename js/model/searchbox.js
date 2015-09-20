define('model/searchbox',[
    'model/unfalldaten-legende',
    'jquery',
],
       function (legende, $) {
           var ele=$('#search-id');
           ele.html('');
           ele.append($('<option>',{id:'*'}).text('Alles'));
           for (var key in legende) {
               var ignore=false,
                   title=legende[key].title;
               if (legende[key].ignore !== undefined) {
		   ignore = legende[key].ignore;
	       }
               if (!ignore) {
                   ele.append($('<option>',{id:key}).html(title));
               }
           }
           ele.change( function () {
               $('#search-id option:selected').each(function(){
                   debugger;
                   var key=this.id;
                   if (key === '*') {
                       $('#search-op').fadeOut();
                       $('#search-value').fadeOut();
                       $('#filter-string').fadeIn();
                   } else if (legende[key].keys === undefined) {
                       $('#search-op').fadeIn();
                       $('#search-value').fadeOut();
                       $('#filter-string').fadeIn();
                   } else {
                       $('#search-op').fadeIn();
                       $('#search-value').fadeIn();
                       $('#filter-string').fadeOut();
                       var valbox=$('#search-value').html('');
                       for (var value in legende[key].keys) {
                           valbox.append($('<option>',{id:value}).html(legende[key].keys[value]));
                       };
                   };
               });
           });
       });
