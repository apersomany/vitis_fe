import { LocalStorage } from "lowdb/browser";
import { LowSync } from "lowdb";

import "mingcute_icon/font/Mingcute.css";
import { CONFIGS_DEFAULT } from "./states";

let base = document.createElement("style");
document.head.appendChild(base);

base.textContent = `
    body {
        font-family: sans-serif;
        height: 100vh;
        margin: 0px;
    }

    * { 
        background-color: var(--back-color);
        color: var(--text-color);
    }

    [class^="mgc_"]::before, [class*=" mgc_"]::before {
        color: var(--icon-color) !important;
    }
`;

let cond = document.createElement("style");
document.head.appendChild(cond);

let conf = new LowSync(new LocalStorage("configs"), CONFIGS_DEFAULT);
conf.read();
let dark = conf.data.dark;

export function update_cond() {
    if (dark) {
        cond.textContent = `
            * {
                --blur-filter: contrast(200%) brightness(50%) blur(50px);
                --back-color: #000000;
                --line-color: #424240;
                --card-color: #080800;
                --text-color: #f8f8ff;
                --icon-color: #bdbdbf;
            }

            .dark {
                filter: invert();
            }
        `;
    } else {
        cond.textContent = `
            * {
                --blur-filter :contrast(50%) brightness(200%) blur(50px);
                --back-color: #ffffff;
                --line-color: #bdbdbf;
                --card-color: #fdfdff;
                --text-color: #080800;
                --icon-color: #424240;
            }
        `;
    }
}

export function toggle_dark() {
    conf.read();
    conf.data.dark = !dark;
    conf.write();
    dark = !dark;
    update_cond();
}

update_cond();
