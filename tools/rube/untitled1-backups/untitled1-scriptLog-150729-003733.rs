//Started script log at Qua 29 Jul 2015 00:35:18 BRT

addBody(1, '{"awake":true,"type":"dynamic"}');
getBody(1).addFixture(1, '{"density":1,"shapes":[{"radius":0,"type":"polygon"}],"friction":0.2,"vertices":{"x":[0.5,0.154508,-0.404509,-0.404508,0.154509],"y":[0,0.475528,0.293893,-0.293893,-0.475528]}}');
getBody(1).setPosition(0,0);
getFixture(1).select();
getVertex(1,1).select();
getVertex(1,1).setPos(0.823457, 0.837494);
getVertex(1,1).deselect();
getFixture(1).deselect();
setCursor(-1.47077, 0.560927);
getFixture(1).select();
getShape(1,0).setType(2);
getShape(1,0).setType(3);
