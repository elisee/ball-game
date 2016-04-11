const Notification = (window as any).Notification;

export function show(text: string) {
  if (Notification == null) return;
  if (document.hasFocus()) return;

  if (Notification.permission === "granted") {
    create(text);
  }  else if (Notification.permission !== "denied") {
    Notification.requestPermission((permission: string) => {
      if (permission === "granted") create(text);
    });
  }
}

function create(text: string) {
  const notification = new Notification(text);
  notification.addEventListener("click", () => { notification.close(); window.focus(); });
  setTimeout(notification.close.bind(notification), 5000);
}
