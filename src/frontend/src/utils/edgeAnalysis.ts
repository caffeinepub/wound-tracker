export function analyzeEdgeSharpness(imageData: ImageData): number {
  const { width, height, data } = imageData;
  
  // Sobel edge detection
  const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
  const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];
  
  let totalGradient = 0;
  let edgePixelCount = 0;
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0;
      let gy = 0;
      
      // Apply Sobel operators
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
          
          gx += intensity * sobelX[ky + 1][kx + 1];
          gy += intensity * sobelY[ky + 1][kx + 1];
        }
      }
      
      const gradient = Math.sqrt(gx * gx + gy * gy);
      
      if (gradient > 50) { // Edge threshold
        totalGradient += gradient;
        edgePixelCount++;
      }
    }
  }
  
  const avgGradient = edgePixelCount > 0 ? totalGradient / edgePixelCount : 0;
  
  // Normalize to 0-1 scale (higher gradient = sharper edges)
  // Typical gradient range: 0-500
  const sharpness = Math.min(1, avgGradient / 300);
  
  return sharpness;
}
