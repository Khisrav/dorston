<?php

namespace App\Filament\Resources\DoorCombinations\Schemas;

use App\Models\DoorModel;
use App\Models\Nomenclature;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Utilities\Get;
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
                    ->live()
                    ->required(),
                // The code as written returns an array with callbacks (closures) in the `options()` method. 
                // Filament's Select expects a flat array of options or a grouped array, but only with static arrays, not closures or callbacks.
                // The callbacks will not be executed by Filament, so the Select box will not be populated as intended.

                // The correct way is to set the grouped options in code, not via callbacks:

                Select::make('film_color_id') // can also mean paint_id
                    ->label('Цвет')
                    ->native(false)
                    ->searchable()
                    ->options([
                        'Пленка' => Nomenclature::where('nomenclature_category_id', 13)->pluck('name', 'id')->toArray(),
                        'Краска' => Nomenclature::where('nomenclature_category_id', 2)->pluck('name', 'id')->toArray()
                    ])
                    ->required(),
                Select::make('img_purpose')
                    ->label('Назначение')
                    ->native(false)
                    ->options([ 
                        'Наличник' => 'Наличник',
                        'Полотно' => 'Полотно',
                        'Вставка наличника' => 'Вставка наличника',
                        'Вставка полотна' => 'Вставка полотна'
                    ])
                    ->required(),
                FileUpload::make('image')
                    ->label('Изображение')
                    ->image()
                    ->acceptedFileTypes(['image/png', 'image/webp'])
                    ->maxSize(500)
                    ->directory('door-combinations')
                    ->disk('public')
                    ->required(),
            ]);
    }
}
