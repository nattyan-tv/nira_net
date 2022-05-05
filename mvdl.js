const parent = window.parent;

function start() {
    document.getElementById("start").disabled = true;
    document.getElementById("start").value = "WAIT...";
    url = document.getElementById("url").value;
    $.ajax({
        type: 'POST',
        url: '/cgi/music.py',
        async: true,
        dataType: 'json',
        timeout: 10000,
        data: {
            url: url
        },
    })
    .done(function(data) {
        if (data.CODE == 200) {
            window.open(data.URL, '_blank');
        }
        else
        {
            alert(data.CODE + " - " + data.TITLE + "\n" + data.DESCRIPTION);
        }
        console.log(data);
    })
    .fail(function(XMLHttpRequest, status, e) {
        alert("エラーが発生しました。\n" + e);
        console.log(e);
    })
    .always(function() {
        document.getElementById("start").disabled = false;
        document.getElementById("start").value = "START";
    });
}