import wabtFactory from 'wabt';
self.onmessage = async (event: MessageEvent<{ code: string; a: number; b: number; mode: string }>) => {
  let phase = 'WAT変換・型検証';
  try {
    const { code, a, b, mode } = event.data;
    if (code.length > 16000) throw new Error('WATは16000文字まで');
    const wabt = await wabtFactory();
    const module = wabt.parseWat('lesson.wat', code);
    let bytes: Uint8Array;
    try { module.resolveNames(); module.validate(); bytes = module.toBinary({ write_debug_names: true }).buffer; }
    finally { module.destroy(); }
    phase = 'Wasmロード・検証';
    const compiled = await WebAssembly.compile(bytes as BufferSource);
    if (WebAssembly.Module.imports(compiled).length) throw new Error('この教材ではimportを提供しません');
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join(' ');
    if (mode === 'compile') { self.postMessage({ ok: true, mode, hex, size: bytes.length }); return; }
    phase = 'Wasm実行';
    const instance = await WebAssembly.instantiate(compiled, {});
    if (typeof instance.exports.calculate !== 'function') throw new Error('export calculate関数が必要です');
    const result = instance.exports.calculate(a, b);
    if (typeof result !== 'number' || !Number.isInteger(result)) throw new Error('教材では整数を返すcalculateを使用してください');
    self.postMessage({ ok: true, mode, result, hex, size: bytes.length });
  } catch (error) { self.postMessage({ ok: false, phase, error: error instanceof Error ? error.message : String(error) }); }
};
