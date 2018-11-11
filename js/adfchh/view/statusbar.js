define('adfchh/view/statusbar', [
    'jquery',
], function ($) {

    var ele=$('<div class="adfc-status-bar">');
    var progress=$('<div class="progress-bar adfc-status-progress-bar" style="width:2%">');
    var textEle=$('<div class="adfc-status-txt">');
    ele.append(textEle);
    ele.append($('<div class="progress">').append(progress));
    var append=false;
    var progessStatus=false;
    var startTime;
    var step=100;
    var statusbar={

        show: function() {
            if (append) {
                ele.show();
            } else {
                $('body').prepend(ele);
                append=true;
            }
        },
        setText: function(txt) {
            textEle.text(txt);
            textEle.removeClass('alert alert-warning');
        },
        stopProgress: function () {
            progressStatus=false;
            var endTime = new Date().getTime();
            step=(endTime-startTime)/100;
            console.log('new step=',step);
        },
        startProgress: function () {
            startTime= new Date().getTime();
            var p=1;
            statusbar.showProgress();
            var doF;
            progressStatus=true;
            doF=function () {
                setTimeout( function () {
                    if (progressStatus) {
                        p++;
                        if (p>90) {
                            step=step*2;
                        }
                        if (p<=98) {
                            statusbar.setProgress(p);
                            doF();
                        }
                    }
                }, step);
            };
            doF();
        },
        showProgress: function () {
            progress.show();
        },
        setProgress: function (width) {

            progress.width(width + '%');
            progress.text(width + '%');
        },
        hide: function () {
            ele.hide();
        },
        zuVieleDaten: function () {
            textEle.text('Zu viele Daten, bitte zoomen Sie rein um alle Unfälle zu sehen.');
            textEle.addClass('alert alert-warning');
        },
        hideProgress: function () {
            progress.hide();
        }
    };
    return statusbar;
});
