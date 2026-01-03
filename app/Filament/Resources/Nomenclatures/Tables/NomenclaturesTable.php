<?php

namespace App\Filament\Resources\Nomenclatures\Tables;

use App\Models\NomenclatureCategory;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\MultiSelectFilter;
use Filament\Tables\Table;

class NomenclaturesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable(),
                TextColumn::make('name')
                    ->label('Название')
                    ->searchable(),
                TextColumn::make('nomenclature_category_id')
                    ->label('ID категории')
                    ->numeric()
                    ->sortable(),
                ImageColumn::make('image')
                    ->label('Изображение'),
                TextColumn::make('base_price')
                    ->label('Базовая цена')
                    ->money()
                    ->sortable(),
                TextColumn::make('unit')
                    ->label('Единица измерения')
                    ->badge(),
                TextColumn::make('created_at')
                    ->label('Создан')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->label('Обновлен')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                MultiSelectFilter::make('nomenclature_category_id')
                    ->label('Категория')
                    ->options(NomenclatureCategory::all()->pluck('name', 'id'))
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
