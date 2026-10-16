//main.js root js for electron launche
//
        //-------------------------------------------------------------
        //Code By Corex Institut (Benjamin Burban) --
        //WebSite - link -> \ https://corexinstitut.netlify.app
        //-------------------------------------------------------------
        //Go home AI Corex Institut 
        //WebSite - link -> \ https://corexinstitut.netlify.app/corexai
        //-------------------------------------------------------------
//
//import lib for use in app Window
const { BrowserWindow, Menu, app, shell } = require("electron");
const path = require("path");
const fs = require("fs");

//blocker ads and tracker
const blocker = require("./blocker");
//join file (ressources/disabled)
const file = path.join(__dirname, "sources/disabled");

//Check if the file exists.
if (fs.existsSync(file)) {
    //set entry point to the file
    const disables = fs.readFileSync(file, "utf8").split("\n").map(l => l.trim()).filter(l => l !== "");
    disables.forEach(flag => app.commandLine.appendSwitch(flags));
}

//hidde Menu Bar
Menu.setApplicationMenu(null);

//function create root page Window
function crWindow() {
    //set fenetre to BrowserWindow
    fenetre = new BrowserWindow({
        //set icon app
        icon: path.join(__dirname, 'ressources/meta.ico'),
        //set size page
        width: 1000,
        height: 700,
        minWidth: 700,
        minHeight: 550,

        //set preferences app
        webPreferences: {
            sandbox: true,
            contextIsolation: true,
            webSecurity: true,
            backgroundThrottling: true,

            nodeIntegration: false,
            enableRemoteModule: false,
            webviewTag: false,
            nodeIntegrationInSubFrames: false,
            allowRunningInsecureContent: false,
            experimentalFeatures: false,
            offscreen: false
        }
    });

    //set title BrowserWindow 
    fenetre.on('page-title-updated', (event) => {
        event.preventDefault();
        fenetre.setTitle('meta');
    });

    //load website ai (meta ai)
    fenetre.loadURL("https://meta.ai");

    fenetre.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    //limited renderer
    fenetre.webContents.setFrameRate(30);

    //System for page refreshing via F5 and Ctrl+R
    fenetre.webContents.on('before-input-event', (event, input) => {
        const ctrl = input.control || input.meta;

        if ((ctrl && input.key.toLowerCase() === 'r') || input.key === 'F5') {
            event.preventDefault();
            if (input.shift) fenetre.webContents.reloadIgnoringCache();
            else fenetre.webContents.reload();
        }
    });
}

//call (crWindow) for create root page 
app.whenReady().then(async () => {
    await blocker.enable();
    crWindow();
});