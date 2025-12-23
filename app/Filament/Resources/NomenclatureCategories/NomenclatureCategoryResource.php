<?php

namespace App\Filament\Resources\NomenclatureCategories;

use App\Filament\Resources\NomenclatureCategories\Pages\CreateNomenclatureCategory;
use App\Filament\Resources\NomenclatureCategories\Pages\EditNomenclatureCategory;
use App\Filament\Resources\NomenclatureCategories\Pages\ListNomenclatureCategories;
use App\Filament\Resources\NomenclatureCategories\Schemas\NomenclatureCategoryForm;
use App\Filament\Resources\NomenclatureCategories\Tables\NomenclatureCategoriesTable;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use App\Models\NomenclatureCategory;
use UnitEnum;
class NomenclatureCategoryResource extends Resource
{
    protected static ?string $model = NomenclatureCategory::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static string|UnitEnum|null $navigationGroup = 'Номенклатуры';
    protected static ?string $recordTitleAttribute = 'Категория номенклатур';
    protected static ?string $navigationLabel = 'Категории';
    protected static ?string $pluralNavigationLabel = 'Категории номенклатур';
    protected static ?string $pluralModelLabel = 'Категория номенклатур';
    protected static ?string $modelLabel = 'Категория номенклатур';

    public static function form(Schema $schema): Schema
    {
        return NomenclatureCategoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return NomenclatureCategoriesTable::configure($table);
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
            'index' => ListNomenclatureCategories::route('/'),
            'create' => CreateNomenclatureCategory::route('/create'),
            'edit' => EditNomenclatureCategory::route('/{record}/edit'),
        ];
    }
}
