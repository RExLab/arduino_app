/*
Tutorial desenvolvido por Gamesh_  com base no Exemplo de domínio público: Blink
http://brasilrobotics.blogspot.com/
 */
#include<LiquidCrystal.h>

LiquidCrystal lcd(12, 11, 5, 4, 3, 2);    

void setup() {
Serial.begin(9600);
Serial.write("Iniciando...\n");
lcd.begin(16, 2);                                               // Set up the LCD's number of columns and rows:
  lcd.setCursor(2, 0);                                            // Set LCD cursor position (column, row)
  lcd.print("RExLab - UFSC");                                      // Print text to LCD
  lcd.setCursor(4, 1);                                            // Set LCD cursor position (column,row)
  lcd.print("GT - mre");                                       // Print text to LCD
  delay(5000); // wait 500ms                                      // Delay to read text
  lcd.clear(); // clear LCD display                               // Clear the display
  lcd.setCursor(2, 0);                                            // Set LCD cursor position (column, row)
  lcd.print("Display LCD");                                     // Print text to LCD
  lcd.setCursor(5, 1);                                            // Set LCD cursor position (column, row)
  lcd.print("+ LED");                                   // Print text to LCD
  delay(5000);                                                    // Delay to read text
  lcd.clear(); 
pinMode(13, OUTPUT); //Declara que o pino 12 do arduino é de Saída. Vai mandar dados, energia...
}

void loop() {
  
Serial.write("Oi \n");

lcd.setCursor(3,0);
lcd.print("LED Ligado");
lcd.setCursor(0,1);
lcd.print("Dura 3 segundos");
digitalWrite(13, HIGH);  // Diz que o pino 12 do arduino está Ligado. Logo LED ON
delay(3000); // Espera por 1s
lcd.clear();

lcd.setCursor(2,0);
lcd.print("LED desligado");
lcd.setCursor(0,1);
lcd.print("Dura 3 segundos");
digitalWrite(13, LOW); //  Diz que o pino 12 do arduino está Desligado. Logo: LED OFF
delay(3000); // Espera por 1s
lcd.clear();
}
