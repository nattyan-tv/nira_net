const parent = window.parent;
const MINECRAFT = 2;
const STEAM = 1;

if (localStorage.getItem("ss_list") != null)
{
    var ss_list_dic = {};
    var ss_list_storage = localStorage.getItem("ss_list").split("?");
    for(i = 0; i < ss_list_storage.length; i++){
        var server_info = ss_list_storage[i].split("=");
        var ss_list = document.getElementById('ss_list');
        var option = document.createElement('option');
        option.value = server_info[1];
        option.textContent = server_info[0];
        ss_list.appendChild(option)
    }
    var ss_list = document.getElementById('ss_list');
    var option = document.createElement('option');
    option.textContent = "---Tool---";
    option.disabled = true;
    ss_list.appendChild(option)
}
$('#add_ss_server_div').hide();
$('#del_ss_server_div').hide();
var ss_list = document.getElementById('ss_list');
var option = document.createElement('option');
option.value = "add_server";
option.textContent = "追加...";
ss_list.appendChild(option)


if (localStorage.getItem("mc_list") != null)
{
    var mc_list_dic = {};
    var mc_list_storage = localStorage.getItem("mc_list").split("?");
    for(i = 0; i < mc_list_storage.length; i++){
        var server_info = mc_list_storage[i].split("=");
        var mc_list = document.getElementById('mc_list');
        var option = document.createElement('option');
        option.value = server_info[2] + "=" + server_info[1];
        option.textContent = server_info[0];
        mc_list.appendChild(option)
    }
    var mc_list = document.getElementById('mc_list');
    var option = document.createElement('option');
    option.textContent = "---Tool---";
    option.disabled = true;
    mc_list.appendChild(option)
}
$('#add_mc_server_div').hide();
$('#del_mc_server_div').hide();
var mc_list = document.getElementById('mc_list');
var option = document.createElement('option');
option.value = "add_server";
option.textContent = "追加...";
mc_list.appendChild(option)


ss_selected = null
mc_selected = null

function change_ss_list(){
    var bt = document.getElementById('check_ss_button');
    bt.disabled = false;
    if(document.getElementById('ss_list').value == "add_server"){
        check_ss_button.disabled = true;
        if (ss_selected == null){
            $('#add_ss_server_div').hide('normal');
            $('#add_ss_server_div').show('normal');
            ss_selected = 0
        }
        else{
            $('#del_ss_server_div').show('normal');
            $('#del_ss_server_div').hide('normal');
            $('#add_ss_server_div').hide('normal');
            $('#add_ss_server_div').show('normal');
            ss_selected = 0
        }
    }
    else{
        check_ss_button.disabled = false;
        if (ss_selected == 0){
            $('#add_ss_server_div').show('normal');
            $('#add_ss_server_div').hide('normal');
            $('#del_ss_server_div').hide('normal');
            $('#del_ss_server_div').show('normal');
            ss_selected = 1
        }
        else if(ss_selected == null){
            $('#del_ss_server_div').hide('normal');
            $('#del_ss_server_div').show('normal');
            ss_selected = 1
        }
    }
}

function change_mc_list(){
    var bt = document.getElementById('check_mc_button');
    bt.disabled = false;
    if(document.getElementById('mc_list').value == "add_server"){
        check_mc_button.disabled = true;
        if (mc_selected == null){
            $('#add_mc_server_div').hide('normal');
            $('#add_mc_server_div').show('normal');
            mc_selected = 0
        }
        else{
            $('#del_mc_server_div').show('normal');
            $('#del_mc_server_div').hide('normal');
            $('#add_mc_server_div').hide('normal');
            $('#add_mc_server_div').show('normal');
            mc_selected = 0
        }
    }
    else{
        check_mc_button.disabled = false;
        if (mc_selected == 0){
            $('#add_mc_server_div').show('normal');
            $('#add_mc_server_div').hide('normal');
            $('#del_mc_server_div').hide('normal');
            $('#del_mc_server_div').show('normal');
            mc_selected = 1
        }
        else if(mc_selected == null){
            $('#del_mc_server_div').hide('normal');
            $('#del_mc_server_div').show('normal');
            mc_selected = 1
        }
    }
}

function show_add_server(server){
    if(server == 1){
        server = "Steam"
    }
    else if(server == 2){
        server = "Minecraft"
    }
    alert("すでに" + server + "サーバーが登録されているDiscordのサーバーに所属している場合、Discordでログインするだけでサーバーを自動的に追加できます。");
}

function add_ss_server(type){
    if(type == 1){
        if(localStorage.getItem("ss_list") == null){
            var name = document.getElementById('ss_server_name').value;
            var address = document.getElementById('ss_server_address').value;
            var port = document.getElementById('ss_server_port').value;
            localStorage.setItem("ss_list",name+"="+address+":"+port)
            alert("保存しました。")
            location.reload(false)
        }
        else
        {
            var current = localStorage.getItem("ss_list")
            var name = document.getElementById('ss_server_name').value;
            var address = document.getElementById('ss_server_address').value;
            var port = document.getElementById('ss_server_port').value;
            localStorage.setItem("ss_list",current+"?"+name+"="+address+":"+port)
            alert("保存しました。")
            location.reload(false)
        }
    }
    else if(type == 2)
    {
        window.open("https://discord.com/api/oauth2/authorize?client_id=944822456470863922&redirect_uri=https%3A%2F%2Fnira.f5.si%2Fcgi%2Fdiscord_auth%2Fss_server.py&response_type=code&scope=identify%20guilds")
    }
}


function a2s(){
    var bt = document.getElementById('check_ss_button');
    bt.disabled = true;
    bt.textContent = "処理中です...";
    document.getElementById('ss_list').disabled = true;
    document.getElementById('del_all_ss_all').disabled = true;
    document.getElementById('del_ss_button').disabled = true;
    var ss_list = localStorage.getItem("ss_list").split("?");
    var index = Number(document.getElementById("ss_list").selectedIndex)-1
    var address = ss_list[index].split(":")[0].split("=")[1]
    var port = ss_list[index].split(":")[1]
    $.ajax({
        type: 'POST',
        url: '/cgi/nira_web.py',
        async: true,
        dataType: 'html',
        timeout: 10000,
        data: {
            address: address,
            port: port,
            type: STEAM
        },
    })
    .done(function(data) {
        alert(data)
    })
    .fail(function(XMLHttpRequest, status, e) {
        alert("エラーが発生しました。\n" + e)
    })
    .always(function() {
        var bt = document.getElementById('check_ss_button');
        bt.disabled = false;
        bt.textContent = "ステータスチェック";
        document.getElementById('ss_list').disabled = false;
        document.getElementById('del_all_ss_all').disabled = false;
        document.getElementById('del_ss_button').disabled = false;
    });
}

function del_server(){
    var result = parent.window.confirm("サーバーを削除してもよろしいですか？")
    if (result){
        var ss_list = localStorage.getItem("ss_list").split("?");
        var index = Number(document.getElementById("ss_list").selectedIndex)-1
        if (ss_list.length == 1)
        {
            localStorage.removeItem("ss_list");
        }
        else if(index != 0)
        {
            var ss = localStorage.getItem("ss_list").replace("?" + ss_list[index], "")
            console.log(ss)
            localStorage.setItem("ss_list", ss);
        }
        else
        {
            var ss = localStorage.getItem("ss_list").replace(ss_list[index] + "?", "")
            console.log(ss)
            localStorage.setItem("ss_list", ss);
        }
        alert("削除しました。")
        location.reload(false);
    }
}

function delete_ss_all(){
    var result = parent.window.confirm("SteamDedicatedサーバーをすべて削除してもよろしいですか？")
    if (result){
        localStorage.removeItem("ss_list");
        alert("削除しました。")
        location.reload(false);
    }
}

function delete_mc_all(){
    var result = parent.window.confirm("Minecraftサーバーをすべて削除してもよろしいですか？")
    if (result){
        localStorage.removeItem("mc_list");
        alert("削除しました。")
        location.reload(false);
    }
}


function add_mc_server(type){
    if(type == 1){
        if(localStorage.getItem("mc_list") == null){
            var name = document.getElementById('mc_server_name').value;
            var address = document.getElementById('mc_server_address').value;
            var port = document.getElementById('mc_server_port').value;
            var server_type = document.getElementById('mc_type').value;
            localStorage.setItem("mc_list",name + "=" + server_type + "=" + address + ":" + port)
            alert("保存しました。")
            location.reload(false)
        }
        else
        {
            var current = localStorage.getItem("mc_list")
            var name = document.getElementById('mc_server_name').value;
            var address = document.getElementById('mc_server_address').value;
            var port = document.getElementById('mc_server_port').value;
            localStorage.setItem("mc_list", current + "?" + name + "=" + server_type + "=" + address + ":" + port)
            alert("保存しました。")
            location.reload(false)
        }
    }
    else if(type == 2)
    {
        location.href = "https://discord.com/api/oauth2/authorize?client_id=944822456470863922&redirect_uri=https%3A%2F%2Fnira.f5.si%2Fcgi%2Fdiscord_auth%2Fmc_server.py&response_type=code&scope=identify%20guilds"
    }
}


function mc_check(){
    var bt = document.getElementById('check_mc_button');
    bt.disabled = true;
    bt.textContent = "処理中です...";
    document.getElementById('mc_list').disabled = true;
    document.getElementById('del_all_mc_all').disabled = true;
    document.getElementById('del_mc_button').disabled = true;
    var mc_list = localStorage.getItem("mc_list").split("?");
    var index = Number(document.getElementById("mc_list").selectedIndex)-1
    var address = mc_list[index].split("=")[2].split(":")[0]
    var port = mc_list[index].split("=")[2].split(":")[1]
    var server_type = mc_list[index].split("=")[1]
    $.ajax({
        type: 'POST',
        url: '/cgi/nira_web.py',
        async: true,
        dataType: 'json',
        timeout: 10000,
        data: {
            address: address,
            port: port,
            server_type: server_type,
            type: MINECRAFT
        },
    })
    .done(function(data) {
        if (data["CODE"] != 200) {
            alert("エラーが発生しました。\n" + data["CODE"] + " " + data["TITLE"] + "\n" + data["DESCRIPTION"])
        }
        else{
            alert("サーバー名:" + data["SERVER_NAME"] + "\nマップ名:" + data["SERVER_MAP"] + "\nプレイヤー数:" + data["SERVER_PLAYER"] + "\n\n" + data["SERVER_PLAYERS"])
        }
    })
    .fail(function(XMLHttpRequest, status, e) {
        alert("エラーが発生しました。\n" + e)
    })
    .always(function() {
        var bt = document.getElementById('check_ss_button');
        bt.disabled = false;
        bt.textContent = "ステータスチェック";
        document.getElementById('ss_list').disabled = false;
        document.getElementById('del_all_ss_all').disabled = false;
        document.getElementById('del_ss_button').disabled = false;
    });
}