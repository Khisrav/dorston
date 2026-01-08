<?php

namespace App\Filament\Resources\DoorModels;

use App\Filament\Resources\DoorModels\Pages\CreateDoorModel;
use App\Filament\Resources\DoorModels\Pages\EditDoorModel;
use App\Filament\Resources\DoorModels\Pages\ListDoorModels;
use App\Filament\Resources\DoorModels\Pages\ViewDoorModel;
use App\Filament\Resources\DoorModels\Schemas\DoorModelForm;
use App\Filament\Resources\DoorModels\Schemas\DoorModelInfolist;
use App\Filament\Resources\DoorModels\Tables\DoorModelsTable;
use App\Models\DoorModel;
use BackedEnum;
use UnitEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class DoorModelResource extends Resource
{
    protected static ?string $model = DoorModel::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;
    protected static string|UnitEnum|null $navigationGroup = 'Предустановки';
    protected static ?string $recordTitleAttribute = 'Модель двери';
    protected static ?string $navigationLabel = 'Модели дверей';
    protected static ?string $pluralNavigationLabel = 'Модели дверей';
    protected static ?string $pluralModelLabel = 'Модель двери';
    protected static ?string $modelLabel = 'Модель двери';

    public static function form(Schema $schema): Schema
    {
        return DoorModelForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return DoorModelInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return DoorModelsTable::configure($table);
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
            'index' => ListDoorModels::route('/'),
            // 'create' => CreateDoorModel::route('/create'),
            'view' => ViewDoorModel::route('/{record}'),
            // 'edit' => EditDoorModel::route('/{record}/edit'),
        ];
    }
}
