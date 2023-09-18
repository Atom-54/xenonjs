/** 
 * Author: yusufhilmi
 * Let's keep everything here until it gets too big
 * My first npm package, can use help about design patterns, best practices!
 */
export const getEmbedding = async (text, precision = 7, options = {pooling: "mean", normalize: false}, model = "Xenova/gte-small") => {
  const {pipeline} = await import("../@xenova/transformers/transformers.min.js");
  const pipe = await pipeline("feature-extraction", model);
  const output = await pipe(text, options);
  const roundedOutput = Array.from(output.data).map(
    value => parseFloat(value.toFixed(precision))
    //value => /*parseFloat*/(value.toExponential(precision))
  );
  return Array.from(roundedOutput);
};

export const cosineSimilarity = (
  vecA,
  vecB,
  precision = 6
) => {
  // Check if both vectors have the same length
  if (vecA.length !== vecB.length) {
    throw new Error("Vectors must have the same length");
  }
  // Compute dot product and magnitudes
  const dotProduct = vecA.reduce((sum, a, i) => {
    const b = vecB[i]; // Extract value safely
    return sum + a * (b !== undefined ? b : 0); // Check for undefined
  }, 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  // Check if either magnitude is zero
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  // Calculate cosine similarity and round to specified precision
  return parseFloat(
    (dotProduct / (magnitudeA * magnitudeB)).toFixed(precision)
  );
};

export class EmbeddingIndex {
  constructor(initialObjects) {
    this.objects = [];
    this.keys = [];
    if (initialObjects && initialObjects.length > 0) {
      initialObjects.forEach((obj) => this.validateAndAdd(obj));
      if (initialObjects[0]) {
        this.keys = Object.keys(initialObjects[0]);
      }
    }
  }
  validateAndAdd(obj) {
    if (!Array.isArray(obj.embedding) || obj.embedding.some(isNaN)) {
      throw new Error(
        "Object must have an embedding property of type number[]"
      );
    }
    if (!this.keys.every((key) => key in obj)) {
      throw new Error(
        "Object must have the same properties as the initial objects"
      );
    }
    this.objects.push(obj);
  }
  add(obj) {
    this.validateAndAdd(obj);
  }
  // Method to update an existing vector in the index
  update(filter, vector) {
    // Find the index of the vector with the given filter
    const index = this.objects.findIndex((object) =>
      Object.keys(filter).every((key) => object[key] === filter[key])
    );
    if (index === -1) {
      throw new Error("Vector not found");
    }
    // Validate and add the new vector
    this.validateAndAdd(vector);
    // Replace the old vector with the new one
    this.objects[index] = vector;
  }
  // Method to remove a vector from the index
  remove(filter) {
    // Find the index of the vector with the given filter
    const index = this.objects.findIndex((object) =>
      Object.keys(filter).every((key) => object[key] === filter[key])
    );
    if (index === -1) {
      throw new Error("Vector not found");
    }
    // Remove the vector from the index
    this.objects.splice(index, 1);
  }
  // Method to remove multiple vectors from the index
  removeBatch(filters) {
    filters.forEach((filter) => {
      // Find the index of the vector with the given filter
      const index = this.objects.findIndex((object) =>
        Object.keys(filter).every((key) => object[key] === filter[key])
      );
      if (index !== -1) {
        // Remove the vector from the index
        this.objects.splice(index, 1);
      }
    });
  }
  // Method to retrieve a vector from the index
  get(filter) {
    // Find the vector with the given filter
    const vector = this.objects.find((object) =>
      Object.keys(filter).every((key) => object[key] === filter[key])
    );
    if (!vector) {
      return null;
    }
    // Return the vector
    return vector;
  }
  search(queryEmbedding, options = {topK: 3, filter: {}}) {
    const topK = options.topK || 3;
    const filter = options.filter || {};
    // Compute similarities
    const similarities = this.objects
      .filter((object) =>
        Object.keys(filter).every((key) => object[key] === filter[key])
      )
      .map((obj) => ({
        similarity: cosineSimilarity(queryEmbedding, obj.embedding),
        object: obj,
      }));
    // Sort by similarity and return topK results
    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }
  printIndex() {
    console.log("Index Content:");
    this.objects.forEach((obj, idx) => {
      console.log(`Item ${idx + 1}:`, obj);
    });
  }
};