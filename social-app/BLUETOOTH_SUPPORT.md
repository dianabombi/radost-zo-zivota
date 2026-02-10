# Web Bluetooth API - Podpora Prehliadačov

## Prehľad

Web Bluetooth API umožňuje webovým aplikáciám komunikovať s Bluetooth zariadeniami. Bohužiaľ, podpora tejto technológie je **veľmi obmedzená** naprieč rôznymi prehliadačmi a platformami.

## Podporované Prehliadače

### ✅ Plne Podporované

| Prehliadač | Platforma | Poznámky |
|------------|-----------|----------|
| **Google Chrome** | Windows, macOS, Linux | Vyžaduje HTTPS alebo localhost |
| **Microsoft Edge** | Windows, macOS | Vyžaduje HTTPS alebo localhost |
| **Chrome** | Android | Najlepšia podpora, funguje aj cez HTTP |

### ❌ Nepodporované

| Prehliadač | Platforma | Dôvod |
|------------|-----------|-------|
| **Safari** | macOS, iOS | Apple nepodporuje Web Bluetooth API |
| **Firefox** | Všetky platformy | Za experimentálnym flagom, nie je dostupné pre bežných používateľov |
| **Všetky prehliadače** | iOS (iPhone, iPad) | iOS nepodporuje Web Bluetooth API vôbec |

## Požiadavky

### Pre Desktop (Chrome/Edge)
1. **HTTPS pripojenie** - aplikácia musí bežať na `https://` alebo `localhost`
2. **Bluetooth zapnutý** - systémový Bluetooth musí byť aktívny
3. **Povolenia** - používateľ musí povoliť prístup k Bluetooth

### Pre Android (Chrome)
1. **Chrome prehliadač** - najnovšia verzia
2. **Bluetooth zapnutý** - systémový Bluetooth musí byť aktívny
3. **Lokalizačné služby** - musia byť zapnuté (Android požiadavka pre Bluetooth scanning)
4. **Povolenia** - používateľ musí povoliť prístup k Bluetooth a lokalizácii

## Prečo nie je možné implementovať Bluetooth pre Safari/Firefox/iOS?

### Technické obmedzenia

**Safari a iOS:**
- Apple **úmyselne nepodporuje** Web Bluetooth API vo svojich prehliadačoch
- Dôvod: Bezpečnostné a privacy obavy
- **Nie je možné obísť** - je to blokované na úrovni operačného systému
- Ani Chrome na iOS nemôže používať Bluetooth (všetky prehliadače na iOS používajú Safari engine)

**Firefox:**
- Web Bluetooth API je za experimentálnym flagom `dom.bluetooth.enabled`
- **Nie je dostupný** pre bežných používateľov
- Vyžaduje manuálnu aktiváciu v `about:config`
- Mozilla nemá plány na plnú podporu v blízkej budúcnosti

**Záver:** Toto nie je chyba v našej aplikácii - je to **obmedzenie samotných prehliadačov**, ktoré nemôžeme obísť žiadnym kódom.

## ✅ Alternatívne Riešenia (Fungujú všade!)

Aplikácia automaticky ponúka alternatívne metódy overenia pre používateľov bez Bluetooth podpory:

### 1. **QR Kód Overenie** 📱
- ✅ Funguje vo **všetkých prehliadačoch** (Safari, Firefox, Chrome, Edge)
- ✅ Funguje na **všetkých zariadeniach** (iOS, Android, Desktop)
- ✅ Používa kameru zariadenia - žiadne špeciálne API
- ✅ **Odporúčaná metóda** pre Safari a iOS používateľov
- Ako to funguje:
  1. Jeden používateľ vygeneruje QR kód
  2. Druhý používateľ ho naskenuje kamerou
  3. Stretnutie je overené okamžite

### 2. **Email Overenie** 📧
- ✅ Funguje vo **všetkých prehliadačoch**
- ✅ Funguje na **všetkých zariadeniach**
- ✅ Nevyžaduje fyzickú blízkosť
- Ako to funguje:
  1. Zadajte email druhého používateľa
  2. Pošle sa žiadosť o stretnutie
  3. Druhý používateľ potvrdí stretnutie

### 3. **Manuálne Overenie** 👤
- Administrátor môže manuálne overiť stretnutie
- Vhodné pre špeciálne prípady alebo technické problémy

## Testovanie

### Ako otestovať podporu:
```javascript
if ('bluetooth' in navigator) {
  console.log('✅ Bluetooth API je podporované');
} else {
  console.log('❌ Bluetooth API NIE JE podporované');
}
```

### Odporúčané testovacie prostredie:
- **Vývoj:** Chrome na localhost s HTTPS (cez Vite s `@vitejs/plugin-basic-ssl`)
- **Produkcia:** Chrome/Edge na HTTPS doméne
- **Mobilné testovanie:** Chrome na Android zariadení

## Chybové Hlášky

Aplikácia automaticky detekuje prehliadač a zobrazuje špecifické správy:

- **Safari:** "Safari nepodporuje Web Bluetooth API. Použite Chrome alebo Edge..."
- **Firefox:** "Firefox nepodporuje Web Bluetooth API (je za experimentálnym flagom)..."
- **iOS:** "iOS zariadenia nepodporujú Web Bluetooth API..."
- **HTTP:** "Web Bluetooth API vyžaduje HTTPS pripojenie..."

## Zdroje

- [Web Bluetooth API Specification](https://webbluetoothcg.github.io/web-bluetooth/)
- [Can I Use - Web Bluetooth](https://caniuse.com/web-bluetooth)
- [Chrome Platform Status](https://chromestatus.com/feature/5264933985976320)

## Odporúčania pre Používateľov

**Pre najlepší zážitok s Bluetooth overením:**
1. Použite **Google Chrome** alebo **Microsoft Edge** na počítači
2. Alebo použite **Chrome** na **Android** zariadení
3. Uistite sa, že aplikácia beží na **HTTPS** (nie HTTP)
4. Majte **Bluetooth zapnutý** v systémových nastaveniach

**Ak nemáte podporovaný prehliadač:**
- Použite **QR kód overenie** namiesto Bluetooth
- QR kód funguje vo všetkých prehliadačoch vrátane Safari a Firefox
