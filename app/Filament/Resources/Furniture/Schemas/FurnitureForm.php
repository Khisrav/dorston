<?php

namespace App\Filament\Resources\Furniture\Schemas;

use App\Models\Nomenclature;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FurnitureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('shape')
                    ->label('Форма')
                    ->options([
                        'rectangular' => 'Прямоугольная',
                        'oval' => 'Овальная',
                        'other' => 'Другая',
                    ])
                    ->required()
                    ->native(false),
                Select::make('color')
                    ->label('Цвет')
                    ->options([
                        'black' => 'Черный',
                        'chrome' => 'Хром',
                        'gold' => 'Золотой',
                        'bronze' => 'Бронзовый',
                    ])
                    ->required()
                    ->native(false),

                Section::make('Номенклатура и накладки')
                    ->description('Выберите компоненты фурнитуры и загрузите изображения накладок')
                    ->schema([
                        // Cylindrical Lock
                        Select::make('cylindrical_lock_id')
                            ->label('Цилиндрический замок (накладка)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Категория: Накладки')
                            ->columnSpan(1),
                        FileUpload::make('cylindrical_lock_cover_image')
                            ->label('Изображение накладки цилиндрического замка')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                                '4:3',
                                '1:1',
                            ])
                            ->maxSize(2048)
                            ->directory('furniture/cylindrical-lock-covers')
                            ->columnSpan(1),

                        // Lever Lock
                        Select::make('lever_lock_id')
                            ->label('Сувальдный замок (накладка)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Категория: Накладки')
                            ->columnSpan(1),
                        FileUpload::make('lever_lock_cover_image')
                            ->label('Изображение накладки сувальдного замка')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                                '4:3',
                                '1:1',
                            ])
                            ->maxSize(2048)
                            ->directory('furniture/lever-lock-covers')
                            ->columnSpan(1),

                        // Peephole
                        Select::make('peephole_id')
                            ->label('Глазок')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 10)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Категория: Глазки')
                            ->columnSpan(1),
                        FileUpload::make('peephole_cover_image')
                            ->label('Изображение накладки глазка')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                                '4:3',
                                '1:1',
                            ])
                            ->maxSize(2048)
                            ->directory('furniture/peephole-covers')
                            ->columnSpan(1),

                        // Night Latch Turner
                        Select::make('night_latch_turner_id')
                            ->label('Ночник (вертушка)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 11)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Категория: Вертушки')
                            ->columnSpan(1),
                        FileUpload::make('night_latch_turner_cover_image')
                            ->label('Изображение накладки ночника')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                                '4:3',
                                '1:1',
                            ])
                            ->maxSize(2048)
                            ->directory('furniture/night-latch-covers')
                            ->columnSpan(1),

                        // Cylinder Rod
                        Select::make('cylinder_rod_id')
                            ->label('Вертушка на шток цилиндра')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 18)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Категория: Вертушки на шток')
                            ->columnSpan(1),
                        FileUpload::make('cylinder_rod_cover_image')
                            ->label('Изображение вертушки на шток цилиндра')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                                '4:3',
                                '1:1',
                            ])
                            ->maxSize(2048)
                            ->directory('furniture/cylinder-rod-covers')
                            ->columnSpan(1),

                        // Handle
                        Select::make('handle_id')
                            ->label('Ручка')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 6)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable()
                            ->helperText('Категория: Ручки')
                            ->columnSpan(1),
                        FileUpload::make('handle_cover_image')
                            ->label('Изображение накладки ручки')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                                '4:3',
                                '1:1',
                            ])
                            ->maxSize(2048)
                            ->directory('furniture/handle-covers')
                            ->columnSpan(1),
                    ])
                    ->columns(2)
                    ->columnSpanFull()
                    ->collapsible(),
            ]);
    }
}
