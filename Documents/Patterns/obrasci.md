# Obrasci

*Uvodna napomena:* U ovoj sekciji će biti opisani obrasci koji su primenjeni u aplikaciji **TimeCruncher**. 
Neki od obrazaca koji će biti navedeni su ugrađeni u korišćene frejmvorke, dok su preostali implementirani od strane tima **7A3**.
Kojoj od ove dve grupe obrazac pripada biće eksplicitno navedeno u daljem tekstu.

Na frontendu je korišćen frejmvork *Vue.js* koji je pisan u *javaskriptu*, jeziku sa slabim tipovima podataka. 
Iz tog razloga ne postoje apstraktne klase i interfejsi kao takvi. Ipak, potrudili smo se da obrasce koji odgovaraju
objektno-orijentisanoj paradigmi i jezicima sa jakim tipovima podataka što više prilagodimo jeziku sa ovakvom karakterstikom.
U nastavku sledi pregled korišćenih obrazaca.

## Custom implementacija obrazaca

### Dependency Injection (*srp.* Ubrizgavanje zavisnosti) 

Dependency Incjection obrazac je tehnika u računarstvu koja se koristi za tzv. ubrizgavanje zavisnosti. Ideja je da
se tok izvršenja same funkcije kontroliše od spolja. Obrazac diktira kreiranje kostura algoritma koji u sebi sadrži 
promenljive delove koda koji zavise od situacije u kojoj je funkcija pozvana. DI pripada 
[IoC tipu obrazaca](https://en.wikipedia.org/wiki/Inversion_of_control) (*skr. eng.* Inversion
of Control), kojima, takođe, pripada i [Template Method](https://en.wikipedia.org/wiki/Template_method_pattern),
te se između njh može uočiti jasna sličnost. U aplikaciji je ovaj obrazac iskorišćen na više mesta: kreiranje *apiFetch* funkcije, 
kreirenje *Vue* instance, obrada odgovora sa bekenda. Mi ćemo posebnu pažnju posvetiti obradi odgovora sa servera kako bi detaljnije opisali kako obrazac funkcioniše.

### Primer implementacije u aplikaciji

U trenutku kada se piše funkcija koja je implementirana po DI principu, kaže se da joj se *indžektuju* zavisnosti 
(*eng.* to inject - ubrizgati). Kada se pri pozivu funkcije kao parametri proslede neke realne vrednosti to
se naziva *provajdovanje* (*eng.* to provide - obezbediti).

##### Deklaracija funkcije implementirane po DI principu
```
class ResponseHandler {
    handle(response, handleSuccess, errorMessage) {
        if (!response.errorStatus) {
            handleSuccess(response)
        } else {
            alert(errorMessage)
        }
    }
}

export const responseHandler = new ResponseHandler()
```
##### Primer poziva funkcije
```
{
  ...
  const response = await groupsApi.updateSingle(this.$route.params.groupId, updatedGroup)
  const errorMessage = `Could not update group ${this.group.name}.`
  responseHandler.handle(response, this.successfulUpdate, errorMessage)
  ...
}

successfulUpdate: function(response) {
  this.name = response.name
  this.description = response.description
  this.members = response.users
}
```

### Strategy (*srp.* Strategija)
Poznat i pod nazivom *Policy* jedan od najpoznatijih [GoF obrazaca](https://en.wikipedia.org/wiki/Design_Patterns) 
spada po oblasti delovanja u objektne, a po nameni u bihevioralne obrasce. Starategy obrazac je primenjen za implementiranje različitih
načina pribavljanja zadataka filtriranih po određenim kriterijumima i za manipulaciju ruterom na frontendu.
Kako je kod obiminiji u nastavku sledi samo UML dijagram.

#### UML dijagaram
![Strategy obrazac](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/strategy.png)

### Singleton
Jednostavan projektni obrazac sa kreacionom namenom i objektnim delovanjem čiji je cilj kreiranje jedne i samo jedne instance 
klase napisane po ovom principu. U aplikaciji **TimeCruncher** je to urađeno preko klase *SingletonPusher* sa statičkom
funkcijom *Instance* koja vraća instancu pušera. Dodatnih funkcija u klasi nema jer je kreirani objekat instanca biblioteke *pusher*
i samim tim već enkaspulira sve potrebne funkcionalnosti. 

#### UML dijagram
![Singleton obrazac](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/singleton.png)

#### Primer implementacije u aplikaciji

##### Implementacija Singleton obrasca
```
import Pusher from 'pusher-js'

export class SingletonPusher {
    static Instance() {
        if (!this.pusher) {
            this.pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, {
                cluster: process.env.VUE_APP_PUSHER_CLUSTER,
                authEndpoint: process.env.VUE_APP_BE_URL + '/pusher/auth',
                auth: {
                    headers: {
                        'access_token': localStorage.getItem('user') ? localStorage.getItem('user').accessToken : null
                    }
                }
            });
        }
        return this.pusher
    }
}
```

##### Primer poziva funkcije
```
initPusher: function () {
  this.pusher = SingletonPusher.Instance()
},
```

*Napomena:* Autori aplikacije su svesni da je ovo moglo da se postigne i kreiranjem pušer objekta u okviru fajla sa gorenavednom klasom
i njegovim eksportovanjem, ali kako bi implementacija bila sličnija GoF Singleton obrascu opredelili smo se za ovaj način.


### Fasada
Objektni strukturalni obrazac sa ciljem da sakrije mnogobrojne zavisne i isprepletane funkcije iza poziva jedne jednostavne funkcije. 
U aplikaciji **TimeCruncher** je fasada primenjena za manipulaciju konverzije datuma u stringove pri čemu su korišćene funkcije
ugrađene biblioteke *Date*.

#### UML dijagram

![Fasada](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/facade.png)

#### Primer implementacije u aplikaciji

##### Primer implementacije fasade
```
class DateController {
    constructor() {
        this.monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec']
    }

    toInputFormat(date) {
        const year = date.getFullYear()
        let month = this.monthNames[date.getMonth()]
        let day = date.getDate()
        day = day < 10 ? `0${day}` : day
        return `${day}-${month}-${year}`
    }

    toString(date) {
        const year = date.getFullYear()
        let month = date.getMonth() + 1
        month = month < 10 ? `0${month}` : month
        let day = date.getDate()
        day = day < 10 ? `0${day}` : day
        return `${year}-${month}-${day}`
    }
}

export const dateController = new DateController()
```

##### Primer poziva funkcije iz fasade
```
this.publishTime = dateController.toInputFormat(new Date(this.task.publishTime))
```
### Publish/Subscribe mehanizam
Publish/Subscribe mehanizam stoji kao jedna od fundamentalnih karakteristika aplikacije **TimeCruncher**. Implementiran je i na
frontendu, i na bekendu. Real-time komunikacija koristeći biblioteku Pušer je bazirana po ovom principu, gde se instance
klijenta pretplaćuju na događaje koji se šalju sa servera. Takođe, ovaj pristup pretplaćivanja je uveliko zastupljen i u samoj
klijentskoj aplikaciji u komunikaciji između komponenti. Pub/Sub mehanizam se nametnuo kao jedno od rešenja problema nepostojanja 
mogućnosti komunikacije komponenti koje nisu u relaciji *predak-potomak*. Koristeći magistrale događaja postala je moguća komunikacija
između bilo kojih komponenti unutar aplikacije.

#### UML dijagram

![Pub/Sub](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/event-bus.png)

#### Primer implementacije u aplikaciji

##### Primer implementacije publish/subscribe mehanizma

```
const newTask = new Vue()

export function publish(task) {
    newTask.$emit('newTask', task)
}

export function subscribe(fn) {
    newTask.$on('newTask', fn)
}
```
##### Primer korišćenja magistrale

###### Emitovanje događaja na kreiranu magistralu
```
newTask$.publish(newTask)
```

###### Odgovor na emitovan događaj detektovan na magistrali
```
newTask$.subscribe((newTask) => {
  this.newTasks.push(newTask)
})
```

U datom primeru jedna komponenta emituje događaj `newTask`, a druga komponenta koja je pretplaćena na njega, odgovora pozivom 
anonimne funkcije prosleđene `subscribe` funkciji.

## Ugrađeni enterprise obrasci 

### Template View (*srp.* Šablonski pogled)

Prezentacija je napisana u obliku skupa šablonskih HTML strana sa naznakama gde je potrebno umetnuti dinamički sadržaj.
Ovaj obrazac se nametnuo zbog frontend frejmvorka *Vue.js* čije komponente se kreiraju poštujući *SoC* princip (*skr. eng.*
Separation of Concerns). Kao što smo naveli već u [dokumentu](https://github.com/pripovedac/TimeCruncher/blob/master/Architecture/arhitektruni_dizajn.md)
vezanom za arhitekturu aplikacije:

> Ovo znači da su .vue fajlovi pravljeni tako da je jedan fajl namenjen jednoj komponenti i u njemu su i templejt, i javaskript, i css. 

#### Primer korišćenja u aplikaciji
```
<template>
    <div class="task-card" :class="{
                done: isCompleted,
                todo: !isCompleted,
                isLate: isLate,
                isDeleted: isDeleted
     }">
        <button @click="changeRoute($event)">
            <span>
                <CheckCircleIcon v-if="isCompleted"
                                 class="icon"/>
                <AlertOctagonIcon v-else-if="isLate" class="icon"/>
                <InfoIcon v-else class="icon"/>
            </span>
        </button>
        <div class="task-data">
            <h1>{{name}}</h1>
            <p>{{description}}</p>
            <div v-if="date">{{displayedDate}}</div>
            <div v-else>Date undefined</div>
        </div>
    </div>
</template>
```

### Transaction script (*srp.* Trasakciona skripta)
Obrazac domenske logike koji organizuje poslovnu logiku tako da svaka procedura odgovara na jedan zahtev primljen sa
prezentacionog sloja. Ovaj obrazac se prirodno nametnuo kao najjednostavanije rešenje za implementaciju 
[API](https://en.wikipedia.org/wiki/Application_programming_interface)-ja (*skr. eng.* Application Programming Interface).


### Data mapper
Obrazac sloja izvora podataka nametnut od strane frejmvorka [Nest](https://nestjs.com/) koji se koristio na bekendu.
Koristi se kada je model domenske logike kompleksan i odvojen od sloja domenske logike. Objektno-relacioni maper koji
se koristio uz Data mapper je [TypeORM](http://typeorm.io/#/).
