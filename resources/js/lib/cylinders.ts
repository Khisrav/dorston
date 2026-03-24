import type { DoorConfig } from '@/types/configurator'
import { isMetallicDoor } from '@/lib/utils'

/** Apartment (Comfort / Absolut): three cylinder product lines; DB uses different nomenclature ids for metallic vs non-metallic leaf thickness. */
export type ComfortCylinderLine = 'dwf_profi' | 'fuaro_d_pro_507' | 'securemme_k2'

export const COMFORT_CYLINDER_LINES: {
    line: ComfortCylinderLine
    label: string
    metallicId: number
    nonMetallicId: number
}[] = [
    { line: 'dwf_profi', label: 'DWF Profi', metallicId: 227, nonMetallicId: 230 },
    { line: 'fuaro_d_pro_507', label: 'Fuaro D-Pro 507', metallicId: 228, nonMetallicId: 231 },
    { line: 'securemme_k2', label: 'Securemme K-2', metallicId: 229, nonMetallicId: 232 },
]

export function resolveComfortCylinderId(line: ComfortCylinderLine, isMetallic: boolean): number {
    const row = COMFORT_CYLINDER_LINES.find((r) => r.line === line)
    if (!row) throw new Error(`Unknown comfort cylinder line: ${line}`)
    return isMetallic ? row.metallicId : row.nonMetallicId
}

export function comfortCylinderLineFromId(id: number): ComfortCylinderLine | null {
    for (const row of COMFORT_CYLINDER_LINES) {
        if (id === row.metallicId || id === row.nonMetallicId) return row.line
    }
    return null
}

/** Termo: only these nomenclature rows are offered (60/10/25 termo-specific cylinders). */
export const TERMO_CYLINDER_NOMENCLATURE_IDS = [233, 234] as const

/** When exterior model toggles metallic vs non-metallic, keep the same product line but swap nomenclature id. */
export function remapApartmentCylindersToMatchDoor(config: DoorConfig): void {
    if (config.doorConstructive !== 'Comfort' && config.doorConstructive !== 'Absolut') return

    const isM = isMetallicDoor(config)
    const p = config.furniture.primaryCylindricalLockMechanism ?? -1
    if (p !== -1) {
        const line = comfortCylinderLineFromId(p)
        if (line !== null) {
            const next = resolveComfortCylinderId(line, isM)
            if (next !== p) config.furniture.primaryCylindricalLockMechanism = next
        }
    }

    const s = config.furniture.secondaryCylindricalLockMechanism ?? -1
    if (s !== -1) {
        const line = comfortCylinderLineFromId(s)
        if (line !== null) {
            const next = resolveComfortCylinderId(line, isM)
            if (next !== s) config.furniture.secondaryCylindricalLockMechanism = next
        }
    }
}
