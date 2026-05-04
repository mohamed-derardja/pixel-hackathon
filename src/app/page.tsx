"use client";

import React, { useState } from "react";

export default function Home() {
  const [step, setStep] = useState<"language" | "gender" | "injury">("language");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [selectedZones, setSelectedZones] = useState<string[]>(["Head", "Right Lower Leg"]);
  const [isViewSwapped, setIsViewSwapped] = useState<boolean>(false);

  const handleLanguageSelect = () => {
    setStep("gender");
  };

  const handleGenderSelect = (selectedGender: "male" | "female") => {
    setGender(selectedGender);
    setStep("injury");
  };

  const toggleZone = (zone: string) => {
    setSelectedZones((prev) =>
      prev.includes(zone) ? prev.filter((z) => z !== zone) : [...prev, zone]
    );
  };

  return (
    <div className="flex-grow flex flex-col min-h-screen font-body-md antialiased">
      {/* TopAppBar */}
      <header className="bg-white font-medium tracking-tight top-0 border-b border-slate-100 shadow-sm flex justify-between items-center w-full px-8 py-4 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-sm">
            <span
              className="material-symbols-outlined text-white text-[28px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              medical_services
            </span>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tighter">
            swift triage
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-slate-400">
            <button className="hover:bg-slate-50 transition-colors active:opacity-80 duration-150 p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">fullscreen</span>
            </button>
            <button className="hover:bg-slate-50 transition-colors active:opacity-80 duration-150 p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <button className="hover:bg-slate-50 transition-colors active:opacity-80 duration-150 p-2 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
          <button className="bg-error hover:bg-on-error-container text-on-error px-6 py-3 rounded-default transition-colors active:opacity-80 duration-150 flex items-center gap-2 shadow-sm text-label-lg">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              emergency
            </span>
            Emergency Call
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col items-center justify-center p-gutter md:p-margin max-w-container-max mx-auto w-full">
        {step === "language" ? (
          <>
            <div className="text-center mb-12 max-w-2xl">
              <h1 className="text-display-md text-on-background mb-4">
                Select Your Language
              </h1>
              <p className="text-body-lg text-on-surface-variant">
                To begin your assessment, please choose a language.
              </p>
            </div>

            {/* Language Selection Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
              <LanguageCard
                code="EN"
                name="English"
                selectLabel="Select"
                onClick={handleLanguageSelect}
              />
              <LanguageCard
                code="FR"
                name="Français"
                selectLabel="Sélectionner"
                isActive
                onClick={handleLanguageSelect}
              />
              <LanguageCard
                code="AR"
                name="العربية"
                selectLabel="إختار"
                isRtl
                onClick={handleLanguageSelect}
              />
            </div>
          </>
        ) : step === "gender" ? (
          <div className="w-full max-w-container-max flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-16">
              <h1 className="text-display-md text-on-surface mb-4">
                Identify Patient Gender
              </h1>
              <p className="text-body-lg text-on-surface-variant">
                Please select the patient's gender to proceed.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
              <button
                onClick={() => handleGenderSelect("male")}
                className="group flex-1 bg-surface-container-low border border-outline/10 rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-1 active:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.99] active:shadow-inner"
              >
                <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center mb-8 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors duration-300 text-primary border border-outline/5 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[200px]"
                    style={{ fontVariationSettings: "'wght' 200" }}
                  >
                    male
                  </span>
                </div>
                <span className="text-headline-lg text-on-surface group-hover:text-primary transition-colors duration-300">
                  Male
                </span>
              </button>
              <button
                onClick={() => handleGenderSelect("female")}
                className="group flex-1 bg-surface-container-low border border-outline/10 rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-300 hover:border-primary hover:shadow-md hover:-translate-y-1 active:bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.99] active:shadow-inner"
              >
                <div className="w-40 h-40 rounded-full bg-white flex items-center justify-center mb-8 group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors duration-300 text-primary border border-outline/5 shadow-sm">
                  <span
                    className="material-symbols-outlined text-[80px]"
                    style={{ fontVariationSettings: "'wght' 200" }}
                  >
                    female
                  </span>
                </div>
                <span className="text-headline-lg text-on-surface group-hover:text-primary transition-colors duration-300">
                  Female
                </span>
              </button>
            </div>
            <button
              onClick={() => setStep("language")}
              className="mt-12 text-primary font-bold hover:underline"
            >
              Back to Language Selection
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Step Progress Bar */}
            <div className="flex items-center gap-3 mb-2">
              <button onClick={() => setStep("language")} className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-label-lg">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">1</span>
                Language
              </button>
              <div className="w-8 h-px bg-primary/20"></div>
              <button onClick={() => setStep("gender")} className="flex items-center gap-2 text-primary/60 hover:text-primary transition-colors text-label-lg">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">2</span>
                Gender
              </button>
              <div className="w-8 h-px bg-primary/20"></div>
              <div className="flex items-center gap-2 text-primary text-label-lg font-bold">
                <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</span>
                Injury Map
              </div>
            </div>

            {/* Main Layout */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Sidebar — Body Zones */}
              <aside className="w-full lg:w-72 shrink-0 bg-white border border-outline/10 rounded-2xl shadow-sm p-5 flex flex-col gap-4 h-fit lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-1">
                  <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>pin_drop</span>
                  <h2 className="text-headline-md text-on-surface">Body Zones</h2>
                </div>
                <p className="text-label-md text-on-surface-variant/70 mb-2">Tap zones to mark injuries</p>
                <div className="flex flex-col gap-1.5">
                  {["Head", "Neck", "Chest", "Abdomen", "Left Arm", "Right Arm", "Left Leg", "Right Leg", "Upper Back", "Lower Back"].map((zone) => (
                    <button
                      key={zone}
                      onClick={() => toggleZone(zone)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all duration-200 text-body-md ${selectedZones.includes(zone)
                        ? "bg-primary/10 text-primary font-semibold border border-primary/20 shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container-high/60 border border-transparent"
                        }`}
                    >
                      <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selectedZones.includes(zone) ? "border-primary bg-primary" : "border-outline/30"
                        }`}>
                        {selectedZones.includes(zone) && (
                          <span className="material-symbols-outlined text-white text-[14px]">check</span>
                        )}
                      </span>
                      {zone}
                    </button>
                  ))}
                </div>
                {selectedZones.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-outline/10">
                    <p className="text-label-md text-on-surface-variant/70 mb-2">{selectedZones.length} zone{selectedZones.length > 1 ? "s" : ""} selected</p>
                    <button onClick={() => setSelectedZones([])} className="text-error text-label-lg hover:underline transition-colors">Clear all</button>
                  </div>
                )}
              </aside>

              {/* Center — Body Map Canvas */}
              <section className="flex-grow flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-display-md text-on-surface leading-tight">Patient Anatomy</h1>
                    <p className="text-body-md text-on-surface-variant/70 mt-1 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>{gender === "male" ? "male" : "female"}</span>
                      {gender === "male" ? "Male" : "Female"} patient
                    </p>
                  </div>
                  <button
                    onClick={() => setStep("gender")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-outline/15 text-label-lg text-on-surface-variant hover:bg-surface-container-high/60 hover:border-primary/30 transition-all duration-200"
                  >
                    <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                    Change Gender
                  </button>
                </div>

                {/* Body Map Container */}
                <div className={`relative w-full bg-white border border-outline/10 rounded-2xl shadow-sm p-8 lg:p-10 flex ${isViewSwapped ? 'flex-col-reverse sm:flex-row-reverse' : 'flex-col sm:flex-row'} items-center justify-center gap-10 min-h-[750px] overflow-hidden`}>
                  {/* Decorative Grid */}
                  <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #00629d 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                  {/* Front View */}
                  <div className="relative flex-1 max-w-[420px] h-[680px] flex flex-col items-center group">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                      <h3 className="text-label-lg text-secondary font-bold uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Anterior</h3>
                    </div>
                    <div
                      className="w-full h-full relative border border-slate-200/50 bg-gradient-to-b from-slate-50/50 to-white rounded-2xl shadow-inner overflow-hidden flex items-center justify-center bg-no-repeat transition-all duration-500 hover:shadow-md hover:border-primary/20"
                      style={{
                        backgroundImage: `url('/${gender === "male" ? "man_front_side_v2" : "women_front_side_correct"}.svg')`,
                        backgroundSize: gender === "male" ? "auto 355%" : "auto 160%",
                        backgroundPosition: gender === "male" ? "center 50%" : "center 32%",
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center 40%, rgba(0, 102, 255, 0.04) 0%, transparent 60%)' }}></div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:flex flex-col items-center gap-3 z-10">
                    <div className="w-px h-48 bg-gradient-to-b from-transparent via-outline/15 to-transparent"></div>
                    <button
                      onClick={() => setIsViewSwapped(!isViewSwapped)}
                      className="w-10 h-10 rounded-full bg-white border border-outline/10 flex items-center justify-center text-on-surface-variant shadow-sm hover:text-primary hover:border-primary/30 transition-all duration-300 active:scale-90 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      title="Swap Views"
                    >
                      <span className={`material-symbols-outlined text-[20px] transition-transform duration-500 ${isViewSwapped ? 'rotate-180' : ''}`}>compare_arrows</span>
                    </button>
                    <div className="w-px h-48 bg-gradient-to-b from-transparent via-outline/15 to-transparent"></div>
                  </div>

                  {/* Back View */}
                  <div className="relative flex-1 max-w-[420px] h-[680px] flex flex-col items-center group">
                    <div className="flex items-center gap-2 mb-5">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                      <h3 className="text-label-lg text-secondary font-bold uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Posterior</h3>
                    </div>
                    <div
                      className="w-full h-full relative border border-slate-200/50 bg-gradient-to-b from-slate-50/50 to-white rounded-2xl shadow-inner overflow-hidden flex items-center justify-center bg-no-repeat transition-all duration-500 hover:shadow-md hover:border-primary/20"
                      style={{
                        backgroundImage: `url('/${gender === "male" ? "man_back_side" : "women_back_side"}.svg')`,
                        backgroundSize: gender === "male" ? 'auto 520%' : 'auto 540%',
                        backgroundPosition: gender === "male" ? 'center 50%' : 'center 78%',
                      }}
                    >
                      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center 40%, rgba(0, 102, 255, 0.04) 0%, transparent 60%)' }}></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between bg-white border border-outline/10 rounded-2xl shadow-sm px-6 py-4">
                  <button onClick={() => setStep("gender")} className="flex items-center gap-2 px-5 py-3 rounded-xl text-label-lg text-on-surface-variant hover:bg-surface-container-high/60 border border-outline/10 transition-all duration-200">
                    <span className="material-symbols-outlined text-[18px] rotate-180">arrow_forward</span>
                    Back
                  </button>
                  <div className="text-label-md text-on-surface-variant/60">
                    {selectedZones.length > 0 ? `${selectedZones.length} injury zone${selectedZones.length > 1 ? "s" : ""} marked` : "No zones selected yet"}
                  </div>
                  <button className="flex items-center gap-2 px-7 py-3 rounded-xl bg-primary text-white text-label-lg font-bold hover:bg-primary/90 transition-all duration-200 shadow-sm active:scale-[0.98]">
                    Continue
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function BodyZone({ label, style, selected, onClick }: { label: string; style: React.CSSProperties; selected: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`body-zone ${selected ? "selected" : ""}`}
      style={style}
      title={label}
    ></div>
  );
}

function LanguageCard({
  code,
  name,
  selectLabel,
  isRtl = false,
  isActive = false,
  onClick,
}: {
  code: string;
  name: string;
  selectLabel: string;
  isRtl?: boolean;
  isActive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center justify-center bg-surface-container-low border ${isActive
        ? "border-primary/40 ring-1 ring-primary/10 shadow-md bg-surface-container"
        : "border-outline/10 shadow-sm"
        } rounded-xl p-10 hover:shadow-md hover:bg-surface-container hover:border-primary/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.99] active:shadow-inner`}
    >
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-8 border border-outline/5 group-hover:bg-primary-container transition-colors duration-300">
        <span className="text-display-md text-primary group-hover:text-on-primary-container">
          {code}
        </span>
      </div>
      <span
        className={`${isRtl ? "text-display-lg" : "text-headline-lg"
          } text-on-surface mb-3`}
        dir={isRtl ? "rtl" : "ltr"}
      >
        {name}
      </span>
      <div className="h-px w-8 bg-outline/20 mb-3 group-hover:w-12 group-hover:bg-primary/40 transition-all duration-300"></div>
      <span
        className="text-label-lg text-on-surface-variant/70 uppercase tracking-[0.2em]"
        dir={isRtl ? "rtl" : "ltr"}
      >
        {selectLabel}
      </span>
    </button>
  );
}





