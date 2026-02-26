<?php

namespace App\Filament\Resources\DoorCombinations\Schemas;

use App\Models\Nomenclature;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Schemas\Schema;

class DoorCombinationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('door_model_id')
                    ->label('Модель двери')
                    ->native(false)
                    ->searchable()
                    ->relationship('doorModel', 'name')
                    ->required(),
                Select::make('film_color_id')
                    ->label('Цвет пленки')
                    ->native(false)
                    ->searchable()
                    ->options(fn () => Nomenclature::where('nomenclature_category_id', 13)->pluck('name', 'id'))
                    ->required(),
                Select::make('img_purpose')
                    ->label('Назначение')
                    ->native(false)
                    ->options([ 'Наличник', 'Полотно', 'Вставка наличника', 'Вставка полотна' ])
                    ->required(),
                FileUpload::make('image')
                    ->label('Изображение')
                    ->image()
                    ->acceptedFileTypes(['image/png', 'image/webp'])
                    ->maxSize(200)
                    ->directory('door-combinations')
                    ->disk('public')
                    ->required(),
            ]);
    }
}
