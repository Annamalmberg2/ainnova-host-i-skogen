# AiNNOVA · Skog & AI

[Öppna kampanjen](https://annamalmberg2.github.io/ainnova-host-i-skogen/) · [English](https://annamalmberg2.github.io/ainnova-host-i-skogen/en.html)

En halvdag med Anna Malmberg: svampguidning, företagsfrågor och AI i Väse. 4 000 kr för fyra timmar, 1 000 kr per extra person. Priser exklusive moms.

## Webbplatsen

- Två kompletta statiska språkversioner med språkmetadata och separata adresser.
- Installerbar PWA med manifest, appikoner, favicon och Apple Touch Icon.
- Service worker som sparar båda språken, stilmall, skript och fotografier för offlineläsning efter första lyckade laddningen. Externa länkar kräver uppkoppling.
- Större text, hög kontrast, tangentbordsfokus, hopplänk, semantiska rubriker, bildbeskrivningar och stöd för minskad rörelse. Inställningar sparas lokalt när webbläsaren tillåter det.
- Open Graph och Twitter Card använder Annas skogsbild. Canonical, hreflang, sitemap och robots.txt finns.
- Inga ramverk, byggsteg, externa typsnitt, analysskript eller spårningscookies. Personliga läsinställningar lagras enbart i webbläsaren.
- Fotografiernas EXIF-metadata har tagits bort i publicerade kopior. Originalbilderna är oförändrade.

## Underhåll och publicering

GitHub Pages publicerar main från rotkatalogen. Redigera index.html och en.html tillsammans, style.css för utseendet och app.js för läs- och installationsfunktioner. Öka CACHE-versionen i sw.js när filer ändras för att byta den förladdade offlineversionen. Behåll repots namn för att behålla adressen.

Sidan kan flyttas till valfritt statiskt webbhotell. Uppdatera då de absoluta adresserna i sidornas metadata, robots.txt och sitemap.xml. Manifest och service worker använder relativa adresser för att fungera i en underkatalog.

Installationsgränssnittet beror på webbläsare och operativsystem. Knappen erbjuder webbläsarens installationsdialog där den stöds, annars visas instruktioner. Ingen appbutik krävs.

## Verifiering

Mobilvy med större text och hög kontrast: ingen horisontell överrinning vid 375 CSS-pixlar. Engelska texter, språkbyte, bokningsankare och installationshjälp kontrollerade i webbläsare. Offlineläsning verifierad genom att stoppa den lokala servern och ladda om sidan. JavaScript syntaxkontrollerat med Node. Detta är ingen formell WCAG-certifiering.

© 2026 AiNNOVA AB. Fotografier: Anna Malmberg. Ingen generell återanvändningslicens ges för text eller bilder.

## Teknisk granskning

Se [AUDIT.md](AUDIT.md) för verifierade kontroller, rättningar och kvarvarande begränsningar. Kör `node tests/check.mjs` samt `node --check app.js` och `node --check sw.js` före publicering.

## Paddling och gemensam prislista · 30 september 2026

Paddlingssektionen finns på båda språken. Bilderna kommer från användarens tidigare WordPress-sida och är sparade lokalt utan EXIF-metadata. Gamla sommartider och ett historiskt kajakpris har inte förts över som aktuella löften; paddlingens pris och upplägg bekräftas vid bokning.

`prices.js` läser den publika Google Apps Script-adress som användaren angav. Endast kategorierna `Rådgivning & Utbildning`, `Alltid`, `Standard` och `Övrigt` visas. Ändra `ALLOWED` för att återanvända samma prisflöde på en annan sida med ett annat urval. Prisdata hämtas när sektionen närmar sig skärmen och kan hämtas på nytt med Uppdatera priser. Informationen i flödet redigeras vid källan; denna sida skriver aldrig till kalkylbladet.

Det tillkommer en extern läsanslutning till Google (`script.google.com` och dess omdirigering `script.googleusercontent.com`). Begäran skickas utan credentials och utan referer. Google ser som vid andra nätverksanrop besökarens IP-adress. Inga nya analysverktyg eller externa typsnitt har lagts till.

Senaste lyckade urval sparas lokalt och visas med hämtningstid om ny hämtning misslyckas. Ingen gammal kopia påstås vara aktuell. Tolv sekunders timeout, validering av svar, tomt resultat och lagringsfel hanteras. Kalkylbladstext läggs in med `textContent`; endast HTTP/HTTPS-länkar accepteras. På engelska sidan anges att källans prislista är på svenska och korten har `lang="sv"`.

## Äventyret — året runt (2026-09-30)
Samma permanenta GitHub Pages-adress och app-id behålls. Båda språken presenterar nu ett gemensamt fyratimmarserbjudande med val av aktivitet, inklusive promenad, paddling, svamp eller möte inne/online. Vinteraktiviteter beskrivs som möjliga upplägg att komma överens om.

`prices.js` matchar tjänsten `Äventyret` i kategorin `Rådgivning & Utbildning` (skiftlägesokänsligt, Unicode NFC). Grundpriset visas i hero och bokningskort från samma källa som prislistan. Flödet hämtas vid sidladdning; sparade värden märks med hämtningstid och visas vid nätfel. Utan tillgänglig rad används tidigare visat pris med uppmaning att bekräfta med Anna. Fyratimmarsupplägg och tillägg 1 000 kr/person är fortfarande sidinnehåll, inte kalkylbladsfält. Ändra matchningen om tjänstens namn byts. Kalkylbladet ändras aldrig av sidan.

Grundkontrast (2026-09-30): ingen kontrastknapp behövs. Gemensamma kort ärver sin sektions textfärg. Fototexter har mörkt överlägg/fast bakgrund. Kör även `node tests/contrast.mjs` vid färgändringar och kontrollera renderade textfärger i webbläsaren.
