let sharedCtx: AudioContext | null = null;
let noiseBuffer: AudioBuffer | null = null;

export const getAudioContext = (): AudioContext | null => {
    try {
        if (!sharedCtx) {
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) sharedCtx = new AudioContextClass();
        }
        if (sharedCtx && sharedCtx.state === 'suspended') {
            sharedCtx.resume();
        }
        return sharedCtx;
    } catch (e) {
        console.error("AudioContext initialization failed", e);
        return null;
    }
};

export const getNoiseBuffer = (ctx: AudioContext): AudioBuffer => {
    if (!noiseBuffer) {
        const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
        noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
    }
    return noiseBuffer;
};
