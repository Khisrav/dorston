<?php

namespace App\Filament\Resources\Nomenclatures\Tables;

use App\Models\NomenclatureCategory;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\TextInputColumn;
use Filament\Tables\Filters\MultiSelectFilter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class NomenclaturesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('image')
                    ->disk('public')
                    ->height(56)
                    ->label('')
                    ->toggleable(),

                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextInputColumn::make('name')
                    ->label('Название')
                    ->searchable()
                    ->grow()
                    ->toggleable(),

                TextColumn::make('nomenclatureCategory.name')
                    ->label('Категория')
                    ->badge()
                    ->sortable()
                    ->toggleable(),

                TextInputColumn::make('base_price')
                    ->label('Цена')
                    ->type('number')
                    ->suffix(' ₽')
                    ->sortable()
                    ->toggleable(),

                TextColumn::make('unit')
                    ->label('Ед. изм.')
                    ->badge()
                    ->color('gray')
                    ->toggleable(),

                TextInputColumn::make('tag')
                    ->label('Метка')
                    ->searchable()
                    ->toggleable(),

                TextColumn::make('created_at')
                    ->label('Создан')
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Обновлен')
                    ->dateTime('d.m.Y')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('id', 'desc')
            ->filters([
                MultiSelectFilter::make('nomenclature_category_id')
                    ->label('Категория')
                    ->options(fn () => NomenclatureCategory::all()->pluck('name', 'id')),

                SelectFilter::make('tag')
                    ->label('Метка')
                    ->options([
                        'primary-lock'   => 'Основной замок',
                        'secondary-lock' => 'Вспомогательный замок',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                CreateAction::make(),
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
