// ==UserScript==
// @name         YT AdBlock Block Block
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  YT sucks!
// @author       aryllic
// @match        https://www.youtube.com/*
// @match        https://www.youtu.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

const match = "watch?v=";
const waitTimeout = 10000
let replaced = false;

function replacePlayer() {
    if (replaced) return;
    if (document.location.href.indexOf(match) == -1) return;
    if (!document.querySelector("ytd-enforcement-message-view-model")) return;

    replaced = true;
    document.querySelector("ytd-enforcement-message-view-model").innerHTML = `<iframe style="height: 100%; width: 100%; border-radius: 10px; margin-bottom: 20px;" src="${document.location.href.replace(match, "embed/").split("&")[0]}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
};

function waitForPlayer(startTime) {
    return new Promise((resolve, reject) => {
        if (document.querySelector("ytd-enforcement-message-view-model")) {
            resolve(true);
        } else {
            setTimeout(function() {
                waitForPlayer(startTime).then((playerBool) => {
                    if (document.location.href.indexOf(match) == -1 || new Date().getTime() - startTime > waitTimeout) {
                        resolve(false);
                    } else {
                        resolve(playerBool);
                    };
                });
            }, 100);
        };
    });
};

window.addEventListener("focus", replacePlayer);
window.addEventListener("yt-navigate-finish", function() {
    if (replaced) {
        location.reload();
        replaced = false;
        return;
    };

    waitForPlayer(new Date().getTime()).then((playerBool) => {
        if (playerBool) {replacePlayer()};
    });
});
