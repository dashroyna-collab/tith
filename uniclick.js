function parseBool(value, defaultValue) {
    return (value == 'true' || value == 'false' || value === true || value === false) && JSON.parse(value) || defaultValue;
}

var campaignIds = {
    'default': "68a3b27950289ee4f8f1197d",
}
var cookieDomain = "www.createsexfriend.com"
var cookieDuration = parseInt("90") || 30
var registerViewOncePerSession = parseBool("false", false)
var lastPaidClickAttribution = false
var firstClickAttribution = false
var firstPaidClickAttribution = false
var attribution = "lastpaid"
var referrer = document.referrer;
if (attribution === 'lastpaid') {
    lastPaidClickAttribution = true
} else if (attribution === 'firstclick') {
    lastPaidClickAttribution = false
    firstClickAttribution = true
} else if (attribution === 'lastclick') {
    lastPaidClickAttribution = false
    firstClickAttribution = false
} else if (attribution === 'firstpaid') {
    firstPaidClickAttribution = true
}

var ourCookie = getCookie('rtkclickid-store')
var rtkClickID;

function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param, params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
};
var urlParams = new URLSearchParams(window.location.search);
var locSearch = window.location.search
locSearch = locSearch.substring(1)
var rtkfbp = getCookie('_fbp');
var rtkfbc = getCookie('_fbc');
var pixelParams = "&" + locSearch + "&sub19=" + rtkfbp + "&sub20=" + rtkfbc
var campaignID = urlParams.get('cmpid')
var souceKey = urlParams.get('tsource');
if (!campaignID) {
    campaignID = campaignIds['default']
}

if (lastPaidClickAttribution) {
    if (campaignID != campaignIds['default']) {
        firstClickAttribution = false
    }
    if (campaignID == campaignIds['default']) {
        firstClickAttribution = true
    }
}
if (firstPaidClickAttribution && campaignID != campaignIds['default']) {
    firstClickAttribution = true
}
var initialSrc = "https://rtrk.swipeyai.com/" + campaignID + "?format=json" + "&referrer=" + referrer;
for (var i = 1; i <= 10; i++) {
    initialSrc = removeParam("sub" + i, initialSrc)
}
;
var rawData;
initialSrc = removeParam("cost", initialSrc);
initialSrc = removeParam("ref_id", initialSrc);
if (!urlParams.get('rtkcid')) {
    rtkxhr = new XMLHttpRequest;
    rtkxhr.onreadystatechange = function () {
        if (rtkxhr.readyState == 4 && rtkxhr.status == 200) {
            rawData = JSON.parse(rtkxhr.responseText);
            let paidClick = getCookie('rtkcid-paid')
            rtkClickID = paidClick || rawData.clickid;
            setSessionClickID(rtkClickID);
            if (ourCookie === null || ourCookie === undefined || ourCookie === 'undefined' || !firstClickAttribution) {
                setCookie(rtkClickID);
            }
            if (firstPaidClickAttribution && campaignID != campaignIds['default']) {
                setCookiePaidClick(rtkClickID)
                if (!paidClick) {
                    setCookie(rtkClickID);
                }
            }
            xhrr = new XMLHttpRequest;
            if (sessionStorage.getItem('viewOnce') !== 1) {
                xhrr.open("GET", "https://rtrk.swipeyai.com/view?clickid=" + rtkClickID + "&referrer=" + referrer)
                xhrr.send();
            }
            if (registerViewOncePerSession) {
                sessionStorage.setItem('viewOnce', '1')
            }
        }
    }
    if (sessionStorage.getItem('rtkclickid') === 'undefined' || !sessionStorage.getItem('rtkclickid')) {
        rtkxhr.open("GET", initialSrc + pixelParams);
        rtkxhr.send();
    } else {
        let paidClick = getCookie('rtkcid-paid')
        rtkClickID = paidClick || sessionStorage.getItem('rtkclickid')
        if (ourCookie === null || ourCookie === undefined || ourCookie === 'undefined' || !firstClickAttribution) {
            setCookie();
        }
        if (firstPaidClickAttribution && campaignID != campaignIds['default']) {
            setCookiePaidClick(rtkClickID)
            if (!paidClick) {
                setCookie(rtkClickID);
            }
        }
        xhrr = new XMLHttpRequest;
        if (sessionStorage.getItem('viewOnce') !== 1) {
            xhrr.open("GET", "https://rtrk.swipeyai.com/view?clickid=" + rtkClickID + "&referrer=" + referrer)
            xhrr.send();
        }
        if (registerViewOncePerSession) {
            sessionStorage.setItem('viewOnce', '1')
        }
    }
} else {
    let paidClick = getCookie('rtkcid-paid')
    rtkClickID = paidClick || urlParams.get('rtkcid')
    if (ourCookie === null || ourCookie === undefined || ourCookie === 'undefined' || !firstClickAttribution) {
        setCookie();
    }
    if (firstPaidClickAttribution && campaignID != campaignIds['default']) {
        setCookiePaidClick(rtkClickID)
        if (!paidClick) {
            setCookie(rtkClickID);
        }
    }
    xhrTrack = new XMLHttpRequest;
    if (sessionStorage.getItem('viewOnce') !== 1) {
        xhrTrack.open("GET", "https://rtrk.swipeyai.com/view?clickid=" + rtkClickID + "&referrer=" + referrer)
        xhrTrack.send();
    }
    if (registerViewOncePerSession) {
        sessionStorage.setItem('viewOnce', '1')
    }
    setSessionClickID()
}

function setCookie(clickId) {
    var cookieName = "rtkclickid-store", cookieValue = clickId || rtkClickID,
        expirationTime = 86400 * cookieDuration * 1000,
        date = new Date(), dateTimeNow = date.getTime();
    date.setTime(dateTimeNow + expirationTime);
    var date = date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + date + "; path=/; domain=" + cookieDomain
}

function setSessionClickID(clickId) {
    sessionStorage.setItem('rtkclickid', clickId || rtkClickID);
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function setCookiePaidClick(clickId) {
    var cookieName = "rtkcid-paid", cookieValue = clickId, expirationTime = 86400 * cookieDuration * 1000,
        date = new Date(), dateTimeNow = date.getTime();
    date.setTime(dateTimeNow + expirationTime);
    var date = date.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + "; expires=" + date + "; path=/; domain=" + cookieDomain
}
