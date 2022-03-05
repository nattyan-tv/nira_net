    // スクロール禁止
    function no_scroll() {
        // PCでのスクロール禁止
        document.addEventListener("mousewheel", scroll_control, { passive: false });
        // スマホでのタッチ操作でのスクロール禁止
        document.addEventListener("touchmove", scroll_control, { passive: false });
    }
    // スクロール禁止解除
    function return_scroll() {
        // PCでのスクロール禁止解除
        document.removeEventListener("mousewheel", scroll_control, { passive: false });
        // スマホでのタッチ操作でのスクロール禁止解除
        document.removeEventListener('touchmove', scroll_control, { passive: false });
    }
    
    // スクロール関連メソッド
    function scroll_control(event) {
        event.preventDefault();
    }
    
    no_scroll()
    document.addEventListener("dblclick", function(e){ e.preventDefault();}, { passive: false });
