<?php

namespace App\Filament\Resources\DoorCombinations\Pages;

use App\Filament\Resources\DoorCombinations\DoorCombinationResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewDoorCombination extends ViewRecord
{
    protected static string $resource = DoorCombinationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
