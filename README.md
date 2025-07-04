# Smart Lights

Skrzyżowanie czterowlotowe, dwa pasy w każdą stronę. Pas lewy do skrętu w lewo, oraz pas prawy do skrętu w prawo oraz jazdy na wprost.

Cztery tryby świateł:

- jazda na wprost i w prawo z północy i południa,
- jazda na wprost i w prawo ze wschodu i zachodu,
- jazda w lewo z północy i południa (dodatkowo wszystkie warunkowe prawoskręty),
- jazda w lewo ze wschodu i zachodu (dodatkowo wszystkie warunkowe prawoskręty).

Takie tryby świateł zapewniają, że wszystkie samochody są w stanie przejechać przez skrzyżowanie bezkolizyjnie. Dodatkowo, dodanie warunkowych strzałek w prawo dodaje możliwość przejazdu, gdy dany pas i tak jest nie wykorzystany w danym momencie.

## Algorytm

Algorytm bada aktualne zapotrzebowanie (ilość oczekujących samochodów) na każdym pasie. Włącza tryb świateł, który pozwoli przejechać pasom, na których oczekuje najwięcej samochodów.

Dodatkowo, światła nie mogą zmieniać się częściej niż co 10 sekund, jako że w momencie zmiany świateł jest moment, w którym żadna strona nie może jechać i taka częsta zmiana świateł powodowałaby dodatkowe opóźnienia.

Jeśli którys pas przez dłuższy czas (80 sekund) nie zawiera największej ilości pojazdów, to mimo wszystko zielone światło jest włączane dla tego pasa. Zapobiega to sytuacji, w której jeden samochód stoi w nieskończoność na czerwonym świetle, bo pozostałe kierunki są bardziej oblegane.

## UI

Po włączeniu aplikacji, użytkownik może wgrać plik JSON w odpowiednim formacie, lub uruchomić losową symulację (podając czas oraz natężenie ruchu w skali od 1 do 10). Po wciśnięciu "Start" symulacja zostaje uruchomiona.

Na każdym pasie wyświetlana jest tablica z trzema wartościami, np. |4|7|11|. Pierwsza wartość oznacza ilość widocznych samochodów na danym pasie. Druga wartość - ilość samochodów których jeszcze nie widać na ekranie, ale stoją w kolejce na tym samym pasie. Trzecia wartość wskazuje sumę oczekujących samochodów (widocznych i niewidocznych na ekranie). Dodatkowo, ta trzecia wartość przybiera odpowiedni kolor tła (zielony, żółty lub czerwony) w zależności od ilości oczekujących samochodów.

Samochody przemieszczają się po ulicy zgodnie z wyznaczonym parametrem "startRoad" i "endRoad".

Po wykonaniu wszystkich komend (w przypadku trybu JSON) lub upłynięciu zadanego czasu (tryb Random), symulacja jest zatrzymywana i zostaje pobrany plik result.json - zawiera on informację jakie samochody opuściły skrzyżowanie w danym kroku. Na ekranie pojawia się przycisk "Restart" który pozwala powrócić do ekranu głównego i uruchomić kolejną symulację.
