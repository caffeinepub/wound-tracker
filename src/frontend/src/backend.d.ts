import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface APIWoundMeasurement {
    circularity: number;
    redPercentage: number;
    area: number;
    perimeter: number;
    diagnosis: string;
    textureSmoothness: number;
    exudateLevel: number;
    timestamp: bigint;
    edgeSharpness: number;
    image: ExternalBlob;
    blackPercentage: number;
    yellowPercentage: number;
    pinkPercentage: number;
}
export interface backendInterface {
    deleteMeasurement(id: string): Promise<void>;
    getAllMeasurements(): Promise<Array<APIWoundMeasurement>>;
    getMeasurement(id: string): Promise<APIWoundMeasurement | null>;
    measureWound(id: string, image: ExternalBlob, area: number, perimeter: number, circularity: number, textureSmoothness: number, edgeSharpness: number, exudateLevel: number, redPercentage: number, pinkPercentage: number, yellowPercentage: number, blackPercentage: number): Promise<APIWoundMeasurement>;
}
