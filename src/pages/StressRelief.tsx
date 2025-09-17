import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Timer, BarChart3, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const StressRelief = () => {
  // Breathing Exercise State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [breathingTimer, setBreathingTimer] = useState(0);
  const [breathingCycle, setBreathingCycle] = useState(0);
  const [breathingProgress, setBreathingProgress] = useState(0);
  const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sound Therapy State
  const [activeSounds, setActiveSounds] = useState<Set<string>>(new Set());
  const [soundVolume, setSoundVolume] = useState(50);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<{ [key: string]: { oscillator: OscillatorNode; gainNode: GainNode } }>({});

  const frequencies = [
    { 
      id: 'freq-100', 
      frequency: 100,
      description: 'Deep bass frequency for grounding'
    },
    { 
      id: 'freq-150', 
      frequency: 150,
      description: 'Low frequency for relaxation'
    },
    { 
      id: 'freq-200', 
      frequency: 200,
      description: 'Mid-low frequency for calm'
    },
    { 
      id: 'freq-300', 
      frequency: 300,
      description: 'Mid frequency for balance'
    },
    { 
      id: 'freq-600', 
      frequency: 600,
      description: 'Higher frequency for clarity'
    },
    { 
      id: 'freq-800', 
      frequency: 800,
      description: 'High frequency for focus'
    }
  ];

  // Initialize audio context
  useEffect(() => {
    const initAudioContext = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initAudioContext();
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      
      // Cleanup audio context and oscillators
      Object.values(oscillatorsRef.current).forEach(({ oscillator }) => {
        try {
          oscillator.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
      });
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Breathing Exercise Logic - Fixed implementation
  useEffect(() => {
    if (isBreathingActive) {
      breathingIntervalRef.current = setInterval(() => {
        setBreathingTimer(prev => {
          const newTimer = prev + 1;
          
          // 4-7-8 breathing pattern
          if (breathingPhase === 'inhale' && newTimer >= 4) {
            setBreathingPhase('hold');
            return 0;
          } else if (breathingPhase === 'hold' && newTimer >= 7) {
            setBreathingPhase('exhale');
            return 0;
          } else if (breathingPhase === 'exhale' && newTimer >= 8) {
            setBreathingPhase('pause');
            return 0;
          } else if (breathingPhase === 'pause' && newTimer >= 2) {
            setBreathingPhase('inhale');
            setBreathingCycle(prev => prev + 1);
            return 0;
          }
          
          return newTimer;
        });
      }, 1000);
    } else {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
    }
    
    return () => {
      if (breathingIntervalRef.current) {
        clearInterval(breathingIntervalRef.current);
        breathingIntervalRef.current = null;
      }
    };
  }, [isBreathingActive, breathingPhase]);

  // Update breathing progress for visual circle
  useEffect(() => {
    let maxTime = 4;
    if (breathingPhase === 'hold') maxTime = 7;
    else if (breathingPhase === 'exhale') maxTime = 8;
    else if (breathingPhase === 'pause') maxTime = 2;
    
    setBreathingProgress((breathingTimer / maxTime) * 100);
  }, [breathingTimer, breathingPhase]);

  // Fixed toggle breathing function
  const toggleBreathing = () => {
    console.log('Toggle breathing clicked, current state:', isBreathingActive);
    setIsBreathingActive(prev => !prev);
  };

  // Fixed reset breathing function
  const resetBreathing = () => {
    console.log('Reset breathing clicked');
    
    // Clear interval first
    if (breathingIntervalRef.current) {
      clearInterval(breathingIntervalRef.current);
      breathingIntervalRef.current = null;
    }
    
    // Reset all states
    setIsBreathingActive(false);
    setBreathingTimer(0);
    setBreathingPhase('inhale');
    setBreathingProgress(0);
    setBreathingCycle(0);
  };

  const getBreathingInstruction = () => {
    if (!isBreathingActive) return 'Press Play to Start';
    
    switch (breathingPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'pause':
        return 'Pause';
      default:
        return 'Ready';
    }
  };

  const getCircleScale = () => {
    if (!isBreathingActive) return 1;
    
    if (breathingPhase === 'inhale') {
      return 1 + (breathingProgress / 100) * 0.5;
    } else if (breathingPhase === 'exhale') {
      return 1.5 - (breathingProgress / 100) * 0.5;
    }
    return breathingPhase === 'hold' ? 1.5 : 1;
  };

  const createSoundOscillator = (soundId: string, frequency: number) => {
    if (!audioContextRef.current) return null;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    
    // Set volume based on current volume setting
    gainNode.gain.setValueAtTime((soundVolume / 100) * 0.1, audioContextRef.current.currentTime);
    
    return { oscillator, gainNode };
  };

  const toggleSound = async (soundId: string) => {
    if (!audioContextRef.current) {
      // Try to initialize audio context
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      } catch (error) {
        console.log('Audio context initialization failed:', error);
        return;
      }
    }

    const newActiveSounds = new Set(activeSounds);
    
    if (activeSounds.has(soundId)) {
      // Stop the sound
      const soundData = oscillatorsRef.current[soundId];
      if (soundData) {
        try {
          soundData.oscillator.stop();
        } catch (e) {
          // Oscillator might already be stopped
        }
        delete oscillatorsRef.current[soundId];
      }
      newActiveSounds.delete(soundId);
    } else {
      // Start the sound
      const freq = frequencies.find(f => f.id === soundId);
      if (freq) {
        const soundData = createSoundOscillator(soundId, freq.frequency);
        if (soundData) {
          try {
            soundData.oscillator.start();
            oscillatorsRef.current[soundId] = soundData;
            newActiveSounds.add(soundId);
          } catch (error) {
            console.log('Failed to start oscillator:', error);
          }
        }
      }
    }
    
    setActiveSounds(newActiveSounds);
  };

  const stopAllSounds = () => {
    Object.entries(oscillatorsRef.current).forEach(([soundId, soundData]) => {
      try {
        soundData.oscillator.stop();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    
    oscillatorsRef.current = {};
    setActiveSounds(new Set());
  };

  // Update volume for all active sounds
  useEffect(() => {
    Object.values(oscillatorsRef.current).forEach(({ gainNode }) => {
      if (gainNode && audioContextRef.current) {
        gainNode.gain.setValueAtTime((soundVolume / 100) * 0.1, audioContextRef.current.currentTime);
      }
    });
  }, [soundVolume]);
  
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-pink-50 to-white dark:from-pink-900/20 dark:to-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800 dark:text-white">
                Interactive <span className="text-pink-600 dark:text-pink-400">Stress Relief</span> & Relaxation
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Experience interactive stress relief through guided breathing exercises, frequency-based sound therapy, and mindfulness activities designed to promote relaxation and well-being.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button 
                  onClick={toggleBreathing}
                  className="bg-gradient-to-r from-pink-600 to-purple-500 hover:from-pink-500 hover:to-purple-400 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Breathing Exercise
                </button>
                <button 
                  onClick={() => document.getElementById('sound-therapy')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white dark:bg-slate-800 text-gray-800 dark:text-white border border-gray-200 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-500 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Try Frequency Therapy
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-center mb-8">
                  <Gamepad2 className="h-16 w-16 text-pink-600 dark:text-pink-400" />
                </div>
                <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
                  Interactive Wellness Tools
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                  Our interactive approach includes:
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                    <Timer className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                    <span className="text-gray-700 dark:text-gray-200">Real-time breathing guidance</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                    <Volume2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="text-gray-700 dark:text-gray-200">Frequency-based sound therapy</span>
                  </div>
                  <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-gray-700 dark:text-gray-200">Progress tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Breathing Exercise - FIXED BUTTONS */}
      <section className="py-20 px-6 bg-gray-50 dark:bg-slate-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              4-7-8 Breathing Exercise
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Follow the interactive breathing circle to practice the 4-7-8 technique for stress relief and relaxation.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-slate-700">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 rounded-xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 dark:bg-black/20 backdrop-blur-sm"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative mb-8">
                    <div 
                      className="w-48 h-48 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center transition-transform duration-1000 ease-in-out relative"
                      style={{ transform: `scale(${getCircleScale()})` }}
                    >
                      <div className="absolute inset-0 rounded-full border-4 border-pink-500 dark:border-pink-400 opacity-30"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-pink-500 dark:border-pink-400 transition-all duration-300"
                        style={{ 
                          clipPath: `inset(0 ${100 - breathingProgress}% 0 0)`,
                        }}
                      ></div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                          {getBreathingInstruction()}
                        </p>
                        {isBreathingActive && (
                          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                            {breathingTimer}s
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* FIXED BUTTON CONTAINER */}
                  <div className="flex space-x-4 mb-6 z-20 relative">
                    <button 
                      onClick={toggleBreathing}
                      className="bg-pink-600 hover:bg-pink-500 text-white p-4 rounded-full transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 cursor-pointer"
                      aria-label={isBreathingActive ? "Pause breathing exercise" : "Start breathing exercise"}
                      type="button"
                    >
                      {isBreathingActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                    </button>
                    <button 
                      onClick={resetBreathing}
                      className="bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 p-4 rounded-full transition-colors hover:bg-gray-300 dark:hover:bg-slate-600 shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 cursor-pointer"
                      aria-label="Reset breathing exercise"
                      type="button"
                    >
                      <RotateCcw className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                      Cycles Completed: {breathingCycle}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Inhale for 4 seconds, hold for 7 seconds, exhale for 8 seconds
                    </p>
                    {isBreathingActive && (
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                        <span className="text-sm text-pink-600 dark:text-pink-400 font-medium">Active</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Reduces Anxiety</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Helps calm your nervous system and reduce anxiety levels
                  </p>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Improves Focus</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Enhances concentration and mental clarity
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                  <h4 className="font-medium text-gray-800 dark:text-white mb-2">Better Sleep</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Promotes relaxation for improved sleep quality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Frequency Therapy */}
      <section id="sound-therapy" className="py-20 px-6 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-white">
              Frequency-Based Sound Therapy
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Choose from different therapeutic frequencies to create your perfect relaxation environment. Each frequency offers unique benefits for mental wellness.
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-slate-700">
            <div className="max-w-4xl mx-auto">
              {/* Sound Controls */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {activeSounds.size > 0 ? `Playing ${activeSounds.size} frequency${activeSounds.size > 1 ? 's' : ''}` : 'Select frequencies to play'}
                  </h3>
                  {activeSounds.size > 0 && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm">Active</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <VolumeX className="h-5 w-5 text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={soundVolume}
                      onChange={(e) => setSoundVolume(Number(e.target.value))}
                      className="w-20 accent-purple-600"
                    />
                    <Volume2 className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{soundVolume}%</span>
                  </div>
                  {activeSounds.size > 0 && (
                    <button
                      onClick={stopAllSounds}
                      className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    >
                      Stop All
                    </button>
                  )}
                </div>
              </div>

              {/* Frequency Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {frequencies.map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => toggleSound(freq.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-center ${
                      activeSounds.has(freq.id)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg transform scale-105'
                        : 'border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900/50 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                    }`}
                  >
                    <div className={`text-3xl font-bold mb-3 transition-transform duration-300 ${
                      activeSounds.has(freq.id) ? 'animate-pulse text-purple-600 dark:text-purple-400' : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {freq.frequency}Hz
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {freq.description}
                    </p>
                    <div className="flex justify-center">
                      {activeSounds.has(freq.id) ? (
                        <Pause className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      ) : (
                        <Play className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Demo Notice */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-blue-800 dark:text-blue-300 text-center text-sm">
                  <strong>Interactive Frequency Therapy:</strong> Each frequency generates a pure sine wave tone for therapeutic relaxation. 
                  Click any frequency to start/stop, adjust volume, and combine multiple frequencies for a personalized experience.
                </p>
              </div>

              {/* Frequency Benefits */}
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 text-center">
                  Benefits of Frequency Therapy
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-full inline-block mb-2">
                      <Timer className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Reduces Stress</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-full inline-block mb-2">
                      <Volume2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Improves Focus</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-full inline-block mb-2">
                      <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Better Sleep</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white dark:bg-slate-800 p-3 rounded-full inline-block mb-2">
                      <Gamepad2 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Mood Enhancement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default StressRelief;