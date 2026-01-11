import { DoorConfig } from '@/types/configurator'
import { InertiaLinkProps } from '@inertiajs/vue3'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function urlIsActive(
    urlToCheck: NonNullable<InertiaLinkProps['href']>,
    currentUrl: string,
) {
    return toUrl(urlToCheck) === currentUrl
}

export function toUrl(href: NonNullable<InertiaLinkProps['href']>) {
    return typeof href === 'string' ? href : href?.url
}

export const isDoorStandard = (width: number, height: number) => {
    return (width <= 2050 && height <= 960) ? true : false
}

export const isMetallicDoor = (doorConfig: DoorConfig) => {
    return ['Kombi', 'Verso', 'Forta', 'Stark'].includes(doorConfig.exterior.panelModel)
}

export const getPaintPrice = (doorConfig: DoorConfig) => {
    let total = 0
    
    if (doorConfig.metalPainting?.undercoat === 'Цинкогрунтование') {
        total += (isDoorStandard(doorConfig.doorWidth, doorConfig.doorHeight) ? 1 : 1.1) * 420
    }
    
    return total
}

export const getDoorModelImage = (link: string) => link.startsWith('http') ? link : `/storage/${link}`