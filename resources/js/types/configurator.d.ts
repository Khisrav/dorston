export type doorConstructive = 'Comfort' | 'Absolut' | 'Termo';
export type doorType = 'Apartment' | 'Street';
export type doorHandleSide = 'Left' | 'Right';
export type peepholePosition = 'None' | 'Side' | 'Center';
export type doorBoxDesign = 'Closed' | 'Opened';

export interface DoorConfig {
    doorType: doorType,
    doorConstructive: doorConstructive,
    doorWidth: number;
    doorHeight: number;
    doorHandleSide: doorHandleSide;
    doorBoxDesign: doorBoxDesign;
    peepholePosition?: peepholePosition | undefined;
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
    metalPainting: {
        undercoat?: boolean;
        primaryColor?: number;
        secondaryColor?: number;
    }
    furniture: {
        furnitureSetId?: number;
        furnitureShape?: string;
        furnitureColor?: string;
        primaryLock?: number;
        primaryCylindricalLockMechanism?: number;
        hasSecondaryLock?: boolean;
        hasPeephole?: boolean;
        hasNightLatchTurner?: boolean;
        secondaryLock?: number;
        secondaryCylindricalLockMechanism?: number;
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
    tag?: string;
    properties?: any;
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
    additional_element_mask_image?: string;
}

export interface Furniture {
    id: number;
    shape: 'rectangular' | 'oval' | 'other';
    color: 'black' | 'chrome' | 'gold' | 'bronze';
    cylindrical_lock_cover_image?: string | null;
    lever_lock_cover_image?: string | null;
    peephole_cover_image?: string | null;
    night_latch_turner_cover_image?: string | null;
    cylinder_rod_cover_image?: string | null;
    handle_cover_image?: string | null;
    cylindrical_lock_id?: number | null;
    lever_lock_id?: number | null;
    peephole_id?: number | null;
    night_latch_turner_id?: number | null;
    cylinder_rod_id?: number | null;
    handle_id?: number | null;
    created_at?: any;
    updated_at?: any;
}