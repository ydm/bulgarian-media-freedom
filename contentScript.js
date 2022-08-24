// +-------+
// | Model |
// +-------+
var SOURCE = "https://gist.githubusercontent.com/" +
    "/ydm/5e837c8c653d2f093f53af418cd63094/raw/sponsorship.json";
// +------+
// | View |
// +------+
// ID should be kept synchronized with styles.css.
var ID = "bulgarian-media-freedom";
function createElement(tag, root, props) {
    var element = document.createElement(tag);
    Object.entries(props || {}).forEach(function (_a) {
        var key = _a[0], value = _a[1];
        if (key in element) {
            //TODO: Well, fuck...
            element[key] = value;
        }
    });
    root === null || root === void 0 ? void 0 : root.appendChild(element);
    return element;
}
function createText(text, root) {
    var element = document.createTextNode(text);
    root.appendChild(element);
}
function wrapper() {
    var _a;
    (_a = document.getElementById(ID)) === null || _a === void 0 ? void 0 : _a.remove();
    var root = createElement("div", document.body, { id: ID });
    createElement("h1", root, {
        className: "title",
        textContent: "Този уебсайт e финансиран"
    });
    var closeButton = createElement("button", root, {
        className: "close-button",
        textContent: "Затвори"
    });
    closeButton.addEventListener("click", function () {
        root.remove();
    });
    return createElement("ul", root);
}
function item(root, x) {
    function formatAmount(x) {
        var rev = x.toString().split("").reverse().join("");
        var dotted = rev.replace(/(.{3})/g, "$1 ");
        var normalized = dotted.split("").reverse().join("");
        var stripped = normalized.startsWith(".")
            ? normalized.substring(1)
            : normalized;
        return stripped;
    }
    var li = createElement("li", root);
    var amount = formatAmount(x.amount);
    var a = createElement("a", li, {
        href: x.url,
        target: "_blank"
    });
    createElement("b", a, {
        textContent: "".concat(amount)
    });
    createText(" лв за ", a);
    createElement("b", a, {
        textContent: x.grantee
    });
    createText(" от ", a);
    createElement("b", a, {
        textContent: x.grantor
    });
    createText(", ".concat(x.date), a);
}
function display(xs) {
    var top = wrapper();
    xs.sort(function (lhs, rhs) { return rhs.amount - lhs.amount; });
    xs.forEach(function (x) {
        item(top, x);
    });
}
// +------------+
// | Controller |
// +------------+
var TAG = "BULGARIAN MEDIA FREEDOM";
function fetchSponsorships(url, callback) {
    fetch(url, {
        cache: "default",
        credentials: "omit",
        method: "GET",
        mode: "cors",
        redirect: "follow"
    })
        .then(function (resp) { return resp.json(); })
        .then(callback)["catch"](function (reason) {
        return console.log("[".concat(TAG, "] fetchSponsorships: failed to fetch url=").concat(url, ": reason=").concat(reason));
    });
}
function main() {
    var regexp = /(https?:\/\/)?(www.)?/gi;
    var domain = window.location.host.toLowerCase().replace(regexp, "");
    function handler(sponsorships) {
        if (Object.prototype.hasOwnProperty.call(sponsorships, domain)) {
            display(sponsorships[domain]);
        }
        else {
            console.log("[".concat(TAG, "] main: domain=").concat(domain));
        }
    }
    fetchSponsorships(SOURCE, handler);
}
main();
