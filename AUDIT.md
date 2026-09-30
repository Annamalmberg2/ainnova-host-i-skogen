# Teknisk granskning · 18 september 2026

## Rättat

- Offlineläget använder en komplett sparad version direkt. En långsam eller trasig anslutning fördröjer inte redan sparat innehåll.
- En ny service worker väntar tills tidigare flikar stängts innan den aktiveras. Pågående besök får behålla samma sparade version.
- Cache-namn är avgränsade till denna webbplats sökväg. Rensning påverkar inte andra appar på samma GitHub Pages-domän.
- Bara uttryckligen listade resurser fångas av service workern. Okända adresser maskeras inte längre som startsidan. Delningsparametrar skapar inte extra cacheposter.
- Content Security Policy begränsar skript, stilmallar, anslutningar, formulär och appresurser till den egna domänen och blockerar plugins samt ändring av dokumentets basadress.
- Tydligare tangentbordsfokus, fokuserbart mål för hopplänken samt bättre omflöde för större text, navigering och smala skärmar.

## Genomförda kontroller

`node tests/check.mjs` kontrollerar båda språkversionernas lokala länkar, ankare, unika ID:n, huvudrubrik, bildbeskrivningar, språkmetadata och CSP. Manifestets start/scope/display och ikonernas verkliga PNG-dimensioner kontrolleras.

Service workern körs också isolerat med simulerad Cache API och ett nätverk som alltid misslyckas. Svenska, engelska, CSS, en bild och delningsparametrar hämtas från cache utan nätverksanrop. Tester verifierar cacheisolering, rensning, okända adresser, POST och frånvaron av påtvingad aktivering mitt i ett besök.

`node --check app.js` och `node --check sw.js` passerar.

Manuell webbläsarkontroll: engelsk sida med större text och hög kontrast vid 320-pixels visningsyta (305 CSS-pixlar innehållsyta) har ingen horisontell överrinning. Installationshjälpen öppnas, Escape stänger den och fokus återgår till knappen. Inga fel eller varningar rapporterades i konsolen vid kontrollen. Uppdateringen från den tidigare lokala versionen till den nya kontrollerades genom att stänga och öppna fliken igen.

## Kvarvarande begränsningar

Detta är inte en WCAG-certifiering eller en oberoende säkerhetsrevision. Full genomgång med faktiska skärmläsare, 200–400 procent webbläsarzoom och installation på fysiska iOS/Android-enheter återstår. Ingen sådan testning påstås vara genomförd.

GitHub Pages kontrollerar HTTP-säkerhetsheaders. CSP i HTML stöder inte `frame-ancestors`; ett motsvarande skydd mot inramning kräver ett webbhotell eller en proxy med egna headers. Sidan har inga inloggningar, betalningsformulär eller egna insamlingsformulär.

Offline fungerar efter lyckad förladdning och så länge webbläsaren behåller lagringen. Webbläsaren kan rensa lagring. Externa länkar och kontakt med Anna kräver anslutning.

Vid framtida ändringar måste cacheversionen i sw.js ökas tillsammans med innehållet. Befintliga besökare kan behöva stänga webbplatsens flikar och öppna igen för att få den nya versionen. GitHub Pages är en extern driftstjänst, inte en evighetsgaranti.

## Tillägg · 30 september 2026

Paddling har lagts till i båda språkversionerna. Den tidigare policyn om enbart egna anslutningar har utökats med två specifika Google-domäner för användarens publika prisflöde. Inga externa skript tillåts. Livedata är avsiktligt separerade från service workerns versionscache: nya priser ska kunna hämtas utan ny webbpublicering. Service workerns version har höjts till v4 och de två nya bilderna samt priskoden förladdas för offlinebruk.

Prislistan använder ett kategorifilter, schemakontroll, textnoder i stället för inmatad HTML, protokollkontroll av länkar, timeout, återförsök och märkt reservvisning. Den kan inte läsas första gången offline. Själva kalkylbladet har inte ändrats.

Verifierat: prisflödet laddas från Google i webbläsaren utan konsolfel; kategorin Rådgivning & Utbildning visar åtta tjänster. Engelsk mobilvy vid 375 CSS-pixlar saknar horisontell överrinning. `node tests/prices.mjs` kontrollerar kategoriurval, textvisning, blockerade javascript-länkar, sparat reservläge, misslyckad hämtning och spärrad lokal lagring. Förladdning av nya offlineversioner använder cache: reload för att undvika gamla filer från HTTP-cachen.
