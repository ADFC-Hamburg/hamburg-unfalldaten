define('adfchh/model/searchbox', [
    'adfchh/model/unfalldaten-legende',
    'jquery',
],
       function (legende, $) {
           var searchBox=$('#search-box');
           var clear=$('#clear');
           var condBox=$('<div class="act-cond-search">');
           var searchId=$('<select name="search-id" id="search-id" class="search-what" size="1">');
           var searchOp = null;
           var searchValue = null;
           var filterString = null;
           var btnAnd=$('<button class="btn btn-outline-info">').append('und');
           var btnOr=$('<button class="btn btn-outline-info">').append('oder');
           var btnSubmit=$('<button type="submit" class="btn btn-primary">').append($('<span class="fa fa-filter">'));
           condBox.append(searchId);
           var moreDiv=$('<div class="search-line">');
           searchBox.append(moreDiv);
           searchBox.append(condBox);
           searchBox.append(btnAnd);
           searchBox.append(btnOr);
           function moreCodition(what) {
               calcFilter();
               moreDiv.append($('<div>').text("a=42"));
           }
           btnAnd.click( function () {
               moreCodition('and');
           });
           btnOr.click( function () {
               moreCodition('or');
           });
           function hideAndOr() {
               btnAnd.hide();
               btnOr.hide();
           }
           function showAndOr() {
               btnAnd.show();
               btnOr.show();
           }
           hideAndOr();
           searchBox.append(btnSubmit);
           function createSearchOp(key) {
               if (searchOp) {
                   searchOp.empty();
               } else {
                   searchOp=$('<select name="search-op" id="search-op" class="search-op" size="1">');
                   console.log('condBoxAppend searchOp');
                   condBox.append(searchOp);
               };
               searchOp.append($('<option>',{value:'eq'}).text('='));
               searchOp.append($('<option>',{value:'ne'}).html('&ne;'));
               searchOp.fadeIn();
               searchOp.focus();
           }
           function removeSearchOp() {
               if (searchOp) {
                   searchOp.fadeOut();
                   console.log('condBoxRemove searchOp');
                   searchOp.remove();
                   searchOp = null;
               }
           }
           function createFilterString()  {
               if (filterString) {
                   filterString.empty();
               } else {
                   filterString=$('<input type="text" id="filter-string" class="input-medium search-query" autocomplete="off">');
                   console.log('condBoxAppend filterString');
                   condBox.append(filterString);
               }
               filterString.fadeIn();
           }
           function removeFilterString() {
               if (filterString) {
                   filterString.fadeOut();
                   console.log('condBoxRemove filterString');
                   filterString.remove();
                   filterString = null;
               }
           }
           function createSearchValue(key) {
               if (searchValue) {
                   searchValue.empty();
               } else {
                   searchValue=$('<select name="search-value" id="search-value" class="search-value" size="1">');
                   console.log('condBoxAppend searchValue');
                   condBox.append(searchValue);
               }
               var keyLeg=legende[key];
               for (var value in keyLeg.keys) {
                   searchValue.append($('<option>', {value: value}).text(keyLeg.keys[value]));
               }
               searchValue.fadeIn();
           }
           function removeSearchValue() {
               if (searchValue) {
                   searchValue.fadeOut();
                   console.log('condBoxRemove searchValue');
                   searchValue.remove();
                   searchValue = null;
               }
           }

           searchId.empty();
           searchId.append($('<option>', {value: '*'}).text('Alles'));
           var searchGroups={};
           for (var key in legende) {
               var ignore=false,
                   title=legende[key].title;
               if (legende[key].ignore !== undefined) {
                   ignore = legende[key].ignore;
               }
               if (legende[key].hideInSearch !== undefined) {
                   ignore = legende[key].hideInSearch;
               }
               if (!ignore) {
                   if (legende[key].searchGroup !== undefined) {
                       var searchGrp=legende[key].searchGroup;
                       if (searchGroups[searchGrp] === undefined) {
                           searchId.append($('<option>', {value: searchGrp}).text(searchGrp));
                           searchGroups[searchGrp]= [ ];
                       }
                       searchGroups[searchGrp].push(key);
                   } else {
                       searchId.append($('<option>', {value: key}).text(title));
                   }
               }
           }
           searchId.change( function () {
               var key= searchId.val();
               if (key === '*') {  
                   removeSearchOp();
                   removeSearchValue();
                   removeFilterString();
                   hideAndOr();
               } else {
                   showAndOr();
                   var sKey=key;
                   if (searchGroups[key] !== undefined) {
                       sKey=searchGroups[key][0];
                   }
                   if (legende[sKey].keys === undefined) {
                       createSearchOp(sKey);
                       removeSearchValue();
                       createFilterString();
                   } else {
                       createSearchOp(sKey);
                       createSearchValue(sKey);
                       removeFilterString();
                   }
               }
           });

           var searchFunc= function () {
               console.err('SearchFunc not set');
           };
           function setSearchFunc(func)  {
               searchFunc=func;
           }
           var filter={id:'*',cmp:'eq',val:''};
           clear.click(function(evt){
               evt.preventDefault();
               searchId.val('*');
               removeSearchOp();
               removeSearchValue();
               removeFilterString();

               filter={id:'*',cmp:'eq',val:''};
               searchFunc();
           });

           function calcFilter() {
               var key=searchId.val();
               if (key === '*') {
                   lowerFilterString = '';
                   filterKey='';
                   filterOp='eq';
                   clear.fadeOut();
               } else {
                   filterOp=searchOp.val();
                   if (searchGroups[key] !== undefined) {
                       filterKey=searchGroups[key];
                       var val=searchValue.val();
                       lowerFilterVal= val.toLowerCase().strip();
                   }  else if (legende[key].keys === undefined) {
                       filterKey=key;
                       lowerFilterVal= filterString.value().toLowerCase().strip();
                   } else {
                       filterKey=key;
                       filterOp=searchOp.val();
                       lowerFilterVal= searchValue.val();
                   }
                   clear.fadeIn();
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
               filter={id:filterKey,cmp:filterOp,val:lowerFilterVal};
           }
           btnSubmit.click(function (e) {
               e.preventDefault();
               calcFilter();
               searchFunc();
               return true;
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
