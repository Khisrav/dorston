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
                    ->width('60px'),

                ImageColumn::make('preview_image')
                    ->label('Превью')
                    ->disk('public')
                    ->defaultImageUrl(url('/images/placeholder.png'))
                    ->imageSize(86),

                TextColumn::make('title')
                    ->label('Название')
                    ->searchable()
                    ->sortable()
                    ->placeholder('—')
                    ->wrap()
                    ->description(fn ($record): string => $record->shape
                        ? match ($record->shape) {
                            'rectangular' => 'Прямоугольная',
                            'oval'        => 'Овальная',
                            'other'       => 'Другая',
                            default       => $record->shape,
                        }
                        : ''
                    ),

                TextColumn::make('type')
                    ->label('Тип')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'push'       => 'info',
                        'pull'       => 'success',
                        'electronic' => 'warning',
                        default      => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'push'       => 'Нажимная',
                        'pull'       => 'Бугельная',
                        'electronic' => 'Электронная',
                        default      => $state,
                    })
                    ->sortable(),

                TextColumn::make('color')
                    ->label('Цвет')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'black'        => 'gray',
                        'chrome'       => 'info',
                        'matte-chrome' => 'info',
                        'gold'         => 'warning',
                        'bronze'       => 'danger',
                        default        => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => match ($state) {
                        'black'        => 'Матовый чёрный',
                        'chrome'       => 'Хром',
                        'matte-chrome' => 'Матовый хром',
                        'gold'         => 'Золотой',
                        'bronze'       => 'Бронзовый',
                        default        => $state,
                    })
                    ->sortable(),

                // ── Primary locks (toggleable) ───────────────────────────
                TextColumn::make('cylindricalLock.name')
                    ->label('Цил. замок (осн.)')
                    ->sortable()
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                ImageColumn::make('primary_cylindrical_lock_cover_image')
                    ->label('Накладка цил. (осн.)')
                    ->disk('public')
                    ->defaultImageUrl(url('/images/placeholder.png'))
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('leverLock.name')
                    ->label('Сув. замок (осн.)')
                    ->sortable()
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                ImageColumn::make('primary_lever_lock_cover_image')
                    ->label('Накладка сув. (осн.)')
                    ->disk('public')
                    ->defaultImageUrl(url('/images/placeholder.png'))
                    ->toggleable(isToggledHiddenByDefault: true),

                // ── Secondary locks (toggleable) ─────────────────────────
                TextColumn::make('secondaryCylindricalLock.name')
                    ->label('Цил. замок (доп.)')
                    ->sortable()
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('secondaryLeverLock.name')
                    ->label('Сув. замок (доп.)')
                    ->sortable()
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                // ── Other elements (toggleable) ───────────────────────────
                TextColumn::make('peephole.name')
                    ->label('Глазок')
                    ->sortable()
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('nightLatchTurner.name')
                    ->label('Ночная задвижка')
                    ->sortable()
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('cylinderRod.name')
                    ->label('Вертушка на шток')
                    ->sortable()
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('handle.name')
                    ->label('Ручка')
                    ->sortable()
                    ->searchable()
                    ->placeholder('—')
                    ->toggleable(isToggledHiddenByDefault: true),

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
                SelectFilter::make('type')
                    ->label('Тип')
                    ->options([
                        'push'       => 'Нажимная',
                        'pull'       => 'Бугельная',
                        'electronic' => 'Электронная',
                    ]),
                SelectFilter::make('shape')
                    ->label('Форма')
                    ->options([
                        'rectangular' => 'Прямоугольная',
                        'oval'        => 'Овальная',
                        'other'       => 'Другая',
                    ]),
                SelectFilter::make('color')
                    ->label('Цвет')
                    ->options([
                        'black'        => 'Матовый чёрный',
                        'chrome'       => 'Хром',
                        'matte-chrome' => 'Матовый хром',
                        'gold'         => 'Золотой',
                        'bronze'       => 'Бронзовый',
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
