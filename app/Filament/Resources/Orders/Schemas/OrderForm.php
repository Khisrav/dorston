<?php

namespace App\Filament\Resources\Orders\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->label('ID пользователя')
                    ->required()
                    ->numeric(),
                TextInput::make('total_price')
                    ->label('Общая стоимость')
                    ->required()
                    ->numeric()
                    ->prefix('₽'),
                Select::make('status')
                    ->label('Статус')
                    ->options([
            'pending' => 'В ожидании',
            'confirmed' => 'Подтвержден',
            'shipped' => 'Отправлен',
            'in_production' => 'В производстве',
            'delivered' => 'Доставлен',
            'cancelled' => 'Отменен',
        ])
                    ->required(),
                Textarea::make('comment')
                    ->label('Комментарий')
                    ->columnSpanFull(),
            ]);
    }
}
