"use client";

import React, { useState } from "react";

export default function Home() {
  const [step, setStep] = useState<"language" | "gender" | "injury">("language");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [selectedZones, setSelectedZones] = useState<string[]>(["Head", "Right Lower Leg"]);

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
                    className="material-symbols-outlined text-[80px]"
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
          <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 animate-in fade-in zoom-in-95 duration-500">
            {/* Left Section: Interactive Canvas */}
            <section className="flex-grow flex flex-col gap-6">
              <header>
                <h1 className="text-display-md text-on-surface mb-2">Patient Anatomy</h1>
              </header>

              {/* Body Map Container */}
              <div className="relative w-full bg-slate-50/30 border border-outline/10 rounded-2xl shadow-sm p-12 flex flex-col sm:flex-row items-center justify-center gap-16 min-h-[850px] overflow-hidden">
                {/* Front View */}
                <div className="relative w-[450px] h-[750px] flex flex-col items-center group">
                  <h3 className="text-label-lg text-secondary font-bold text-center uppercase tracking-[0.2em] mb-6 group-hover:text-primary transition-colors">Anterior (Front)</h3>
                  <div
                    className="w-full h-full relative border border-slate-200/60 bg-gradient-to-b from-slate-50 to-white rounded-3xl shadow-inner overflow-hidden flex items-center justify-center bg-no-repeat transition-all duration-500 hover:shadow-md"
                    style={{ 
                      backgroundImage: `url('/${gender === "male" ? "man" : "women"}.svg')`,
                      backgroundSize: 'auto 350%',
                      backgroundPosition: 'center 50%',
                      opacity: 1
                    }}
                  >
                    {/* Subtle Overlay Glow */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(0, 102, 255, 0.03) 0%, transparent 70%)' }}></div>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-[600px] bg-gradient-to-b from-transparent via-outline/20 to-transparent"></div>

                {/* Back View */}
                <div className="relative w-[450px] h-[750px] flex flex-col items-center group">
                  <h3 className="text-label-lg text-secondary font-bold text-center uppercase tracking-[0.2em] mb-6 group-hover:text-primary transition-colors">Posterior (Back)</h3>
                  <div
                    className="w-full h-full relative border border-slate-200/60 bg-gradient-to-b from-slate-50 to-white rounded-3xl shadow-inner overflow-hidden flex items-center justify-center bg-no-repeat transition-all duration-500 hover:shadow-md"
                    style={{
                      backgroundImage: `url('/${gender === "male" ? "man" : "women"}.svg')`,
                      backgroundSize: 'auto 350%',
                      backgroundPosition: 'center 50%',
                      opacity: 1,
                      transform: "scaleX(-1)"
                    }}
                  >
                    {/* Subtle Overlay Glow */}
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, rgba(0, 102, 255, 0.03) 0%, transparent 70%)' }}></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <button onClick={() => setStep("gender")} className="bg-primary text-white font-bold px-10 py-5 rounded-lg flex items-center justify-center gap-2 hover:bg-on-primary-fixed-variant transition-all active:scale-[0.98] shadow-md">
                  <span className="material-symbols-outlined rotate-180">arrow_forward</span>
                  Change Gender / Back
                </button>
              </div>

            </section>
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





