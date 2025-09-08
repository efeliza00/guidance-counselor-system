import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("windowControls", {
  close: () => ipcRenderer.send("close-window"),
  minimize: () => ipcRenderer.send("minimize-window"),
  maximize: () => ipcRenderer.send("maximize-window"),
});

contextBridge.exposeInMainWorld("account", {
  signUp: (formData) => ipcRenderer.invoke("create-account", formData),
  login: (formData) => ipcRenderer.invoke("login-account", formData),
  getToken: () => ipcRenderer.invoke("get-token"),
});

contextBridge.exposeInMainWorld("complaint", {
  create: (formData, id) =>
    ipcRenderer.invoke("create-complaint", formData, id),
  getComplaints: ({ id, page = 1, limit = 10, search = "" }) =>
    ipcRenderer.invoke("get-complaints", { id, page, limit, search }),

  getComplaint: ({ id, complaintId }) =>
    ipcRenderer.invoke("get-complaint", { id, complaintId }),
  getOverview: ({ id }) => ipcRenderer.invoke("get-overview-stats", { id }),

  update: ({ id, complaintId, formData }) =>
    ipcRenderer.invoke("update-complaint", { id, complaintId, formData }),
  delete: ({ id, complaintId }) =>
    ipcRenderer.invoke("delete-complaint", { id, complaintId }),
});

contextBridge.exposeInMainWorld("student", {
  getStudents: ({ id, page = 1, limit = 10, search = "" }) =>
    ipcRenderer.invoke("get-students", { id, page, limit, search }),
});
