
package org.jbox2d.testbed.tests;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Vector;
import java.util.Map.Entry;

import org.iforce2d.Jb2dJson;
import org.jbox2d.common.Vec2;
import org.jbox2d.dynamics.BodyDef;
import org.jbox2d.dynamics.World;
import org.jbox2d.dynamics.Body;
import org.jbox2d.testbed.framework.TestbedSettings;
import org.jbox2d.testbed.framework.TestbedTest;
import org.json.JSONObject;

/**
 * @author Chris Campbell - www.iforce2d.net
 */
public class LoadRUBE_customProperties extends TestbedTest {
	
  @Override
  public boolean isSaveLoadEnabled() {
    return true;
  }
  
	class WobblyProperties {
		Vec2 basePos; 			// starting position
		float horizontalRange; 	// oscillation range
		float verticalRange;	// oscillation range
		float speed; 			// oscillation speed
	}
	
	Map<Body, WobblyProperties> m_wobblyBodyPropertiesMap;
	float m_timePassed;
  
	/**
	 * @see org.jbox2d.testbed.framework.TestbedTest#initTest(boolean)
	 */
	@Override
	public void initTest(boolean argDeserialized) {
	  if(argDeserialized){
	    return;
	  }
	  
      m_wobblyBodyPropertiesMap = new HashMap<Body, WobblyProperties>(); 
  
	  //load world from RUBE file
	  Jb2dJson json = new Jb2dJson();
	  StringBuilder errorMsg = new StringBuilder();
	  World world = json.readFromFile("customProperties.json", errorMsg);
	  if ( null != world ) {
		  m_world = world;
			
		  //replace testbed stuff
		  groundBody = m_world.createBody(new BodyDef());
		  m_world.setDestructionListener(destructionListener);
		  m_world.setContactListener(this);
		  m_world.setDebugDraw(model.getDebugDraw());
		  
          //find all bodies with custom property 'category' value matching 'wobbly'
          Vector<Body> wobblyBodies = new Vector<Body>();
          json.getBodiesByCustomString("category", "wobbly", wobblyBodies);
          
          //look at some other custom properties of these bodies and store them
          for (int i = 0; i < (int)wobblyBodies.size(); i++) {
              Body b = wobblyBodies.elementAt(i);
              WobblyProperties wp = new WobblyProperties();
              wp.basePos = new Vec2( b.getPosition() );
              wp.horizontalRange = json.getCustomFloat(b, "horzRange", 0);
              wp.verticalRange = json.getCustomFloat(b, "vertRange", 0);
              wp.speed = json.getCustomFloat(b, "speed", 0);
              m_wobblyBodyPropertiesMap.put(b, wp);              
          }
	  }
	  else 
		  System.out.println(errorMsg);
	  
	  m_timePassed = 0;

	}
	
	/**
	 * @see org.jbox2d.testbed.framework.TestbedTest#step(org.jbox2d.testbed.framework.TestbedSettings)
	 */
	@Override
	public void step(TestbedSettings settings) {
		super.step(settings);
		addTextLine("The movement of these bodies is defined by custom properties.");
		
		float hz = settings.getSetting(TestbedSettings.Hz).value;
        m_timePassed += 1 / hz;

        //use the custom properties to move the wobbly bodies around
        Iterator<Entry<Body, WobblyProperties>> it = m_wobblyBodyPropertiesMap.entrySet().iterator();
		while (it.hasNext()) {
			Entry<Body, WobblyProperties> pair = (Entry<Body, WobblyProperties>) it.next();
			Body b = pair.getKey();
            WobblyProperties wp = pair.getValue();            
            Vec2 pos = wp.basePos.add( new Vec2( (float)Math.sin(m_timePassed*wp.speed) * wp.horizontalRange, (float)Math.cos(m_timePassed*wp.speed) * wp.verticalRange ) );
            b.setTransform(pos, 0);
		}
	}
	
	/**
	 * @see org.jbox2d.testbed.framework.TestbedTest#getTestName()
	 */
	@Override
	public String getTestName() {
		return "Load RUBE - custom properties";
	}
	
}
