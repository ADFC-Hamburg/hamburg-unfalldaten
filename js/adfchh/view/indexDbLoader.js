define('adfchh/view/indexDbLoader', [
    'jquery',
], function ($) {

    var ele=$('<div class="indexDbProgress">');
    var progress=$('<div class="progress-bar" style="width:2%">');
    var textEle=$('<div class="indexDbText">');
    ele.append(textEle);
    ele.append($('<div class="progress">').append(progress));
    var hintEle=$('<div class="indexDBHint">');
    ele.append(hintEle);
    var append=false;
    var startTime;
    var indexLoader={

        show: function() {
            startTime = new Date().getTime();
            if (append) {
                ele.show();
            } else {
                $('body').prepend(ele);
            }
        },
        setText: function(txt) {
            console.log('Progress:'+txt);
            textEle.text(txt);

        },
        setYearProgress: function (jahr, jahrP, startJahr, endJahr) {
            var p=100-((1+endJahr-jahr-(jahrP/100))*100/(1+endJahr-startJahr));
            if (p<2) {
                p=2;
            }
            var now= new Date().getTime();
            var zeitVergangen= now-startTime;
            var zeitProProzent=zeitVergangen/p;
            var nochZeit=zeitProProzent*(100-p);
            var endZeit=new Date(now+nochZeit);
            txt='Noch ca. '+Math.round(nochZeit/1000)+' Sekunden';
            if (p>30) {
                txt=txt+' Ende ca. '+endZeit.toTimeString().substr(0,8)+' Uhr';
            }
            progress.width(p + '%');
            progress.text(txt);
            
        },
        setProgress: function (width) {
            progress.width(width + '%'); 
        },
        setHint: function (txt) {
            hintEle.text(txt);
        },
        hide: function () {
            ele.hide();
        }
    };
    return indexLoader;
});
