console.log ('WORKER')

self.onmessage = (e) ->
  console.log ('WORKER')
  raw = e.data.rawStroke
  beautiful = e.data.beautifulStroke

  if beautiful
    console.log "I prefer the pretty shape"
  else
    console.log "I don't have option. I'll stay with the ugly shape"
