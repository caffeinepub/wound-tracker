export function analyzeMoisture(imageData: ImageData): number {
  const { width, height, data } = imageData;
  
  let glossyPixelCount = 0;
  const totalPixels = width * height;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Calculate brightness and saturation
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const brightness = max / 255;
    const saturation = max === 0 ? 0 : (max - min) / max;
    
    // Detect specular highlights (high brightness, low saturation)
    if (brightness > 0.8 && saturation < 0.3) {
      glossyPixelCount++;
    }
    
    // Also detect very bright spots that could indicate moisture
    if (brightness > 0.9) {
      glossyPixelCount++;
    }
  }
  
  // Calculate exudate level (0-1 scale)
  const exudateLevel = (glossyPixelCount / totalPixels) * 10; // Amplify for visibility
  
  return Math.min(1, exudateLevel);
}
