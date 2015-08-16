importScripts('/js/myscriptDependecies.js')
importScripts('/js/myscriptRequests.js') #loading the class myscriptRequests

for dependecy in myscriptDependecies
  importScripts(dependecy)

#OBS: 'myscriptDependecies is a array of all libraries used in the myscript's request

myscriptRequests  = new myscriptRequests()

self.onmessage = (e)->
  strokeBundler = e.data
  self.myscriptRequests.receiveStrokeBundler(strokeBundler)
  try
    self.myscriptRequests.doRecognition().then (data) ->
      serverResult = data
      shape = self.myscriptRequests.decodeServerResult(data)
      postMessage(shape)
  catch err
    alert err.message
