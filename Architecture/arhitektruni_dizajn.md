# Time Cruncher

## Domen aplikacije

_Time Cruncher_ je web-aplikacija namenjena organizaciji personalnog vremena i olakšavanju menadžmenta grupe ljudi. Korisnik aplikacije će imati uvid u lične, odnosno privatne, kanale sa zaduženjima i kanale koji će biti dostupni većem broju ljudi na kojima će kolobarativno moći da određuju zadatke koje treba ispuniti.

### Funkcionalni zahtevi


- Registracija korisnika
- Logovanje korisnika
- Kreiranje, zakazivanje, komentarisanje, završavanje zadataka
- Dodavanje, brisanje, ažuriranje kanala
- Dodavanje ljudi na konkretan kanal
- Uvid u lične zadatke filtrirane po vremenskom periodu, ili tipu
- Podsetnik na izvršenje zadataka u vidu notifikacija

![opšti use case dijagram](https://github.com/pripovedac/TimeCruncher/blob/master/Architecture/diagrams/use_case_1.png)

![use case prijavljivanje](https://github.com/pripovedac/TimeCruncher/blob/master/Architecture/diagrams/use_case_2.png)

![use case rad sa kanalima](https://github.com/pripovedac/TimeCruncher/blob/master/Architecture/diagrams/use_case_3.png)

![use case rad sa zadacima](https://github.com/pripovedac/TimeCruncher/blob/master/Architecture/diagrams/use_case_4.png)

### Nefunkcionalni zahtevi 

- Pristupačnost - web-aplikacija ne zavisi od platforme na kojoj se izvršava
- Dostupnost - kako će serveri biti uvek aktivni, aplikacija će biti dostupna 24/7
- Performanse - sistem bi pri normalnim uslovima trebalo brzo da reaguje na akcije korisnika, što je pogotovo bitno uzimajući u obzir činjenicu da se radi o *real-time* komunikaciji
- Proširljivost - aplikacija treba da bude projektovana tako da je lako ugraditi nove funkcionalnosti u trenutnu aplikaciju 
- Sigurnost - niko sem ulogovanog korisnika neće imati uvid u njegove privatne kanale
- Dobar UX (skr. _User eXperience_) - interfejs treba da bude intuitivan i lak za korišćenje
 
## Arhitekturni obrasci

### Layered 
Osnovni arhitekturni obrazac koji će biti primenjen u aplikaciji **Time Cruncher** biće *layered* (eng. *slojeviti*) obrazac. 

Sistem se sastoji iz nekoliko slojeva: klijentske aplikacije, Pusher-a, servera i sloja baze podataka. Server je posrednik između klijentske aplikacije i baze što može obavljati preko Pusher-a. Komunikacija između klijenta i servera vrši se pomoću *HTTP zahteva*. API koji je obezbeđen na serverskoj strani biće pisan poštujući *RESTful* principe i podrazumevaće *CRUD* operacije za sve entite za koje će one imati smisla. Parafrazirno, ovo znači da će server biti zadužen za perzistenciju podataka. Na serveru će biti odrađen biznis model podataka na osnovu kojih će se generisati odgovarajuće relacije u bazi.

### Publish-subscribe

U sistemu koji će biti implementiran Pusher će predstavljati komponentu sistema koja koordinira komunikacijom. Svaka komponenta koja se na klijentskoj strani pretplatila na određeni događaj će biti obaveštena čim se događaj desi.

Takođe, na klijentu se komunikacja između komponenti omogućava slanjem propova od roditelja ka detetu i slanjem događaja u suprotnom smeru. Ukoliko komponente nisu u ovom odnosu komunikaciju nije moguće obaviti. Zato će biti iskorišćen *Event-based* stil gde će međusobno nezavisne komponente komunicirati putem event magistrale,  odnosno na indirektan način.


### MVC (skr. *Model-View-Controller*)

#### Frontend

MVC obrazac na frontendu je nametnut izabranim frejmvorkom, *Vue.js*. U Vue-u je primenjen **SoC** dizajn princip (skr. *Separation of Concerns*). Ovo znači da su **.vue** fajlovi pravljeni tako da je jedan fajl namenjen jednoj komponenti i u njemu su i templejt, i javaskript, i css. Ovo je suprotan pristup **SoT** dizajn principu (skr. *Separation of Technologies*) gde se kod razdvaja po tehnologijama, a ne nameni.

Shodno ovom, u Vue-u je iskorišćen MVC obrazac, gde templejt predstavlja view, model su podaci dobijeni sa servera, a kontroler je javaskript koji manipuliše podacima i prosleđuje ih templejtu.

#### Backend

Slično, na backend-u se takođe može uočiti *MVC* obrazac gde je biznis model zapravo model podataka, controller je poslovna logika implementirana u API-ju, dok view predstavlja klijentska aplikacija kojoj API obezbeđuje svoje funkcionalnosti.

## Arhitekturni dizajn

### Strukturni pogled 

Struktura sistema predstavljena korišćenjem komponenti sistema.

![strukturni pogled](https://github.com/pripovedac/TimeCruncher/blob/master/Architecture/diagrams/strukturni_pogled.png)


## Bihevioralni pogled

Interakcija komponenti sistema pri kreiranju novog zadatka. Klijent koristeći svoju aplikaciju koja se izvršava na nekom pretraživaču bira opciju za kreiranje zadatka. Ova informacija se putem Pusher-a prosleđuje serveru koji izvršava dobijeni zadatak uz pomoć ORM alata i vrši perzistenciju zadatka u bazi podataka. Nakon obavljene navedene sekvence akcija ponovo posredstvom Pusher-a se vrši publish-ovanje ka svim korisnicima koji osluškuju kanal na kome je došlo do promene.

![bihevioralni pogled](https://github.com/pripovedac/TimeCruncher/blob/master/Architecture/diagrams/bihevioralni_pogled.png)

## Alokacioni pogled

Raspored komponenti na realnim čvorovima.

![alokacioni pogled](https://github.com/pripovedac/TimeCruncher/blob/master/Architecture/diagrams/alokacioni_pogled.png)


## Tehnologije

### Frontend

Na frontend-u će biti korišćen [Vue.js](https://vuejs.org/). Vue predstavlja frejmvork prilagođen kreiranju modernih SPA (skr. _Single Page Application_) aplikacija. Ima svoj zvančni [ruter](https://router.vuejs.org/) te je navigacija kroz strane dodatno olakšana. Kako je ideja da aplikacija ima i svoju mobilnu verziju, biće, takođe, korišćen i [Vue native](https://vue-native.io/).

### Backend

Na serveru će biti korišćen *Node.js*, te je za backend odabran frejmvork [Nest.js](https://docs.nestjs.com/). Pisan je u typescript-u, kao i ORM alat, [typeORM](https://github.com/typeorm/typeorm), čija podrška dolazi sa njim *out-of-the-box* što je odgovarajuće s obzirom da će se koristiti SQL baza podataka.

### Komunikacija

Komunikacija između instanci aplikacije **Time Cruncher** kao i servera biće omogućena korišćenjem [Pusher](https://pusher.com/)-a. Pusher kanali se koriste za komunikaciju koristeći notifikacije, čet, ažuriranje web-stranica i dr. U pozadini koristi *publish-subrscribe* model.

### Zaduženja

Ideja je da će Miloš biti zadužen za izradu backend-a, dok će Darko raditi na frontend-u. Ukoliko bude potrebe, ipak, postoji mogućnost da će obojica u nekom trenutku raditi zajednički na određenim delovima.

### Napomena

Članovi tima **7A3** koji rade na ovom projektu su odabrali ove tehnologije sa željom da usavrše svoje znanje u ovim oblastima. Ipak, zbog nedovoljno iskustva moguće je da će doći do manjih _izmena_ i _dopuna_ dokumentacije vezane za korišćene tehnologije kako projekat bude napredovao.
