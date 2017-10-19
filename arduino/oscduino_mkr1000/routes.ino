//if get the string In -> inTKMapping[n]
int inTKMapping[]={14,15,16,17,18,19,20};

//if get the string 0n -> inTKMapping[n]
int outTKMapping[]={0,1,2,3,4,5,6};

int pinMapping(String s){
  int n=s[1]-48; //converts ascii char to int '0' = ascii 48
  int pin;
  if (s[0]==('I')){
    pin=inTKMapping[n];
  }else{
    pin=outTKMapping[n];
  }
  return pin;
}

void routeDigitalWrite(OSCMessage &msg, int addrOffset ) {
  int pin;
  int value;
  if (msg.isInt(0)) {
    pin = msg.getInt(0);
  }
  if (msg.isInt(1)) {
    value = msg.getInt(1);
  }
  digitalWrite(pin,value);
  Serial.println("digitalwrite \t"+(String)pin+"\t"+(String)value);
  bundleOUT.add("/dw").add((int32_t)pin);
  bundleOUT.add("/dw").add((int32_t)value);
}

void routeDigitalRead(OSCMessage &msg, int addrOffset ) {
  int pin;
  int value;
  
  if (msg.isInt(0)) {
    pin = msg.getInt(0);
  }else if (msg.isString(0)){
    char str[2];
    //fill str with 8 characters from the 0th datum
    msg.getString(0, str, 2);
    pin=pinMapping(str);
  }
  value=digitalRead(pin);
  Serial.println("digitalread \t"+(String)pin+"\t"+(String)value);
  bundleOUT.add("/dr").add((int32_t)pin);
  bundleOUT.add("/dr").add((int32_t)value);   
}

void routeAnalogueRead(OSCMessage &msg, int addrOffset ) {
  int pin;
  int value;
  if (msg.isInt(0)) {
    pin = msg.getInt(0);
  }else if (msg.isString(0)){
    char str[2];
    //fill str with 8 characters from the 0th datum
    msg.getString(0, str, 2);
    pin=pinMapping(str);
  }
  value=analogRead(pin);
  Serial.println("analogueread \t"+(String)pin+"\t"+(String)value);
  bundleOUT.add("/ar").add((int32_t)pin);
  bundleOUT.add("/ar").add((int32_t)value);   
}
void routeAnalogueWrite(OSCMessage &msg, int addrOffset ) {
  int pin;
  int value;
  if (msg.isInt(0)) {
    pin = msg.getInt(0);
  }
  if (msg.isInt(1)) {
    value = msg.getInt(1);
  }
  analogWrite(pin,value/4);
  Serial.println("analogwrite \t"+(String)pin+"\t"+(String)value);
  bundleOUT.add("/aw").add((int32_t)pin);
  bundleOUT.add("/aw").add((int32_t)value);   
}
