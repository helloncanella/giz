importScripts('/js/myscriptDependecies.js')

for dependecy in myscriptDependecies
  importScripts(dependecy)

#OBS: 'myscriptDependecies is a array of all libraries used in the myscript's request

self.onmessage = (e)->
  strokeBundler = e.data
  myscriptRequest = new self.myscriptRequest(strokeBundler)

  myscriptRequest.doRecognition().then((data) ->
    result = myscriptRequest.result = data
    postMessage(result) #sending the myscript result to the main thread (controller.js)
  )


class myscriptRequest

  constructor: (@strokeBundler) ->
    @applicationKey = 'a74d2cfe-c979-42b1-9afe-5203c68a490a'
    @hmacKey = '4d3be9ad-8f15-40e8-92d7-29af2d6ea0be'
    @instanceId = undefined

    @inkManager = new MyScript.InkManager()
    @shapeRecognizer = new MyScript.ShapeRecognizer()

    @fillInkManager()

  fillInkManager: ->
    counter = start = 0
    end = @strokeBundler.length - 1
    for stroke in @strokeBundler
      switch counter
        when start then @inkManager.startInkCapture(stroke.x, stroke.y)
        when end then @inkManager.endInkCapture()
        else @inkManager.continueInkCapture(stroke.x,stroke.y)
      counter++

  doRecognition: ->
    if (!@inkManager.isEmpty())
      return @shapeRecognizer.doSimpleRecognition(@applicationKey, @instanceId, @inkManager.getStrokes(), @hmacKey)
    else
      throw console.error("problem with the Myscript's recognition")
