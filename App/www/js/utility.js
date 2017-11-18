window.serverRootLocal = false;

function formatItemDate(dpick, tpick) {
	var date = '';
	var months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
	var hours = tpick.getHours() > 9 ? tpick.getHours() : '0' + tpick.getHours();
	var minutes = tpick.getMinutes() > 9 ? tpick.getMinutes() : '0' + tpick.getMinutes();
	var date = dpick.getDate() > 9 ? dpick.getDate() : '0' + dpick.getDate();
	
	return date + ' ' + months[dpick.getMonth() + 1] + ' ' + hours + ':' + minutes;
};

Date.prototype.addDays = function(days) {
    var dat = new Date(this.valueOf());
    dat.setDate(dat.getDate() + days);
    return dat;
}

function formatItemTime(tpick) {
	var hours = tpick.getHours() > 9 ? tpick.getHours() : '0' + tpick.getHours();
	var minutes = tpick.getMinutes() > 9 ? tpick.getMinutes() : '0' + tpick.getMinutes();
	
	return hours + ':' + minutes;
};

function formatDateMonthExt(date) {
	var months = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
	var day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();

	return day + ' ' + months[date.getMonth()];
};

function roundMinutes(min) {
	var minutes = '00';
	if(min == 0 )
		minutes = '00';
	else if(min > 0 && min <= 15) 
		minutes = '15';
	else if(min > 15 && min <= 30) 
		minutes = '30';
	else if(min > 30 && min <= 45) 
		minutes = '45';
	else if(min > 45) 
		minutes = '-1';
	return minutes;
}

function formatHours(date) {
	var hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
	var min = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
	
	if(roundMinutes(min) == '-1') {
		hours = hours + 1;
		min = '00';
	} 
	else 
		min = roundMinutes(min);
	
	return hours + ':' + min;
};