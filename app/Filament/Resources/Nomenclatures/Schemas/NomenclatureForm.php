<?php

namespace App\Filament\Resources\Nomenclatures\Schemas;

use App\Models\NomenclatureCategory;
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
                    ->required()
                    ->columnSpanFull(),

                Select::make('nomenclature_category_id')
                    ->label('Категория')
                    ->options(fn () => NomenclatureCategory::all()->pluck('name', 'id'))
                    ->searchable()
                    ->required(),

                TextInput::make('tag')
                    ->label('Метка')
                    ->placeholder('primary-lock, secondary-lock, …'),

                TextInput::make('base_price')
                    ->label('Базовая цена')
                    ->numeric()
                    ->default(0)
                    ->prefix('₽'),

                Select::make('unit')
                    ->label('Единица измерения')
                    ->options([
                        'м'      => 'М',
                        'шт'     => 'Шт',
                        'кг'     => 'Кг',
                        'л'      => 'Л',
                        'м²'     => 'М²',
                        'м³'     => 'М³',
                        'п.м.'   => 'П.м.',
                        'р/шт'   => 'Р/шт',
                        'р/п.м.' => 'Р/п.м.',
                        'р/л'    => 'Р/л',
                        'р/м²'   => 'Р/м²',
                        'р/м³'   => 'Р/м³',
                        'р/кг'   => 'Р/кг',
                        'р/компл.' => 'Р/компл.',
                    ])
                    ->searchable()
                    ->nullable(),

                FileUpload::make('image')
                    ->label('Изображение')
                    ->directory('nomenclatures')
                    ->imageEditor()
                    ->disk('public')
                    ->image()
                    ->imagePreviewHeight('96')
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }
}
