int lives;
int random_number;
int response;
String replay;

int mathRandomInt(int min, int max) {
  if (min > max) {
    // Swap min and max to ensure min is smaller.
    int temp = min;
    min = max;
    max = temp;
  }
  return min + (rand() % (max - min + 1));
}

int getUserInputPromptNumber(String msg) {
  Serial.println(msg);
  boolean stringComplete = false;
  int content = 0;
  while (stringComplete == false) {
    if (Serial.available()) {
      content = Serial.parseInt();
      stringComplete = true;
    }
  }
  // Empty incoming serial buffer
  while(Serial.available()) { Serial.read(); };
  return content;
}

String getUserInputPromptText(String msg) {
  Serial.println(msg);
  boolean stringComplete = false;
  String content = "";
  while (stringComplete == false) {
    if (Serial.available()) {
      char readChar = (char)Serial.read();
      if (readChar == '\n' || readChar == '\r') {
        stringComplete = true;
      } else {
        content += readChar;
      }
    }
  }
  // Empty incoming serial buffer
  while(Serial.available()) { Serial.read(); };
  return content;
}

void play_game() {
  Serial.println("Welcome to Repeat after me!");
  lives = 3;
  while (lives > 0) {
    random_number = mathRandomInt(1, 100);
    response = getUserInputPromptNumber(String("Please repeat: ") + String(random_number));
    if (response == random_number) {
      Serial.println("Very good!");
    } else {
      lives += -1;
      Serial.println((String(response) + String(" is incorrect. You\'ve got ") + String(lives) + String(" lives left.")));
    }
  }
}

void game_lost() {
  Serial.println("Oh no! You lost :(");
  replay = "unknown";
  while (replay != "no") {
    replay = getUserInputPromptText("Would you like to play again? (yes/no)");
    if (replay == "yes") {
      return;
    }
  }
  Serial.println("No? Okay then, goodbye!");
  while(true);
}


void setup() {
  Serial.begin(9600);
}

void loop() {
  play_game();
  game_lost();

}