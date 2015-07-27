
package org.jbox2d.testbed.tests;

import org.jbox2d.collision.shapes.CircleShape;
import org.jbox2d.collision.shapes.EdgeShape;
import org.jbox2d.collision.shapes.PolygonShape;
import org.jbox2d.common.Vec2;
import org.jbox2d.dynamics.Body;
import org.jbox2d.dynamics.BodyDef;
import org.jbox2d.dynamics.BodyType;
import org.jbox2d.dynamics.FixtureDef;
import org.jbox2d.dynamics.World;
import org.jbox2d.dynamics.joints.RevoluteJointDef;
import org.jbox2d.testbed.framework.TestbedSettings;
import org.jbox2d.testbed.framework.TestbedTest;
import org.json.JSONException;

import org.iforce2d.Jb2dJson;

/**
 * @author Chris Campbell - www.iforce2d.net
 */
public class LoadRUBE_jointTypes extends TestbedTest {
	
  @Override
  public boolean isSaveLoadEnabled() {
    return true;
  }
  
	/**
	 * @see org.jbox2d.testbed.framework.TestbedTest#initTest(boolean)
	 */
	@Override
	public void initTest(boolean argDeserialized) {
	  if(argDeserialized){
	    return;
	  }
 
  
	  //load world from RUBE file
	  Jb2dJson json = new Jb2dJson();
	  StringBuilder errorMsg = new StringBuilder();
	  World world = json.readFromFile("jointTypes.json", errorMsg);
	  if ( null != world ) {
		  m_world = world;
			
		  //replace testbed stuff
		  groundBody = m_world.createBody(new BodyDef());
		  m_world.setDestructionListener(destructionListener);
		  m_world.setContactListener(this);
		  m_world.setDebugDraw(model.getDebugDraw());
	  }
	  else 
		  System.out.println(errorMsg);
	  
	  /*    
		//write world to RUBE file
		Jb2dJson json = new Jb2dJson();
		StringBuilder errorMsg = new StringBuilder();
		if ( ! json.writeToFile(getWorld(), "jbox2dRUBE.json", 4, errorMsg) )
			System.out.println(errorMsg);
	  */

	}
	
	/**
	 * @see org.jbox2d.testbed.framework.TestbedTest#getTestName()
	 */
	@Override
	public String getTestName() {
		return "Load RUBE - joint types";
	}
	
}
