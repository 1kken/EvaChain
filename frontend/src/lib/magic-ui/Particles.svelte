<script lang="ts">
	import { onMount } from 'svelte';

	interface CubeParticle {
		x: number;
		y: number;
		translateX: number;
		translateY: number;
		size: number;
		alpha: number;
		targetAlpha: number;
		dx: number;
		dy: number;
		magnetism: number;
		rotation: number;
		connected: boolean;
	}

	const {
		className = '',
		quantity = 100, // Increased quantity for more web-like feel
		staticity = 40, // Increased for more stable movement
		ease = 30, // Reduced for snappier response
		size = 10, // Smaller cubes for web aesthetic
		refresh = true,
		color = '#047857', // Web-like blue color
		vx = 0,
		vy = 0,
		connectionDistance = 150 // Maximum distance for connecting lines
	} = $props<{
		className?: string;
		quantity?: number;
		staticity?: number;
		ease?: number;
		size?: number;
		refresh?: boolean;
		color?: string;
		vx?: number;
		vy?: number;
		connectionDistance?: number;
	}>();

	let canvasRef: HTMLCanvasElement;
	let canvasContainerRef: HTMLDivElement;
	let context: CanvasRenderingContext2D | null = null;
	let cubes: CubeParticle[] = [];
	let mouse = { x: 0, y: 0 };
	let canvasSize = { w: 0, h: 0 };
	const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
	let animationFrame: number;
	let isAnimating = false;

	function hexToRgb(hex: string): [number, number, number] {
		hex = hex.replace('#', '');
		if (hex.length === 3) {
			hex = hex
				.split('')
				.map((char) => char + char)
				.join('');
		}
		const hexInt = parseInt(hex, 16);
		const red = (hexInt >> 16) & 255;
		const green = (hexInt >> 8) & 255;
		const blue = hexInt & 255;
		return [red, green, blue];
	}

	const rgb = hexToRgb(color);

	function cubeParams(): CubeParticle {
		const x = Math.floor(Math.random() * canvasSize.w);
		const y = Math.floor(Math.random() * canvasSize.h);
		const translateX = 0;
		const translateY = 0;
		const cubeSize = Math.floor(Math.random() * 2) + size;
		const alpha = 0;
		const targetAlpha = parseFloat((Math.random() * 0.4 + 0.1).toFixed(1)); // Reduced alpha for lighter appearance
		const dx = (Math.random() - 0.5) * 0.3; // Increased movement speed
		const dy = (Math.random() - 0.5) * 0.3;
		const magnetism = 0.1 + Math.random() * 2;
		const rotation = Math.random() * Math.PI * 2;

		return {
			x,
			y,
			translateX,
			translateY,
			size: cubeSize,
			alpha,
			targetAlpha,
			dx,
			dy,
			magnetism,
			rotation,
			connected: false
		};
	}

	function drawConnections(): void {
		if (context) {
			context.strokeStyle = `rgba(${rgb.join(', ')}, 0.15)`; // Light connection lines
			context.lineWidth = 1;

			for (let i = 0; i < cubes.length; i++) {
				for (let j = i + 1; j < cubes.length; j++) {
					const cube1 = cubes[i];
					const cube2 = cubes[j];
					const dx = cube1.x + cube1.translateX - (cube2.x + cube2.translateX);
					const dy = cube1.y + cube1.translateY - (cube2.y + cube2.translateY);
					const distance = Math.sqrt(dx * dx + dy * dy);

					if (distance < connectionDistance) {
						const opacity = 1 - distance / connectionDistance;
						context.beginPath();
						context.strokeStyle = `rgba(${rgb.join(', ')}, ${opacity * 0.15})`;
						context.moveTo(cube1.x + cube1.translateX, cube1.y + cube1.translateY);
						context.lineTo(cube2.x + cube2.translateX, cube2.y + cube2.translateY);
						context.stroke();
					}
				}
			}
		}
	}

	function resizeCanvas(): void {
		if (canvasContainerRef && canvasRef && context) {
			canvasSize.w = canvasContainerRef.offsetWidth;
			canvasSize.h = canvasContainerRef.offsetHeight;
			canvasRef.width = canvasSize.w * dpr;
			canvasRef.height = canvasSize.h * dpr;
			canvasRef.style.width = `${canvasSize.w}px`;
			canvasRef.style.height = `${canvasSize.h}px`;
			context.scale(dpr, dpr);
			initParticles();
		}
	}

	function clearContext(): void {
		if (context) {
			context.clearRect(0, 0, canvasSize.w, canvasSize.h);
		}
	}

	function drawCube(cube: CubeParticle): void {
		if (context) {
			const { x, y, translateX, translateY, size, alpha, rotation } = cube;

			context.save();
			context.translate(x + translateX, y + translateY);
			context.rotate(rotation);

			// Simplified cube drawing for web aesthetic
			context.beginPath();
			context.moveTo(-size / 2, -size / 2);
			context.lineTo(size / 2, -size / 2);
			context.lineTo(size / 2, size / 2);
			context.lineTo(-size / 2, size / 2);
			context.closePath();
			context.fillStyle = `rgba(${rgb.join(', ')}, ${alpha * 0.5})`; // Lighter fill
			context.fill();

			context.restore();
		}
	}

	function initParticles(): void {
		cubes = Array.from({ length: quantity }, () => cubeParams());
	}

	function remapValue(
		value: number,
		start1: number,
		end1: number,
		start2: number,
		end2: number
	): number {
		const remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	}

	function animate(): void {
		if (!isAnimating) return;

		clearContext();
		drawConnections(); // Draw connections before cubes

		cubes = cubes.map((cube) => {
			const edge = [
				cube.x + cube.translateX - cube.size,
				canvasSize.w - cube.x - cube.translateX - cube.size,
				cube.y + cube.translateY - cube.size,
				canvasSize.h - cube.y - cube.translateY - cube.size
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));

			if (
				cube.x < -cube.size ||
				cube.x > canvasSize.w + cube.size ||
				cube.y < -cube.size ||
				cube.y > canvasSize.h + cube.size
			) {
				return cubeParams();
			}

			return {
				...cube,
				alpha:
					remapClosestEdge > 1
						? Math.min(cube.alpha + 0.02, cube.targetAlpha)
						: cube.targetAlpha * remapClosestEdge,
				x: cube.x + cube.dx + vx,
				y: cube.y + cube.dy + vy,
				rotation: cube.rotation + 0.005, // Slower rotation
				translateX:
					cube.translateX + (mouse.x / (staticity / cube.magnetism) - cube.translateX) / ease,
				translateY:
					cube.translateY + (mouse.y / (staticity / cube.magnetism) - cube.translateY) / ease
			};
		});

		cubes.forEach(drawCube);
		animationFrame = requestAnimationFrame(animate);
	}

	function onMouseMove(event: MouseEvent): void {
		if (canvasRef) {
			const rect = canvasRef.getBoundingClientRect();
			const { w, h } = canvasSize;
			const x = event.clientX - rect.left - w / 2;
			const y = event.clientY - rect.top - h / 2;
			const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
			if (inside) {
				mouse.x = x;
				mouse.y = y;
			}
		}
	}

	onMount(() => {
		if (canvasRef) {
			context = canvasRef.getContext('2d');
			resizeCanvas();
			isAnimating = true;
			animate();
			window.addEventListener('resize', resizeCanvas);
			window.addEventListener('mousemove', onMouseMove);
		}

		return () => {
			isAnimating = false;
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', onMouseMove);
			if (animationFrame) {
				cancelAnimationFrame(animationFrame);
			}
		};
	});
</script>

<div class={className} bind:this={canvasContainerRef} aria-hidden="true">
	<canvas bind:this={canvasRef} class="size-full backdrop-blur-sm"> </canvas>
</div>

<style>
	.size-full {
		width: 100%;
		height: 100%;
	}
</style>
