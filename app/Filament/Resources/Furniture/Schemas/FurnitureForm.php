<?php

namespace App\Filament\Resources\Furniture\Schemas;

use App\Models\Nomenclature;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class FurnitureForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([

                // ── Основная информация ──────────────────────────────────
                Section::make('Основная информация')
                    ->schema([
                        TextInput::make('title')
                            ->label('Название набора')
                            ->placeholder('Например: Прямоугольная, матовый чёрный')
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Select::make('type')
                            ->label('Тип ручки')
                            ->options([
                                'push'       => 'Нажимная',
                                'pull'       => 'Бугельная',
                                'electronic' => 'Электронная',
                            ])
                            ->required()
                            ->native(false),

                        Select::make('shape')
                            ->label('Форма')
                            ->options([
                                'rectangular' => 'Прямоугольная',
                                'oval'        => 'Овальная',
                                'other'       => 'Другая',
                            ])
                            ->required()
                            ->native(false),

                        Select::make('color')
                            ->label('Цвет')
                            ->options([
                                'black'        => 'Матовый чёрный',
                                'chrome'       => 'Хром',
                                'matte-chrome' => 'Матовый хром',
                                'gold'         => 'Золотой',
                                'bronze'       => 'Бронзовый',
                            ])
                            ->required()
                            ->native(false),

                        FileUpload::make('preview_image')
                            ->label('Превью набора')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios(['4:3', '1:1'])
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/previews')
                            ->columnSpanFull(),
                    ])
                    ->columns(3)
                    ->columnSpanFull(),

                // ── Основные замки ───────────────────────────────────────
                Section::make('Основные замки')
                    ->description('Первичный цилиндрический и сувальдный замок')
                    ->schema([
                        Select::make('primary_cylindrical_lock_id')
                            ->label('Цилиндрический замок (осн.)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        FileUpload::make('primary_cylindrical_lock_cover_image')
                            ->label('Накладка цилиндрического замка')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/cylindrical-lock-covers'),

                        Select::make('primary_lever_lock_id')
                            ->label('Сувальдный замок (осн.)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        FileUpload::make('primary_lever_lock_cover_image')
                            ->label('Накладка сувальдного замка')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/lever-lock-covers'),
                    ])
                    ->columns(2)
                    ->columnSpanFull()
                    ->collapsible(),

                // ── Дополнительные замки ─────────────────────────────────
                Section::make('Дополнительные замки')
                    ->description('Вторичный цилиндрический и сувальдный замок')
                    ->schema([
                        Select::make('secondary_cylindrical_lock_id')
                            ->label('Цилиндрический замок (доп.)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        FileUpload::make('secondary_cylindrical_lock_cover_image')
                            ->label('Накладка цилиндрического замка (доп.)')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/cylindrical-lock-covers/secondary'),

                        Select::make('secondary_lever_lock_id')
                            ->label('Сувальдный замок (доп.)')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 8)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        FileUpload::make('secondary_lever_lock_cover_image')
                            ->label('Накладка сувальдного замка (доп.)')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/lever-lock-covers/secondary'),
                    ])
                    ->columns(2)
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed(),

                // ── Прочие элементы ──────────────────────────────────────
                Section::make('Прочие элементы')
                    ->description('Глазок, ночная задвижка, вертушка на шток, ручка')
                    ->schema([
                        Select::make('peephole_id')
                            ->label('Глазок')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 10)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        FileUpload::make('peephole_cover_image')
                            ->label('Накладка глазка')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/peephole-covers'),

                        Select::make('night_latch_turner_id')
                            ->label('Ночная задвижка + вертушок')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 11)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        FileUpload::make('night_latch_turner_cover_image')
                            ->label('Накладка ночной задвижки')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/night-latch-covers'),

                        Select::make('cylinder_rod_id')
                            ->label('Вертушка на шток цилиндра')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 18)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        FileUpload::make('cylinder_rod_cover_image')
                            ->label('Накладка вертушки на шток')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/cylinder-rod-covers'),

                        Select::make('handle_id')
                            ->label('Ручка')
                            ->options(fn () => Nomenclature::where('nomenclature_category_id', 6)
                                ->pluck('name', 'id'))
                            ->searchable()
                            ->preload()
                            ->nullable(),

                        FileUpload::make('handle_cover_image')
                            ->label('Накладка ручки')
                            ->image()
                            ->imageEditor()
                            ->maxSize(2048)
                            ->disk('public')
                            ->directory('furniture/handle-covers'),
                    ])
                    ->columns(2)
                    ->columnSpanFull()
                    ->collapsible()
                    ->collapsed(),

            ]);
    }
}
