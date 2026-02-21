export function analyzeTexture(imageData: ImageData): number {
  const { width, height, data } = imageData;
  
  // Calculate local variance to measure texture smoothness
  const windowSize = 5;
  const halfWindow = Math.floor(windowSize / 2);
  let totalVariance = 0;
  let sampleCount = 0;
  
  for (let y = halfWindow; y < height - halfWindow; y += windowSize) {
    for (let x = halfWindow; x < width - halfWindow; x += windowSize) {
      const intensities: number[] = [];
      
      // Collect intensities in window
      for (let dy = -halfWindow; dy <= halfWindow; dy++) {
        for (let dx = -halfWindow; dx <= halfWindow; dx++) {
          const idx = ((y + dy) * width + (x + dx)) * 4;
          const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          intensities.push(intensity);
        }
      }
      
      // Calculate variance
      const mean = intensities.reduce((a, b) => a + b, 0) / intensities.length;
      const variance = intensities.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / intensities.length;
      
      totalVariance += variance;
      sampleCount++;
    }
  }
  
  const avgVariance = totalVariance / sampleCount;
  
  // Normalize to 0-1 scale (lower variance = smoother = higher score)
  // Typical variance range: 0-5000
  const smoothness = Math.max(0, Math.min(1, 1 - (avgVariance / 5000)));
  
  return smoothness;
}
