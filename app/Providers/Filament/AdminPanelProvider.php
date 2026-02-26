<?php

namespace App\Providers\Filament;

use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\AuthenticateSession;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Navigation\NavigationGroup;
use Filament\Navigation\NavigationItem;
use Filament\Pages\Dashboard;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Icons\Heroicon;
use Filament\Widgets\AccountWidget;
use Filament\Widgets\FilamentInfoWidget;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login()
            ->colors([
                'primary' => Color::Blue,
            ])
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\Filament\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\Filament\Pages')
            ->pages([
                Dashboard::class,
            ])
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\Filament\Widgets')
            ->widgets([
                AccountWidget::class,
                FilamentInfoWidget::class,
            ])
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->sidebarCollapsibleOnDesktop()
            ->breadcrumbs(false)
            ->maxContentWidth('full')
            ->spa()
            // ->brandLogoHeight('3rem')
            //     ->favicon(asset('favicon-32x32.png'))
            //     ->colors([
            //         'primary' => Color::Blue,
            //         'gray' => Color::Slate,
            //     ]) 
            ->navigationGroups([
                NavigationGroup::make('Номенклатуры')
                    ->icon(Heroicon::OutlinedRectangleStack)
                    ->collapsed(true)
                    ->collapsible(true),
                NavigationGroup::make('Предустановки')
                    ->icon(Heroicon::OutlinedRectangleStack)
                    ->collapsed(true)
                    ->collapsible(true),
                NavigationGroup::make('Безопасность')
                    ->icon(Heroicon::OutlinedLockClosed)
                    ->collapsed(false)
                    ->collapsible(true),
            ])
            ->navigationItems([
                NavigationItem::make('Конфигуратор')
                    ->url('/configurator')
                    ->icon('heroicon-o-wrench-screwdriver')
                    ->sort(1)
                    ->openUrlInNewTab(),
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
