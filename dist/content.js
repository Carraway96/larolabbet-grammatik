// Nivåerna beskriver övningarnas svårighet, inte en bedömning enligt CEFR.
const LEVELS = [
  { id: 'grund', name: 'Kom igång', tag: 'NIVÅ 1', description: 'Börja med he, she, it och they.', color: 'mint', icon: '01', time: '4–6 min', goal: 'Välja is eller are efter ett pronomen.', rule: 'Använd is med he, she och it. Använd are med you, we och they. Med I använder du am: I am happy. Här tränar vi på is och are.', example: '<span>She <b>is</b> happy.</span><span>They <b>are</b> happy.</span>', questions: [
    ['She ___ happy.', 'is', 'She betyder hon. Med she använder vi is.', 'Hon är glad.'],
    ['They ___ at school.', 'are', 'They betyder de. Med they använder vi are.', 'De är i skolan.'],
    ['He ___ my friend.', 'is', 'Med he använder vi is.', 'Han är min vän.'],
    ['We ___ ready.', 'are', 'We betyder vi. Med we använder vi are.', 'Vi är redo.'],
    ['It ___ cold today.', 'is', 'Med it använder vi is, också när vi pratar om vädret.', 'Det är kallt idag.'],
    ['You ___ kind.', 'are', 'You kan betyda du eller ni. I båda fallen använder vi are.', 'Du är snäll.'],
    ['She ___ in the kitchen.', 'is', 'She hör ihop med is.', 'Hon är i köket.'],
    ['They ___ tired.', 'are', 'They hör ihop med are.', 'De är trötta.'],
    ['He ___ twelve years old.', 'is', 'He hör ihop med is. På engelska är man ett visst antal år.', 'Han är tolv år.'],
    ['We ___ a team.', 'are', 'Det är we som styr verbet, även om a team står efter. We hör ihop med are.', 'Vi är ett lag.']
  ]},
  { id: 'vidare', name: 'Bygg vidare', tag: 'NIVÅ 2', description: 'Hitta subjektet. En eller flera?', color: 'peach', icon: '02', time: '5–7 min', goal: 'Välja is eller are med namn och substantiv.', rule: 'En person eller en sak hör oftast ihop med is: the cat is. Flera hör ihop med are: the cats are. Två personer som binds ihop med and räknas som flera. You hör alltid ihop med are.', example: '<span>The cat <b>is</b> here.</span><span>Leo and Ava <b>are</b> here.</span>', questions: [
    ['The dog ___ hungry.', 'is', 'The dog är en hund (it). En hund hör ihop med is.', 'Hunden är hungrig.'],
    ['The books ___ on the table.', 'are', 'The books är flera böcker (they). Då använder vi are.', 'Böckerna ligger på bordet.'],
    ['Emma ___ my sister.', 'is', 'Emma är en person (she). Då använder vi is.', 'Emma är min syster.'],
    ['Tom and Ali ___ friends.', 'are', 'Tom and Ali är två personer (they). Då använder vi are.', 'Tom och Ali är vänner.'],
    ['My shoes ___ new.', 'are', 'Shoes är plural, alltså flera skor. Använd are.', 'Mina skor är nya.'],
    ['The bus ___ late.', 'is', 'The bus är en buss (it). Använd is.', 'Bussen är sen.'],
    ['My parents ___ at home.', 'are', 'Parents är plural (they). Använd are.', 'Mina föräldrar är hemma.'],
    ['This apple ___ green.', 'is', 'This apple är ett äpple (it). Använd is.', 'Det här äpplet är grönt.'],
    ['The children ___ outside.', 'are', 'Children är plural av child. Flera barn hör ihop med are.', 'Barnen är utomhus.'],
    ['The teacher ___ helpful.', 'is', 'The teacher är en person. Använd is.', 'Läraren är hjälpsam.']
  ]},
  { id: 'utmaning', name: 'Utmana dig', tag: 'NIVÅ 3', description: 'Frågor, negationer och kluriga subjekt.', color: 'lavender', icon: '03', time: '6–8 min', goal: 'Använda is och are i frågor och mer komplexa meningar.', rule: 'I frågor står is eller are ofta före subjektet: Is she ready? Are they ready? Ordet not ändrar inte vilket verb du väljer. Leta efter vem eller vad meningen handlar om – ord nära luckan kan luras.', example: '<span><b>Is</b> the box of pencils blue?</span><span>There <b>are</b> two cats.</span>', questions: [
    ['___ your friends ready?', 'are', 'Your friends är flera. I en fråga flyttas are framför subjektet.', 'Är dina vänner redo?'],
    ['The box of pencils ___ blue.', 'is', 'Subjektets huvudord är box, en låda. Of pencils beskriver innehållet. Använd is.', 'Lådan med pennor är blå.'],
    ['She ___ not tired.', 'is', 'Not gör meningen nekande men she hör fortfarande ihop med is.', 'Hon är inte trött.'],
    ['There ___ two cats in the garden.', 'are', 'Efter there väljer vi här are eftersom two cats är plural.', 'Det finns två katter i trädgården.'],
    ['___ this your jacket?', 'is', 'This är en sak. I frågan står is före this.', 'Är det här din jacka?'],
    ['The keys on the desk ___ mine.', 'are', 'Subjektet är the keys, flera nycklar. Desk står i en beskrivning och styr inte verbet.', 'Nycklarna på skrivbordet är mina.'],
    ['You ___ not alone.', 'are', 'You hör alltid ihop med are, även med not.', 'Du är inte ensam.'],
    ['There ___ a problem.', 'is', 'A problem är ett problem, singular. Därför blir det there is.', 'Det finns ett problem.'],
    ['My brother and I ___ excited.', 'are', 'My brother and I motsvarar we. Två personer hör ihop med are.', 'Min bror och jag är förväntansfulla.'],
    ['The girl with the dogs ___ happy.', 'is', 'Det är the girl som är glad. With the dogs beskriver flickan. En flicka hör ihop med is.', 'Flickan med hundarna är glad.']
  ]}
];
