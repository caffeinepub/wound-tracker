export interface WoundAnalysisResult {
  area: number;
  perimeter: number;
  circularity: number;
  textureSmoothness: number;
  edgeSharpness: number;
  exudateLevel: number;
  redPercentage: number;
  pinkPercentage: number;
  yellowPercentage: number;
  blackPercentage: number;
  imageUrl: string;
  imageBlob: Uint8Array<ArrayBuffer>;
}

export interface ColorComposition {
  red: number;
  pink: number;
  yellow: number;
  black: number;
}
