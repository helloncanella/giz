var dependecy, i, len, myscriptRequests;

importScripts('/js/myscriptDependecies.js');

importScripts('/js/myscriptRequests.js');

for (i = 0, len = myscriptDependecies.length; i < len; i++) {
  dependecy = myscriptDependecies[i];
  importScripts(dependecy);
}

myscriptRequests = new myscriptRequests();

self.onmessage = function(e) {
  var err, strokeBundler;
  strokeBundler = e.data;
  self.myscriptRequests.receiveStrokeBundler(strokeBundler);
  try {
    return self.myscriptRequests.doRecognition().then(function(data) {
      var serverResult, shape;
      serverResult = data;
      shape = self.myscriptRequests.decodeServerResult(data);
      return postMessage(shape);
    });
  } catch (_error) {
    err = _error;
    return alert(err.message);
  }
};
