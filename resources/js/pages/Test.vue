<template>
	<v-stage :config="stageSize">
		<!-- 1. Основная пленка \ текстура и фрезеровка -->
		<v-layer>
			<v-image v-if="backgroundImage" :config="{
				x: 0,
				y: 0,
				image: backgroundImage,
				width: stageSize.width,
				height: stageSize.height,
			}" />

			<v-image :config="{
				x: 0,
				y: 0,
				image: millingImage,
				width: stageSize.width,
				height: stageSize.height,
				globalCompositeOperation: 'multiply',
				opacity: 0.65,
			}" />
		</v-layer>

		<!-- 3. Доп элемент с пленкой \ текстурой -->
		<v-layer>
			<v-group ref="maskedGroup" v-if="textureImage && elementTextureImage && elementDecorImage">
				<!-- 1. Текстура -->
				<v-image :config="{
					x: 0,
					y: 0,
					image: textureImage,
					width: stageSize.width,
					height: stageSize.height,
				}" />

				<!-- 2. Текстура доп элемента как маска -->
				<v-image :config="{
					x: 0,
					y: 0,
					image: elementTextureImage,
					width: stageSize.width,
					height: stageSize.height,
					globalCompositeOperation: 'destination-in',
				}" />
			</v-group>

			<!-- 3. Декор доп элемента на одном уровне с маскированной текстурой (опционально для деталей) -->
			<v-image v-if="elementDecorImage" :config="{
				x: 0,
				y: 0,
				image: elementDecorImage,
				width: stageSize.width,
				height: stageSize.height,
			}" />
		</v-layer>

		<v-layer>
			<v-image :config="{
				x: 0,
				y: 0,
				image: caseSilhouette,
				width: stageSize.width,
				height: stageSize.height,
				// globalCompositeOperation: 'multiply',
				// opacity: 0.75,
			}" />
		</v-layer>

		<!-- 4. Фурнитура -->
	</v-stage>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';
import { useImage } from 'vue-konva';

const textureImages = [
	'/assets/test/film-colors/filmcolor1.png',
	'/assets/test/film-colors/filmcolor2.png',
	'/assets/test/film-colors/filmcolor3.jpg',
	'/assets/test/film-colors/filmcolor4.png',
	'/assets/test/film-colors/filmcolor5.png',
];

const [caseSilhouette] = useImage('/assets/test/case-silhouette.png')

const millings = [
	'',
	'/assets/test/millings/milling1.png',
	'/assets/test/millings/milling2.png',
	'/assets/test/millings/milling3.png',
];

const decorativeElements = [
	{
		texture: '',
		element: '',
	},
	{
		texture: '/assets/test/decorative-elements/el1/texture.png',
		element: '/assets/test/decorative-elements/el1/decor.png',
	},
];

const stageSize = {
	width: 1878 * 0.2,
	height: 4096 * 0.2,
};

const maskedGroup = ref(null);

// Загружаем изображения
const [backgroundImage] = useImage(textureImages[2]);
const [textureImage] = useImage(textureImages[0]);
const [millingImage] = useImage(millings[3]);
// Объект с двумя изображениями элемента
// const elementImage = {
// 	texture: useImage(decorativeElements[0].texture)[0],
// 	decor: useImage(decorativeElements[0].element)[0]
// };
const [elementTextureImage] = useImage(decorativeElements[1].texture);
const [elementDecorImage] = useImage(decorativeElements[1].element);
// ВАЖНО: Следим за свойствами объекта отдельно
watch(
	[textureImage, elementTextureImage, elementDecorImage],
	async ([texture, elTexture, elDecor]) => {
		if (texture && elTexture && elDecor) {
			await nextTick();
			await nextTick(); // Двойной nextTick для надежности

			const group = maskedGroup.value?.getNode();
			if (group) {
				group.cache();
				group.getLayer()?.batchDraw();
			}
		}
	},
);
</script>
