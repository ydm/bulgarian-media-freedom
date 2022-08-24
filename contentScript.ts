// +-------+
// | Model |
// +-------+

const SOURCE =
    "https://gist.githubusercontent.com/" +
    "/ydm/5e837c8c653d2f093f53af418cd63094/raw/sponsorship.json";

interface Sponsorship {
    date: string;
    category: string;
    grantee: string;
    project: string;
    amount: number;
    logo: string;
    url: string;
    grantor: string;
    grantorLogo: string;
}

interface Sponsorships {
    [domain: string]: Sponsorship[];
}

// +------+
// | View |
// +------+

// ID should be kept synchronized with styles.css.
const ID = "bulgarian-media-freedom";

type AllowedProperties =
    | "className"
    | "href"
    | "id"
    | "src"
    | "target"
    | "textContent";
type Properties = {
    [key in AllowedProperties]?: string;
};

function createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    root?: HTMLElement,
    props?: Properties,
): HTMLElementTagNameMap[K] {
    const element: HTMLElementTagNameMap[K] = document.createElement(tag);

    Object.entries(props || {}).forEach(([key, value]) => {
        if (key in element) {
            //TODO: Well, fuck...
            element[key] = value;
        }
    });

    root?.appendChild(element);

    return element;
}

function createText(text: string, root: HTMLElement) {
    const element: Text = document.createTextNode(text);
    root.appendChild(element);
}

function wrapper(): HTMLUListElement {
    document.getElementById(ID)?.remove();
    let root = createElement("div", document.body, {id: ID});
    createElement("h1", root, {
        className: "title",
        textContent: "Този уебсайт e финансиран",
    });
    const closeButton = createElement("button", root, {
        className: "close-button",
        textContent: "Затвори",
    });
    closeButton.addEventListener("click", function () {
        root.remove();
    });
    return createElement("ul", root);
}

function item(root: HTMLElement, x: Sponsorship) {
    function formatAmount(x: number): string {
        const rev = x.toString().split("").reverse().join("");
        const dotted: string = rev.replace(/(.{3})/g, "$1 ");
        const normalized = dotted.split("").reverse().join("");
        const stripped = normalized.startsWith(".")
            ? normalized.substring(1)
            : normalized;
        return stripped;
    }

    const li = createElement("li", root);
    const amount = formatAmount(x.amount);
    const a = createElement("a", li, {
        href: x.url,
        target: "_blank",
    });
    createElement("b", a, {
        textContent: `${amount}`,
    });
    createText(" лв за ", a);
    createElement("b", a, {
        textContent: x.grantee,
    });
    createText(" от ", a);
    createElement("b", a, {
        textContent: x.grantor,
    });
    createText(`, ${x.date}`, a);
}

function display(xs: Sponsorship[]) {
    const top = wrapper();
    xs.sort((lhs: Sponsorship, rhs: Sponsorship) => rhs.amount - lhs.amount);
    xs.forEach((x: Sponsorship) => {
        item(top, x);
    });
}

// +------------+
// | Controller |
// +------------+

const TAG = "BULGARIAN MEDIA FREEDOM";

function fetchSponsorships(
    url: string,
    callback: (sponsorships: Sponsorships) => void,
) {
    fetch(url, {
        cache: "default",
        credentials: "omit",
        method: "GET",
        mode: "cors",
        redirect: "follow",
    })
        .then((resp: Response) => resp.json())
        .then(callback)
        .catch((reason) =>
            console.log(
                `[${TAG}] fetchSponsorships: failed to fetch url=${url}: reason=${reason}`,
            ),
        );
}

function main() {
    const regexp = /(https?:\/\/)?(www.)?/gi;
    const domain = window.location.host.toLowerCase().replace(regexp, "");

    function handler(sponsorships: Sponsorships): void {
        if (Object.prototype.hasOwnProperty.call(sponsorships, domain)) {
            display(sponsorships[domain]);
        } else {
            console.log(`[${TAG}] main: domain=${domain}`);
        }
    }

    fetchSponsorships(SOURCE, handler);
}

main();
