// Web Audio API Sound and Music Synthesizer for Star Friends
// 100% Procedural - Zero external audio file dependencies!

class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.noteIndex = 0;
        this.volume = 0.5;
        this.isInitialized = false;

        // Joyful pentatonic scale (C major pentatonic across octaves for fail-safe harmony)
        this.scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];
        this.arpeggioIndex = 0;
        this.lastStarTime = 0;
    }

    init() {
        if (this.isInitialized) return;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.isInitialized = true;
            }
        } catch (e) {
            console.warn('Web Audio not available', e);
        }
    }

    ensureContext() {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else {
            this.startBGM();
        }
        return this.isMuted;
    }

    // Play a gentle tone with attack, decay, sustain, release
    playTone(freq, type = 'sine', duration = 0.2, gainPeak = 0.25, pitchBend = 0) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (pitchBend !== 0) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(10, freq + pitchBend), now + duration);
        }

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(gainPeak * this.volume, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    // Sound: Jump (Cute bubbly boing)
    playJump(isFlutter = false) {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = isFlutter ? 'triangle' : 'sine';
        const startFreq = isFlutter ? 380 : 260;
        const endFreq = isFlutter ? 620 : 540;

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.2);

        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
    }

    // Sound: Double jump / Glide flutter
    playDoubleJump() {
        this.playJump(true);
        setTimeout(() => this.playTone(700, 'sine', 0.12, 0.15, 120), 50);
    }

    // Sound: Dash / Whoosh
    playDash() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        // White noise burst softened with lowpass filter
        const bufferSize = this.ctx.sampleRate * 0.18;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.18);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.2 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
    }

    // Sound: Star Collect (Melodic arpeggio that climbs with rapid pickups)
    playStar() {
        const nowMs = Date.now();
        if (nowMs - this.lastStarTime < 800) {
            this.arpeggioIndex = (this.arpeggioIndex + 1) % this.scale.length;
        } else {
            this.arpeggioIndex = 0;
        }
        this.lastStarTime = nowMs;

        const freq = this.scale[this.arpeggioIndex];
        this.playTone(freq, 'triangle', 0.22, 0.25, 40);
        setTimeout(() => {
            this.playTone(freq * 1.5, 'sine', 0.18, 0.15, 0);
        }, 50);
    }

    // Sound: Trampoline / Jelly Pad Bounce
    playBounce() {
        if (this.isMuted) return;
        this.ensureContext();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.32);

        gain.gain.setValueAtTime(0.3 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
    }

    // Sound: Rescue Baby Pet Friend (Excited happy chirps & fanfare)
    playRescue() {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.28, 0.25, 20);
                this.playTone(freq * 1.01, 'sine', 0.25, 0.15, 0);
            }, idx * 80);
        });
    }

    // Sound: Checkpoint Reached (Magical warm chime)
    playCheckpoint() {
        const notes = [440, 554.37, 659.25, 880]; // A major chime
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.35, 0.2, 0);
            }, idx * 90);
        });
    }

    // Sound: Victory Fanfare!
    playVictory() {
        const victoryMelody = [
            { f: 523.25, d: 150 }, // C5
            { f: 523.25, d: 150 }, // C5
            { f: 523.25, d: 150 }, // C5
            { f: 659.25, d: 350 }, // E5
            { f: 587.33, d: 200 }, // D5
            { f: 659.25, d: 200 }, // E5
            { f: 783.99, d: 600 }  // G5
        ];

        let offset = 0;
        victoryMelody.forEach(note => {
            setTimeout(() => {
                this.playTone(note.f, 'triangle', note.d / 1000, 0.3, 0);
                this.playTone(note.f * 1.5, 'sine', note.d / 1000, 0.15, 0);
            }, offset);
            offset += note.d + 30;
        });
    }

    // Procedural Uplifting Background Music (Sweet Marimba / Chiptune Lullaby)
    startBGM() {
        if (this.bgmPlaying || this.isMuted) return;
        this.ensureContext();
        this.bgmPlaying = true;

        // Friendly 8-bar upbeat pentatonic tune
        const bgmNotes = [
            523.25, 0, 659.25, 523.25, 783.99, 0, 659.25, 0,
            587.33, 0, 440.00, 587.33, 659.25, 0, 523.25, 0,
            659.25, 0, 783.99, 880.00, 783.99, 0, 659.25, 0,
            523.25, 0, 587.33, 0, 523.25, 0, 0, 0
        ];

        const bassNotes = [
            261.63, 261.63, 329.63, 329.63, 220.00, 220.00, 261.63, 261.63
        ];

        let step = 0;
        const tick = () => {
            if (!this.bgmPlaying) return;

            const leadFreq = bgmNotes[step % bgmNotes.length];
            if (leadFreq > 0 && !this.isMuted) {
                this.playTone(leadFreq, 'sine', 0.14, 0.08);
            }

            // Play bass note every 4 steps
            if (step % 4 === 0) {
                const bassIdx = Math.floor(step / 4) % bassNotes.length;
                const bassFreq = bassNotes[bassIdx];
                if (!this.isMuted) {
                    this.playTone(bassFreq, 'triangle', 0.28, 0.09);
                }
            }

            step++;
            this.bgmTimer = setTimeout(tick, 180);
        };

        tick();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

// Global sound singleton
window.sound = new SoundEngine();
