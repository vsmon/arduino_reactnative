#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <ArduinoJson.h>
#include <Adafruit_BME280.h>
#include <Adafruit_Sensor.h> //INCLUSÃO DE BIBLIOTECA

Adafruit_BME280 bmp; //OBJETO DO TIPO Adafruit_BMP280 (I2C)


#define USE_SERIAL Serial
#define LED 2

double TEMPERATURE;
double HUMIDITY;
double PRESSURE;
double ALTITUDE;

#ifndef STASSID
#define STASSID "" //SSID WIFI
#define STAPSK  "" //PASS WIFI
#endif

const char* ssid = STASSID;
const char* password = STAPSK;

ESP8266WebServer server(3001);

void handleNotFound() {
  String message = "File Not Found\n\n";
  message += "URI: ";
  message += server.uri();
  message += "\nMethod: ";
  message += (server.method() == HTTP_GET) ? "GET" : "POST";
  message += "\nArguments: ";
  message += server.args();
  message += "\n";
  for (uint8_t i = 0; i < server.args(); i++) {
    message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
  }
  server.send(404, "text/plain", message);

}

void GetTemperature(){
 
    TEMPERATURE = bmp.readTemperature(); // chama método de leitura da classe dht,
                    
    Serial.print(F("Temperatura: ")); //IMPRIME O TEXTO NO MONITOR SERIAL
    Serial.print(TEMPERATURE); //IMPRIME NO MONITOR SERIAL A TEMPERATURA
    Serial.println(" *C (Grau Celsius)"); //IMPRIME O TEXTO NO MONITOR SERIAL

}

void GetHumidity(){  
    HUMIDITY = bmp.readHumidity(); // chama método de leitura da classe dht,
                    
    Serial.print(F("Humidity: ")); //IMPRIME O TEXTO NO MONITOR SERIAL
    Serial.print(HUMIDITY); //IMPRIME NO MONITOR SERIAL A HUMIDITY
    Serial.println(" % (Percentual)"); //IMPRIME O TEXTO NO MONITOR SERIAL
}

void GetPressure(){
    PRESSURE = bmp.readPressure();
  
    Serial.print(F("Pressão: ")); //IMPRIME O TEXTO NO MONITOR SERIAL
    Serial.print(PRESSURE); //IMPRIME NO MONITOR SERIAL A PRESSÃO
    Serial.println(" Pa (Pascal)"); //IMPRIME O TEXTO NO MONITOR SERIAL
}

void GetAltitude(){
    ALTITUDE = bmp.readAltitude(1013.25);
  
    Serial.print(F("Altitude aprox.: ")); //IMPRIME O TEXTO NO MONITOR SERIAL
    Serial.print(ALTITUDE,0); //IMPRIME NO MONITOR SERIAL A ALTITUDE APROXIMADA
    Serial.println(" m (Metros)"); //IMPRIME O TEXTO NO MONITOR SERIAL

}
void handleBody() { //Handler for the body path
  if (server.method() == HTTP_GET){
    //Encode JSON    
    //Instantiate objects        
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.createObject();
    root["temperature"] = TEMPERATURE;
    root["humidity"] = HUMIDITY;
    root["pressure"] = PRESSURE;
    root["altitude"] = ALTITUDE;
    root["status_led"] = !digitalRead(LED);

    char JSONmessageBuffer[300];
    root.prettyPrintTo(JSONmessageBuffer, sizeof(JSONmessageBuffer));
    
//      String message = "{\n";
//             message += "'data':\n";
//             message += JSONmessageBuffer;
//             message += "}\n";

      String message = JSONmessageBuffer;
 
      server.send(200, "text/json", message);
      Serial.println(message);
  }
  if(server.method() == HTTP_POST){
    if (server.hasArg("plain")== false){ //Check if body received
 
            server.send(200, "text/plain", "Body not received");
            return;
 
    }
 
      String message = "status:\n";
             message += server.arg("plain");
             message += "\n";

      StaticJsonBuffer<200> newBuffer;
      JsonObject& newjson = newBuffer.parseObject(server.arg("plain"));  

      const int STATUS_LED = newjson["status_led"];
      Serial.println("Status Led recebido: " + STATUS_LED);
     if(STATUS_LED == 1){          
        digitalWrite(LED, LOW);
     }else{
        digitalWrite(LED, HIGH);
     }
                      
      
      server.send(200, "text/json", message);
      Serial.println(message);
  }
  
}
void setup(void) {
  pinMode(LED, OUTPUT);
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.println("");

  if(!bmp.begin(0x76)){ //SE O SENSOR NÃO FOR INICIALIZADO NO ENDEREÇO I2C 0x76, FAZ
      Serial.println(F("Sensor BMP280 não foi identificado! Verifique as conexões.")); //IMPRIME O TEXTO NO MONITOR SERIAL
      while(1); //SEMPRE ENTRE NO LOOP
  }

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  if (MDNS.begin("esp8266")) {
    Serial.println("MDNS responder started");
  }
  
  server.on("/data",handleBody);

    

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");
}

void loop(void) {
    GetTemperature();
    GetHumidity();
    GetPressure();
    GetAltitude();
  server.handleClient();
  MDNS.update();
}
