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
const vehicleOrigins = ["Polski salon", "Importowany"];
const fuelTypes = [
  "Benzyna",
  "Diesel",
  "LPG",
  "Hybryda",
  "Plug-in Hybrid",
  "Elektryczny",
  "CNG",
  "Wodór",
  "Inne",
];
const sellerTypes = ["Firma", "Osoba prywatna"];

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

  const [basicData, setBasicData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    consent: false,
    honeypot: "",
  });

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
    vehicleOrigin: "",
    engineCapacity: "",
    fuelType: "",
    vin: "",
    firstRegistrationDate: "",

    // Sprzedawca pojazdu
    sellerType: "Firma",
    sellerTaxIdOrPesel: "",
    sellerName: "",
    sellerBankAccount: "",

    // Kredyt
    loanAmount: "",
    downPayment: "",
    months: "60",
    wantsInsurance: false,

    // Spłata
    paymentMethod: "auto" as "transfer" | "auto",
    paymentDay: "10",
    installmentBankAccount: "", // rachunek do automatycznego pobierania rat
  });

  const [consents, setConsents] = useState({
    rodo: false,
    contactOffer: false,
    veloBankQuery: "" as YesNo,
    bigKrdQuery: "" as YesNo,
    erifBigQuery: "" as YesNo,
    verifyBusinessInfo: "" as YesNo,
    verifyPesel: "" as YesNo,
    acceptRegulations: false,
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

    const form = {
      ...basicData,
      ...(isExpanded ? data : {}),
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
          </p>
          <p>Skontaktujemy się z Tobą maksymalnie w ciągu 24 godzin roboczych.</p>
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
          <p className="text-muted-foreground font-body">
            Uzupełnij dane. Formularz scalony (PDF + bank).
          </p>
        </div>

        <div className="card-elevated p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="website"
              value={basicData.honeypot}
              onChange={(e) => setBasicData({ ...basicData, honeypot: e.target.value })}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

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

            {isExpanded && (
              <div className="space-y-7 pt-4 border-t border-border animate-fade-in">
                {/* ...pozostawiasz swoje wcześniejsze sekcje bez zmian... */}

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

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Pochodzenie pojazdu</label>
                      <select
                        value={data.vehicleOrigin}
                        onChange={(e) => setData({ ...data, vehicleOrigin: e.target.value })}
                        className="select-styled"
                      >
                        <option value="">Wybierz...</option>
                        {vehicleOrigins.map((origin) => (
                          <option key={origin} value={origin}>
                            {origin}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Pojemność silnika (cm³)</label>
                      <input
                        type="number"
                        min="0"
                        value={data.engineCapacity}
                        onChange={(e) => setData({ ...data, engineCapacity: e.target.value })}
                        className="input-styled"
                        placeholder="np. 1998"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Rodzaj paliwa</label>
                      <select
                        value={data.fuelType}
                        onChange={(e) => setData({ ...data, fuelType: e.target.value })}
                        className="select-styled"
                      >
                        <option value="">Wybierz...</option>
                        {fuelTypes.map((fuel) => (
                          <option key={fuel} value={fuel}>
                            {fuel}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Nr VIN</label>
                      <input
                        type="text"
                        value={data.vin}
                        onChange={(e) => setData({ ...data, vin: e.target.value.toUpperCase() })}
                        className="input-styled"
                        placeholder="17 znaków"
                        maxLength={17}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">
                      Data pierwszej rejestracji
                    </label>
                    <input
                      type="date"
                      value={data.firstRegistrationDate}
                      onChange={(e) => setData({ ...data, firstRegistrationDate: e.target.value })}
                      className="input-styled"
                    />
                  </div>
                </div>

                {/* SPRZEDAWCA */}
                <div className="space-y-4">
                  <h3 className="font-heading font-bold text-lg">Sprzedawca samochodu</h3>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">Rodzaj sprzedawcy</label>
                      <select
                        value={data.sellerType}
                        onChange={(e) => setData({ ...data, sellerType: e.target.value })}
                        className="select-styled"
                      >
                        {sellerTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">
                        {data.sellerType === "Firma" ? "NIP" : "PESEL"}
                      </label>
                      <input
                        type="text"
                        value={data.sellerTaxIdOrPesel}
                        onChange={(e) => setData({ ...data, sellerTaxIdOrPesel: e.target.value })}
                        className="input-styled"
                        placeholder={data.sellerType === "Firma" ? "10 cyfr" : "11 cyfr"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">
                      {data.sellerType === "Firma" ? "Nazwa firmy" : "Imię i nazwisko"}
                    </label>
                    <input
                      type="text"
                      value={data.sellerName}
                      onChange={(e) => setData({ ...data, sellerName: e.target.value })}
                      className="input-styled"
                      placeholder={data.sellerType === "Firma" ? "Nazwa firmy" : "Jan Kowalski"}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">
                      Numer rachunku do przelewu za zakup samochodu
                    </label>
                    <input
                      type="text"
                      value={data.sellerBankAccount}
                      onChange={(e) =>
                        setData({
                          ...data,
                          sellerBankAccount: e.target.value.replace(/\s/g, ""),
                        })
                      }
                      className="input-styled"
                      placeholder="np. 11112222333344445555666677"
                      inputMode="numeric"
                    />
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

                  {data.paymentMethod === "auto" && (
                    <div>
                      <label className="block text-sm font-body font-medium mb-1.5">
                        Numer rachunku bankowego, z którego będzie pobierana rata
                      </label>
                      <input
                        type="text"
                        value={data.installmentBankAccount}
                        onChange={(e) =>
                          setData({
                            ...data,
                            installmentBankAccount: e.target.value.replace(/\s/g, ""),
                          })
                        }
                        className="input-styled"
                        placeholder="np. 11112222333344445555666677"
                        inputMode="numeric"
                      />
                    </div>
                  )}
                </div>

                {/* ...dalej zostawiasz sekcję zgód bankowych bez zmian... */}
              </div>
            )}

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
                <span className="font-body text-sm text-muted-foreground">
                  Wyrażam zgodę na kontakt w sprawie oferty
                </span>
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

            {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-heading font-bold text-lg hover:bg-primary/90 transition-all shadow-cta disabled:opacity-70"
            >
              {isSubmitting ? "Wysyłam..." : "Wyślij wniosek"}
            </button>

            <p className="text-center text-gold font-heading font-semibold text-sm">
              Bez zobowiązań • Bez opłat
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadForm;