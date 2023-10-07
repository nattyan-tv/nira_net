const Methods = {
    Revoke: "revoke",
    GetUser: "getuser",
    GetGuilds: "getguilds",
    GetChannels: "getchannels",
    GetVoiceChannels: "getvcs",
    GetMember: "getmember",
    GetOwner: "getowner",
    CanManage: "canmanage",
    SetVCLimit: "setvclimit",
}

const callApi = async (method, body) => {
    body.access_token = localStorage.getItem("access_token")
    const response = await fetch(API_URL + method, {
        method: "POST",
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
    return response.json()
}

/**
 * @param {string} guild_id 設定を行うサーバーのID
 * @param {string} guild_name 設定を行うサーバーの名前
 */
const guildconfig = async (guild_id, guild_name) => {
    const display = document.getElementById("displayable");
    const cotainer = document.createElement("div");
    cotainer.classList.add("guildconfig-container");

    const utilbar = document.createElement("div");
    utilbar.classList.add("util-bar");

    const back = document.createElement("div");
    back.classList.add("back-button");
    back.innerHTML = "&lt; Back";
    back.onclick = initPage;

    const guildname = document.createElement("div");
    guildname.classList.add("guild-name-ub");
    guildname.innerHTML = guild_name;

    utilbar.appendChild(back);
    utilbar.appendChild(guildname);

    const cfbts = document.createElement("div");
    cfbts.classList.add("config-buttons");

    const vclimit_channel = document.createElement("div");
    vclimit_channel.classList.add("config-button");
    vclimit_channel.innerHTML = "VCLimitのチャンネル毎設定 (Beta)";
    vclimit_channel.onclick = () => {
        vclimit(guild_id, guild_name);
    }

    cfbts.appendChild(vclimit_channel);

    display.innerHTML = "";
    cotainer.appendChild(utilbar);
    cotainer.appendChild(cfbts);
    display.appendChild(cotainer);
}

const vclimit = async (guild_id, guild_name) => {
    const display = document.getElementById("displayable");
    display.innerHTML = "サーバーの情報を読み取り中...";
    const user_id = JSON.parse(sessionStorage.getItem("user")).id;
    const { owner_id } = await callApi(Methods.GetOwner, { guild_id: guild_id });
    if (user_id != owner_id) {
        display.innerHTML = "ユーザーの情報を取得中...";
        const member = await callApi(Methods.GetMember, { guild_id: guild_id, user_id: user_id });
        const canmanage = await callApi(Methods.CanManage, { guild_id: guild_id, role_ids: member.roles });
        if (!canmanage.can_manage) {
            alert("このサーバーの設定を変更する権限がありません。");
            initPage();
            return;
        }
    }

    display.innerHTML = "チャンネルの情報を取得中...";
    const { channels, configs } = await callApi(Methods.GetVoiceChannels, { guild_id: guild_id });
    // main
    const cotainer = document.createElement("div");
    cotainer.classList.add("guildconfig-container");

    const utilbar = document.createElement("div");
    utilbar.classList.add("util-bar");

    const back = document.createElement("div");
    back.classList.add("back-button");
    back.innerHTML = "&lt; Back";
    back.onclick = () => {
        guildconfig(guild_id, guild_name);
    }

    const guildname = document.createElement("div");
    guildname.classList.add("guild-name-ub");
    guildname.innerHTML = `${guild_name}<br>VC Limitのチャンネル毎設定`;

    utilbar.appendChild(back);
    utilbar.appendChild(guildname);

    const cfbts = document.createElement("div");
    cfbts.classList.add("config-buttons");

    for (const vc of channels) {
        const vclimit_channel = document.createElement("div");
        vclimit_channel.classList.add("vc-button");
        vclimit_channel.classList.add(configs[vc.id] ? "vcenable" : "vcdisable");
        vclimit_channel.innerHTML = vc.name;
        vclimit_channel.onclick = async () => {
            if (vclimit_channel.classList.contains("vcdisable")) {
                // Enable
                // レスポンスの`message`が`OK`なら成功
                callApi(Methods.SetVCLimit, { guild_id: guild_id, channel_id: vc.id, enable: true })
                .then((res) => {
                    if (res.message == "OK") {
                        vclimit_channel.classList.remove("vcdisable");
                        vclimit_channel.classList.add("vcenable");
                    } else {
                        alert("エラーが発生しました。");
                    }
                })
            } else {
                // Disable
                callApi(Methods.SetVCLimit, { guild_id: guild_id, channel_id: vc.id, enable: false })
                .then((res) => {
                    if (res.message == "OK") {
                        vclimit_channel.classList.remove("vcenable");
                        vclimit_channel.classList.add("vcdisable");
                    } else {
                        alert("エラーが発生しました。");
                    }
                })
            }
        }
        cfbts.appendChild(vclimit_channel);
    }

    display.innerHTML = "";
    cotainer.appendChild(utilbar);
    cotainer.appendChild(cfbts);
    display.appendChild(cotainer);
}

const initPage = async () => {
    const display = document.getElementById("displayable");
    display.innerHTML = "サーバーの一覧を読み込み中...<br>※この画面がずっと表示される場合は、エラーが発生している場合があります。";
    const user = await callApi(Methods.GetUser, {})
    const guilds = await callApi(Methods.GetGuilds, {})
    document.getElementById("h-username").innerHTML = `@${user.username}`;
    sessionStorage.setItem("user", JSON.stringify(user));
    display.innerHTML = "";
    const container = document.createElement("div");
    container.classList.add("guild-container");
    for (let i = 0; i < guilds.length; i++) {
        const guild = guilds[i];
        const div = document.createElement("div");
        if (guild.icon !== null) {
            const img = document.createElement("img");
            img.src = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
            img.classList.add("guild-icon");
            div.appendChild(img);
        } else {
            const fimg = document.createElement("div");
            fimg.classList.add("guild-icon-fake");
            const fspan = document.createElement("span");
            fspan.classList.add("guild-icon-fake-span");
            fspan.innerHTML = guild.name[0];
            fimg.appendChild(fspan);
            div.appendChild(fimg);
        }
        const span = document.createElement("span");
        span.innerHTML = guild.name;
        span.classList.add("guild-name");
        div.appendChild(span);
        div.classList.add("guildinfo");
        div.onclick = () => {
            guildconfig(guild.id, guild.name);
        }
        container.appendChild(div);
    }
    display.appendChild(container);
}

const logout = async () => {
    try {
        await callApi(Methods.Revoke, {token: localStorage.getItem("access_token")});
    } catch(e) {
        // Revoke出来ないなら有効期限切れを待つべき
        console.log(e);
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_in");
    sessionStorage.removeItem("user");
    location.href = "../";
}

window.onload = initPage;
