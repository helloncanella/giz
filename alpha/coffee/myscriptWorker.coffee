importScripts('/js/myscriptDependecies.js')
importScripts('/js/myscriptRequests.js') #loading the class myscriptRequests

for dependecy in myscriptDependecies
  importScripts(dependecy)

#OBS: 'myscriptDependecies is a array of all libraries used in the myscript's request

myscriptRequests  = new myscriptRequests()

self.onmessage = (e)->
  strokeBundler = e.data
  self.myscriptRequests.receiveStrokeBundler(strokeBundler)
  self.myscriptRequests.doRecognition().then((data) ->
    result = self.myscriptRequests.result = data
    postMessage(result) #sending the myscript result to the main thread (controller.js)
  )
