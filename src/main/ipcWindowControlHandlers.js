import { ipcMain, BrowserWindow } from "electron";

export const windowControlHandlers = () => {
  ipcMain.on("close-window", (e) => {
    const window = BrowserWindow.fromWebContents(e.sender);
    window.close();
  });

  ipcMain.on("minimize-window", (e) => {
    const window = BrowserWindow.fromWebContents(e.sender);
    window.minimize();
  });

  ipcMain.on("maximize-window", (e) => {
    const window = BrowserWindow.fromWebContents(e.sender);
    window.maximize();
  });
};
