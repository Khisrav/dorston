<?php

namespace App\Filament\Resources\DoorModels\Pages;

use App\Filament\Resources\DoorModels\DoorModelResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewDoorModel extends ViewRecord
{
    protected static string $resource = DoorModelResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // EditAction::make(),
        ];
    }
}
