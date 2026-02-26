<?php

namespace App\Filament\Resources\DoorCombinations\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class DoorCombinationInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('doorModel.name')
                    ->label('Модель двери'),
                TextEntry::make('filmColor.name')
                    ->label('Цвет плёнки/краски'),
                TextEntry::make('img_purpose')
                    ->label('Назначение')
                    ->badge(),
                ImageEntry::make('image')
                    ->label('Изображение'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
