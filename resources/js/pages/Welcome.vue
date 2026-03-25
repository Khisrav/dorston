<script setup lang="ts">
import PublicLayout from '@/layouts/PublicLayout.vue';
import { Head, Link } from '@inertiajs/vue3';
import { BoxIcon, CalculatorIcon, ChartLineIcon, CogIcon, EyeIcon, MailIcon, PhoneIcon, PointerIcon, SquarePercentIcon, UserIcon, UsersIcon } from 'lucide-vue-next';
import { Button, IconField, InputIcon, InputMask, InputText } from 'primevue';
import axios from 'axios';
import { ref } from 'vue';
import { lead as bitrixLead } from '@/routes/bitrix24';

const form = ref({
    name: '',
    phone: '',
    email: '',
});

const isSubmitting = ref(false);
const submitError = ref('');
const submitSuccess = ref('');

async function submit() {
    if (isSubmitting.value) return;

    submitError.value = '';
    submitSuccess.value = '';

    const name = form.value.name.trim();
    const phone = form.value.phone.trim();
    const email = form.value.email.trim();

    if (!name || !phone || !email) {
        submitError.value = 'Пожалуйста, заполните все поля.';
        return;
    }

    isSubmitting.value = true;
    try {
        await axios.post(bitrixLead.url(), { name, phone, email });

        submitSuccess.value = 'Спасибо! Заявка отправлена.';
        form.value.name = '';
        form.value.phone = '';
        form.value.email = '';
    } catch (err: any) {
        const message =
            err?.response?.data?.message ||
            err?.message ||
            'Не удалось отправить заявку. Попробуйте ещё раз позже.';
        submitError.value = message;
    } finally {
        isSubmitting.value = false;
    }
}

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

const whatYouGet = [
	{
		icon: SquarePercentIcon,
		title: '+30% к прибыли',
		description: 'Реализация нестандартных проектов увеличивает продажи до 30%',
	},
	{
		icon: CalculatorIcon,
		title: 'Быстрый и точный расчет',
		description: 'Экономьте время с конфигуратором и получайте точный расчет без ошибок',
	},
	{
		icon: UsersIcon,
		title: 'Удержание клиентов',
		description: 'Рассчитайте стоимость заказа сразу при клиенте, и не придется отпускать его к конкурентам',
	},
	{
		icon: ChartLineIcon,
		title: 'Конкурентное преимущество',
		description: 'Расширьте продуктовую витрину и закрывайте большее количество запросов клиента',
	},
]
</script>

<template>
	<Head title="Dorston" />
	<PublicLayout>
	<div>
		<section>
			<div class="flex h-full flex-1 flex-col items-center justify-center gap-8 p-4 py-12 md:py-32 sm:px-8 lg:px-12">
				<div class="flex flex-col items-center gap-8 w-full">
					<div class="text-center max-w-5xl mx-auto">
						<h1 class="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-black mb-3">Увеличьте свои продажи на нестандартных заказах</h1>
						<p class="font-serif text-base sm:text-lg text-black/50">Индивидуальные проекты и уникальные решения для клиентов в одном месте</p>
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
									<Button label="Рассчитать" size="small" icon="pi pi-arrow-right" icon-pos="right" />
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
					<h2 class="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black text-center">Конфигуратор Dorston - современное решение. Быстрый и точный расчет онлайн</h2>
					<div class="bg-white px-6 py-9 border border-sky-900/10 shadow-2xl shadow-sky-900/5 rounded-3xl text-center space-y-4 text-[18px] max-w-5xl mx-auto">
						<img src="/assets/ui/section2.png" alt="Зарабатывайте на нестандартных дверях до +30% прибыли" class="w-full rounded">
						<p>Конфигуратор помогает дилерам быстро рассчитать нестандартные двери и не терять клиентов из-за долгих расчетов</p>
						<Button label="Перейти к конфигуратору" size="" icon="pi pi-calculator" icon-pos="left" />
					</div>
				</div>
			</div>
		</section>

		<section>
			<div class="max-w-6xl mx-auto py-16 px-4 sm:px-8 lg:px-12">
				<h2 class="font-serif text-center max-w-2xl mx-auto mb-8 font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black">Что даст вам конфигуратор <b>Dorston</b></h2>
				<div class="flex h-full flex-1 flex-col items-center justify-center gap-8">
					<div class="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
						<div v-for="item in whatYouGet" :key="item.title" class="bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] rounded-2xl p-6 space-y-3 relative flex flex-col gap-4">
							<!-- Fixed icon container: perfectly square, centered icon, no stretch -->
							<div class="flex items-center justify-center rounded-2xl bg-white shadow-2xl w-16 h-16 min-w-16 min-h-16 max-w-16 max-h-16">
								<component :is="item.icon" class="text-sky-900 w-10 h-10" />
							</div>
							<div class="space-y-2">
								<h3 class="text-xl font-bold text-black">{{ item.title }}</h3>
								<p class="text-sm text-black/50">{{ item.description }}</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- <section class="">
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
		</section> -->

		<section>
			<div class="max-w-6xl mx-auto py-16 px-4 sm:px-8 lg:px-12">
				<div class="flex h-full flex-1 flex-col items-center justify-center gap-8">
					<h2 class="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-black mb-0">Как начать работу</h2>
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
								<span class="text-sm text-sky-100">Среднее время сделки</span>
								<span class="text-base font-bold text-white">5–10 минут</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- contact form -->
		<section class="bg-gradient-to-br from-sky-900 via-sky-700 to-sky-800">
			<div class="max-w-6xl mx-auto py-16 px-4 sm:px-8 lg:px-12">
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

					<!-- Left: copy -->
					<div class="space-y-6 text-white">
						<h2 class="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight">Остались вопросы?</h2>
						<p class="text-sky-200 text-lg leading-relaxed">
							Заполните форму — менеджер свяжется с вами и ответит на любые вопросы по конфигурации и стоимости.
						</p>
						<ul class="space-y-3 text-sky-100">
							<li class="flex items-center gap-3">
								<PhoneIcon class="size-4 shrink-0 text-sky-400" />
								<span>Бесплатная консультация</span>
							</li>
							<li class="flex items-center gap-3">
								<MailIcon class="size-4 shrink-0 text-sky-400" />
								<span>Отвечаем на e-mail в течение дня</span>
							</li>
						</ul>
					</div>

					<!-- Right: form card -->
					<div class="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
						<h3 class="font-serif text-xl font-bold text-black mb-6">Свяжитесь с нами</h3>

						<form class="flex flex-col gap-4" @submit.prevent="submit">

							<!-- Name -->
							<div class="flex flex-col gap-1.5">
								<label for="contact-name" class="text-sm font-medium text-black/70">Ваше имя</label>
								<IconField>
									<InputIcon>
										<UserIcon class="size-4" />
									</InputIcon>
									<InputText
										id="contact-name"
										v-model="form.name"
										placeholder="Иван Иванов"
										autocomplete="name"
										class="w-full"
										:disabled="!!submitSuccess"
									/>
								</IconField>
							</div>

							<!-- Phone -->
							<div class="flex flex-col gap-1.5">
								<label for="contact-phone" class="text-sm font-medium text-black/70">Телефон</label>
								<IconField>
									<InputIcon>
										<PhoneIcon class="size-4" />
									</InputIcon>
									<InputMask
										id="contact-phone"
										v-model="form.phone"
										mask="+7 (999) 999-99-99"
										placeholder="+7 (___) ___-__-__"
										autocomplete="tel"
										class="w-full"
										:disabled="!!submitSuccess"
									/>
								</IconField>
							</div>

							<!-- Email -->
							<div class="flex flex-col gap-1.5">
								<label for="contact-email" class="text-sm font-medium text-black/70">E-mail</label>
								<IconField>
									<InputIcon>
										<MailIcon class="size-4" />
									</InputIcon>
									<InputText
										id="contact-email"
										v-model="form.email"
										type="email"
										placeholder="ivan@example.com"
										autocomplete="email"
										class="w-full"
										:disabled="!!submitSuccess"
									/>
								</IconField>
							</div>

							<Button
								type="submit"
								label="Отправить заявку"
								class="mt-2 w-full"
								:loading="isSubmitting"
								:disabled="isSubmitting || !!submitSuccess"
							/>

							<p v-if="submitError" class="text-center text-red-600">{{ submitError }}</p>
							<p v-if="submitSuccess" class="text-center text-emerald-600">{{ submitSuccess }}</p>

							<p class="text-center text-xs text-black/40">Нажимая кнопку, вы соглашаетесь с <a href="dorston.ru/politics" class="text-sky-900">политикой конфиденциальности</a> и обработкой персональных данных</p>

						</form>
					</div>

				</div>
			</div>
		</section>
	</div>
	</PublicLayout>
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