export type doorConstructive = 'Comfort' | 'Absolut' | 'Termo';
export type doorType = 'Apartment' | 'Street';
export type doorHandleSide = 'Left' | 'Right';
export type doorBoxDesign = 'Closed' | 'Opened';

export interface DoorConfig {
    doorType: doorType,
    doorConstructive: doorConstructive,
    doorWidth: number;
    doorHeight: number;
    doorHandleSide: doorHandleSide;
    doorBoxDesign: doorBoxDesign;
    interior: {
        panelModel: string;
        primaryTexture?: string;
        secondaryTexture?: string;
        casingTexture?: string;
    };
    exterior: {
        panelModel: string;
        primaryTexture?: string;
        secondaryTexture?: string;
        casingTexture?: string;
    };
    metalPainting?: {
        undercoat?: string | 'Цинкогрунтование';
        primaryColor?: string;
        secondaryColor?: string;
    }
    furniture: {
        primaryLock: string;
        primaryCylindricalLockMechanism: string;
        secondaryLock?: string;
        secondaryCylindricalLockMechanism?: string;
        // hinges?: string;
    }
}