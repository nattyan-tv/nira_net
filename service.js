const parent = window.parent;

function getStatus() {
    $.ajax({
        type: 'POST',
        url: '/cgi/status.py',
        async: true,
        dataType: 'json',
        timeout: 10000,
    })
    .done(function(data) {
        niraBot.innerHTML = data.niraBot;
        niraNet.innerHTML = data.niraNet;
        console.log(data);
    })
    .fail(function(XMLHttpRequest, status, e) {
        alert("エラーが発生しました。\n" + e);
        console.log(e);
    })
}