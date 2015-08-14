var dependecy, i, len, myscriptRequests;

importScripts('/js/myscriptDependecies.js');

importScripts('/js/myscriptRequests.js');

for (i = 0, len = myscriptDependecies.length; i < len; i++) {
  dependecy = myscriptDependecies[i];
  importScripts(dependecy);
}

myscriptRequests = new myscriptRequests();

self.onmessage = function(e) {
  var strokeBundler;
  strokeBundler = e.data;
  self.myscriptRequests.receiveStrokeBundler(strokeBundler);
  return self.myscriptRequests.doRecognition().then(function(data) {
    var result;
    result = self.myscriptRequests.result = data;
    return postMessage(result);
  });
};
