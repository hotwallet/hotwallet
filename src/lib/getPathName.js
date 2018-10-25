export default function (location) {
  return window.cordova ? location.hash.substring(1) : location.pathname
}
