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
                    ->label('Door model'),
                TextEntry::make('filmColor.name')
                    ->label('Film color'),
                TextEntry::make('img_purpose')
                    ->badge(),
                ImageEntry::make('image'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
