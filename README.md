# Lärolabbet – Grammatik

En statisk övningssida för svenskspråkiga elever som lär sig engelsk grammatik.

Första området är **is och are**, med tre öppna nivåer och tio frågor per nivå. På nivå 1 och 2 följs varje svar av en svensk förklaring. På nivå 3 kommer rättning och förklaringar först efter sista frågan. Rätt på första svaret, ledtrådar, lokala framsteg, poäng och tre märken ingår. Resultat delas som PNG-bild: kopiera bilden till urklipp eller ladda ner den och bifoga till läraren. Det är ett elevrapporterat träningsunderlag, inte ett verifierat provresultat.

Stödet minskar mellan nivåerna:

- **Nivå 1:** Aha-labbet öppet från start, snabbregel synlig samt översättning, ledtrådar och direkt återkoppling.
- **Nivå 2:** Aha-labbet dolt från start, kan öppnas vid behov. Ingen fast snabbregel. Översättning, ledtrådar och direkt återkoppling finns kvar. Rapporten anger om bildförklaringen öppnats.
- **Nivå 3:** ingen bildförklaring, snabbregel, översättning eller ledtråd under övningen. Svar låses med en neutral bekräftelse. Facit, rätt/fel, poäng och förklaringar till samtliga tio frågor visas först efter sista frågan.

Aha-labbet har växlingsbara, illustrerade exempel och kontrollfrågor utan poäng. Bilderna är lokala SVG-illustrationer med textalternativ. Resultatsidan visar visuella tankekedjor även på nivå 3. Försök sparar stödversion och om bildförklaringen öppnats. Äldre försök utan stödversion märks som tidigare version med stöd, även om de gjordes på nivå 3.

## Köra lokalt

Kör från projektmappen (HTTP/localhost behövs för säker bildexport och bildkopiering):

```powershell
python -m http.server 4173 --directory dist
```

Öppna sedan http://localhost:4173. Ingen installation eller byggprocess behövs. Google Fonts används som frivillig typsnittsförbättring med lokala reservtypsnitt. Alla övningsfunktioner och loggan finns i projektet.

## GitHub Pages

Lägg projektet i ett GitHub-repository. Under **Settings → Pages**, välj **GitHub Actions** som källa. Den medföljande workflow-filen publicerar `dist/` vid en push till `main` eller manuell körning. Om standardgrenen heter något annat ändrar du `branches` i workflow-filen. Relativa sökvägar gör att sidan fungerar även under ett repositorynamn, exempelvis `/larolabbet-grammatik/`.

Detta projekt har också en privat Sites-publicering för förhandsgranskning. `.openai/hosting.json` är konfiguration för den publiceringen och behövs inte av GitHub Pages.

## Innehåll och vidareutveckling

- `dist/content.js`: nivåer, pedagogiska förklaringar, exempel och frågor. Varje fråga är `[mening med ___, rätt svar, förklaring, svensk översättning]`.
- `dist/app.js`: navigation, övningsflöde, resultat och lokal lagring.
- `dist/report-image.js`: lokal canvas-rendering av resultatbild, förhandsvisning, PNG-kopiering och nedladdning. Bilden innehåller logga, namn/elevkod, datum, nivå, stödstatus, poäng, samtliga svar, reflektion och försöks-id.
- `dist/lesson.js`: interaktiva bildförklaringar, kontrollfrågor utan poäng och visuella tankekedjor.
- `dist/lesson.css`: utformning av bildförklaringen på mobil, surfplatta och dator.
- `dist/style.css`: responsiv formgivning och tillgängliga fokusmarkeringar.
- `dist/assets/larolabbet-logo.png`: originalfil från https://carraway96.github.io/larolabbet/assets/larolabbet-logo.png, återanvänd enligt uppdrag.

Den nuvarande spelmotorn är anpassad till tio is/are-frågor per nivå. För nya grammatikområden behöver svarsalternativ och resultaträkning generaliseras.

## Lagring och återkoppling

Slutförda försök sparas i webbläsarens localStorage under `larolabbet-grammar-v1`. Namn och reflektion finns bara i sidans minne och i den rapport eleven själv kopierar eller sparar. Inga resultat skickas automatiskt. Vid delade datorer bör eleven först spara rapporten och därefter rensa resultaten under **Mina framsteg**. Elever på samma webbläsarprofil delar annars samma historik.

Rapporten innehåller första svar per fråga, facit, resultat, ledtrådar och frivillig reflektion. Rapporten anger vilket inbyggt stöd som fanns under försöket. På nivå 3 visas facit och förklaringar först efter sista frågan. Detta begränsar stöd i gränssnittet; det är inte en låst provmiljö och hindrar inte externa hjälpmedel. Resultatet exporteras som en rasterbild i PNG-format utan medföljande text eller HTML i urklipp. Namn och reflektion kan fyllas i, medan poäng och svar hämtas från försöket. Bildkopiering kräver HTTPS eller localhost och stöd för ClipboardItem/image/png i webbläsaren. Om kopiering nekas eller inte stöds erbjuds PNG-nedladdning. Rapporten ritas direkt i dubbel upplösning (2000 pixlars bredd), med större text och högre kontrast. Förhandsvisningen använder hela resultatytans bredd och kan öppnas i en läsvy med zoom, lässtorlek och anpassning till bredd. En läsbar textmotsvarighet finns för skärmläsare.

En bild kan fortfarande redigeras i ett bildprogram, och lokala resultat kan manipuleras. Försöks-id är en referens, inte en digital signatur. Bildrapporten är inte verifierad mot en server. Använd rapporten formativt, tillsammans med annan information om lärandet.

För automatisk läraråterkoppling behövs en backend eller integration med skolans lärplattform, med autentisering och behörighetskontroll. GitHub Pages räcker för den nuvarande lokala lösningen.
