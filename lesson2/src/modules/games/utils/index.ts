export const notifyMe = (message: string) => {
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    new Notification("There is new Game!", {
      body: message,
      icon: "/favicon.ico",
      vibrate: [200, 100, 200],
    });
  } else if (
    Notification.permission === "denied" ||
    Notification.permission === "default"
  ) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification("There is new Game!", {
          body: message,
          icon: "/favicon.ico",
          vibrate: [200, 100, 200],
        });
      }
    });
  }
};
