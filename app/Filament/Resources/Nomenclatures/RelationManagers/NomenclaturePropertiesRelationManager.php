<?php

namespace App\Filament\Resources\Nomenclatures\RelationManagers;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextInputColumn;
use Filament\Tables\Table;

class NomenclaturePropertiesRelationManager extends RelationManager
{
    protected static string $relationship = 'nomenclatureProperties';
    protected static ?string $title = 'Свойства';
    protected static ?string $pluralTitle = 'Свойства номенклатуры';
    protected static ?string $modelLabel = 'Свойство';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('property_name')
                    ->label('Свойство')
                    ->required()
                    ->maxLength(255)
                    ->datalist(['Страна', 'Механизм', 'Безопасность']),

                TextInput::make('property_value')
                    ->label('Значение')
                    ->required()
                    ->maxLength(255),
            ])
            ->columns(2);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('property_name')
            ->columns([
                TextInputColumn::make('property_name')
                    ->label('Свойство')
                    ->searchable()
                    ->sortable(),

                TextInputColumn::make('property_value')
                    ->label('Значение')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([])
            ->headerActions([
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
