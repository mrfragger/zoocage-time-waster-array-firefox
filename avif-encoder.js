import avifModule from './avif_enc.js';

let emscriptenModule = null;

self.onmessage = async (e) => {
  const { imageData, quality, effort } = e.data;
  
  try {
    if (!emscriptenModule) {
      emscriptenModule = await avifModule();
    }
    
    const { width, height, data } = imageData;
    
    const options = {
      quality: quality,
      qualityAlpha: -1,
      denoiseLevel: 0,
      tileColsLog2: 0,
      tileRowsLog2: 0,
      speed: effort,
      subsample: 1,
      chromaDeltaQ: false,
      sharpness: 0,
      tune: 0,
      enableSharpYUV: false,
      bitDepth: 8,
      lossless: false
    };
    
    const result = emscriptenModule.encode(
      new Uint8Array(data.buffer),
      width,
      height,
      options
    );
    
    if (!result || result.byteLength === 0) {
      throw new Error('AVIF encoding failed');
    }
    
    const blob = new Blob([result], { type: 'image/avif' });
    self.postMessage({ blob });
    
  } catch (error) {
    console.error('AVIF encoding error:', error);
    self.postMessage({ error: `Encoding failed: ${error.message}` });
  }
};