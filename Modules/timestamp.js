exports.getTimestamp = function (day = 0) {
    let d = AddDayHelper(day);

    return [d.getFullYear(),(d.getMonth()+1).padLeft(),d.getDate().padLeft()].join('-') +' ' +
            [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');
}

Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

function AddDayHelper(day = 0){
    if(day){
        var today = new Date();
        var futureDay = new Date();
        futureDay.setDate(today.getDate()+day);
        return futureDay
    }

    return new Date();
}
