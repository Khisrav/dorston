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
                    ->label('Название')
                    ->required(),
                TextInput::make('nomenclature_category_id')
                    ->label('ID категории')
                    ->required()
                    ->numeric(),
                FileUpload::make('image')
                    ->label('Изображение')
                    ->image(),
                TextInput::make('base_price')
                    ->label('Базовая цена')
                    ->required()
                    ->numeric()
                    ->prefix('₽'),
                Select::make('unit')
                    ->label('Единица измерения')
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
