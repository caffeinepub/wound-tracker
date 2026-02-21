export interface WoundMetrics {
  area: number;
  perimeter: number;
  circularity: number;
}

export function analyzeWoundMetrics(imageData: ImageData): WoundMetrics {
  const { width, height, data } = imageData;
  
  // Convert to grayscale and apply threshold to detect wound region
  const threshold = 128;
  const binaryData: boolean[][] = [];
  
  for (let y = 0; y < height; y++) {
    binaryData[y] = [];
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const gray = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
      binaryData[y][x] = gray < threshold;
    }
  }
  
  // Calculate area (count wound pixels)
  let area = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (binaryData[y][x]) area++;
    }
  }
  
  // Calculate perimeter using edge detection
  let perimeter = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (binaryData[y][x]) {
        // Check if this is an edge pixel
        const isEdge = !binaryData[y-1][x] || !binaryData[y+1][x] || 
                       !binaryData[y][x-1] || !binaryData[y][x+1];
        if (isEdge) perimeter++;
      }
    }
  }
  
  // Calculate circularity: 4π * area / perimeter²
  // Perfect circle = 1.0, irregular shapes < 1.0
  const circularity = perimeter > 0 ? (4 * Math.PI * area) / (perimeter * perimeter) : 0;
  
  return {
    area: Math.max(area, 100), // Ensure minimum area
    perimeter: Math.max(perimeter, 10),
    circularity: Math.min(Math.max(circularity, 0), 1)
  };
}
