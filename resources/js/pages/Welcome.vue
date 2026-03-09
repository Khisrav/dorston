<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { BoxIcon, CogIcon, EyeIcon, PointerIcon } from 'lucide-vue-next';


const options = [
    {
        title: 'Для квартиры',
        subtitle: 'Конструктивы Absolut и Comfort',
        href: '/configurator/apartment',
        tags: ['Absolut', 'Comfort'],
        image: '/assets/ui/configurator-apartment.jpg',
    },
    {
        title: 'Для дома',
        subtitle: 'Конструктив Termo',
        href: '/configurator/termo',
        tags: ['Termo'],
        image: '/assets/ui/configurator-termo.jpg',
    },
]

const howItWorks = [
	{
		icon: PointerIcon,
		title: 'Выберите тип',
		description: 'Определите, для квартиры или для дома нужна дверь',
	},
	{
		icon: CogIcon,
		title: 'Настройте параметры',
		description: 'Выберите размер, материал, отделку и фурнитуру',
	},
	{
		icon: EyeIcon,
		title: 'Оцените результат',
		description: 'Визулизация в изменений реальном времени',
	},
	{
		icon: BoxIcon,
		title: 'Получите расчет',
		description: 'Мгновенная финальная стоимость с доставкой',
	}
]
</script>

<template>
	<div>
		<section>
			<div class="flex h-full flex-1 flex-col items-center justify-center gap-8 p-4 sm:p-8 lg:p-12">
				<div class="flex flex-col items-center gap-8 w-full">
					<div class="text-center">
						<h1 class="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-black mb-3">
							Конфигуратор дверей
						</h1>
						<p class="font-serif text-base sm:text-lg text-black/50">Настройте дизайн, цвет и фурнитуру за несколько шагов. Конфигуратор рассчитает цену автоматически.</p>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-5xl">
						<Link
							v-for="option in options"
							:key="option.href"
							:href="option.href"
							class="group relative grid grid-cols-1 md:grid-cols-12 gap-4 p-0 overflow-hidden border rounded-3xl border-sky-950/10 bg-white hover:border-sky-950/40 cursor-pointer transition-all duration-300">
							<div class="col-span-6 relative">
								<div class="md:absolute bottom-0 p-6 sm:p-8">
									<div class="space-y-4">
										<h2 class="text-xl sm:text-2xl font-bold text-black tracking-tight mb-1">
											{{ option.title }}
										</h2>
										<p class="text-sm text-black/50">
											Конструктивы:
										</p>
									</div>
									<div class="flex flex-wrap gap-2 mb-4 mt-2">
										<Badge
											v-for="tag in option.tags"
											:key="tag"
											:label="tag"
											severity="secondary">
											{{ tag }}
										</Badge>
									</div>
									<Button label="Расчитать" size="small" icon="pi pi-arrow-right" icon-pos="right" />
								</div>
							</div>
							<div class="col-span-6">
								<img :src="option.image" alt="Для квартиры" class="w-full">
							</div>
						</Link>
					</div>
				</div>
			</div>
		</section>

		<section class=" bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF]">
			<div class="max-w-6xl mx-auto py-16 px-4 sm:px-8 lg:px-12">
				<div class="flex h-full flex-1 flex-col items-center justify-center gap-8">
					<h2 class="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black">Соберите свою дверь за несколько минут</h2>
					<div class="bg-white px-6 py-9 rounded-3xl space-y-4 text-[18px] max-w-5xl mx-auto">
						<p><span class="text-sky-900">Конфигуратор Dorston</span> — это онлайн-инструмент для быстрой сборки входной двери под нужные параметры и расчета стоимости. Конструктив, размер, отделка и комплектация — выбирайте то, что нужно именно вам.</p>
						<p>Особенно это важно для нестандартных заказов. На рынке металлических дверей около 30% заявок — нестандарт, и часто такие запросы «зависают» из-за долгого расчёта или сложной коммуникации.</p>
						<p>Конфигуратор Dorston решает эту проблему: сложный заказ можно рассчитать за 5–10 минут — <b>быстро, наглядно и без лишних согласований.</b></p>
					</div>
				</div>
			</div>
		</section>

		<section class="">
			<div class="max-w-6xl mx-auto py-16 px-4 sm:px-8 lg:px-12">
				<div class="flex h-full flex-1 flex-col items-center justify-center gap-8">
					<h2 class="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black mb-3">Кому подходит конфигуратор</h2>
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
						<div class="bg-white rounded-3xl border border-sky-950/10 p-6 space-y-3">
							<img src="/assets/ui/dealer.jpg" alt="Для салонов, дилеров и застройщиков" class="w-full rounded">
							<h3 class="text-xl font-bold text-sky-900">Для салонов, дилеров и застройщиков</h3>
							<p>Нестандартные двери сегодня — одна из самых перспективных ниш с относительно низкой конкуренцией.</p>
							<ul class="list-disc list-inside">
								<li>Рассчитайте стоимость двери всего за 5–10 минут</li>
								<li>Не теряйте клиентов из-за долгих согласований</li>
								<li>Увеличьте конверсию нестандартных заказов</li>
							</ul>
						</div>
						<div class="bg-white rounded-3xl border border-sky-950/10 p-6 space-y-3">
							<img src="/assets/ui/client.jpg" alt="Для частных клиентов" class="w-full rounded">
							<h3 class="text-xl font-bold text-sky-900">Для частных клиентов</h3>
							<p>Не нашли подходящую дверь в каталоге? Соберите её сами: от размеров до отделки, фурнитуры и замков.</p>
							<ul class="list-disc list-inside">
								<li>Контролируйте стоимость на каждом этапе</li>
								<li>Получите идеальную дверь под ваш интерьер</li>
								<li>Визуализируйте результат перед заказом</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>

		<section>
			<div class="max-w-6xl mx-auto py-16 px-4 sm:px-8 lg:px-12">
				<div class="flex h-full flex-1 flex-col items-center justify-center gap-8">
					<h2 class="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black mb-0">Как это работает</h2>
					<p>Всего 4 простых шага до двери вашей мечты</p>
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-6">
						<div v-for="item, index in howItWorks" :key="item.title" class="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] rounded-2xl p-6 space-y-3 text-center relative">
							<span class="font-bold text-white bg-sky-900 w-12 h-12 rounded-full flex items-center justify-center absolute top-0 right-0 translate-x-5 -translate-y-1/2">0{{ index + 1 }}</span>
							<div class="w-20 h-20 relative rounded-2xl bg-white shadow-2xl mx-auto">
								<component :is="item.icon" class="text-sky-900 size-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
							</div>
							<h3 class="text-xl font-bold text-black">{{ item.title }}</h3>
							<p class="text-sm text-sky-900">{{ item.description }}</p>
						</div>
					</div>
					<div>
						<div class="flex items-center justify-center gap-4 bg-sky-900 p-4 pr-5 rounded-full">
							<div class="size-12 text-2xl rounded-full bg-white/20 flex items-center justify-center">⚡</div>
							<div class="flex flex-col items-start justify-center">
								<span class="text-sm text-sky-100">Среднее время настройки</span>
								<span class="text-base font-bold text-white">5–10 минут</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<style scoped>
section {
  position: relative;
  isolation: isolate;
}

section::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to right,
    rgba(128, 128, 128, 0.1) 0px,
    rgba(128, 128, 128, 0.1) 1px,
    transparent 1px,
    transparent 30vw
  );
  background-size: 30vw 100%;
  background-position: center;
  mix-blend-mode: overlay;
  pointer-events: none;
  z-index: -1;
}
</style>