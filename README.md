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
