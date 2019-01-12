# Model komunikacije

## Pusher
Komunikacija u aplikaciji **TimeCruncher** se obavlja uz pomoć _Pushera_. Pusher je alat koji obezbeđuje komunikaciju po principu publish-subscribe, gde se poruke razmenjuju u vidu događaja (eng. _event_) na kanalima. Kanali mogu biti javni,
što bi značilo da je dozvoljeno subscribe-ovanje bilo kog korisnika na kanal, ili privatni, gde svaki zahtev za subscribe-ovanje na kanal prolazi kroz autorizaciju.

![Proces autentifikacije kod Pushera](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/pusherRequest.jpg)

## Time Cruncher
Aplikacija **TimeCruncher** koristi 2 kanala:
* `private-channel_for_user-<id>`: Na ovim kanalima se objavljuju događaji usmereni svakom korisniku pojedinačno. Na primer informacija o dodavanju korisnika u novu grupu.
* `private-channel_for_group-<id>`: Ovi kanali služe za razmenu poruka na nivou grupe, gde je omogućeno subscribe-ovanje samo članovima iste. Na primer dodavanje zadataka u grupu.

![Sekvencijalni prikaz procesa dodavanja novog zadatka](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/CreateNewTask.jpg)
