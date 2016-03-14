const audioCtx = new AudioContext();

interface Sound {
  buffer: AudioBuffer;
}

export function loadSound(path: string)  {
  const sound: Sound = { buffer: null };

  const request = new XMLHttpRequest();
  request.open("GET", path, true);
  request.responseType = "arraybuffer";

  request.addEventListener("load", () => {
    audioCtx.decodeAudioData(request.response, (buffer) => {
      sound.buffer = buffer;
    });
  });

  request.send();

  return sound;
}

export function playSound(sound: Sound, volume = 0.5) {
  if (sound.buffer == null) return;

  const source = audioCtx.createBufferSource();
  source.buffer = sound.buffer;

  const gainNode = audioCtx.createGain();
  gainNode.gain.value = volume;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  source.start(0);
}
