import "mingcute_icon/font/Mingcute.css";
import { CONFIGS } from "./states";

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
        display: none;
    }

    body {
        font-family: sans-serif;
        height: 100vh;
        margin: 0px;
        overflow: hidden;
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

let conf = CONFIGS();

export function update_cond() {
    if (conf.dark) {
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
                --blur-filter: contrast(50%) brightness(200%) blur(50px);
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
    conf.dark = !conf.dark;
    update_cond();
}

update_cond();
