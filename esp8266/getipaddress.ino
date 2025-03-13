#include <ESP8266WiFi.h>

const char* ssid = ""; // Your Wi-Fi Name
const char* password = ""; // Your Wi-Fi Password


void setup() {
  Serial.begin(115200);
  delay(10);
  
  Serial.println();
  Serial.println("Starting ESP8266...");
  
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  unsigned long startAttemptTime = millis();
  
  // timeout after 30 seconds
  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < 30000) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println();
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected.");
    Serial.print("ESP8266 IP Address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Failed to connect to WiFi. Please check your credentials or network.");
  }
}

void loop() {
}
