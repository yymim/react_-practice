import { app, BrowserWindow, ipcMain, Menu } from "electron";
import pkg from "electron-updater";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

let win;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { autoUpdater } = pkg;

function createWindow() {
  win = new BrowserWindow({
    width: 990,
    height: 780,
    icon: "public/favicon_io/favicon.ico",
    webPreferences: {
      preload: path.join(__dirname, "../build/preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
    },
  });

  autoUpdater.autoInstallOnAppQuit = false;
  win.loadFile(path.join(__dirname, "../build/index.html"));
  // win.webContents.openDevTools();
  // Menu.setApplicationMenu(null);

  ipcMain.on("apply-update", () => {
    autoUpdater.quitAndInstall();
  });

  win.on("closed", function () {
    win = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (win === null) {
    createWindow();
  }
});

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on("update-available", () => {
  win.webContents.send("update-available");
});

autoUpdater.on("download-progress", (progressObj) => {
  let message = `다운로드 속도: ${progressObj.bytesPerSecond}`;
  message += ` - 진행 상태: ${progressObj.percent}%`;
  message += ` (${progressObj.transferred}/${progressObj.total})`;
});

autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update-downloaded");
});
