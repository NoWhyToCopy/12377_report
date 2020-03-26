// ==UserScript==
// @name            快捷举报黄赌毒不良页面 (12377.cn)
// @namespace       12377.cn
// @version         1.0
// @description     快速举报黄、赌、毒、有害网页
// @author          12377_report
// @grant           GM_addStyle
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addValueChangeListener
// @license         MIT
// @include         http://*
// @include         https://*
// ==/UserScript==

"use strict"

const common_messages = [
    // 你可以在此填写你的常用语, 填写完成Ctrl + S保存
    '未成年人的心智还没有发育成熟，很容易被所展示的内容所诱惑乃至荒废学业，内容甚至会使未成年玩家产生暴力倾向并诱发犯罪行为。',
    '玩家在网络游戏中可以组建帮会、门派一类的组织，受此影响，一些未成年玩家在现实生活中也拉邦结派，甚至将虚拟世界里的恩怨带到现实社会中而打架斗殴',
    '网站展示容易对他人的身体造成损害，给人的精神带来污染，使人的思想产生混乱，让人的心理变得异常垃圾的信息。',
    '这些信息大多具有粗鲁、庸俗、虚假、怪异、矫情等性质，其对未成年人的身心发育和健康成长十分有害。',
];

GM_registerMenuCommand('举报当前页面', ReportCurrentPage, 'R');
GM_registerMenuCommand('--举报须知--', function() { GM_openInTab('http://www.12377.cn/txt/2018-02/05/content_40215072.htm'); }, null);
GM_registerMenuCommand('显示我的净网贡献统计', ShowStatistics, 'S');
GM_registerMenuCommand('清除统计信息', ClearStatistics, 'D');

if(location.hostname.match('report.12377.cn') && location.pathname.match('toreportinputNormal')) {
    GM_addStyle(`
#input_helper {
    left: 10px;
    top: 10px;
    position: fixed;
    background-color: rgba(120, 210, 120, 0.95);
    height: 31rem;
    width: 20rem;
    z-index: 99999;
}
#input_helper_title {
    text-align: center;
    font-size: 2rem;
    margin: 1rem 0rem;
}
.input_helper_lists {
    width: 100%;
    overflow-y: scroll;
    height: calc(100% - 18rem);
    background-color: #783dbf;
}
.input_helper_items {
    padding: .5rem 0rem;
    font-size: medium;
    margin: 0px 1rem;
    color: wheat;
    text-align: left;
}
`);
    ShowInputHelperGUI();
}

function ShowInputHelperGUI() {
    var helper_windows_h5code =
    `<div id="input_helper">
        <div id="input_helper_title">快速填写举报助理</div>
        <div id="choice_page_lists" class="input_helper_lists"></div>
        <hr/>
        <div id="choice_message_lists" class="input_helper_lists"></div>
    </div>`;
    document.body.innerHTML = helper_windows_h5code + document.body.innerHTML;
    var message_boxes = document.getElementById('choice_message_lists');
    for(var idx = 0; idx < common_messages.length; idx++) {
        var item = document.createElement('div');
        item.id = 'message_' + idx;
        item.className = 'input_helper_items';
        item.innerText = (idx + 1) + '. ' + ShortShowText(common_messages[idx], 32);;
        message_boxes.appendChild(item);
        item.addEventListener("click", function(ev) {
            var idx = ev.target.id.match(/message_([0-9]+)/)[1];
            document.getElementById('content').value = common_messages[idx];
        });
    }
    FlushHelperPageLists(null, null, GM_getValue('r_lists', null), null);
    GM_addValueChangeListener('r_lists', FlushHelperPageLists);
}

function ShortShowText(text, length) {
    if(text != null && length > 0) {
        if(text.length > length) {
            return text.substr(0, length) + '...';
        }
        else {
            return text;
        }
    }
    else {
        return null;
    }
}

function FlushHelperPageLists(name, old_value, page_data, remote) {
    var info = document.getElementById('choice_page_lists');
    info.innerHTML = '';
    if(page_data != null) {
        { // Title
            var item = document.createElement('div');
            item.className = 'input_helper_items';
            item.innerText = "标题: " + ShortShowText(page_data.title, 32);
            info.appendChild(item);
        }
        { // Url
            var item = document.createElement('div');
            item.className = 'input_helper_items';
            item.innerText = "链接: " + ShortShowText(page_data.url, 64);
            info.appendChild(item);
        }
        { // Button
            var item = document.createElement('div');
            item.className = 'input_helper_items';
            item.innerText = ">| 自动填写 |<";
            item.style.fontWeight = 1000;
            info.appendChild(item);
            item.addEventListener("click", function(ev) {
                var page_data = GM_getValue('r_lists', null);
                if(page_data != null) {
                    document.getElementById('webname').value = page_data.title;
                    document.getElementById('pageurl').value = page_data.url;
                }
            });
        }
    }
}

function ShowStatistics() {
    alert('功能尚未开发');
}

function ClearStatistics() {
    alert('功能尚未开发');
}

function ReportCurrentPage() {
    GM_openInTab('http://report.12377.cn:13225/typecatalogSelect.html');
    var page_data = {
        url: location.href,
        title: document.title
    }
    GM_setValue('r_lists', page_data);
}
