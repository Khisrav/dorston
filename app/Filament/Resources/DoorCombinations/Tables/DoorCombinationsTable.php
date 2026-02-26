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
                TextColumn::make('doorModel.name')
                    ->label('Модель двери')
                    ->searchable(),
                TextColumn::make('filmColor.name')
                    ->label('Цвет')
                    ->searchable(),
                TextColumn::make('img_purpose')
                    ->label('Назначение')
                    ->badge(),
                ImageColumn::make('image')
                    ->label('Изображение')
                    ->disk('public')
                    ->height(100),
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
