<?php

namespace App\Filament\Resources\Nomenclatures\Tables;

use App\Models\NomenclatureCategory;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\SelectColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\TextInputColumn;
use Filament\Tables\Filters\MultiSelectFilter;
use Filament\Tables\Table;

class NomenclaturesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->disk('public')
                    ->height(64)
                    ->label(''),
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable(),
                TextInputColumn::make('name')
                    ->label('Название')
                    ->searchable(),
                TextColumn::make('nomenclature_category_id')
                    ->label('Категория')
                    // ->badge()
                    ->formatStateUsing(fn (int $state) => NomenclatureCategory::find($state)?->name)
                    ->sortable(),
                TextInputColumn::make('base_price')
                    ->label('Базовая цена')
                    ->type('number')
                    ->suffix('₽')
                    // ->money('RUB')
                    ->sortable(),
                TextColumn::make('unit')
                    ->label('Ед. изм.')
                    ->badge(),
                SelectColumn::make('tag')
                    ->label('Метка')
                    ->options([
                        'primary-lock' => 'Основной замок',
                        'secondary-lock' => 'Дополнительный замок',
                        'primary-cylinder' => 'Основной цилиндр',
                        'secondary-cylinder' => 'Дополнительный цилиндр',
                    ])
                    ->sortable()
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
