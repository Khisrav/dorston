<x-filament-panels::page>
    <div class="space-y-6">
        {{-- Profile Information Form --}}
        <x-filament::section>
            <form wire:submit="updateProfile">
                {{ $this->profileForm }}
                
                <div class="mt-6">
                    <x-filament::button type="submit">
                        Сохранить изменения
                    </x-filament::button>
                </div>
            </form>
        </x-filament::section>

        {{-- Password Update Form --}}
        <x-filament::section>
            <form wire:submit="updatePassword">
                {{ $this->passwordForm }}
                
                <div class="mt-6">
                    <x-filament::button type="submit" color="warning">
                        Обновить пароль
                    </x-filament::button>
                </div>
            </form>
        </x-filament::section>
    </div>
</x-filament-panels::page>
