function open_menu(){
    document.getElementById("main_menu").className = "main_menu show_main_menu";
    document.getElementById("menu_closer").className = "menu_closer";
}

function close_menu(){
    document.getElementById("main_menu").className = "main_menu hide_main_menu";
    document.getElementById("menu_closer").className = "menu_closer_nodisp";
}

function frame(url){
    window.parent.document.getElementById('main_frame').contentWindow.location.replace(url);
    close_menu()
}