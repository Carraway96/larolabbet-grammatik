const STAGES = ['grund', 'vidare', 'utmaning'];
const TOPICS = {
  be: { id:'be', title:'Is eller are?', short:'Is & are', label:'VERBET BE', intro:'Vem eller vad är meningen om? Hitta kopplingen till is och are.', options:['is','are'], doodles:['she is.','cats are.','is it?'], memory:'He, she, it → is. You, we, they → are. I → am.', pairs:[['he · she · it','is'],['you · we · they','are']], note:'You har alltid are, även när det betyder du.' },
  have: { id:'have', title:'Have eller has?', short:'Have & has', label:'ATT HA', intro:'Bygg vidare på is och are. Nu berättar du vad någon har.', options:['have','has'], doodles:['she has.','we have.','who has?'], memory:'He, she, it → has. I, you, we, they → have.', pairs:[['he · she · it','has'],['I · you · we · they','have']], note:'I har have. Jämför: I am happy, men I have a cat.' },
  article: { id:'article', title:'A eller an?', short:'A & an', label:'OBESTÄMD ARTIKEL', intro:'En eller ett på engelska. Följ ljudet efter luckan och välj a eller an.', options:['a','an'], doodles:['an apple.','a red apple.','an hour.'], memory:'Konsonantljud → a. Vokalljud → an. Det första ljudet efter artikeln styr.', pairs:[['konsonantljud','a'],['vokalljud','an']], note:'Lyssna på ljudet, inte bara på första bokstaven. A university, men an hour.' }
};
LEVELS.forEach(level => { level.topic = 'be'; level.stage = level.id; });
function addTopicLevels(topic, specs) {
  specs.forEach((spec, i) => LEVELS.push({ ...spec, topic, stage:STAGES[i], id:`${topic}-${STAGES[i]}`, name:['Kom igång','Bygg vidare','Utmana dig'][i], tag:`NIVÅ ${i+1}`, color:['mint','peach','lavender'][i], icon:`0${i+1}`, time:['4–6 min','5–7 min','6–8 min'][i] }));
}
addTopicLevels('have', [
  { description:'Koppla I, she och they till rätt verb.', goal:'Välja have eller has efter personliga pronomen.', questions:[
    ['She ___ a cat.','has','She betyder hon. Med she använder vi has.','Hon har en katt.',['She','she']],
    ['I ___ a blue bag.','have','Med I använder vi have. I have betyder jag har.','Jag har en blå väska.',['I','I']],
    ['They ___ two bikes.','have','They betyder de. They hör ihop med have.','De har två cyklar.',['They','they']],
    ['He ___ a sister.','has','He betyder han. He hör ihop med has.','Han har en syster.',['He','he']],
    ['We ___ a garden.','have','We betyder vi. Med we använder vi have.','Vi har en trädgård.',['We','we']],
    ['It ___ a long tail.','has','It kan syfta på ett djur eller en sak. Med it använder vi has.','Den har en lång svans.',['It','it']],
    ['You ___ a nice hat.','have','You hör ihop med have, både när det betyder du och när det betyder ni.','Du har en fin hatt.',['You','you']],
    ['She ___ a red pencil.','has','Med she blir verbet has. Färgen på pennan påverkar inte verbet.','Hon har en röd penna.',['She','she']],
    ['He ___ a new phone.','has','He hör ihop med has.','Han har en ny telefon.',['He','he']],
    ['We ___ English today.','have','We hör ihop med have. We have English betyder här att vi har engelska på schemat.','Vi har engelska idag.',['We','we']]
  ]},
  { description:'Byt namn och substantiv mot pronomen.', goal:'Välja have eller has med namn, singular och plural.', questions:[
    ['Emma ___ a dog.','has','Emma är en person. Tänk she: She has a dog.','Emma har en hund.',['Emma','she']],
    ['The children ___ new books.','have','Children betyder flera barn. Tänk they: They have new books.','Barnen har nya böcker.',['The children','they']],
    ['My brother ___ a skateboard.','has','My brother kan bytas mot he. He hör ihop med has.','Min bror har en skateboard.',['My brother','he']],
    ['Tom and Ali ___ a plan.','have','Tom and Ali är två personer. De kan bli they, som hör ihop med have.','Tom och Ali har en plan.',['Tom and Ali','they']],
    ['The house ___ a red door.','has','The house är ett hus. Tänk it: It has a red door.','Huset har en röd dörr.',['The house','it']],
    ['My friends ___ a football.','have','My friends är flera vänner. They hör ihop med have.','Mina vänner har en fotboll.',['My friends','they']],
    ['The dog ___ big ears.','has','Det är en hund som har öronen. The dog kan bli it, så vi väljer has.','Hunden har stora öron.',['The dog','it']],
    ['The girls ___ a map.','have','The girls är flera flickor. Byt till they och välj have.','Flickorna har en karta.',['The girls','they']],
    ['This bike ___ two lights.','has','This bike är en cykel. Byt till it: It has two lights.','Den här cykeln har två lampor.',['This bike','it']],
    ['My parents ___ a car.','have','Parents är plural. My parents kan bli they, och they har have.','Mina föräldrar har en bil.',['My parents','they']]
  ]},
  { description:'Längre subjekt och ord som kan luras.', goal:'Hitta subjektets huvudord och välja have eller has utan stöd.', questions:[
    ['The girl with the dogs ___ a red bag.','has','Subjektets huvudord är girl. With the dogs beskriver flickan. Tänk she → has.','Flickan med hundarna har en röd väska.',['The girl','she']],
    ['The boys in my class ___ a new teacher.','have','Det är flera boys som har en lärare. In my class ändrar inte antalet: they → have.','Pojkarna i min klass har en ny lärare.',['The boys','they']],
    ['My brother and I ___ the same hobby.','have','My brother and I motsvarar we. We hör ihop med have.','Min bror och jag har samma hobby.',['My brother and I','we']],
    ['The box of pencils ___ a blue lid.','has','Det är en box som har ett lock. Of pencils beskriver innehållet: it → has.','Lådan med pennor har ett blått lock.',['The box','it']],
    ['Everyone ___ a ticket.','has','Everyone betyder alla, men behandlas grammatiskt som singular. Därför använder vi has.','Alla har en biljett.',['Everyone','grammatiskt singular']],
    ['The houses near the lake ___ big gardens.','have','Huvudordet är houses, flera hus. Near the lake är en beskrivning: they → have.','Husen nära sjön har stora trädgårdar.',['The houses','they']],
    ['My best friend ___ two sisters.','has','My best friend är en person. Antalet systrar efter verbet styr inte valet: en vän → has.','Min bästa vän har två systrar.',['My best friend','en person']],
    ['You and Emma ___ the same book.','have','You and Emma syftar på fler än en person. Tillsammans hör ni ihop med have.','Du och Emma har samma bok.',['You and Emma','flera personer']],
    ['Somebody ___ my umbrella.','has','Somebody syftar grammatiskt på en person. Då använder vi has.','Någon har mitt paraply.',['Somebody','grammatiskt singular']],
    ['The children at this school ___ lunch at twelve.','have','Children betyder flera barn. At this school beskriver vilka barn: they → have.','Barnen på den här skolan äter lunch klockan tolv.',['The children','they']]
  ]}
]);
addTopicLevels('article', [
  { description:'Bilder och vanliga ord: a cat, an apple.', goal:'Välja a eller an före vanliga substantiv i singular.', questions:[
    ['___ apple','an','Apple börjar med ett vokalljud. Därför säger vi an apple.','ett äpple',['apple','vokalljud'],'apple'],
    ['___ book','a','Book börjar med konsonantljudet b. Därför säger vi a book.','en bok',['book','konsonantljud'],'book'],
    ['___ orange','an','Orange börjar med ett vokalljud. Vi säger an orange.','en apelsin',['orange','vokalljud'],'orange'],
    ['___ dog','a','Dog börjar med konsonantljudet d. Vi säger a dog.','en hund',['dog','konsonantljud'],'dog'],
    ['___ egg','an','Egg börjar med ett vokalljud. Vi säger an egg.','ett ägg',['egg','vokalljud'],'egg'],
    ['___ bike','a','Bike börjar med konsonantljudet b. Vi säger a bike.','en cykel',['bike','konsonantljud'],'bike'],
    ['___ umbrella','an','Umbrella börjar med ett vokalljud. Vi säger an umbrella.','ett paraply',['umbrella','vokalljud'],'umbrella'],
    ['___ cat','a','Cat börjar med konsonantljudet k. Vi säger a cat.','en katt',['cat','konsonantljud'],'cat'],
    ['___ ice cream','an','Ice börjar med ett vokalljud. An ice cream betyder här en glass, till exempel en strut.','en glass',['ice','vokalljud'],'icecream'],
    ['___ pencil','a','Pencil börjar med konsonantljudet p. Vi säger a pencil.','en penna',['pencil','konsonantljud'],'pencil']
  ]},
  { description:'Korta meningar och ord som beskriver.', goal:'Välja artikel efter det första ljudet direkt efter luckan, även före adjektiv.', questions:[
    ['She has ___ umbrella.','an','Ordet efter luckan är umbrella. Det börjar med ett vokalljud, så vi väljer an.','Hon har ett paraply.',['umbrella','vokalljud']],
    ['He has ___ red apple.','a','Red står direkt efter luckan och börjar med r. Vi väljer a, även om apple börjar med ett vokalljud.','Han har ett rött äpple.',['red','konsonantljud']],
    ['This is ___ old bike.','an','Old kommer direkt efter luckan och börjar med ett vokalljud. Därför blir det an old bike.','Det här är en gammal cykel.',['old','vokalljud']],
    ['We saw ___ small elephant.','a','Small står först efter luckan och börjar med s. Därför blir det a small elephant.','Vi såg en liten elefant.',['small','konsonantljud']],
    ['I have ___ idea.','an','Idea börjar med ett vokalljud. Vi säger an idea.','Jag har en idé.',['idea','vokalljud']],
    ['She is ___ good friend.','a','Good börjar med konsonantljudet g. Därför blir det a good friend.','Hon är en bra vän.',['good','konsonantljud']],
    ['He has ___ English book.','an','English börjar med ett vokalljud. Det är ljudet i English, inte i book, som styr.','Han har en engelsk bok.',['English','vokalljud']],
    ['This is ___ big orange.','a','Big börjar med konsonantljudet b och står direkt efter luckan. Därför väljer vi a.','Det här är en stor apelsin.',['big','konsonantljud']],
    ['It is ___ easy question.','an','Easy börjar med ett vokalljud. Vi säger an easy question.','Det är en lätt fråga.',['easy','vokalljud']],
    ['She has ___ green bag.','a','Green börjar med konsonantljudet g. Vi säger a green bag.','Hon har en grön väska.',['green','konsonantljud']]
  ]},
  { description:'Ljudet styr: an hour, men a university.', goal:'Välja a eller an efter uttalet, även när första bokstaven luras.', questions:[
    ['We waited for ___ hour.','an','H är stumt i hour. Ordet börjar med ett vokalljud, så vi säger an hour.','Vi väntade i en timme.',['hour','stumt h → vokalljud']],
    ['She studies at ___ university.','a','University börjar med ett j-ljud, som i engelskans you. Det är ett konsonantljud: a university.','Hon studerar vid ett universitet.',['university','j-ljud → konsonantljud']],
    ['He is ___ honest person.','an','H är stumt i honest. Första ljudet är ett vokalljud, så vi väljer an.','Han är en ärlig person.',['honest','stumt h → vokalljud']],
    ['This is ___ useful tool.','a','Useful börjar med ett j-ljud, som you. Därför säger vi a useful tool.','Det här är ett användbart verktyg.',['useful','j-ljud → konsonantljud']],
    ['She wears ___ uniform.','a','Uniform börjar med ett j-ljud, som you. Första ljudet är en konsonant: a uniform.','Hon bär uniform.',['uniform','j-ljud → konsonantljud']],
    ['That is ___ unusual idea.','an','Unusual börjar med ett vokalljud. Att ordet börjar med u betyder inte automatiskt a: lyssna på uttalet.','Det där är en ovanlig idé.',['unusual','vokalljud']],
    ['He is ___ European student.','a','European börjar med ett j-ljud, som you. Därför blir det a European student.','Han är en europeisk student.',['European','j-ljud → konsonantljud']],
    ['We saw ___ enormous animal.','an','Enormous står direkt efter luckan och börjar med ett vokalljud. Därför blir det an.','Vi såg ett enormt djur.',['enormous','vokalljud']],
    ['This is ___ one-way street.','a','One börjar med ett w-ljud. Det är ett konsonantljud, trots bokstaven o: a one-way street.','Det här är en enkelriktad gata.',['one-way','w-ljud → konsonantljud']],
    ['She has ___ interesting hobby.','an','Interesting börjar med ett vokalljud. Det är ordet efter luckan som styr: an interesting hobby.','Hon har en intressant hobby.',['interesting','vokalljud']]
  ]}
]);
