<?php

namespace App\Filament\Resources\NomenclatureCategories\Pages;

use App\Filament\Resources\NomenclatureCategories\NomenclatureCategoryResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListNomenclatureCategories extends ListRecords
{
    protected static string $resource = NomenclatureCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
