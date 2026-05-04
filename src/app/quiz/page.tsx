"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Question {
  id: string;
  text: string;
  priorityIfYes: number;
  priorityIfNo: number;
}

const QUESTIONS: Question[] = [
  { id: "breathing", text: "Is the patient breathing normally?", priorityIfYes: 0, priorityIfNo: 10 },
  { id: "conscious", text: "Is the patient conscious and responsive?", priorityIfYes: 0, priorityIfNo: 8 },
  { id: "bleeding", text: "Is there severe bleeding that won't stop?", priorityIfYes: 9, priorityIfNo: 0 },
  { id: "pain", text: "Is the patient in severe pain?", priorityIfYes: 6, priorityIfNo: 0 },
  { id: "moving", text: "Can the patient move all limbs normally?", priorityIfYes: 0, priorityIfNo: 5 },
  { id: "chest_pain", text: "Does the patient have chest pain?", priorityIfYes: 10, priorityIfNo: 0 },
  { id: "allergies", text: "Does the patient have any known allergies?", priorityIfYes: 3, priorityIfNo: 0 },
];

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [priority, setPriority] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const zones = searchParams.get("zones");
    const g = searchParams.get("gender");
    if (zones) {
      setSelectedZones(zones.split(","));
    }
    if (g === "male" || g === "female") {
      setGender(g);
    }
  }, [searchParams]);

  const speakQuestion = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (!showResult && currentQuestionIndex < QUESTIONS.length) {
      const question = QUESTIONS[currentQuestionIndex].text;
      const timeout = setTimeout(() => {
        speakQuestion(question);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [currentQuestionIndex, showResult, speakQuestion]);

  const initializeSpeechRecognition = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in your browser. Please use Chrome or Edge.");
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = "";
      for (let i = event.results.length - 1; i >= 0; i--) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript = result[0].transcript.toLowerCase();
          break;
        }
      }
      if (!finalTranscript && event.results.length > 0) {
        finalTranscript = event.results[event.results.length - 1][0].transcript.toLowerCase();
      }
      setTranscript(finalTranscript);

      if (finalTranscript) {
        if (finalTranscript.includes("yes") || finalTranscript.includes("yeah") || finalTranscript.includes("sure")) {
          handleAnswer(true);
        } else if (finalTranscript.includes("no") || finalTranscript.includes("nah") || finalTranscript.includes("nope")) {
          handleAnswer(false);
        }
      }
    };

    recognition.onerror = () => {
      setError("Error with speech recognition. Please try again or use manual buttons.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return recognition;
  }, []);

  const startListening = () => {
    setError(null);
    setTranscript("");
    if (!recognitionRef.current) {
      recognitionRef.current = initializeSpeechRecognition();
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setError("Could not start listening. Please check microphone permissions.");
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const handleAnswer = (answer: boolean) => {
    const currentQuestion = QUESTIONS[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));

    stopListening();
    setTranscript("");

    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 500);
    } else {
      calculatePriority({ ...answers, [currentQuestion.id]: answer });
    }
  };

  const calculatePriority = (finalAnswers: Record<string, boolean>) => {
    let totalPriority = 0;
    const zonePriority = selectedZones.length * 2;
    totalPriority += zonePriority;

    QUESTIONS.forEach((q) => {
      const answer = finalAnswers[q.id];
      if (answer === true) {
        totalPriority += q.priorityIfYes;
      } else {
        totalPriority += q.priorityIfNo;
      }
    });

    const maxPriority = 50;
    const normalizedPriority = Math.min(100, Math.round((totalPriority / maxPriority) * 100));
    setPriority(normalizedPriority);
    setShowResult(true);
  };

  const getPriorityLabel = (p: number): { label: string; color: string; description: string } => {
    if (p >= 80) return { label: "CRITICAL", color: "text-red-600 bg-red-50 border-red-200", description: "Immediate medical attention required" };
    if (p >= 60) return { label: "HIGH", color: "text-orange-600 bg-orange-50 border-orange-200", description: "Urgent care needed within minutes" };
    if (p >= 40) return { label: "MODERATE", color: "text-yellow-600 bg-yellow-50 border-yellow-200", description: "Medical attention needed soon" };
    if (p >= 20) return { label: "LOW", color: "text-blue-600 bg-blue-50 border-blue-200", description: "Medical attention needed when possible" };
    return { label: "MINIMAL", color: "text-green-600 bg-green-50 border-green-200", description: "Routine care or self-care may be sufficient" };
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setPriority(null);
    setShowResult(false);
    setTranscript("");
    setError(null);
  };

  const goBack = () => {
    const params = new URLSearchParams();
    if (selectedZones.length > 0) params.set("zones", selectedZones.join(","));
    params.set("gender", gender);
    router.push(`/?${params.toString()}`);
  };

  const currentQuestion = QUESTIONS[currentQuestionIndex] || QUESTIONS[0];
  const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white">medical_services</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">Triage Assessment</h1>
        </div>
        <button onClick={goBack} className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Map
        </button>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {showResult && priority !== null ? (
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-blue-600">assignment</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Assessment Complete</h2>
              <p className="text-slate-500 mb-8">Based on the selected body zones and your answers</p>

              <div className={`inline-flex flex-col items-center p-6 rounded-xl border-2 mb-8 ${getPriorityLabel(priority).color}`}>
                <span className="text-sm font-semibold uppercase tracking-wider mb-1">Priority Level</span>
                <span className="text-4xl font-bold">{getPriorityLabel(priority).label}</span>
                <span className="text-lg mt-2">{priority}%</span>
              </div>

              <p className="text-slate-600 mb-8 max-w-md mx-auto">{getPriorityLabel(priority).description}</p>

              <div className="flex gap-4 justify-center">
                <button onClick={resetQuiz} className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                  Restart Assessment
                </button>
                <button onClick={goBack} className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                  Back to Map
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Progress bar */}
              <div className="h-2 bg-slate-100">
                <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>

              <div className="p-8">
                {/* Question info */}
                <div className="flex items-center justify-between mb-8">
                  <span className="text-sm text-slate-500">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400">help_outline</span>
                    <span className="text-sm text-slate-500">Answer with voice or buttons</span>
                  </div>
                </div>

                {/* Question */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">{currentQuestion.text}</h2>
                    <button
                      onClick={() => speakQuestion(currentQuestion.text)}
                      disabled={isSpeaking}
                      className={`p-2 rounded-full transition-all ${isSpeaking ? "bg-blue-100 text-blue-600 animate-pulse" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                      title="Replay question"
                    >
                      <span className="material-symbols-outlined text-[20px]">{isSpeaking ? "volume_up" : "replay"}</span>
                    </button>
                  </div>
                  {isSpeaking && (
                    <p className="text-blue-600 text-sm animate-pulse">🔊 Speaking...</p>
                  )}

                  {/* Selected zones display */}
                  {selectedZones.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mt-4">
                      {selectedZones.map((zone) => (
                        <span key={zone} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          {zone}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Voice listening indicator */}
                {isListening && (
                  <div className="flex items-center justify-center gap-3 mb-6 p-4 bg-blue-50 rounded-xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-8 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-8 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-8 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
                    </div>
                    <span className="text-blue-700 font-medium">Listening...</span>
                    {transcript && <span className="text-slate-500 italic">&ldquo;{transcript}&rdquo;</span>}
                  </div>
                )}

                {/* Error message */}
                {error && (
                  <div className="flex items-center gap-2 justify-center mb-6 p-4 bg-red-50 text-red-700 rounded-xl">
                    <span className="material-symbols-outlined">error</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Answer buttons */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => handleAnswer(true)}
                    disabled={isListening}
                    className="flex items-center gap-3 px-8 py-4 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">check</span>
                    Yes
                  </button>

                  <button
                    onClick={isListening ? stopListening : startListening}
                    className={`flex items-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all ${
                      isListening
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    }`}
                  >
                    <span className="material-symbols-outlined">{isListening ? "mic_off" : "mic"}</span>
                    {isListening ? "Stop" : "Listen"}
                  </button>

                  <button
                    onClick={() => handleAnswer(false)}
                    disabled={isListening}
                    className="flex items-center gap-3 px-8 py-4 rounded-xl bg-slate-200 text-slate-700 font-semibold hover:bg-slate-300 transition-colors disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined">close</span>
                    No
                  </button>
                </div>

                {/* Instructions */}
                <p className="text-center text-slate-400 text-sm mt-8">
                  Click &ldquo;Listen&rdquo; and say &ldquo;Yes&rdquo; or &ldquo;No&rdquo; to answer, or use the buttons above
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <QuizContent />
    </Suspense>
  );
}
