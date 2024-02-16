"use client";

import { Bun } from "@/assets/techs/bun";
import { CSS } from "@/assets/techs/css";
import { Docker } from "@/assets/techs/docker";
import { Figma } from "@/assets/techs/figma";
import { Firebase } from "@/assets/techs/firebase";
import { Git } from "@/assets/techs/git";
import { HTML } from "@/assets/techs/html";
import { JavaScript } from "@/assets/techs/javascript";
import { MUI } from "@/assets/techs/mui";
import { Nest } from "@/assets/techs/nest";
import { Next } from "@/assets/techs/next";
import { Node } from "@/assets/techs/node";
import { Postgre } from "@/assets/techs/postgre";
import { Prisma } from "@/assets/techs/prisma";
import { React } from "@/assets/techs/react";
import { StyledComponents } from "@/assets/techs/styled-components";
import { Supabase } from "@/assets/techs/supabase";
import { Tailwind } from "@/assets/techs/tailwindcss";
import { TypeScript } from "@/assets/techs/typescript";
import { Vite } from "@/assets/techs/vite";
import { VSCode } from "@/assets/techs/vscode";
import { useEffect, useRef } from "react";

const TECHS = [
	{ name: "VS Code", logo: VSCode, id: "vscode" },
	{ name: "HTML", logo: HTML, id: "html" },
	{ name: "CSS", logo: CSS, id: "css" },
	{ name: "JavaScript", logo: JavaScript, id: "javascript" },
	{ name: "TypeScript", logo: TypeScript, id: "typescript" },
	{ name: "Figma", logo: Figma, id: "figma" },
	{ name: "Git", logo: Git, id: "git" },
	{ name: "React", logo: React, id: "react" },
	{ name: "Vite", logo: Vite, id: "vite" },
	{ name: "Next.js", logo: Next, id: "next" },
	{ name: "TailwindCSS", logo: Tailwind, id: "tailwind" },
	{
		name: "Styled Components",
		logo: StyledComponents,
		id: "styled-components",
	},
	{ name: "Material UI", logo: MUI, id: "mui" },
	{ name: "Docker", logo: Docker, id: "docker" },
	{ name: "Node.js", logo: Node, id: "node" },
	{ name: "Bun", logo: Bun, id: "bun" },
	{ name: "Nest.js", logo: Nest, id: "nest" },
	{ name: "Prisma", logo: Prisma, id: "prisma" },
	{ name: "PostgreSQL", logo: Postgre, id: "postgresql" },
	{ name: "Firebase", logo: Firebase, id: "firebase" },
	{ name: "Supabase", logo: Supabase, id: "supabase" },
] as const;

export const Techs = () => {
	const sliderRef = useRef<HTMLDivElement>(null);
	const sliderBeforeRef = useRef<HTMLDivElement>(null);
	const sliderAfterRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const slider = sliderRef.current;
		const sliderAfter = sliderAfterRef.current;
		const sliderBefore = sliderBeforeRef.current;
		if (!slider || !sliderAfter || !sliderBefore) return;
		const size = (slider.children[0] as HTMLElement).offsetWidth;

		let time = 0;
		let timeAfter = size;
		let timeBefore = size * 2;
		const interval = setInterval(() => {
			if (slider.offsetLeft <= size * -1) time = sliderBefore.offsetLeft + size;
			if (sliderAfter.offsetLeft <= size * -1)
				timeAfter = slider.offsetLeft + size;
			if (sliderBefore.offsetLeft <= size * -1)
				timeBefore = sliderAfter.offsetLeft + size;

			slider.style.left = `${time}px`;
			sliderAfter.style.left = `${timeAfter}px`;
			sliderBefore.style.left = `${timeBefore}px`;

			time--;
			timeAfter--;
			timeBefore--;
		}, 50);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="w-full mt-10 h-32 flex items-center overflow-hidden relative select-none">
			{[sliderRef, sliderAfterRef, sliderBeforeRef].map((ref, i) => (
				<div
					ref={ref}
					key={i.toString()}
					className="w-fit h-fit top-0 left-0 absolute"
					aria-hidden={i > 0}
				>
					<ul className="w-full flex h-fit gap-8 justify-center px-4">
						{TECHS.map((tech) => (
							<Tech tech={tech} key={tech.id} />
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export const Tech = ({
	tech,
}: {
	tech: (typeof TECHS)[number]["id"] | (typeof TECHS)[number];
}) => {
	const techValues =
		typeof tech === "string"
			? TECHS.find(({ id }) => id === tech) || TECHS[7]
			: tech;
	return (
		<li className="flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity w-max">
			<techValues.logo className="h-8 w-auto mb-2" aria-hidden />
			<span>{techValues.name}</span>
		</li>
	);
};
