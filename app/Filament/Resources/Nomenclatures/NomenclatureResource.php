<?php

namespace App\Filament\Resources\Nomenclatures;

use App\Filament\Resources\Nomenclatures\Pages\CreateNomenclature;
use App\Filament\Resources\Nomenclatures\Pages\EditNomenclature;
use App\Filament\Resources\Nomenclatures\Pages\ListNomenclatures;
use App\Filament\Resources\Nomenclatures\Schemas\NomenclatureForm;
use App\Filament\Resources\Nomenclatures\Tables\NomenclaturesTable;
use App\Models\Nomenclature;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class NomenclatureResource extends Resource
{
    protected static ?string $model = Nomenclature::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static string|UnitEnum|null $navigationGroup = 'Номенклатуры';

    protected static ?string $navigationLabel = 'Номенклатура';
    protected static ?string $pluralNavigationLabel = 'Номенклатура';
    protected static ?string $pluralModelLabel = 'Номенклатура';
    protected static ?string $modelLabel = 'Номенклатура';

    public static function form(Schema $schema): Schema
    {
        return NomenclatureForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NomenclaturesTable::configure($table);
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
            'index' => ListNomenclatures::route('/'),
            'create' => CreateNomenclature::route('/create'),
            'edit' => EditNomenclature::route('/{record}/edit'),
        ];
    }
}
