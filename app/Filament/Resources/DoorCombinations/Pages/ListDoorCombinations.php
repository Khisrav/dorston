<?php

namespace App\Filament\Resources\DoorCombinations\Pages;

use App\Filament\Resources\DoorCombinations\DoorCombinationResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListDoorCombinations extends ListRecords
{
    protected static string $resource = DoorCombinationResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
