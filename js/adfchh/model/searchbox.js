define('adfchh/model/searchbox', [
    'adfchh/model/unfalldaten-legende',
    'jquery',
    'bootstrap-multiselect'
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
           var filter={id:'*',cmp:'eq',val:''};
           var moreFilter=[];
           const cmpLabel= {
               'eq': '=',
               'ne': '≠'
           };
           const compositLabel = {
               'and': ' und ',
               'or': ' oder '
           };
           function getSearchCondition() {
               var rtnFilter=moreFilter.slice(0);
               rtnFilter.push(filter);
               console.log('rtnFilter', rtnFilter);
               console.log('mFilter', moreFilter);
               return rtnFilter;
           };
           

           function removeMore() {
               moreDiv.html('');
           };
           searchBox.append(moreDiv);
           searchBox.append(condBox);
           searchBox.append(btnAnd);
           searchBox.append(btnOr);
           function moreCodition(what) {
               calcFilter();
               filter.comp=what;
               moreFilter.push(filter);
               var tooltip=legende[filter.id].title+ cmpLabel[filter.cmp];
               if (legende[filter.id].keys) {
                   if (!Array.isArray(filter.val)) {
                       tooltip=tooltip+legende[filter.id].keys[filter.val];
                   } else {
                       var comma='';
                       for (var i = 0; i < filter.val.length; i++) {
                           tooltip=tooltip+comma+legende[filter.id].keys[filter.val[i]];
                           comma=',';
                       }
                           
                   }
               } else {
                   tooltip=tooltip+filter.val;
               }
               moreDiv.append($('<div>',{title:tooltip}).text('('+filter.id+' '+cmpLabel[filter.cmp]+' '+filter.val+')'));
               moreDiv.append($('<div>').text(compositLabel[what]));
               // rest filter:
               filter={id:'*',cmp:'eq',val:''};               
               searchId.val('*');
               removeSearchOp();
               removeSearchValue();
               removeFilterString();
               btnAnd.fadeOut();
               btnOr.fadeOut();
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
                   searchValue.multiselect('destroy');
                   searchValue.empty();
               } else {
                   searchValue=$('<select name="search-value" id="search-value" class="search-value" size="1" multiple="multiple">');
                   console.log('condBoxAppend searchValue');
                   condBox.append(searchValue);
               }
               var keyLeg=legende[key];
               for (var value in keyLeg.keys) {
                   searchValue.append($('<option>', {value: value}).text(keyLeg.keys[value]));
               }
               searchValue.multiselect({
                   buttonWidth: '120px',
                   nonSelectedText: 'Bitte wählen',
                   allSelectedText: 'Alle',
                   nSelectedText: ' - gewählt',
                   maxHeight: 400,
                   numberDisplayed: 1
               });

           }
           function removeSearchValue() {
               if (searchValue) {
                   searchValue.fadeOut();
                   searchValue.multiselect('destroy');
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

           clear.click(function(evt){
               evt.preventDefault();
               searchId.val('*');
               removeSearchOp();
               removeSearchValue();
               removeFilterString();
               removeMore();
               moreFilter=[];
               filter={id:'*',cmp:'eq',val:''};
               searchFunc(getSearchCondition());
           });

           function calcFilter() {
               var lowerFilterVal,filterKey,filterOp;
               var key=searchId.val();
               if (key === '*') {
                   lowerFilterVal = '';
                   filterKey='*';
                   filterOp='eq';
                   if (moreFilter.length===0) {
                       clear.fadeOut();
                   }
                   btnAnd.fadeOut();
                   btnOr.fadeOut();
               } else {
                   btnAnd.fadeIn();
                   btnOr.fadeIn();
                   filterOp=searchOp.val();
                   if (searchGroups[key] !== undefined) {
                       filterKey=searchGroups[key];
                       var val=searchValue.val();
                       lowerFilterVal= val.toLowerCase().strip();
                   }  else if (legende[key].keys === undefined) {
                       filterKey=key;
                       lowerFilterVal= filterString.val().toLowerCase().strip();
                   } else {
                       filterKey=key;
                       filterOp=searchOp.val();
                       lowerFilterVal= searchValue.val();
                   }
                   clear.fadeIn();
               
                   var converter;
                   if (typeof filterKey === 'string') {
                       if (legende[filterKey].converter === undefined) {
                           converter='int';
                       } else {
                           converter=legende[filterKey].converter;
                       };
                   } else {
                       if (legende[filterKey[0]].converter === undefined) {
                           converter='int';
                       } else {
                           converter=legende[filterKey[0]].converter;
                       };
                   }
                   if ((converter === 'int') || (converter === 'geschlecht') || (converter === 'richtung')) {
                       if (typeof lowerFilterVal === 'string') {
                           lowerFilterVal=parseInt(lowerFilterVal);
                       } else {
                           if (lowerFilterVal.length===1) {
                               lowerFilterVal=parseInt(lowerFilterVal[0]);
                           } else {
                               for (var i = 0; i < lowerFilterVal.length; i++) {
                                   lowerFilterVal[i]=parseInt(lowerFilterVal[i]);
                               };
                           }
                       }
                   } else if (converter === 'date') {
                       //FIXME
                       console.err('Date converter not implemented');
                   } else if (converter != 'string') {
                       console.err('Converter not found');
                   }
               }
               filter={id:filterKey,cmp:filterOp,val:lowerFilterVal};
           }
           btnSubmit.click(function (e) {
               e.preventDefault();
               calcFilter();
               searchFunc(getSearchCondition());
               return true;
           });
           return {
               'searchGroups': searchGroups,
               'setSearchFunc': setSearchFunc,
               'getSearchCondition': getSearchCondition
           };
       });
