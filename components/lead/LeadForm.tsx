import { useMemo, useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

const employmentTypes = [
  "Umowa o pracę – na czas nieokreślony",
  "Umowa o pracę – na czas określony",
  "Umowa o pracę – okres próbny",
  "Umowa o pracę – pełny etat",
  "Umowa o pracę – część etatu",
  "Renta",
  "Emerytura",
  "Umowa zlecenie",
  "Umowa o dzieło",
];

const vehicleTypes = ["Osobowy", "Dostawczy", "Motocykl", "4x4", "Pozostałe"];

const maritalStatuses = [
  "Kawaler/Panna",
  "Żonaty/Zamężna",
  "Rozwiedziony/a",
  "Wdowiec/Wdowa",
  "W separacji",
];

const idDocTypes = ["Dowód osobisty", "Paszport", "Karta pobytu", "Inny"];

type YesNo = "" | "TAK" | "NIE";
const yesNoOptions: { value: YesNo; label: string }[] = [
  { value: "", label: "Wybierz..." },
  { value: "TAK", label: "TAK" },
  { value: "NIE", label: "NIE" },
];

const ratyOptions = [24, 36, 48, 60, 72, 84, 96, 108];

const LeadForm = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Bazowe (szybki kontakt)
  const [basicData, setBasicData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    consent: false, // <- dodajemy zgodę
    honeypot: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (basicData.honeypot) return;

  if (!canSubmit) {
    setErrorMsg("Uzupełnij wymagane pola i zaznacz zgody.");
    return;
  }

  setIsSubmitting(true);
  setErrorMsg(null);
  setIsSuccess(false);

  // ✅ jeden obiekt ze wszystkimi polami (to co ktoś wpisał)
  const form = {
    ...basicData,
    ...(isExpanded ? data : {}), // jeżeli nie rozwinął, nie wysyłamy pełnych danych
  };

  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: isExpanded ? "leadform_full" : "leadform_basic",
        honeypot: basicData.honeypot,
        form,
        consents,
      }),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      throw new Error(txt || "Request failed");
    }

    setIsSuccess(true);
  } catch (err) {
    console.error(err);
    setErrorMsg("Nie udało się wysłać formularza. Spróbuj ponownie.");
  } finally {
    setIsSubmitting(false);
  }
};


  // Pełne dane (PDF + bank) — scalone
  const [data, setData] = useState({
    // Dane klienta
    clientType: "private" as "private" | "jdg",
    secondName: "",
    mothersMaidenName: "",
    pesel: "",
    birthDate: "",
    maritalStatus: "",
    citizenship: "Polska",
    countryOfBirth: "Polska",

    // Dokument tożsamości
    idDocType: "",
    idDocNumber: "",
    idDocIssuer: "",
    idDocIssueDate: "",
    idDocExpiryDate: "",
    idDocNoExpiry: false,

    // Prawo jazdy
    drivingLicenseNumber: "",
    noDrivingLicense: false,

    // Adres zamieszkania
    addressPostalCode: "",
    addressCity: "",
    addressStreetAndNo: "",

    // Źródło dochodu
    employmentType: "",
    netIncome6mAvg: "",

    // Miejsce osiągania dochodu
    employerName: "",
    employerNip: "",
    employerPhone: "",
    employerPostalCode: "",
    employerCity: "",
    employerStreetAndNo: "",
    position: "",
    employmentStartDate: "",

    // Obciążenia / limity
    monthlyObligations: "",
    dependentsCount: "",
    accountLimitsSum: "",
    cardLimitsSum: "",

    // Pojazd
    vehicleType: "Osobowy",
    vehicleBrandModel: "",
    vehicleYear: "",
    vehiclePriceBrutto: "",

    // Kredyt
    loanAmount: "",
    downPayment: "",
    months: "60",
    wantsInsurance: false,

    // Spłata
    paymentMethod: "auto" as "transfer" | "auto",
    paymentDay: "10",
  });

  // Zgody (PDF + bank) — spójne typy, bez duplikatów
  const [consents, setConsents] = useState({
    // RODO / kontakt
    rodo: false, // obowiązkowe
    contactOffer: false,

    // Bank — TAK/NIE (z formularza bankowego)
    veloBankQuery: "" as YesNo,
    bigKrdQuery: "" as YesNo,
    erifBigQuery: "" as YesNo,
    verifyBusinessInfo: "" as YesNo,
    verifyPesel: "" as YesNo,

    // Regulamin / wniosek
    acceptRegulations: false, // obowiązkowe
  });

  const canSubmit = useMemo(() => {
    if (basicData.honeypot) return false;

    const requiredBasics =
      basicData.firstName.trim() &&
      basicData.lastName.trim() &&
      basicData.phone.trim() &&
      consents.rodo &&
      consents.acceptRegulations;

    return Boolean(requiredBasics);
  }, [basicData, consents]);

 

  if (isSuccess) {
    return (
      <section id="wniosek" className="bg-background section-padding">
  <div className="container-narrow max-w-2xl text-center py-16">
    <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
    <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
      Wniosek został pomyślnie wysłany!
    </h2>
    <p className="text-lg text-muted-foreground font-body">
      Dziękujemy za zaufanie. Obecnie analizujemy Twoje dane i przygotowujemy propozycję rat
      dopasowanych do Twoich możliwości. 
      <p>Skontaktujemy się z Tobą maksymalnie w ciągu 24 godzin roboczych.</p>
    </p>
  </div>
</section>
    );
  }

  return (
    <section id="wniosek" className="bg-background section-padding">
      <div className="container-narrow max-w-2xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Wniosek
          </h2>
          <p className="text-muted-foreground font-body">Uzupełnij dane. Formularz scalony (PDF + bank).</p>
        </div>

        <div className="card-elevated p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Honeypot */}
            <input
              type="text"
              name="website"
              value={basicData.honeypot}
              onChange={(e) => setBasicData({ ...basicData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* PODSTAWOWE */}
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium mb-1.5">Imię *</label>
                  <input
                    type="text"
                    required
                    value={basicData.firstName}
                    onChange={(e) => setBasicData({ ...basicData, firstName: e.target.value })}
                    className="input-styled"
                    placeholder="Jan"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium mb-1.5">Nazwisko *</label>
                  <input
                    type="text"
                    required
                    value={basicData.lastName}
                    onChange={(e) => setBasicData({ ...basicData, lastName: e.target.value })}
                    className="input-styled"
                    placeholder="Kowalski"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-body font-medium mb-1.5">Telefon *</label>
                  <input
                    type="tel"
                    required
                    value={basicData.phone}
                    onChange={(e) => setBasicData({ ...basicData, phone: e.target.value })}
                    className="input-styled"
                    placeholder="600 000 000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-body font-medium mb-1.5">Email</label>
                  <input
                    type="email"
                    value={basicData.email}
                    onChange={(e) => setBasicData({ ...basicData, email: e.target.value })}
                    className="input-styled"
                    placeholder="jan@email.pl"
                  />
                </div>
              </div>
            </div>

            {/* Toggle pełnych danych */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full py-3 border border-border rounded-lg font-body text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Ukryj pełny formularz
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Pokaż pełny formularz (bank + PDF)
                </>
              )}
            </button>

            {/* PEŁNE DANE */}
            {isExpanded && (
              <div className="space-y-7 pt-4 border-t border-border animate-fade-in">
                {/* DANE KLIENTA */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Dane klienta</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Typ klienta</label>
                      <select
                        value={data.clientType}
                        onChange={(e) => setData({ ...data, clientType: e.target.value as "private" | "jdg" })}
                        className="select-styled"
                      >
                        <option value="private">Osoba prywatna</option>
                        <option value="jdg">Jednoosobowa działalność gospodarcza</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Drugie imię</label>
                      <input
                        type="text"
                        value={data.secondName}
                        onChange={(e) => setData({ ...data, secondName: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Nazwisko rodowe matki</label>
                    <input
                      type="text"
                      value={data.mothersMaidenName}
                      onChange={(e) => setData({ ...data, mothersMaidenName: e.target.value })}
                      className="input-styled"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">PESEL</label>
                      <input
                        type="text"
                        value={data.pesel}
                        onChange={(e) => setData({ ...data, pesel: e.target.value })}
                        className="input-styled"
                        placeholder="11 cyfr"
                        inputMode="numeric"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Data urodzenia</label>
                      <input
                        type="date"
                        value={data.birthDate}
                        onChange={(e) => setData({ ...data, birthDate: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Stan cywilny</label>
                      <select
                        value={data.maritalStatus}
                        onChange={(e) => setData({ ...data, maritalStatus: e.target.value })}
                        className="select-styled"
                      >
                        <option value="">Wybierz...</option>
                        {maritalStatuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Obywatelstwo</label>
                      <input
                        type="text"
                        value={data.citizenship}
                        onChange={(e) => setData({ ...data, citizenship: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Państwo urodzenia</label>
                      <input
                        type="text"
                        value={data.countryOfBirth}
                        onChange={(e) => setData({ ...data, countryOfBirth: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                  </div>
                </div>

                {/* DOKUMENT */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Dokument tożsamości</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Typ dokumentu</label>
                      <select
                        value={data.idDocType}
                        onChange={(e) => setData({ ...data, idDocType: e.target.value })}
                        className="select-styled"
                      >
                        <option value="">Wybierz...</option>
                        {idDocTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Nr dokumentu</label>
                      <input
                        type="text"
                        value={data.idDocNumber}
                        onChange={(e) => setData({ ...data, idDocNumber: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Organ wydający dokument</label>
                    <input
                      type="text"
                      value={data.idDocIssuer}
                      onChange={(e) => setData({ ...data, idDocIssuer: e.target.value })}
                      className="input-styled"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Data wydania</label>
                      <input
                        type="date"
                        value={data.idDocIssueDate}
                        onChange={(e) => setData({ ...data, idDocIssueDate: e.target.value })}
                        className="input-styled"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Data ważności</label>
                      <input
                        type="date"
                        value={data.idDocExpiryDate}
                        onChange={(e) => setData({ ...data, idDocExpiryDate: e.target.value })}
                        className="input-styled"
                        disabled={data.idDocNoExpiry}
                      />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.idDocNoExpiry}
                          onChange={(e) => setData({ ...data, idDocNoExpiry: e.target.checked })}
                          className="checkbox-styled"
                        />
                        <span className="font-body text-sm">Bezterminowo</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* PRAWO JAZDY */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Prawo jazdy</h3>

                  <div className="grid sm:grid-cols-2 gap-4 items-start">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Nr prawa jazdy</label>
                      <input
                        type="text"
                        value={data.drivingLicenseNumber}
                        onChange={(e) => setData({ ...data, drivingLicenseNumber: e.target.value })}
                        className="input-styled"
                        disabled={data.noDrivingLicense}
                      />
                      <label className="flex items-center gap-2 mt-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.noDrivingLicense}
                          onChange={(e) => setData({ ...data, noDrivingLicense: e.target.checked })}
                          className="checkbox-styled"
                        />
                        <span className="font-body text-sm">Brak</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* ADRES */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Adres zamieszkania</h3>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Kod pocztowy</label>
                      <input
                        type="text"
                        value={data.addressPostalCode}
                        onChange={(e) => setData({ ...data, addressPostalCode: e.target.value })}
                        className="input-styled"
                        placeholder="00-000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Miejscowość</label>
                      <input
                        type="text"
                        value={data.addressCity}
                        onChange={(e) => setData({ ...data, addressCity: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Ulica i numer</label>
                      <input
                        type="text"
                        value={data.addressStreetAndNo}
                        onChange={(e) => setData({ ...data, addressStreetAndNo: e.target.value })}
                        className="input-styled"
                        placeholder="np. Kwiatowa 10/2"
                      />
                    </div>
                  </div>
                </div>

                {/* DOCHÓD */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Źródło dochodu</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Forma zatrudnienia</label>
                      <select
                        value={data.employmentType}
                        onChange={(e) => setData({ ...data, employmentType: e.target.value })}
                        className="select-styled"
                      >
                        <option value="">Wybierz...</option>
                        {employmentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">
                        Dochód łączny netto (średnia z ostatnich 6 m-cy)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={data.netIncome6mAvg}
                        onChange={(e) => setData({ ...data, netIncome6mAvg: e.target.value })}
                        className="input-styled"
                        placeholder="np. 5500"
                      />
                    </div>
                  </div>
                </div>

                {/* PRACODAWCA */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Miejsce osiągania dochodu</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Nazwa</label>
                      <input
                        type="text"
                        value={data.employerName}
                        onChange={(e) => setData({ ...data, employerName: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">NIP pracodawcy/firmy</label>
                      <input
                        type="text"
                        value={data.employerNip}
                        onChange={(e) => setData({ ...data, employerNip: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Telefon</label>
                      <input
                        type="tel"
                        value={data.employerPhone}
                        onChange={(e) => setData({ ...data, employerPhone: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Stanowisko</label>
                      <input
                        type="text"
                        value={data.position}
                        onChange={(e) => setData({ ...data, position: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Kod pocztowy</label>
                      <input
                        type="text"
                        value={data.employerPostalCode}
                        onChange={(e) => setData({ ...data, employerPostalCode: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Miejscowość</label>
                      <input
                        type="text"
                        value={data.employerCity}
                        onChange={(e) => setData({ ...data, employerCity: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Ulica i numer</label>
                      <input
                        type="text"
                        value={data.employerStreetAndNo}
                        onChange={(e) => setData({ ...data, employerStreetAndNo: e.target.value })}
                        className="input-styled"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Data zatrudnienia</label>
                    <input
                      type="date"
                      value={data.employmentStartDate}
                      onChange={(e) => setData({ ...data, employmentStartDate: e.target.value })}
                      className="input-styled"
                    />
                  </div>
                </div>

                {/* OBCIĄŻENIA */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Obciążenia / limity</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">
                        Miesięczne łączne obciążenia finansowe
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={data.monthlyObligations}
                        onChange={(e) => setData({ ...data, monthlyObligations: e.target.value })}
                        className="input-styled"
                        placeholder="np. 1200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Ilość osób na utrzymaniu</label>
                      <input
                        type="number"
                        min="0"
                        value={data.dependentsCount}
                        onChange={(e) => setData({ ...data, dependentsCount: e.target.value })}
                        className="input-styled"
                        placeholder="np. 1"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">
                        Posiadane limity w rachunkach – suma
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={data.accountLimitsSum}
                        onChange={(e) => setData({ ...data, accountLimitsSum: e.target.value })}
                        className="input-styled"
                        placeholder="np. 5000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">
                        Posiadane limity na kartach kredytowych – suma
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={data.cardLimitsSum}
                        onChange={(e) => setData({ ...data, cardLimitsSum: e.target.value })}
                        className="input-styled"
                        placeholder="np. 8000"
                      />
                    </div>
                  </div>
                </div>

                {/* POJAZD */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Pojazd</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Typ pojazdu</label>
                      <select
                        value={data.vehicleType}
                        onChange={(e) => setData({ ...data, vehicleType: e.target.value })}
                        className="select-styled"
                      >
                        {vehicleTypes.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Marka i model</label>
                      <input
                        type="text"
                        value={data.vehicleBrandModel}
                        onChange={(e) => setData({ ...data, vehicleBrandModel: e.target.value })}
                        className="input-styled"
                        placeholder="np. Skoda Octavia"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Rok produkcji</label>
                      <input
                        type="number"
                        min="1900"
                        max="2100"
                        value={data.vehicleYear}
                        onChange={(e) => setData({ ...data, vehicleYear: e.target.value })}
                        className="input-styled"
                        placeholder="2022"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Cena samochodu (brutto)</label>
                      <input
                        type="number"
                        min="0"
                        value={data.vehiclePriceBrutto}
                        onChange={(e) => setData({ ...data, vehiclePriceBrutto: e.target.value })}
                        className="input-styled"
                        placeholder="80000"
                      />
                    </div>
                  </div>
                </div>

                {/* KREDYT */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Kredyt</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Kwota kredytu</label>
                      <input
                        type="number"
                        min="0"
                        value={data.loanAmount}
                        onChange={(e) => setData({ ...data, loanAmount: e.target.value })}
                        className="input-styled"
                        placeholder="70000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Wpłata własna (0 jeśli brak)</label>
                      <input
                        type="number"
                        min="0"
                        value={data.downPayment}
                        onChange={(e) => setData({ ...data, downPayment: e.target.value })}
                        className="input-styled"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 items-start">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Okres kredytowania (raty)</label>
                      <select
                        value={data.months}
                        onChange={(e) => setData({ ...data, months: e.target.value })}
                        className="select-styled"
                      >
                        {ratyOptions.map((m) => (
                          <option key={m} value={m}>
                            {m} rat
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={data.wantsInsurance}
                          onChange={(e) => setData({ ...data, wantsInsurance: e.target.checked })}
                          className="checkbox-styled"
                        />
                        <span className="font-body text-sm">Czy chcesz ubezpieczyć kredyt?</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* SPŁATA */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Spłata kredytu</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Forma spłaty</label>
                      <select
                        value={data.paymentMethod}
                        onChange={(e) => setData({ ...data, paymentMethod: e.target.value as "transfer" | "auto" })}
                        className="select-styled"
                      >
                        <option value="transfer">Własne przelewy bankowe (10 zł/mies.)</option>
                        <option value="auto">Automatyczne obciążenie rachunku (5 zł/mies.)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Dzień spłaty</label>
                      <select
                        value={data.paymentDay}
                        onChange={(e) => setData({ ...data, paymentDay: e.target.value })}
                        className="select-styled"
                      >
                        <option value="10">10 dzień miesiąca</option>
                        <option value="20">20 dzień miesiąca</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ZGODY (BANK) — TAK/NIE */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Zgody (bank)</h3>

                  <div className="space-y-3">
                    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-center">
                      <p className="font-body text-sm text-muted-foreground">
                        Wyrażam zgodę na wystąpienie przez VeloBank S.A. z siedzibą w Warszawie.
                      </p>
                      <select
                        value={consents.veloBankQuery}
                        onChange={(e) => setConsents({ ...consents, veloBankQuery: e.target.value as YesNo })}
                        className="select-styled"
                      >
                        {yesNoOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-center">
                      <p className="font-body text-sm text-muted-foreground">
                        Wyrażam zgodę na wystąpienie przez VeloBank do Krajowego Rejestru Długów BIG S.A. (Wrocław).
                      </p>
                      <select
                        value={consents.bigKrdQuery}
                        onChange={(e) => setConsents({ ...consents, bigKrdQuery: e.target.value as YesNo })}
                        className="select-styled"
                      >
                        {yesNoOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-center">
                      <p className="font-body text-sm text-muted-foreground">
                        Wyrażam zgodę na wystąpienie przez VeloBank do ERIF BIG (Warszawa).
                      </p>
                      <select
                        value={consents.erifBigQuery}
                        onChange={(e) => setConsents({ ...consents, erifBigQuery: e.target.value as YesNo })}
                        className="select-styled"
                      >
                        {yesNoOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-center">
                      <p className="font-body text-sm text-muted-foreground">
                        Wyrażam zgodę na weryfikację informacji Klienta dot. sytuacji prawnej/finansowej/majątkowej (w tym miejsca
                        prowadzenia działalności).
                      </p>
                      <select
                        value={consents.verifyBusinessInfo}
                        onChange={(e) => setConsents({ ...consents, verifyBusinessInfo: e.target.value as YesNo })}
                        className="select-styled"
                      >
                        {yesNoOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-center">
                      <p className="font-body text-sm text-muted-foreground">Zgoda na weryfikację numeru PESEL.</p>
                      <select
                        value={consents.verifyPesel}
                        onChange={(e) => setConsents({ ...consents, verifyPesel: e.target.value as YesNo })}
                        className="select-styled"
                      >
                        {yesNoOptions.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ZGODY OGÓLNE */}
            <div className="space-y-3 pt-4 border-t border-border">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consents.rodo}
                  onChange={(e) => setConsents({ ...consents, rodo: e.target.checked })}
                  className="checkbox-styled mt-0.5"
                />
                <span className="font-body text-sm text-muted-foreground">
                  Zapoznałem/am się z klauzulą informacyjną RODO i akceptuję jej treść *
                </span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.contactOffer}
                  onChange={(e) => setConsents({ ...consents, contactOffer: e.target.checked })}
                  className="checkbox-styled mt-0.5"
                />
                <span className="font-body text-sm text-muted-foreground">Wyrażam zgodę na kontakt w sprawie oferty</span>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consents.acceptRegulations}
                  onChange={(e) => setConsents({ ...consents, acceptRegulations: e.target.checked })}
                  className="checkbox-styled mt-0.5"
                />
                <span className="font-body text-sm text-muted-foreground">
                  Akceptuję regulamin i wymagane obowiązki informacyjne *
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-lg hover:bg-primary/90 transition-all shadow-cta disabled:opacity-70"
            >
              {isSubmitting ? "Wysyłam..." : "Wyślij wniosek"}
            </button>

            <p className="text-center text-gold font-heading font-semibold text-sm">Bez zobowiązań • Bez opłat</p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;