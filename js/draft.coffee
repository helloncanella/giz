class Banana
  init:()->
    start=null
    @update(start)
  
  fps:60
  
  update: (start) ->
    if @start==null
        date = new Date()
        start = date.getTime()
    else    
      console.log('ola')
      now = date.getTime()
      if (now-start)%1000/@fps==0
        console.log(now-start)
    
    requestFrameAnime(@update)
    
fruit = new Banana()
fruit.init()
 
