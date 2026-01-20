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
        panelModel: number;
        primaryTexture?: number;
        secondaryTexture?: number;
        casingTexture?: number;
    };
    exterior: {
        panelModel: number;
        primaryTexture?: number;
        secondaryTexture?: number;
        casingTexture?: number;
    };
    metalPainting?: {
        undercoat?: boolean;
        primaryColor?: number;
        secondaryColor?: number;
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

export interface DoorModel {
    id: number;
    name: string;
    image: string;
    type: 'interior' | 'exterior';
    is_thermally_resistant: boolean;
    has_primary_film_color: boolean;
    has_secondary_film_color: boolean;
    has_casing_film_color: boolean;
    has_primary_paint: boolean;
    has_secondary_paint: boolean;
    default_primary_film_color_id?: number;
    default_secondary_film_color_id?: number;
    default_casing_film_color_id?: number;
    default_primary_paint_id?: number;
    default_secondary_paint_id?: number;
    milling_image?: string;
    milling_overflows_to_casing: boolean;
    additional_element_decor_image?: string;
    additional_element_texture_image?: string;
}