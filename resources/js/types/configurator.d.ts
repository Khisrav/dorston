export type doorConstructive = 'Comfort' | 'Absolut' | 'Termo';
export type doorType = 'Apartment' | 'Street';
export type doorHandleSide = 'Left' | 'Right';
export type doorBoxDesign = 'Closed' | 'Opened';

export interface DoorConfig {
    doorType: doorType,
    doorConstructive: doorConstructive,
    doorWidth: number;
    doorHeight: number;
    doorTexture: string;
    doorHandleSide: 'Left' | 'Right';
    doorBoxDesign: 'Closed' | 'Opened';
}