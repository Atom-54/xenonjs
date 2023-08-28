/** Performs audio classification. */
export declare class AudioClassifier extends AudioTaskRunner<AudioClassifierResult[]> {
    /**
     * Initializes the Wasm runtime and creates a new audio classifier from the
     * provided options.
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param audioClassifierOptions The options for the audio classifier. Note
     *     that either a path to the model asset or a model buffer needs to be
     *     provided (via `baseOptions`).
     */
    static createFromOptions(wasmFileset: WasmFileset, audioClassifierOptions: AudioClassifierOptions): Promise<AudioClassifier>;
    /**
     * Initializes the Wasm runtime and creates a new audio classifier based on
     * the provided model asset buffer.
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param modelAssetBuffer A binary representation of the model.
     */
    static createFromModelBuffer(wasmFileset: WasmFileset, modelAssetBuffer: Uint8Array): Promise<AudioClassifier>;
    /**
     * Initializes the Wasm runtime and creates a new audio classifier based on
     * the path to the model asset.
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param modelAssetPath The path to the model asset.
     */
    static createFromModelPath(wasmFileset: WasmFileset, modelAssetPath: string): Promise<AudioClassifier>;
    private constructor();
    /**
     * Sets new options for the audio classifier.
     *
     * Calling `setOptions()` with a subset of options only affects those options.
     * You can reset an option back to its default value by explicitly setting it
     * to `undefined`.
     *
     * @param options The options for the audio classifier.
     */
    setOptions(options: AudioClassifierOptions): Promise<void>;
    /**
     * Performs audio classification on the provided audio clip and waits
     * synchronously for the response.
     *
     * @param audioData An array of raw audio capture data, like from a call to
     *     `getChannelData()` on an AudioBuffer.
     * @param sampleRate The sample rate in Hz of the provided audio data. If not
     *     set, defaults to the sample rate set via `setDefaultSampleRate()` or
     *     `48000` if no custom default was set.
     * @return The classification result of the audio datas
     */
    classify(audioData: Float32Array, sampleRate?: number): AudioClassifierResult[];
}

/** Options to configure the MediaPipe Audio Classifier Task */
export declare interface AudioClassifierOptions extends ClassifierOptions, TaskRunnerOptions {
}

/** Classification results of a model. */
export declare interface AudioClassifierResult {
    /** The classification results for each head of the model. */
    classifications: Classifications[];
    /**
     * The optional timestamp (in milliseconds) of the start of the chunk of data
     * corresponding to these results.
     *
     * This is only used for classification on time series (e.g. audio
     * classification). In these use cases, the amount of data to process might
     * exceed the maximum size that the model can process: to solve this, the
     * input data is split into multiple chunks starting at different timestamps.
     */
    timestampMs?: number;
}

/** Performs embedding extraction on audio. */
export declare class AudioEmbedder extends AudioTaskRunner<AudioEmbedderResult[]> {
    /**
     * Initializes the Wasm runtime and creates a new audio embedder from the
     * provided options.
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param audioEmbedderOptions The options for the audio embedder. Note that
     *     either a path to the TFLite model or the model itself needs to be
     *     provided (via `baseOptions`).
     */
    static createFromOptions(wasmFileset: WasmFileset, audioEmbedderOptions: AudioEmbedderOptions): Promise<AudioEmbedder>;
    /**
     * Initializes the Wasm runtime and creates a new audio embedder based on the
     * provided model asset buffer.
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param modelAssetBuffer A binary representation of the TFLite model.
     */
    static createFromModelBuffer(wasmFileset: WasmFileset, modelAssetBuffer: Uint8Array): Promise<AudioEmbedder>;
    /**
     * Initializes the Wasm runtime and creates a new audio embedder based on the
     * path to the model asset.
     * @param wasmFileset A configuration object that provides the location of the
     *     Wasm binary and its loader.
     * @param modelAssetPath The path to the TFLite model.
     */
    static createFromModelPath(wasmFileset: WasmFileset, modelAssetPath: string): Promise<AudioEmbedder>;
    private constructor();
    /**
     * Sets new options for the audio embedder.
     *
     * Calling `setOptions()` with a subset of options only affects those options.
     * You can reset an option back to its default value by explicitly setting it
     * to `undefined`.
     *
     * @param options The options for the audio embedder.
     */
    setOptions(options: AudioEmbedderOptions): Promise<void>;
    /**
     * Performs embeding extraction on the provided audio clip and waits
     * synchronously for the response.
     *
     * @param audioData An array of raw audio capture data, like from a call to
     *     `getChannelData()` on an AudioBuffer.
     * @param sampleRate The sample rate in Hz of the provided audio data. If not
     *     set, defaults to the sample rate set via `setDefaultSampleRate()` or
     *     `48000` if no custom default was set.
     * @return The embedding resuls of the audio
     */
    embed(audioData: Float32Array, sampleRate?: number): AudioEmbedderResult[];
}

/** Options to configure the MediaPipe Audio Embedder Task */
export declare interface AudioEmbedderOptions extends EmbedderOptions, TaskRunnerOptions {
}

/**  Embedding results for a given embedder model. */
export declare interface AudioEmbedderResult {
    /**
     * The embedding results for each model head, i.e. one for each output tensor.
     */
    embeddings: Embedding[];
    /**
     * The optional timestamp (in milliseconds) of the start of the chunk of
     * data corresponding to these results.
     *
     * This is only used for embedding extraction on time series (e.g. audio
     * embedding). In these use cases, the amount of data to process might
     * exceed the maximum size that the model can process: to solve this, the
     * input data is split into multiple chunks starting at different timestamps.
     */
    timestampMs?: number;
}

/** Base class for all MediaPipe Audio Tasks. */
declare abstract class AudioTaskRunner<T> extends TaskRunner {
    /**
     * Sets the sample rate for API calls that omit an explicit sample rate.
     * `48000` is used as a default if this method is not called.
     *
     * @param sampleRate A sample rate (e.g. `44100`).
     */
    setDefaultSampleRate(sampleRate: number): void;
}

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Options to configure MediaPipe model loading and processing. */
declare interface BaseOptions_2 {
    /**
     * The model path to the model asset file. Only one of `modelAssetPath` or
     * `modelAssetBuffer` can be set.
     */
    modelAssetPath?: string | undefined;
    /**
     * A buffer containing the model aaset. Only one of `modelAssetPath` or
     * `modelAssetBuffer` can be set.
     */
    modelAssetBuffer?: Uint8Array | undefined;
    /** Overrides the default backend to use for the provided model. */
    delegate?: "CPU" | "GPU" | undefined;
}

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** A classification category. */
export declare interface Category {
    /** The probability score of this label category. */
    score: number;
    /** The index of the category in the corresponding label file. */
    index: number;
    /**
     * The label of this category object. Defaults to an empty string if there is
     * no category.
     */
    categoryName: string;
    /**
     * The display name of the label, which may be translated for different
     * locales. For example, a label, "apple", may be translated into Spanish for
     * display purpose, so that the `display_name` is "manzana". Defaults to an
     * empty string if there is no display name.
     */
    displayName: string;
}

/** Classification results for a given classifier head. */
export declare interface Classifications {
    /**
     * The array of predicted categories, usually sorted by descending scores,
     * e.g., from high to low probability.
     */
    categories: Category[];
    /**
     * The index of the classifier head these categories refer to. This is
     * useful for multi-head models.
     */
    headIndex: number;
    /**
     * The name of the classifier head, which is the corresponding tensor
     * metadata name. Defaults to an empty string if there is no such metadata.
     */
    headName: string;
}

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Options to configure a MediaPipe Classifier Task. */
declare interface ClassifierOptions {
    /**
     * The locale to use for display names specified through the TFLite Model
     * Metadata, if any. Defaults to English.
     */
    displayNamesLocale?: string | undefined;
    /** The maximum number of top-scored detection results to return. */
    maxResults?: number | undefined;
    /**
     * Overrides the value provided in the model metadata. Results below this
     * value are rejected.
     */
    scoreThreshold?: number | undefined;
    /**
     * Allowlist of category names. If non-empty, detection results whose category
     * name is not in this set will be filtered out. Duplicate or unknown category
     * names are ignored. Mutually exclusive with `categoryDenylist`.
     */
    categoryAllowlist?: string[] | undefined;
    /**
     * Denylist of category names. If non-empty, detection results whose category
     * name is in this set will be filtered out. Duplicate or unknown category
     * names are ignored. Mutually exclusive with `categoryAllowlist`.
     */
    categoryDenylist?: string[] | undefined;
}

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Options to configure a MediaPipe Embedder Task */
declare interface EmbedderOptions {
    /**
     * Whether to normalize the returned feature vector with L2 norm. Use this
     * option only if the model does not already contain a native L2_NORMALIZATION
     * TF Lite Op. In most cases, this is already the case and L2 norm is thus
     * achieved through TF Lite inference.
     */
    l2Normalize?: boolean | undefined;
    /**
     * Whether the returned embedding should be quantized to bytes via scalar
     * quantization. Embeddings are implicitly assumed to be unit-norm and
     * therefore any dimension is guaranteed to have a value in [-1.0, 1.0]. Use
     * the l2_normalize option if this is not the case.
     */
    quantize?: boolean | undefined;
}

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * List of embeddings with an optional timestamp.
 *
 * One and only one of the two 'floatEmbedding' and 'quantizedEmbedding' will
 * contain data, based on whether or not the embedder was configured to perform
 * scalar quantization.
 */
export declare interface Embedding {
    /**
     *  Floating-point embedding. Empty if the embedder was configured to perform
     * scalar-quantization.
     */
    floatEmbedding?: number[];
    /**
     * Scalar-quantized embedding. Empty if the embedder was not configured to
     * perform scalar quantization.
     */
    quantizedEmbedding?: Uint8Array;
    /**
     * The index of the classifier head these categories refer to. This is
     * useful for multi-head models.
     */
    headIndex: number;
    /**
     * The name of the classifier head, which is the corresponding tensor
     * metadata name.
     */
    headName: string;
}

/**
 * Resolves the files required for the MediaPipe Task APIs.
 *
 * This class verifies whether SIMD is supported in the current environment and
 * loads the SIMD files only if support is detected. The returned filesets
 * require that the Wasm files are published without renaming. If this is not
 * possible, you can invoke the MediaPipe Tasks APIs using a manually created
 * `WasmFileset`.
 */
export declare class FilesetResolver {
    /**
     * Returns whether SIMD is supported in the current environment.
     *
     * If your environment requires custom locations for the MediaPipe Wasm files,
     * you can use `isSimdSupported()` to decide whether to load the SIMD-based
     * assets.
     *
     * @return Whether SIMD support was detected in the current environment.
     */
    static isSimdSupported(): Promise<boolean>;
    /**
     * Creates a fileset for the MediaPipe Audio tasks.
     *
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Audio
     *    tasks.
     */
    static forAudioTasks(basePath?: string): Promise<WasmFileset>;
    /**
     * Creates a fileset for the MediaPipe Text tasks.
     *
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Text
     *    tasks.
     */
    static forTextTasks(basePath?: string): Promise<WasmFileset>;
    /**
     * Creates a fileset for the MediaPipe Vision tasks.
     *
     * @param basePath An optional base path to specify the directory the Wasm
     *    files should be loaded from. If not specified, the Wasm files are
     *    loaded from the host's root directory.
     * @return A `WasmFileset` that can be used to initialize MediaPipe Vision
     *    tasks.
     */
    static forVisionTasks(basePath?: string): Promise<WasmFileset>;
}

/** Base class for all MediaPipe Tasks. */
declare abstract class TaskRunner {
    protected constructor();
    /** Configures the task with custom options. */
    abstract setOptions(options: TaskRunnerOptions): Promise<void>;
    /** Closes and cleans up the resources held by this task. */
    close(): void;
}

/** Options to configure MediaPipe Tasks in general. */
declare interface TaskRunnerOptions {
    /** Options to configure the loading of the model assets. */
    baseOptions?: BaseOptions_2;
}

/**
 * Copyright 2022 The MediaPipe Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** An object containing the locations of the Wasm assets */
declare interface WasmFileset {
    /** The path to the Wasm loader script. */
    wasmLoaderPath: string;
    /** The path to the Wasm binary. */
    wasmBinaryPath: string;
}

export { }
