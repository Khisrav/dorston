<?php

namespace App\Filament\Resources\DoorCombinations\Pages;

use App\Filament\Resources\DoorCombinations\DoorCombinationResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditDoorCombination extends EditRecord
{
    protected static string $resource = DoorCombinationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
