#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <ArduinoJson.h> 

// Replace with your Wi-Fi credentials and Discord webhook URL
const char* ssid = ""; //your ssid here
const char* password = ""; //your password here
const char* discordWebhook = "";// your discord webhook here

ESP8266WebServer server(80);


#define BLUE_LED_PIN 4   // for 1
#define RED_LED_PIN 14   // for 0
#define BUZZER_PIN 5    

// Handle OPTIONS requests for CORS preflight
void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(204);  // No Content
}

// Handle POST request at /message
void handleMessage() {
  if (!server.hasArg("plain")) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "text/plain", "No message received");
    return;
  }
  
  // Get the raw JSON payload
  String requestBody = server.arg("plain");
  Serial.println("Raw payload: " + requestBody);

  // Parse JSON to extract only the "message" field
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, requestBody);
  if (error) {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.c_str());
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "text/plain", "Invalid JSON");
    return;
  }
  
  // Extract the main message from JSON
  const char* mainMessage = doc["message"];
  if (mainMessage == nullptr) {
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(400, "text/plain", "Message field missing");
    return;
  }
  
  String message = String(mainMessage);
  Serial.println("Received message: " + message);

  // Convert message to binary
  String binaryMessage = "";
  for (int i = 0; i < message.length(); i++) {
    char c = message.charAt(i);
    for (int j = 7; j >= 0; j--) {
      binaryMessage += ((c >> j) & 1) ? "1" : "0";
    }
    binaryMessage += " ";  // Space between characters
  }
  Serial.println("Binary: " + binaryMessage);

  // Output the binary using LEDs and buzzer
  outputBinary(binaryMessage);

  // Send both plain and binary messages to Discord
  sendToDiscord(message, binaryMessage);

  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/plain", "Message processed");
}

// Output binary: for each bit, glow blue LED and play tone for '1' and glow red LED for '0'
void outputBinary(String binaryMessage) {
  for (int i = 0; i < binaryMessage.length(); i++) {
    char bit = binaryMessage.charAt(i);
    if (bit == ' ') {
      delay(500); // Pause between characters
      continue;
    }
    if (bit == '1') {
      // Turn on blue LED and activate buzzer for '1'
      digitalWrite(BLUE_LED_PIN, HIGH);
      digitalWrite(RED_LED_PIN, LOW);
      tone(BUZZER_PIN, 1000); // Play 1 kHz tone
      delay(500);
      noTone(BUZZER_PIN); // Stop the tone
    } else { // bit == '0'
      // Turn on red LED for '0'
      digitalWrite(BLUE_LED_PIN, LOW);
      digitalWrite(RED_LED_PIN, HIGH);
      delay(500);
    }
    // Turn off both LEDs between bits
    digitalWrite(BLUE_LED_PIN, LOW);
    digitalWrite(RED_LED_PIN, LOW);
    delay(200);
  }
}

// Send message to Discord via webhook
void sendToDiscord(String message, String binaryMessage) {
  WiFiClientSecure client;
  client.setInsecure(); // For testing only; use proper certificate validation in production
  
  HTTPClient http;
  http.begin(client, discordWebhook);
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{\"content\":\"📩 Message: " + message + "\\n🧑‍💻 Binary: " + binaryMessage + "\"}";
  int httpCode = http.POST(payload);
  if (httpCode > 0) {
    Serial.println("Discord message sent successfully");
  } else {
    Serial.print("Error sending to Discord: ");
    Serial.println(httpCode);
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  
  // Set up pin modes for LEDs and buzzer
  pinMode(BLUE_LED_PIN, OUTPUT);
  pinMode(RED_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();
  Serial.print("Connected! IP Address: ");
  Serial.println(WiFi.localIP());
  
  // Setup CORS-enabled endpoints
  server.on("/message", HTTP_OPTIONS, handleOptions);
  server.on("/message", HTTP_POST, handleMessage);
  
  server.begin();
}

void loop() {
  server.handleClient();
}
