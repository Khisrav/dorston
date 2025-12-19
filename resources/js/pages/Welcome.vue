<template>
	<div class="min-h-screen bg-white">
		<div class="relative px-6 pt-24 pb-24 lg:px-8">
			<!-- Decorative ornament at top -->
			<!-- <div class="flex justify-center mb-16">
				<div class="w-1 h-12 bg-black"></div>
			</div> -->

			<div class="mx-auto max-w-4xl">
				<!-- Announcement badge with classic styling -->
				<!-- <div class="hidden sm:mb-16 sm:flex sm:justify-center">
					<div class="relative px-6 py-2 text-xs tracking-[0.2em] uppercase text-black border border-black/20">
						Announcing our next round of funding
						<a href="#" class="ml-2 inline-flex items-center font-serif italic hover:underline decoration-1 underline-offset-4">
							<span>Read more</span>
							<span class="ml-1" aria-hidden="true">→</span>
						</a>
					</div>
				</div> -->

				<!-- Main content -->
				<div class="text-center">
					<!-- Decorative top flourish -->
					<div class="flex justify-center mb-8">
						<svg width="60" height="8" viewBox="0 0 60 8" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 4 L25 4 M35 4 L60 4" stroke="black" stroke-width="0.5"/>
							<circle cx="30" cy="4" r="2" fill="black"/>
						</svg>
					</div>

					<h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl tracking-tight text-black leading-tight mb-12">
						Создайте дверь<br />
						<span class="italic">своей мечты</span><br />
						с Dorston
					</h1>

					<div class="flex justify-center mb-8">
						<div class="w-16 h-px bg-black/30"></div>
					</div>

					<p class="font-serif text-lg sm:text-xl lg:text-2xl text-black/70 leading-relaxed max-w-2xl mx-auto mb-16">
						Используйте наш конфигуратор, чтобы создать идеальную дверь для вашего дома или офиса.
					</p>

					<!-- CTA buttons with classic styling -->
					<div class="flex flex-col sm:flex-row items-center justify-center gap-6">
						<Link href="/configurator" 
							class="group relative px-10 py-4 font-bold text-sm md:text-base tracking-[0.15em] uppercase font-serif text-white bg-black border border-black overflow-hidden transition-all duration-300 hover:tracking-[0.2em]">
							<span class="relative z-10">Открыть</span>
						</Link>
						<Link href="#" 
							class="group relative px-10 py-4 font-bold text-sm md:text-base tracking-[0.15em] uppercase font-serif text-black border border-black transition-all duration-300 hover:bg-black hover:text-white hover:tracking-[0.2em]">
							<span class="relative z-10">Подробнее</span>
						</Link>
					</div>
				</div>

				<!-- Decorative bottom flourish -->
				<div class="flex justify-center mt-20">
					<svg width="120" height="16" viewBox="0 0 120 16" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M0 8 L50 8 M70 8 L120 8" stroke="black" stroke-width="0.5" opacity="0.3"/>
						<path d="M55 8 L60 4 L65 8 L60 12 Z" fill="black" opacity="0.3"/>
					</svg>
				</div>
			</div>

			<!-- Decorative side borders for larger screens -->
			<div class="hidden lg:block absolute left-12 top-1/4 bottom-1/4 w-px bg-black/10"></div>
			<div class="hidden lg:block absolute right-12 top-1/4 bottom-1/4 w-px bg-black/10"></div>
		</div>
	</div>
</template>

<script setup>
import { Link } from '@inertiajs/vue3';
import { ref } from 'vue'

const navigation = [
	{ name: 'Product', href: '#' },
	{ name: 'Features', href: '#' },
	{ name: 'Marketplace', href: '#' },
	{ name: 'Company', href: '#' },
]

const mobileMenuOpen = ref(false)
</script>

<style scoped>
/* Import elegant serif fonts */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap');

h1, p, a {
	font-family: 'Playfair Display', serif;
}

/* Subtle hover effects */
a {
	transition: all 0.3s ease;
}
</style>