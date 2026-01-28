<?php

namespace App\Filament\Resources\Furniture;

use App\Filament\Resources\Furniture\Pages\CreateFurniture;
use App\Filament\Resources\Furniture\Pages\EditFurniture;
use App\Filament\Resources\Furniture\Pages\ListFurniture;
use App\Filament\Resources\Furniture\Schemas\FurnitureForm;
use App\Filament\Resources\Furniture\Tables\FurnitureTable;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use App\Models\Furniture;
use UnitEnum;

class FurnitureResource extends Resource
{
    protected static ?string $model = Furniture::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static string|UnitEnum|null $navigationGroup = 'Номенклатуры';
    protected static ?string $recordTitleAttribute = 'Фурнитура';
    protected static ?string $navigationLabel = 'Фурнитуры';
    protected static ?string $pluralNavigationLabel = 'Фурнитуры';
    protected static ?string $pluralModelLabel = 'Фурнитуры';
    protected static ?string $modelLabel = 'Фурнитура';

    public static function form(Schema $schema): Schema
    {
        return FurnitureForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return FurnitureTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListFurniture::route('/'),
            'create' => CreateFurniture::route('/create'),
            'edit' => EditFurniture::route('/{record}/edit'),
        ];
    }
}
