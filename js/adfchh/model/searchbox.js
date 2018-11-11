define('adfchh/model/searchbox', [
    'adfchh/model/unfalldaten-legende',
    'jquery',
],
       function (legende, $) {
           $('#search-op').fadeOut();
           $('#search-value').fadeOut();
           $('#filter-string').fadeOut();

           var ele=$('#search-id');
           ele.html('');
           ele.append($('<option>', {id: '*'}).text('Alles'));
           var searchGroups={};
           for (var key in legende) {
               var ignore=false,
                   title=legende[key].title;
               if (legende[key].ignore !== undefined) {
                   ignore = legende[key].ignore;
               }
               if (!ignore) {
                   if (legende[key].searchGroup !== undefined) {
                       var searchGrp=legende[key].searchGroup;
                       if (searchGroups[searchGrp] === undefined) {
                           ele.append($('<option>', {id: searchGrp}).text(searchGrp));
                           searchGroups[searchGrp]= [ ];
                       }
                       searchGroups[searchGrp].push(key);
                   } else {
                       ele.append($('<option>', {id: key}).text(title));
                   }
               }
           }
           ele.change( function () {
               $('#search-id option:selected').each(function(){
                   var key=this.id;
                   if (key === '*') {
                       $('#search-op').fadeOut();
                       $('#search-value').fadeOut();
                       $('#filter-string').fadeOut();
                   } else {
                       var sKey=key;
                       if (searchGroups[key] !== undefined) {
                           sKey=searchGroups[key][0];
                       }
                       if (legende[sKey].keys === undefined) {
                           $('#search-op').fadeIn();
                           $('#search-value').fadeOut();
                           $('#filter-string').fadeIn();
                       } else {
                           $('#search-op').fadeIn();
                           $('#search-value').fadeIn();
                           $('#filter-string').fadeOut();
                           var valbox=$('#search-value').html('');
                           for (var value in legende[sKey].keys) {
                               valbox.append($('<option>', {id: value}).text(legende[sKey].keys[value]));
                           }
                       }
                   }
               });
           });

           var searchFunc= function () {
               console.err('SearchFunc not set');
           };
           function setSearchFunc(func)  {
               searchFunc=func;
           }
           var filter=['*','=',''];
           $('#clear').click(function(evt){
               evt.preventDefault();
               $('#search-id option[id=\'*\']').prop('selected', true);
               $('#filter-string').val('').focus();
               $('#search-op').fadeOut();
               $('#search-value').fadeOut();
               $('#filter-string').fadeOut();
               filter=['*','=',''];
               searchFunc();
           });
           $('.form-search').submit(function (e) {
               e.preventDefault();
               $('#search-id option:selected').each(function(){
                   var key=this.id;
                   var filterString = document.getElementById('filter-string').value;
                   if (key === '*') {
                       lowerFilterString = filterString.toLowerCase().strip();
                       filterKey='';
                       filterOp='eq';
                       if (filterString) {
                           $('#clear').fadeIn();
                       } else {
                           $('#clear').fadeOut();
                       }
                   } else {
                       filterOp=$('#search-op option:selected').prop('id');
                       if (searchGroups[key] !== undefined) {
                           filterKey=searchGroups[key]
                           
                           $('#search-value option:selected').each(function(){
                               var val=this.id;
                               lowerFilterVal= val.toLowerCase().strip();
                               $('#clear').fadeIn();
                           });
                       }  else if (legende[key].keys === undefined) {
                           filterKey=key;
                           lowerFilterVal= filterString.toLowerCase().strip();
                           if (filterString) {
                               $('#clear').fadeIn();
                           } else {
                               $('#clear').fadeOut();
                           }
                       } else {
                           filterKey=key;
                           filterOp=$('#search-op option:selected').prop('id');
                           $('#search-value option:selected').each(function(){
                               var val=this.id;
                               lowerFilterVal= val;
                               $('#clear').fadeIn();
                           });
                       }
                   }
                   var converter;
                   if (typeof filterKey === 'string') {
                       if (legende[filterKey].converter === undefined) {
                           converter='int';
                       } else {
                           converter=legende[filterKey].converter
                       };
                   } else {
                       if (legende[filterKey[0]].converter === undefined) {
                           converter='int';
                       } else {
                           converter=legende[filterKey[0]].converter
                       };
                   }
                   if (converter === 'int') {
                       lowerFilterVal=parseInt(lowerFilterVal);
                   } else if (converter === 'geschlecht') {
                       lowerFilterVal=parseInt(lowerFilterVal);
                   } else if (converter === 'richtung') {
                       lowerFilterVal=parseInt(lowerFilterVal);
                   } else if (converter === 'date') {
                       //FIXME
                   } else if (converter != 'string') {
                       console.err('Converter not found');
                   }
                   filter=[filterKey,filterOp,lowerFilterVal];
                   searchFunc();
                   return true;
               });
           });
           function getSearchCondition() {
               return filter;
           };
           
           return {
               'searchGroups': searchGroups,
               'setSearchFunc': setSearchFunc,
               'getSearchCondition': getSearchCondition
           };
       });
