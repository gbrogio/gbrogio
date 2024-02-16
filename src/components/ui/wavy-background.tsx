"use client";
import { cn } from "@/utils/cn";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
	children,
	className,
	containerClassName,
	colors,
	waveWidth,
	backgroundFill,
	blur = 10,
	speed = "fast",
	waveOpacity = 0.5,
	...props
}: {
	children?: any;
	className?: string;
	containerClassName?: string;
	colors?: string[];
	waveWidth?: number;
	backgroundFill?: string;
	blur?: number;
	speed?: "slow" | "fast";
	waveOpacity?: number;
	[key: string]: any;
}) => {
	const noise = createNoise3D();
	let w: number;
	let h: number;
	let nt: number;
	let i: number;
	let x: number;
	let ctx: any;
	let canvas: any;
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const getSpeed = () => {
		switch (speed) {
			case "slow":
				return 0.001;
			case "fast":
				return 0.002;
			default:
				return 0.001;
		}
	};

	const init = () => {
		canvas = canvasRef.current;
		ctx = canvas.getContext("2d");
		w = ctx.canvas.width = window.innerWidth;
		h = ctx.canvas.height = window.innerHeight;
		ctx.filter = `blur(${blur}px)`;
		nt = 0;
		window.onresize = () => {
			w = ctx.canvas.width = window.innerWidth;
			h = ctx.canvas.height = window.innerHeight;
			ctx.filter = `blur(${blur}px)`;
		};
		render();
	};

	const waveColors = colors ?? [
		"#fed7aa",
		"#fdba74",
		"#fb923c",
		"#f97316",
		"#ea580c",
	];
	const drawWave = (n: number) => {
		nt += getSpeed();
		for (i = 0; i < n; i++) {
			ctx.beginPath();
			ctx.lineWidth = waveWidth || 50;
			ctx.strokeStyle = waveColors[i % waveColors.length];
			for (x = 0; x < w; x += 5) {
				const y = noise(x / 800, 20 * i, nt) * 150;
				ctx.lineTo(x, y + h * 0.5); // adjust for height, currently at 50% of the container
			}
			ctx.stroke();
			ctx.closePath();
		}
	};

	let animationId: number;
	const render = () => {
		ctx.fillStyle = backgroundFill || "black";
		ctx.globalAlpha = waveOpacity ?? 0.5;
		ctx.fillRect(0, 0, w, h);
		drawWave(5);
		animationId = requestAnimationFrame(render);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		init();
		return () => {
			cancelAnimationFrame(animationId);
		};
	}, []);

	return (
		<div
			className={cn(
				"h-[inherit] flex flex-col items-center justify-center",
				containerClassName,
			)}
		>
			<canvas className="absolute inset-0 z-0" ref={canvasRef} id="canvas" />
			<div className={cn("relative z-10", className)} {...props}>
				{children}
			</div>
		</div>
	);
};
