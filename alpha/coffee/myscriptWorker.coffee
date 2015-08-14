importScripts('/js/myscriptDependecies.js')

for dependecy in myscriptDependecies
  importScripts(dependecy)

#OBS: 'myscriptDependecies is a array of all libraries used in the myscript's request

self.onmessage = (e)->
  strokeBundler = e.data
  myscriptRequest = new self.myscriptRequest(strokeBundler)
  # result = JSON.stringify()) #transforming the result in a string
  myscriptRequest.doRecognition()
  console.log myscriptRequest.doRecognition()
  setTimeout(()->
    console.log myscriptRequest.result
  , 700)
  # postMessage(result)

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
    self = this
    if (!@inkManager.isEmpty())
      @shapeRecognizer.doSimpleRecognition(@applicationKey, @instanceId, @inkManager.getStrokes(), @hmacKey).then (data) ->
        self.result = data.getShapeDocument()
    while(!self.result)
      return self.result
