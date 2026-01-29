<?php

namespace App\Filament\Resources\Furniture\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class FurnitureTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('shape')
                    ->label('Форма')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'rectangular' => 'info',
                        'oval' => 'success',
                        'other' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'rectangular' => 'Прямоугольная',
                        'oval' => 'Овальная',
                        'other' => 'Другая',
                        default => $state,
                    })
                    ->sortable()
                    ->searchable(),

                TextColumn::make('color')
                    ->label('Цвет')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'black' => 'gray',
                        'chrome' => 'info',
                        'gold' => 'warning',
                        'bronze' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'black' => 'Черный',
                        'chrome' => 'Хром',
                        'gold' => 'Золотой',
                        'bronze' => 'Бронзовый',
                        default => $state,
                    })
                    ->sortable()
                    ->searchable(),

                TextColumn::make('cylindricalLock.name')
                    ->label('Цилиндрический замок')
                    ->sortable()
                    ->searchable()
                    ->toggleable()
                    ->placeholder('—')
                    ->wrap(),

                ImageColumn::make('cylindrical_lock_cover_image')
                    ->label('Накладка')
                    ->circular()
                    ->toggleable()
                    ->defaultImageUrl(url('/images/placeholder.png')),

                TextColumn::make('leverLock.name')
                    ->label('Сувальдный замок')
                    ->sortable()
                    ->searchable()
                    ->toggleable()
                    ->placeholder('—')
                    ->wrap(),

                ImageColumn::make('lever_lock_cover_image')
                    ->label('Накладка')
                    ->circular()
                    ->toggleable()
                    ->defaultImageUrl(url('/images/placeholder.png')),

                TextColumn::make('peephole.name')
                    ->label('Глазок')
                    ->sortable()
                    ->searchable()
                    ->toggleable()
                    ->placeholder('—')
                    ->wrap(),

                ImageColumn::make('peephole_cover_image')
                    ->label('Накладка')
                    ->circular()
                    ->toggleable()
                    ->defaultImageUrl(url('/images/placeholder.png')),

                TextColumn::make('nightLatchTurner.name')
                    ->label('Ночник')
                    ->sortable()
                    ->searchable()
                    ->toggleable()
                    ->placeholder('—')
                    ->wrap(),

                ImageColumn::make('night_latch_turner_cover_image')
                    ->label('Накладка')
                    ->circular()
                    ->toggleable()
                    ->defaultImageUrl(url('/images/placeholder.png')),

                TextColumn::make('cylinderRod.name')
                    ->label('Вертушка на шток')
                    ->sortable()
                    ->searchable()
                    ->toggleable()
                    ->placeholder('—')
                    ->wrap(),

                ImageColumn::make('cylinder_rod_cover_image')
                    ->label('Вертушка')
                    ->circular()
                    ->toggleable()
                    ->defaultImageUrl(url('/images/placeholder.png')),

                TextColumn::make('handle.name')
                    ->label('Ручка')
                    ->sortable()
                    ->searchable()
                    ->toggleable()
                    ->placeholder('—')
                    ->wrap(),

                ImageColumn::make('handle_cover_image')
                    ->label('Накладка')
                    ->circular()
                    ->toggleable()
                    ->defaultImageUrl(url('/images/placeholder.png')),

                TextColumn::make('created_at')
                    ->label('Создано')
                    ->dateTime('d.m.Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('updated_at')
                    ->label('Обновлено')
                    ->dateTime('d.m.Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                SelectFilter::make('shape')
                    ->label('Форма')
                    ->options([
                        'rectangular' => 'Прямоугольная',
                        'oval' => 'Овальная',
                        'other' => 'Другая',
                    ]),
                SelectFilter::make('color')
                    ->label('Цвет')
                    ->options([
                        'black' => 'Черный',
                        'chrome' => 'Хром',
                        'gold' => 'Золотой',
                        'bronze' => 'Бронзовый',
                    ]),
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('id', 'desc');
    }
}
