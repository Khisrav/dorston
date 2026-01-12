<?php

namespace App\Filament\Resources\DoorModels\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class DoorModelsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->sortable(),
                TextColumn::make('name')
                    ->label('Название')
                    ->searchable(),
                ImageColumn::make('image')
                    ->disk('public')
                    ->height(100)
                    ->label('Изображение'),
                TextColumn::make('type')
                    ->label('Тип отделки')
                    ->formatStateUsing(fn ($state) => $state === 'interior' ? 'Внутренняя' : 'Внешняя')
                    ->badge(),
                TextColumn::make('is_thermally_resistant')
                    ->label('Термо дверь')
                    ->badge(),
            ])
            ->filters([
                SelectFilter::make('type')
                    ->label('Тип отделки')
                    ->options([
                        'interior' => 'Внутренняя отделка',
                        'exterior' => 'Внешняя отделка',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),
                // EditAction::make(),
            ])
            ->toolbarActions([
                // BulkActionGroup::make([
                //     DeleteBulkAction::make(),
                // ]),
            ]);
    }
}
