# Biznis model i model perzistencije

## Model podataka (business model)

Aplikacija **Time cruncher** koristi _MySQL bazu_ za skladištenje podataka.

![sema baza podataka](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/1.%20database.png)

### Tabele u bazi podataka

U tabeli _user_ se pamte informacije o korisnicima aplikacije.

![tabela user](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/2.%20table_user.png)

U tabeli _group_ se pamte informacije o grupama.

![tabela group](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/3.%20table_group.png)

U tabeli _task_ se pamte informacije o zadacima. Kroz
kolone _creatorId_ I _groupId_ se implementira više prema jedan (eng. _many to one_) veza sa tabelama _user_ i _group_ respektivno.

* _creatorId_ : identifikator korisnika (user) koji je kreirao zadatak (task)
* _groupId_ : identifikator grupe (group) kojoj zadatak pripada

![tabela task](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/4.%20table_task.png)

Tabele _task_assignment_ I _user_group_ implementiraju više prema više (eng. _many to many_) veze između entiteta.

* _task_assignment_: Veza između korisnika (user) i zadataka (task) koji su im dodeljeni.

![tabela task_assignment](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/5.%20table_task_assignment.png)

* _user_group_: Veza između korisnika (user) i grupa (group) kojima oni pripadaju.

![tabela user_group](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/6.%20table_user_group.png)

## Model perzistencije (eng. _Entity model_)

Model perzistencije aplikacije **Time Cruncher** je definisan kroz 4 entiteta, predstavljenih klasama:

![entity model](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/7.%20entity_model.png)

_TypeORM framework_ u okviru _NestJS framework_-a obezbeđuje funkcionalnosti mapiranja relacionog 
modela u objektni model pomoću dekoratora kojima se definiše koja se kolona mapira na koji atribut klase entiteta.

![code snippet](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/8.%20code_snippet.png)

## API:

### URI: _/users_

![api users](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/9.%20api_users.png)

![dto one](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/10.%20dto_one.png)

### URI: _/groups_

![api groups](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/11.%20api_groups.png)

![dto two](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/12.%20dto_two.png)

### URI: _/tasks_

![api tasks](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/13.%20api_tasks.png)

![dto three](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/14.%20dto_three.png)

### URI: _/comments_

![api comments](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/15.%20api_comments.png)

![dto four](https://github.com/pripovedac/TimeCruncher/blob/master/Documents/Images/16.%20dto_four.png)

## Format odgovora na zahteve

Ukoliko je zahtev uspešan, telo odgovora će sadržati tražene podatke,
ili adektvatno obaveštenje u slučaju _DELETE_ zahteva, a u zaglavlju odgovora će se nalaziti
odgovarajući statusni kod odgovora. 

U slučaju neupešnog zahteva, telo odgovora će sadržati sledeći objekat

```
{
  "message": <poruka>
}
```

pri čemu će poruka u slučaju neupešne validacije sadržati niz objekata sa atributima:

* _property_ – naziv atributa klase na kome je validacija utvrdila grešku

* _value_ - vrednost atributa gde je pronađena greška

U slučaju ostalih grešaka poruka će biti tipa `string`.
