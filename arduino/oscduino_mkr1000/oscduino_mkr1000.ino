// UDP OSCuino
// system, analog and digital pin control and monitoring for Arduino
// Yotam Mann and Adrian Freed
#include <SPI.h>
#include <WiFi101.h>
#include <WiFiUdp.h>
#include <OSCMessage.h>
#include <OSCBundle.h>
#include <OSCBoards.h>

int status = WL_IDLE_STATUS;
char ssid[] = "";
char pass[] = "";
int locPort = 12000;
int outPort = 10000;

WiFiUDP Udp;
OSCBundle bundleOUT;
OSCErrorCode error;

/**
   MAIN METHODS

   setup and loop, bundle receiving/sending, initial routing
*/
void setup() {
  Serial.begin(9600);
  Serial.println("OSC test");

  // attempt to connect to Wifi network:
  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(ssid);
    // Connect to WPA/WPA2 network. Change this line if using open or WEP network:
    status = WiFi.begin(ssid, pass);
    // wait 10 seconds for connection:
    delay(5000);
  }
  Serial.println("Connected to wifi");
  printWifiStatus();

  Udp.begin(locPort);

  for (int i=0;i<7;i++){
    pinMode(i,OUTPUT);
  }
}

//reads and routes the incoming messages
void loop() {
  OSCMessage msg;
  int size = Udp.parsePacket();

  if (size > 0) {
    while (size--) {
      msg.fill(Udp.read());
    }
    if (!msg.hasError()) {
      msg.route("/dw", routeDigitalWrite);
      msg.route("/dr", routeDigitalRead);
      msg.route("/ar", routeAnalogueRead);
      msg.route("/aw", routeAnalogueWrite);

    } else {
      error = msg.getError();
      Serial.print("error: ");
      Serial.println(error);
    }
    Udp.beginPacket(Udp.remoteIP(), outPort);
    bundleOUT.send(Udp);
    Udp.endPacket();
    bundleOUT.empty(); // empty the bundle ready to use for new messages
  }
}
