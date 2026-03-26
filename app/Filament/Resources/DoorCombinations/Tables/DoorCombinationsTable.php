<?php

namespace App\Filament\Resources\DoorCombinations\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Grouping\Group;
use Filament\Tables\Table;

class DoorCombinationsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->groups([
                Group::make('door_type')
                    ->collapsible()
                    ->label('Тип двери'),
                Group::make('doorModel.name')
                    ->collapsible()
                    ->label('Модель двери'),
                Group::make('filmColor.name')
                    ->collapsible()
                    ->label('Цвет'),
                Group::make('img_purpose')
                    ->collapsible()
                    ->label('Назначение'),
            ])
            ->columns([
                TextColumn::make('id')
                    ->label('ID')
                    ->toggleable(isToggledHiddenByDefault: false)
                    ->sortable(),
                ImageColumn::make('image')
                    ->label('Изображение')
                    ->disk('public')
                    ->height(100)
                    ->toggleable(isToggledHiddenByDefault: false),
                TextColumn::make('door_type')
                    ->label('Тип двери')
                    ->badge()
                    ->formatStateUsing(fn ($state) => $state === 'apartment' ? 'Квартирная' : 'Термо')
                    ->toggleable(isToggledHiddenByDefault: false),
                TextColumn::make('doorModel.name')
                    ->label('Модель двери')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: false),
                TextColumn::make('filmColor.name')
                    ->label('Цвет')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: false),
                TextColumn::make('img_purpose')
                    ->label('Назначение')
                    ->badge()
                    ->toggleable(isToggledHiddenByDefault: false),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
