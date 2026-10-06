# Archilarkie portfolio

Statické portfolio připravené pro GitHub Pages. Nevyžaduje sestavení ani instalaci balíčků.

Soubor `portfolio-a5.html` obsahuje interaktivní náhled papírového portfolia. Tlačítko **Tisk / uložit PDF** vytvoří stránky ve formátu A5 na šířku (210 × 148 mm).

## Lokální náhled

Otevřete `index.html` v prohlížeči nebo spusťte ve složce projektu jednoduchý lokální server.

## Nasazení na GitHub Pages

1. Vytvořte nový GitHub repozitář.
2. Nahrajte obsah této složky do větve `main`.
3. V `Settings → Pages → Build and deployment` vyberte jako zdroj `GitHub Actions`.
4. Každý další push do `main` web automaticky publikuje.

## Přidání 3D modelu

Uložte optimalizovaný model jako `assets/model.glb`, vložte komponentu `<model-viewer>` do sekce `model-section` a načtěte knihovnu z `https://modelviewer.dev/`. Pro web je vhodné držet jeden model přibližně pod 15–25 MB.

Fotografie a texty vycházejí z původního portfolia na `archilarkie5.webnode.cz`.
