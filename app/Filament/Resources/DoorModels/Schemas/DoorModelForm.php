<?php
namespace App\Filament\Resources\DoorModels\Schemas;

use App\Models\Nomenclature;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;

class DoorModelForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->columns(1)
            ->components([
                Section::make('Основная информация')
                    ->description('Базовые данные модели двери')
                    ->schema([
                        Grid::make(4)
                            ->schema([
                                TextInput::make('name')
                                    ->label('Название')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpan(1),
                                
                                Select::make('type')
                                    ->label('Тип отделки')
                                    ->required()
                                    ->native(false)
                                    ->options(['interior' => 'Внутренняя', 'exterior' => 'Внешняя'])
                                    ->columnSpan(1),

                                Toggle::make('is_thermally_resistant')
                                    ->label('Дверь с терморазрывом')
                                    ->default(false)
                                    ->inline(false),
                        
                                FileUpload::make('image')
                                    ->label('Изображение модели')
                                    ->required()
                                    ->disk('public')
                                    ->directory('door-models')
                                    ->image()
                                    ->imageEditor()
                                    ->maxSize(5120),
                            ]),
                    ])
                    ->collapsible(),

                Section::make('Настройки цветов плёнки')
                    ->description('Управление доступными цветами плёнки для модели')
                    ->schema([
                        Grid::make(4)
                            ->schema([
                                // Primary Film Color
                                Toggle::make('has_primary_film_color')
                                    ->label('Имеет основной цвет плёнки')
                                    ->default(true)
                                    ->live()
                                    ->afterStateUpdated(fn (Set $set, ?bool $state) => 
                                        !$state ? $set('default_primary_film_color_id', null) : null
                                    )
                                    ->columnSpan(2),
                                
                                Select::make('default_primary_film_color_id')
                                    ->label('Основной цвет плёнки по умолчанию')
                                    ->searchable()
                                    ->native(false)
                                    ->options(fn () => Nomenclature::where('nomenclature_category_id', 13)->pluck('name', 'id'))
                                    ->disabled(fn (Get $get) => !$get('has_primary_film_color'))
                                    ->required(fn (Get $get) => $get('has_primary_film_color'))
                                    ->dehydrated(fn (Get $get) => $get('has_primary_film_color'))
                                    ->columnSpan(2)
                                    ->helperText('Выберите цвет плёнки, который будет установлен по умолчанию'),

                                // Secondary Film Color
                                Toggle::make('has_secondary_film_color')
                                    ->label('Имеет вторичный цвет плёнки')
                                    ->default(false)
                                    ->live()
                                    ->afterStateUpdated(fn (Set $set, ?bool $state) => 
                                        !$state ? $set('default_secondary_film_color_id', null) : null
                                    )
                                    ->columnSpan(2),
                                
                                Select::make('default_secondary_film_color_id')
                                    ->label('Вторичный цвет плёнки по умолчанию')
                                    ->searchable()
                                    ->native(false)
                                    ->options(fn () => Nomenclature::where('nomenclature_category_id', 13)->pluck('name', 'id'))
                                    ->disabled(fn (Get $get) => !$get('has_secondary_film_color'))
                                    ->required(fn (Get $get) => $get('has_secondary_film_color'))
                                    ->dehydrated(fn (Get $get) => $get('has_secondary_film_color'))
                                    ->columnSpan(2)
                                    ->helperText('Дополнительный цвет для комбинированной отделки'),

                                // Casing Film Color
                                Toggle::make('has_casing_film_color')
                                    ->label('Имеет цвет плёнки наличника')
                                    ->default(true)
                                    ->live()
                                    ->afterStateUpdated(fn (Set $set, ?bool $state) => 
                                        !$state ? $set('default_casing_film_color_id', null) : null
                                    )
                                    ->columnSpan(2),
                                
                                Select::make('default_casing_film_color_id')
                                    ->label('Цвет плёнки наличника по умолчанию')
                                    ->searchable()
                                    ->native(false)
                                    ->options(fn () => Nomenclature::where('nomenclature_category_id', 13)->pluck('name', 'id'))
                                    ->disabled(fn (Get $get) => !$get('has_casing_film_color'))
                                    ->required(fn (Get $get) => $get('has_casing_film_color'))
                                    ->dehydrated(fn (Get $get) => $get('has_casing_film_color'))
                                    ->columnSpan(2)
                                    ->helperText('Цвет плёнки для обрамления двери'),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed(),

                Section::make('Настройки покраски металла')
                    ->description('Управление доступными цветами покраски металлических элементов')
                    ->schema([
                        Grid::make(2)
                            ->schema([
                                // Primary Paint
                                Toggle::make('has_primary_paint')
                                    ->label('Имеет основной цвет краски')
                                    ->default(true)
                                    ->live()
                                    ->afterStateUpdated(fn (Set $set, ?bool $state) => 
                                        !$state ? $set('default_primary_paint_id', null) : null
                                    )
                                    ->columnSpan(2),
                                
                                Select::make('default_primary_paint_id')
                                    ->label('Основной цвет покраски металла по умолчанию')
                                    ->searchable()
                                    ->native(false)
                                    ->options(fn () => Nomenclature::where('nomenclature_category_id', 2)->pluck('name', 'id'))
                                    ->disabled(fn (Get $get) => !$get('has_primary_paint'))
                                    ->required(fn (Get $get) => $get('has_primary_paint'))
                                    ->dehydrated(fn (Get $get) => $get('has_primary_paint'))
                                    ->columnSpan(2)
                                    ->helperText('Основной цвет для покраски металлических частей'),

                                // Secondary Paint
                                Toggle::make('has_secondary_paint')
                                    ->label('Имеет вторичный цвет краски')
                                    ->default(false)
                                    ->live()
                                    ->afterStateUpdated(fn (Set $set, ?bool $state) => 
                                        !$state ? $set('default_secondary_paint_id', null) : null
                                    )
                                    ->columnSpan(2),
                                
                                Select::make('default_secondary_paint_id')
                                    ->label('Вторичный цвет покраски металла по умолчанию')
                                    ->searchable()
                                    ->native(false)
                                    ->options(fn () => Nomenclature::where('nomenclature_category_id', 2)->pluck('name', 'id'))
                                    ->disabled(fn (Get $get) => !$get('has_secondary_paint'))
                                    ->required(fn (Get $get) => $get('has_secondary_paint'))
                                    ->dehydrated(fn (Get $get) => $get('has_secondary_paint'))
                                    ->columnSpan(2)
                                    ->helperText('Дополнительный цвет для комбинированной покраски'),
                            ]),
                    ])
                    ->collapsible()
                    ->collapsed(),
            ]);
    }
}