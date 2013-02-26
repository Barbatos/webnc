function Notifier() {}

// Returns "true" if this browser supports notifications.
Notifier.prototype.HasSupport = function() {
  if (window.webkitNotifications) {
    return true;
  } else {
    return false;
  }
}


Notifier.prototype.CheckPermission = function() {
  return window.webkitNotifications.checkPermission();
}
// Request permission for this page to send notifications. If allowed,
// calls function "cb" with true.
Notifier.prototype.RequestPermission = function(cb) {
  window.webkitNotifications.requestPermission(function() {
    if (cb) { cb(window.webkitNotifications.checkPermission() == 0); }
  });
}

// Popup a notification with icon, title, and body. Returns false if
// permission was not granted.
Notifier.prototype.Notify = function(icon, title, body) {
  if (window.webkitNotifications.checkPermission() == 0) {
    var popup = window.webkitNotifications.createNotification( icon, title, body );
    popup.show();
    return true;
  }
  return false;
}

// Popup a notification with icon, title, and body. Returns false if
// permission was not granted.
Notifier.prototype.Notify = function(url) {
  if (window.webkitNotifications.checkPermission() == 0) {
    var popup = window.webkitNotifications.createHTMLNotification( url );
    popup.show();
    return true;
  }
  return false;
}