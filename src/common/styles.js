import { LocalStorage } from "lowdb/browser";
import { LowSync } from "lowdb";

import "mingcute_icon/font/Mingcute.css";
import { CONFIGS_DEFAULT } from "./states";

let base = document.createElement("style");
document.head.appendChild(base);

base.textContent = `
/
    /* Copied from https://medium.com/@rion.mrk/how-to-remove-x-icon-from-search-input-field-or-input-type-search-db3c808405fb */
    input[type=search]::-ms-clear { display: none; width : 0; height: 0; }
    input[type=search]::-ms-reveal { display: none; width : 0; height: 0; }
    input[type="search"]::-webkit-search-decoration,
    input[type="search"]::-webkit-search-cancel-button,
    input[type="search"]::-webkit-search-results-button,
    input[type="search"]::-webkit-search-results-decoration { display: none; }

    ::-webkit-scrollbar {
        width: 4px;
    }

    ::-webkit-scrollbar-track {
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: rgba(var(--line-color));
        border-radius: 4px;
        border: transparent;
    }

    body {
        font-family: sans-serif;
        height: 100vh;
        margin: 0px;
    }

    * { 
        background-color: var(--back-color);
        color: var(--text-color);
        user-select: none;
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
                background-color: #ffffff;
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
