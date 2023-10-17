export const atom = (log, resolve) => ({
/**
 * @license
 * Copyright 2023 NeonFlan LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
shouldUpdate({text, enabled}) {
  return text && enabled;
},
async update({text, inLang, outLang}, state, {service, output, isDirty}) {
  inLang ??= 'en';
  outLang ??= 'en';
  // const textChanged = isDirty('text');
  // const languageChanged = isDirty('inLang') || isDirty('outLang'); 
  // if (text && (inLang !== outLang) && (textChanged || languageChanged)) {
  if (isDirty('trigger')) {
    output({translation: '', working: true});
    const result = await service('HuggingFaceService', 'textInference', {
      model: `Helsinki-NLP/opus-mt-${inLang}-${outLang}`,
      inputs: text
    });
    const translation = result?.[0]?.translation_text;
    return {translation, working: false};
  }
}
});
