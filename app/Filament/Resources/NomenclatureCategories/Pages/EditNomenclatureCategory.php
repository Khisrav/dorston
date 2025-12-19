<?php

namespace App\Filament\Resources\NomenclatureCategories\Pages;

use App\Filament\Resources\NomenclatureCategories\NomenclatureCategoryResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditNomenclatureCategory extends EditRecord
{
    protected static string $resource = NomenclatureCategoryResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
