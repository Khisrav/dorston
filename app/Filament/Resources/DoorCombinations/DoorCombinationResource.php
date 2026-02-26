<?php

namespace App\Filament\Resources\DoorCombinations;

use App\Filament\Resources\DoorCombinations\Pages\CreateDoorCombination;
use App\Filament\Resources\DoorCombinations\Pages\EditDoorCombination;
use App\Filament\Resources\DoorCombinations\Pages\ListDoorCombinations;
use App\Filament\Resources\DoorCombinations\Pages\ViewDoorCombination;
use App\Filament\Resources\DoorCombinations\Schemas\DoorCombinationForm;
use App\Filament\Resources\DoorCombinations\Schemas\DoorCombinationInfolist;
use App\Filament\Resources\DoorCombinations\Tables\DoorCombinationsTable;
use App\Models\DoorCombination;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use UnitEnum;

class DoorCombinationResource extends Resource
{
    protected static ?string $model = DoorCombination::class;
    protected static string|UnitEnum|null $navigationGroup = 'Предустановки';
    protected static ?string $recordTitleAttribute = 'Комбинация двери';
    protected static ?string $navigationLabel = 'Комбинации дверей';
    protected static ?string $pluralNavigationLabel = 'Комбинации дверей';
    protected static ?string $pluralModelLabel = 'Комбинации дверей';
    protected static ?string $modelLabel = 'Комбинация двери';

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return DoorCombinationForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return DoorCombinationInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DoorCombinationsTable::configure($table);
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
            'index' => ListDoorCombinations::route('/'),
            'create' => CreateDoorCombination::route('/create'),
            'view' => ViewDoorCombination::route('/{record}'),
            'edit' => EditDoorCombination::route('/{record}/edit'),
        ];
    }
}
