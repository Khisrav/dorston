<?php

namespace App\Filament\Resources\Nomenclatures\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class NomenclatureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('nomenclature_category_id')
                    ->required()
                    ->numeric(),
                FileUpload::make('image')
                    ->image(),
                TextInput::make('base_price')
                    ->required()
                    ->numeric()
                    ->prefix('$'),
                Select::make('unit')
                    ->options([
            'м' => 'М',
            'шт' => 'Шт',
            'кг' => 'Кг',
            'л' => 'Л',
            'м²' => 'М²',
            'м³' => 'М³',
            'п.м.' => 'П.м.',
            'р/шт' => 'Р/шт',
            'р/п.м.' => 'Р/п.м.',
            'р/л' => 'Р/л',
            'р/м²' => 'Р/м²',
            'р/м³' => 'Р/м³',
            'р/кг' => 'Р/кг',
        ])
                    ->required(),
            ]);
    }
}
