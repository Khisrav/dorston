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
        undercoat?: 'Цинкогрунтование' | 'Нет' | '';
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

export interface Nomenclature {
    id: number;
    name: string;
    base_price: number;
    unit: string;
    image?: string | null;
    nomenclature_category_id: number;
    created_at?: any;
    updated_at?: any;
}