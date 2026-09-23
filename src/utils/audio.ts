/**
 * Web Audio API based stadium sound synthesizer.
 * Generates realistic referee whistle and goal celebration chimes without external audio dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Synthesizes a referee whistle burst
 */
export function playRefereeWhistle() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Dual oscillator whistle sound with harmonic modulation
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Whistle characteristic frequencies
    osc1.frequency.setValueAtTime(2850, now);
    osc1.frequency.linearRampToValueAtTime(3100, now + 0.08);
    osc1.frequency.linearRampToValueAtTime(2950, now + 0.25);

    osc2.frequency.setValueAtTime(3000, now);
    osc2.frequency.linearRampToValueAtTime(3250, now + 0.08);
    osc2.frequency.linearRampToValueAtTime(3100, now + 0.25);

    // Modulation tremolo
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(35, now);
    lfoGain.gain.setValueAtTime(150, now);
    lfo.connect(osc1.frequency);
    lfo.start(now);
    lfo.stop(now + 0.35);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.4, now + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.35, now + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.36);
    osc2.stop(now + 0.36);
  } catch (err) {
    console.warn('Audio play error:', err);
  }
}

/**
 * Synthesizes a celebratory stadium goal chord & fanfare
 */
export function playGoalCelebrationSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // First: Ref whistle
    playRefereeWhistle();

    // Second: Celebratory major chords (C, E, G, High C) after a slight pause
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = index % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, now + 0.18 + index * 0.06);

      gain.gain.setValueAtTime(0.001, now + 0.18 + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.22 + index * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + 0.18 + index * 0.06);
      osc.stop(now + 1.7);
    });
  } catch (err) {
    console.warn('Goal audio error:', err);
  }
}
