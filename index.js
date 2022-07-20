addEventListener("fetch", (event) => {
    event.respondWith(
        handleRequest(event).catch((err) => {
            return new Response(err.stack, { status: 500 })
        })
    )
})
async function handleRequest(event) {
    const init = {
        headers: {
            'content-type': 'text/html;charset=UTF-8',
        },
    }
    let url = new URL(event.request.url);
    let id = url.pathname.substring(1);
    if (!id) {
        let index = "这是一个</br>基于CloudFlare Workers的</br>剪贴板托管服务。";
        return new Response(render("<div class=\"mdui-panel mdui-color-blue-100 mdui-shadow-4\" mdui-panel>\r\n            <p class=\"mdui-typo-display-1 mdui-text-color-black-secondary\">"+index+"            </p>\r\n        </div>\r\n        "), init);
    }
    switch (id) {
        case "create-api":
            const json = await readRequestBody(event.request);
            if (json == 0) {
                return new Response(render("<div class=\"mdui-panel mdui-color-blue-100 mdui-shadow-4\" mdui-panel>\r\n            <p class=\"mdui-typo-display-1 mdui-text-color-black-secondary\">"+"你想干什么？"+"            </p>\r\n        </div>\r\n        "), init);
            }
            let r = JSON.parse(json);
            if (!r.text) {
                return new Response(render("<div class=\"mdui-panel mdui-color-blue-100 mdui-shadow-4\" mdui-panel>\r\n            <p class=\"mdui-typo-display-1 mdui-text-color-black-secondary\">"+"你想干什么？"+"            </p>\r\n        </div>\r\n        "), init);
            } else {
                let uid = randomString(6);
                let d = await data.get(uid);
                while (d) {
                    uid = randomString(6);
                    d = await data.get(uid);
                }
                await data.put(uid, r.text);
                return new Response("{\"id\": \"" + uid + "\"}");
            }
            break;
        case "submit":
            return new Response(render("<div class=\"mdui-textfield\"><textarea rows=\"25\" class=\"mdui-textfield-input\">initial value</textarea></div><button class=\"mdui-btn mdui-color-theme-accent mdui-ripple\">提交</button>  <div class=\"mdui-container\"><div class=\"mdui-textfield\"><input class=\"mdui-textfield-input\" type=\"text\" placeholder=\"Link\" readonly=\"readonly\" value=\"URL here.\"/></div></div>"),init);
        default:
            let t = await data.get(id);
            if (!t) {
                return new Response(render("<div class=\"mdui-panel mdui-color-blue-100 mdui-shadow-4\" mdui-panel>\r\n            <p class=\"mdui-typo-display-1 mdui-text-color-black-secondary\">"+id + ' is empty'+"            </p>\r\n        </div>\r\n        "), init);
            } else {
                return new Response(render("<div class=\"mdui-panel mdui-color-blue-100 mdui-shadow-4\" mdui-panel>\r\n            <p class=\"mdui-typo-display-1 mdui-text-color-black-secondary\">"+t+"            </p>\r\n        </div>\r\n        "), init);
            }
            break;
    }
}

function render(text) {
    let front = "<!doctype html>\r\n<html lang=\"zh-cmn-Hans\">\r\n\r\n<head>\r\n    <meta charset=\"utf-8\">\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no\" />\r\n    <meta name=\"renderer\" content=\"webkit\" />\r\n    <meta name=\"force-rendering\" content=\"webkit\" />\r\n    <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" />\r\n    <style>\r\n        .bg {\r\n            width: 100vw;\r\n            height: 100vh;\r\n            position: relative;\r\n            text-align: center;\r\n            color: white;\r\n        }\r\n\r\n        .bg::before {\r\n            content: \'\';\r\n            position: absolute;\r\n            top: 0;\r\n            left: 0;\r\n            width: 100vw;\r\n            height: 100vh;\r\n            background: transparent url(https://best-extension.extfans.com/theme/wallpapers/ilehmpboddbmikmafijoakkjpcgfii/2c217e75764664afc59bbb61d2bc81.webp?imageView2/1/interlace/1/format/png) center center no-repeat;\r\n            filter: blur(5px);\r\n            z-index: -1;\r\n            background-size: cover;\r\n        }\r\n    </style>\r\n    <link rel=\"stylesheet\" href=\"https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/mdui/1.0.2/css/mdui.min.css\" />\r\n    <script src=\"https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/mdui/1.0.2/js/mdui.min.js\"\r\n        type=\"213c7f3762e2e14f20c388b2-text/javascript\"></script>\r\n    <title>剪贴板</title>\r\n</head>\r\n\r\n<body class=\"mdui-theme-primary-blue mdui-theme-accent-pink bg\">\r\n    <div class=\"mdui-appbar\">\r\n        <div class=\"mdui-toolbar mdui-color-theme\">\r\n            <a href=\"javascript:;\" class=\"mdui-btn mdui-btn-icon\">\r\n                <i class=\"mdui-icon material-icons\">menu</i>\r\n            </a>\r\n            <a href=\"javascript:;\" class=\"mdui-typo-headline mdui-text-color-black-secondary\">剪贴板</a>\r\n            <a href=\"javascript:;\" class=\"mdui-typo-title mdui-text-color-black-secondary\">by CloudFlare Workers</a>\r\n            <div class=\"mdui-toolbar-spacer\"></div>\r\n        </div>\r\n    </div>\r\n    <div class=\"mdui-container\">\r\n        ";
    let end = "<div class=\"mdui-typo\">\r\n            <hr />\r\n        </div>\r\n        Power By\r\n        <div class=\"mdui-chip mdui-color-blue\">\r\n            <img class=\"mdui-chip-icon\" src=\"https://cravatar.cn/avatar/3b60cfa2f3618a64fdb8624b540c5a76?s=40\" />\r\n            <span class=\"mdui-chip-title\" onclick=\"window.location.href=\'https://www.hunyl.com\';\">M1saka</span>\r\n        </div>\r\n    </div>\r\n</body>\r\n\r\n</html>";
    return front + text + end;
}

function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n
}

async function readRequestBody(request) {
    const { headers } = request;
    const contentType = headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        return JSON.stringify(await request.json());
    } else if (contentType.includes('application/text')) {
        return request.text();
    } else if (contentType.includes('text/html')) {
        return request.text();
    } else if (contentType.includes('form')) {
        const formData = await request.formData();
        const body = {};
        for (const entry of formData.entries()) {
            body[entry[0]] = entry[1];
        }
        return JSON.stringify(body);
    } else {
        return 0;
    }
}