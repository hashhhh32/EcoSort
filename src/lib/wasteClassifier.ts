
import * as tf from '@tensorflow/tfjs';
import { loadGraphModel } from '@tensorflow/tfjs-converter';

// MobileNet labels
import { IMAGENET_CLASSES } from './imageNetClasses';

// We'll use the MobileNet model for waste classification
// For a production app, you'd want to train a custom model specifically for waste types
let model: tf.GraphModel | null = null;

// Function to load the model
async function loadModel() {
  if (model) return model;
  
  try {
    // Load MobileNet model
    model = await loadGraphModel(
      'https://tfhub.dev/google/tfjs-model/imagenet/mobilenet_v2_100_224/classification/3/default/1',
      { fromTFHub: true }
    );
    return model;
  } catch (error) {
    console.error('Failed to load model:', error);
    throw new Error('Failed to load the classification model');
  }
}

// Process the image to make it compatible with the model
function processImage(imgElement: HTMLImageElement): tf.Tensor {
  // Convert image to tensor
  const tensor = tf.browser.fromPixels(imgElement)
    .resizeNearestNeighbor([224, 224]) // Resize to match model input
    .toFloat();
  
  // Normalize pixel values to [-1, 1]
  const offset = tf.scalar(127.5);
  const normalized = tensor.sub(offset).div(offset);
  
  // Add batch dimension
  return normalized.expandDims(0);
}

// Classify waste from an image URL
export async function classifyWaste(imageUrl: string): Promise<{ className: string; probability: number } | null> {
  // Load model if not already loaded
  await loadModel();
  
  if (!model) {
    throw new Error('Model not loaded');
  }
  
  // Create image element for processing
  const img = new Image();
  
  // Wait for image to load
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = reject;
    img.src = imageUrl;
  });
  
  // Process the image
  const imageTensor = processImage(img);
  
  try {
    // Run prediction
    const predictions = await model.predict(imageTensor) as tf.Tensor;
    
    // Cleanup tensor
    tf.dispose(imageTensor);
    
    // Get top prediction
    const values = await predictions.dataSync();
    const arr = Array.from(values);
    
    // Cleanup prediction tensor
    predictions.dispose();
    
    // Find highest confidence prediction
    const maxIndex = arr.indexOf(Math.max(...arr));
    const probability = arr[maxIndex];
    
    // Get class name from ImageNet classes
    return {
      className: IMAGENET_CLASSES[maxIndex],
      probability: probability
    };
  } catch (error) {
    console.error('Error during classification:', error);
    return null;
  }
}
