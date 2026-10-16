//blocker
const fs = require("fs");
const path = require("path");
const { session } = require("electron");

let enabled = false;

async function enable() {
    if (enabled) return;
    enabled = true;

    const blockPath = path.join(__dirname, 'block');
    const lines = fs.readFileSync(blockPath, "utf8").split(/\r?\n/);
    const rules = lines
        .map(line => line.trim())
        .filter(line => line.startsWith("||"))
        .map(line => {
            let domain = line.substring(2);
            if (domain.endsWith("^")) domain = domain.slice(0, -1);
            return domain;
        });
    session.defaultSession.webRequest.onBeforeRequest(
        {
            urls: ["*://*/*"]
        },
        (details, callback) => {
            try {
                const url = details.url;
                const blocked = rules.some(rule =>
                    url.includes(rule)
                );

                if (blocked) {
                    callback({
                        cancel: true
                    });

                    return;
                }

                callback({
                    cancel: false
                });

            } catch (error) {
                callback({
                    cancel: false
                });
            }
        }
    );
}

module.exports = {
    enable
};