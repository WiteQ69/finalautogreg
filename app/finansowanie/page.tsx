"use client";

import { useMemo, useState } from "react";
import { CheckCircle } from "lucide-react";

type YesNo = "" | "TAK" | "NIE";
const yesNoOptions: { value: YesNo; label: string }[] = [
  { value: "", label: "Wybierz..." },
  { value: "TAK", label: "TAK" },
  { value: "NIE", label: "NIE" },
];

const umowaTypeOther = [
  { value: "", label: "Wybierz..." },
  { value: "Etat_1_1", label: "Etat 1/1 (pełny etat)" },
  { value: "Etat_3_4", label: "Etat 3/4" },
  { value: "Etat_1_2", label: "Etat 1/2" },
  { value: "Etat_1_4", label: "Etat 1/4" },
]


  const employmentTypes =[
  { value: "Umowa o pracę – na czas nieokreślony", label: "Umowa o pracę – na czas nieokreślony" },
  { value: "Umowa o pracę – na czas określony", label: "Umowa o pracę – na czas określony" },
  { value: "Umowa o pracę – okres próbny", label: "Umowa o pracę – okres próbny" },
  { value: "Umowa zlecenie", label: "Umowa zlecenie" },
  { value: "Umowa o dzieło", label: "Umowa o dzieło" },
  { value: "Renta", label: "Renta" },
  { value: "Emerytura", label: "Emerytura" },
  { value: "INNE", label: "Inne (wpisz)" },
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

const ratyOptions = [24, 36, 48, 60, 72, 84, 96, 108];

const housingTypes = ["Dom", "Mieszkanie"];
const ownershipForms = [
  { value: "", label: "Wybierz..." },
  { value: "Właściciel z hipoteką", label: "Właściciel z hipoteką" },
  { value: "Właściciel bez hipoteki", label: "Właściciel bez hipoteki" },
  { value: "Najemca", label: "Najemca" },
  { value: "Zamieszkuje u rodziny", label: "Zamieszkuje u rodziny" },
];

const LeadForm = () => {
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
    propertySeparation: "" as YesNo, // ✅ rozdzielność majątkowa (tylko dla żonaty/zamężna)
    citizenship: "Polska",
    countryOfBirth: "Polska",

    // Dzieci
    childrenCount: "",

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

    // Adres zameldowania ✅
    registeredPostalCode: "",
    registeredCity: "",
    registeredStreetAndNo: "",

    // Adres zamieszkania
    addressPostalCode: "",
    addressCity: "",
    addressStreetAndNo: "",

    // Mieszkanie/dom + własność ✅
    housingType: "Mieszkanie",
    housingOwnershipForm: "",
    housingOwnershipOther: "",
    housingIsMortgagedOrCeded: "" as YesNo, // ✅ hipoteka/cesja

    // Źródło dochodu
    employmentType: "",
    employmentTypeOther: "",
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
    insuranceOption: "NONE" as "NONE" | "LIFE" | "EXTRA_LIFE" | "TP" | "LIFE_TP" | "EXTRA_LIFE_TP",

    // Spłata
    paymentMethod: "auto" as "transfer" | "auto",
    paymentDay: "10",
  });

  const [consents, setConsents] = useState({
  // podstawowe
  rodo: false,
  contactOffer: false,
  acceptRegulations: false,

  // stare zgody bankowe (jeśli nadal potrzebne)
  veloBankQuery: "" as YesNo,
  bigKrdQuery: "" as YesNo,
  erifBigQuery: "" as YesNo,
  verifyBusinessInfo: "" as YesNo,
  verifyPesel: "" as YesNo,

  // ===== COFIDIS – MARKETING =====
  marketingPhone: "" as YesNo,
  marketingEmail: "" as YesNo,
  marketingSms: "" as YesNo,
  marketingProfiling: "" as YesNo,
  marketingPartners: "" as YesNo,

  // ===== COFIDIS – BIG / BIK =====
  bigDataTransfer: "" as YesNo,
  bigQuery: "" as YesNo,
  bigLast12Months: "" as YesNo,

  bikQuery: "" as YesNo,
  bikDuringContract: "" as YesNo,
  bikAfterContract: "" as YesNo,

  // ===== COFIDIS – AIS =====
  aisConsent: "" as YesNo,
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
      ...data,
      // jeśli INNE – dopnij wartość tekstową
      employmentTypeFinal: data.employmentType === "INNE" ? data.employmentTypeOther : data.employmentType,
      housingOwnershipFinal:
        data.housingOwnershipForm === "INNE" ? data.housingOwnershipOther : data.housingOwnershipForm,
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "leadform_full",
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

  const isMarried = data.maritalStatus === "Żonaty/Zamężna";

  if (isSuccess) {
    return (
      <section id="wniosek" className="bg-background section-padding">
        <div className="container-narrow max-w-2xl mx-auto w-full text-center py-16">
          <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Wniosek został pomyślnie wysłany!</h2>
          <p className="text-lg text-muted-foreground font-body">
            Dziękujemy za zaufanie. Obecnie analizujemy Twoje dane i przygotowujemy propozycję rat dopasowanych do Twoich
            możliwości.
          </p>
          <p className="text-lg text-muted-foreground font-body mt-2">
            Skontaktujemy się z Tobą maksymalnie w ciągu 24 godzin roboczych.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="wniosek" className="bg-background section-padding">
      <div className="container-narrow max-w-2xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">Wniosek</h2>
          <p className="text-muted-foreground font-body">Uzupełnij dane. Formularz pełny (bank + PDF).</p>
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

            {errorMsg && (
              <div className="p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm font-body">
                {errorMsg}
              </div>
            )}

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
                  <label className="block text-sm font-body font-medium mb-1.5">Email *</label>
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

            {/* PEŁNE DANE */}
            <div className="space-y-7 pt-4 border-t border-border">
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
                      onChange={(e) => {
                        const next = e.target.value;
                        setData((prev) => ({
                          ...prev,
                          maritalStatus: next,
                          propertySeparation: next === "Żonaty/Zamężna" ? prev.propertySeparation : ("" as YesNo),
                        }));
                      }}
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

                {isMarried && (
                  <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-center">
                    <p className="font-body text-sm text-muted-foreground">
                      Czy jest rozdzielność majątkowa? (dot. osób żonatych/zamężnych)
                    </p>
                    <select
                      value={data.propertySeparation}
                      onChange={(e) => setData({ ...data, propertySeparation: e.target.value as YesNo })}
                      className="select-styled"
                    >
                      {yesNoOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Liczba dzieci</label>
                    <input
                      type="number"
                      min="0"
                      value={data.childrenCount}
                      onChange={(e) => setData({ ...data, childrenCount: e.target.value })}
                      className="input-styled"
                      placeholder="np. 2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Obywatelstwo</label>
                    <input
                      type="text"
                      value={data.citizenship}
                      onChange={(e) => setData({ ...data, citizenship: e.target.value })}
                      className="input-styled"
                    />
                  </div>
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

              {/* ADRES ZAMELDOWANIA ✅ */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg">Adres zameldowania</h3>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Kod pocztowy</label>
                    <input
                      type="text"
                      value={data.registeredPostalCode}
                      onChange={(e) => setData({ ...data, registeredPostalCode: e.target.value })}
                      className="input-styled"
                      placeholder="00-000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Miejscowość</label>
                    <input
                      type="text"
                      value={data.registeredCity}
                      onChange={(e) => setData({ ...data, registeredCity: e.target.value })}
                      className="input-styled"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Ulica i numer</label>
                    <input
                      type="text"
                      value={data.registeredStreetAndNo}
                      onChange={(e) => setData({ ...data, registeredStreetAndNo: e.target.value })}
                      className="input-styled"
                      placeholder="np. Kwiatowa 10/2"
                    />
                  </div>
                </div>
              </div>

              {/* ADRES ZAMIESZKANIA */}
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

              {/* DOM/MIESZKANIE + WŁASNOŚĆ ✅ */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg">Warunki mieszkaniowe</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Dom / mieszkanie</label>
                    <select
                      value={data.housingType}
                      onChange={(e) => setData({ ...data, housingType: e.target.value })}
                      className="select-styled"
                    >
                      {housingTypes.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Forma własności</label>
                    <select
                      value={data.housingOwnershipForm}
                      onChange={(e) =>
                        setData({
                          ...data,
                          housingOwnershipForm: e.target.value,
                          housingOwnershipOther: e.target.value === "INNE" ? data.housingOwnershipOther : "",
                        })
                      }
                      className="select-styled"
                    >
                      {ownershipForms.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {data.housingOwnershipForm === "INNE" && (
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Wpisz formę własności</label>
                    <input
                      type="text"
                      value={data.housingOwnershipOther}
                      onChange={(e) => setData({ ...data, housingOwnershipOther: e.target.value })}
                      className="input-styled"
                      placeholder="np. lokal komunalny / TBS / itp."
                    />
                  </div>
                )}

                <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-center">
                  <p className="font-body text-sm text-muted-foreground">Czy lokal/dom jest obciążony hipoteką / cesją?</p>
                  <select
                    value={data.housingIsMortgagedOrCeded}
                    onChange={(e) => setData({ ...data, housingIsMortgagedOrCeded: e.target.value as YesNo })}
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

              {/* DOCHÓD ✅ (etat 1/1 itd + inne->input) */}
              <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg">Źródło dochodu</h3>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Forma zatrudnienia</label>
                    <select
                      value={data.employmentType}
                      onChange={(e) =>
                        setData({
                          ...data,
                          employmentType: e.target.value,
                          employmentTypeOther: e.target.value === "INNE" ? data.employmentTypeOther : "",
                        })
                      }
                      className="select-styled"
                    >
                      {employmentTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  </div>
                  {data.employmentType === "INNE" && (
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Wpisz formę zatrudnienia</label>
                    <input
                      type="text"
                      value={data.employmentTypeOther}
                      onChange={(e) => setData({ ...data, employmentTypeOther: e.target.value })}
                      className="input-styled"
                      placeholder="np. kontrakt B2B / działalność / inne"
                    />
                  </div>
                )}
<div>
  <label className="block text-sm font-body font-medium mb-1.5">Umowa</label>
  <select
    value={data.employmentType}
    onChange={(e) =>
      setData({
        ...data,
        employmentType: e.target.value,
        employmentTypeOther: e.target.value === "INNE" ? data.employmentTypeOther : "",
      })
    }
    className="select-styled mb-1.5"
  >
    {umowaTypeOther.map((t) => (
      <option key={t.value} value={t.value}>
        {t.label}
      </option>
    ))}
  </select>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">
                      Dochód łączny netto (średnia z ostatnich 3 m-cy)
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

              {/* MIEJSCE DOCHODU */}
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
                    <label className="block text-sm font-body font-medium mb-1.5">Miesięczne łączne obciążenia finansowe</label>
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
                    <label className="block text-sm font-body font-medium mb-1.5">Czy posiadasz obecnie rozpoczęte transakcje z odroczoną płatnością?</label>
                    <input
                      type="text"
                      
                      value={data.accountLimitsSum}
                      onChange={(e) => setData({ ...data, accountLimitsSum: e.target.value })}
                      className="input-styled"
                      placeholder="TAK/NIE"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-body font-medium mb-1.5">Ilość transakcji z odroczoną płatnością - suma</label>
                    <input
                      type="number"
                      min="0"
                      value={data.cardLimitsSum}
                      onChange={(e) => setData({ ...data, cardLimitsSum: e.target.value })}
                      className="input-styled"
                      placeholder="np. 2"
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
 <div>
  <label className="block text-sm font-body font-medium mb-1.5">
    Wybierz ochronę ubezpieczeniową
  </label>

  <select
    value={data.insuranceOption}
    onChange={(e) => setData({ ...data, insuranceOption: e.target.value as typeof data.insuranceOption })}
    className="select-styled"
  >
   
    <option value="NONE">Brak ochrony ubezpieczeniowej</option>
    <option value="LIFE">LIFE - pewna spłata w razie śmierci</option>
    <option value="EXTRA_LIFE">
      EXTRA LIFE - pewna spłata w razie śmierci + niezdolność do pracy
    </option>
    <option value="TP">TP - od utraty dochodu + niezdolność do pracy</option>
    <option value="LIFE_TP">LIFE + TP</option>
    <option value="EXTRA_LIFE_TP">EXTRA LIFE + TP</option>
  </select>
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
                      <option value="transfer">Samodzielny przelew bankowy (10 zł/mies.)</option>
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
            </div>

             {/* ZGODY (COFIDIS) */}
<div className="space-y-4">
  <h3 className="font-heading font-bold text-lg">Zgody</h3>

  <div className="space-y-3">
    {/* 1 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Marketing telefoniczny
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na otrzymywanie od Cofidis komunikacji marketingowej dotyczącej produktów i usług Cofidis za pomocą połączeń
          telefonicznych.
        </p>
      </details>

      <select
        value={consents.marketingPhone}
        onChange={(e) => setConsents({ ...consents, marketingPhone: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 2 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Marketing elektroniczny
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na otrzymywanie od Cofidis komunikacji marketingowej dotyczącej produktów i usług Cofidis drogą elektroniczną na adres
          poczty elektronicznej.
        </p>
      </details>

      <select
        value={consents.marketingEmail}
        onChange={(e) => setConsents({ ...consents, marketingEmail: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 3 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Marketing SMS
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na otrzymywanie od Cofidis komunikacji marketingowej dotyczącej produktów i usług Cofidis za pomocą SMS/MMS.
        </p>
      </details>

      <select
        value={consents.marketingSms}
        onChange={(e) => setConsents({ ...consents, marketingSms: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 4 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Marketing i profilowanie
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na przetwarzanie moich danych i ich profilowanie w celach marketingowych przez Cofidis, co wiąże się z otrzymywaniem od
          Cofidis komunikacji marketingowej dopasowanej do mnie, moich oczekiwań i możliwości finansowych.
        </p>
      </details>

      <select
        value={consents.marketingProfiling}
        onChange={(e) => setConsents({ ...consents, marketingProfiling: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 5 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Partnerzy współpracujący
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na otrzymywanie od Cofidis komunikacji marketingowej dotyczącej produktów i usług partnerów biznesowych, z którymi
          współpracuje Cofidis (lista partnerów: Partnerzywspolpracujacy | Cofidis PL) za pomocą: połączeń telefonicznych, poczty elektronicznej i
          SMS/MMS.
        </p>
      </details>

      <select
        value={consents.marketingPartners}
        onChange={(e) => setConsents({ ...consents, marketingPartners: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 6 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Przekazywanie moich danych do BIG
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na przekazanie przez Cofidis do Krajowego Biura Informacji Gospodarczej z siedzibą w Krakowie, Biura Informacji
          Gospodarczej InfoMonitor S.A. z siedzibą w Warszawie, ERIF Biura Informacji Gospodarczej S.A. z siedzibą w Warszawie oraz Krajowego
          Rejestru Długów – Biura Informacji Gospodarczej S.A. z siedzibą we Wrocławiu moich danych osobowych i informacji dotyczących moich
          zobowiązań wynikających z umowy o udzielenie finansowania, zawartej z Cofidis.
        </p>
      </details>

      <select
        value={consents.bigDataTransfer}
        onChange={(e) => setConsents({ ...consents, bigDataTransfer: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 7 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Przekazywanie danych do BIK po wygaśnięciu umowy
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na przetwarzanie przez Cofidis do Biura Informacji Kredytowej S.A. z siedzibą w Warszawie dotyczących mnie informacji
          stanowiących tajemnicę bankową, po wygaśnięciu moich zobowiązań wynikających z Umowy, w celu zdolności kredytowej i analizy ryzyka
          kredytowego przez okres nie dłuższy niż 5 lat od dnia wygaśnięcia.
        </p>
      </details>

      <select
        value={consents.bikAfterContract}
        onChange={(e) => setConsents({ ...consents, bikAfterContract: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 8 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Zgoda na weryfikację w BIK
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na przekazanie przez Cofidis do Biura Informacji Kredytowej S.A. z siedzibą w Warszawie moich danych osobowych
          (zapytanie) w celu pozyskania informacji mnie dotyczących, w tym prowadzonych przeze mnie działalności gospodarczych, przetwarzanych w
          Biurze Informacji Kredytowej S.A. dla oceny zdolności kredytowej i analizy ryzyka kredytowego oraz przetwarzanie w tym celu przez Biuro
          Informacji Kredytowej S.A. moich danych osobowych przekazanych przez Cofidis w zapytaniu, przez okres nie dłuższy niż 2 lata, w tym ich
          udostępnianie bankom, instytucjom ustawowo upoważnionym do udzielania kredytów, instytucjom kredytowym oraz innym podmiotom na
          podstawie udzielonej im przeze mnie zgody
        </p>
      </details>

      <select
        value={consents.bikQuery}
        onChange={(e) => setConsents({ ...consents, bikQuery: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 9 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Przekazywanie moich danych do BIK w trakcie umowy
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na przekazywanie przez Cofidis do Biura Informacji Kredytowej S.A. z siedzibą w Warszawie moich danych osobowych i
          informacji dotyczących mojego zobowiązania wynikającego z zawartej z Cofidis umowy, oraz przetwarzanie tych informacji przez BIK do dnia
          odwołania zgody, nie dłużej jednak niż 5 lat po wygaśnięciu zobowiązania w celu oceny zdolności kredytowej i analizy ryzyka kredytowego, w
          tym ich udostępnianie bankom, instytucjom ustawowo upoważnionym do udzielania kredytów, instytucjom kredytowym oraz innym podmiotom
          upoważnionym na podstawie udzielonej im przeze mnie zgody. Niniejsza zgoda obejmuje również udostępnianie Cofidis przez Biuro
          Informacji Kredytowej S.A. danych mnie dotyczących, w tym prowadzonych przeze mnie działalności gospodarczych, przetwarzanych w BIK
          dla oceny zdolności kredytowej i analizy ryzyka kredytowego w trakcie obowiązywania zawartej z Cofidis umowy.
        </p>
      </details>

      <select
        value={consents.bikDuringContract}
        onChange={(e) => setConsents({ ...consents, bikDuringContract: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 10 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Zapytania o moje dane w BIG-ach
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Upoważniam Cofidis do uzyskania z Krajowego Biura Informacji Gospodarczej z siedzibą w Krakowie, Biura Informacji Gospodarczej
          InfoMonitor S.A. z siedzibą w Warszawie, ERIF Biura Informacji Gospodarczej S.A. z siedzibą w Warszawie oraz Krajowego Rejestru Długów
          – Biura Informacji Gospodarczej S.A. z siedzibą we Wrocławiu dotyczących mnie informacji gospodarczych dla oceny wiarygodności płatniczej
          oraz oceny ryzyka związanego ze spłatą zobowiązań.
        </p>
      </details>

      <select
        value={consents.bigQuery}
        onChange={(e) => setConsents({ ...consents, bigQuery: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 11 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Moje zapytania w BIG ostatnie 12 miesięcy×
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Upoważniam Cofidis do pozyskania z Krajowego Biura Informacji Gospodarczej z siedzibą w Krakowie, Biura Informacji Gospodarczej
          InfoMonitor S.A. z siedzibą w Warszawie, ERIF Biura Informacji Gospodarczej S.A. z siedzibą w Warszawie oraz Krajowego Rejestru Długów
          – Biura Informacji Gospodarczej S.A. z siedzibą we Wrocławiu informacji dotyczących zapytań składanych na mój temat do Rejestrów BIG w
          ciągu ostatnich 12 miesięcy.
        </p>
      </details>

      <select
        value={consents.bigLast12Months}
        onChange={(e) => setConsents({ ...consents, bigLast12Months: e.target.value as YesNo })}
        className="select-styled"
      >
        {yesNoOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>

    {/* 12 */}
    <div className="grid sm:grid-cols-[1fr_220px] gap-3 items-start">
      <details className="rounded-lg border border-border p-3 bg-background">
        <summary className="cursor-pointer select-none font-body text-sm text-foreground font-medium">
          Zgoda wyraźna na AIS
        </summary>
        <p className="mt-2 font-body text-sm text-muted-foreground whitespace-pre-line">
          Wyrażam zgodę na przetwarzanie przez Cofidis moich danych osobowych, w tym danych o historii transakcji z mojego konta bankowego za
          okres ostatnich 90 dni w celu przeprowadzenia oceny mojej oceny zdolności kredytowej i analizy ryzyka kredytowego.
        </p>
      </details>

      <select
        value={consents.aisConsent}
        onChange={(e) => setConsents({ ...consents, aisConsent: e.target.value as YesNo })}
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
                <span className="font-body text-sm text-muted-foreground">Akceptuję regulamin i wymagane obowiązki informacyjne *</span>
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