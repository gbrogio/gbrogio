"use client";
import { Logo } from "@/assets/techs/logo";
import { Techs } from "@/components/techs";
import { TerminalContact } from "@/components/terminal-contact";
import { Boxes } from "@/components/ui/background-boxes";
import { Button } from "@/components/ui/button";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { WavyBackground } from "@/components/ui/wavy-background";
import Spline from "@splinetool/react-spline";
import Link from "next/link";
import { useEffect, useRef } from "react";

const playSound = () => {
  const audio = new Audio('/key-press.mp3');
	audio.volume = 0.3
  audio.play();
};

export default function Home() {
	const skewRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {		
		document.addEventListener("keyup", playSound);
		return () => document.removeEventListener("keyup", playSound);
	}, []);

	useEffect(() => {
		if (!skewRef.current) return;

		const content = skewRef.current;
		const maxSkew = 2;

		let currentPosition = window.scrollY;

		function skewEffect() {
			const newPosition = window.scrollY;
			const dif = newPosition - currentPosition;

			let skew = dif * 0.8;
			if (skew > maxSkew || skew < -maxSkew) {
				if (skew > 0) {
					skew = maxSkew;
				} else if (skew < 0) {
					skew = -maxSkew;
				}
			}

			content.style.transform = `skewY(${skew}deg)`;
			currentPosition = newPosition;
			requestAnimationFrame(skewEffect);
		}

		skewEffect();
	}, []);

	return (
		<main className="relative w-full [perspective:1500px] pb-32">
			<div
				className="will-change-transform transition-transform duration-500 ease-linear"
				ref={skewRef}
			>
				<div className="fixed pointer-events-none bottom-0 w-full flex items-center justify-center bg-gradient-to-t from-black to-transparent z-50 h-60" />

				<section className="w-full overflow-hidden h-screen min-h-[920px] sticky top-0 left-0">
					<WavyBackground
						speed="slow"
						waveOpacity={0.3}
						className="w-full h-full mx-auto flex items-center justify-center"
					>
						<div className="w-full h-full mx-auto flex items-center justify-center">
							<Boxes className="opacity-10" />
							<div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_50%,black)]" />
							<div className="w-full flex flex-col items-center">
								<div className="relative text-center justify-center w-full flex flex-col items-center max-w-lg space-y-2 px-2">
									<Logo containerClassName="sm:hidden" className="w-8 h-8" />
									<h2 className="text-2xl uppercase font-bold">
										Gulherme Brogio
									</h2>
									<h1 className="sm:text-5xl text-4xl max-sm:flex-col uppercase font-bold inline-flex items-center gap-2">
										<Logo
											containerClassName="max-sm:hidden"
											className="w-8 h-8"
										/>{" "}
										Web Developer
									</h1>
									<TypewriterEffect
										words={"Empower Your Digital Dreams: Seeking a Skilled Web Developer to Transform Ideas into Seamless Online Experiences!"
											.split(" ")
											.map((w) => ({ text: w }))}
										cursorClassName="w-[2px] !h-4"
									/>
									<div className="flex">
										<Button asChild>
											<Link
												href="/curriculum-and-certificates.pdf"
												download
												rel="noopener noreferrer"
												target="_blank"
											>
												Download CV
											</Link>
										</Button>
										<Button variant="link">Work Together</Button>
									</div>
								</div>
								<Techs />
							</div>
							<div className="absolute w-full select-none -z-10 h-full top-0 left-0 text-center flex items-center justify-center">
								<span className="text-[20vw] font-black opacity-5">
									G<span className="opacity-50">BROGIO</span>
								</span>
								<span className="text-[20vw] font-black blur-lg absolute left-1/2 -translate-y-1/2 -translate-x-1/2 top-1/2 opacity-5">
									G<span className="opacity-50">BROGIO</span>
								</span>
							</div>
						</div>
					</WavyBackground>
				</section>

				<section className="bg-black/80 h-full backdrop-blur-lg relative py-32 border-t-1 border-white flex">
					<p className="text-sm max-w-lg mx-auto text-center relative z-10">
						Hello! My name is Guilherme Brogio, and I am a passionate enthusiast
						of computing and web development. Since the moment I dove into the
						world of computers (+/-{" "}
						{(new Date().getFullYear() - 2006 - 8).toString().replace("20", "")}{" "}
						years ago), I was captivated by the incredible ability to transform
						lines of code into amazing digital experiences, building my first
						Website at 12 years old.
						<br />
						<br />
						My journey in web development started with an incessant curiosity to
						understand how things work behind the scenes of the web. This
						passion drove me to explore programming languages, frameworks and
						technologies, constantly seeking to improve my skills.
						<br />
						<br />I firmly believe in the importance of collaboration and
						continuous learning. Along my journey, I learned that the developer
						community is incredibly powerful, and the exchange of knowledge is
						essential for personal and professional growth.
						<br />
						<br />
						Over the years, I had the opportunity to work on exciting projects
						that challenged my skills and expanded my vision about the potential
						of web development. Every challenge faced was an opportunity for
						growth and improvement.
					</p>

					<span className="absolute bottom-2 text-center w-full italic text-muted-foreground text-sm">
						Type something*
					</span>
					<div className="absolute top-0 left-0 w-full h-full opacity-30 z-0">
						<Spline scene="https://draft.spline.design/xsWJhqijXvJAKxMh/scene.splinecode" />
					</div>
				</section>
				<section className="bg-black/80 h-full backdrop-blur-lg relative z-2 py-32 border-t-1 border-white flex">
					<TerminalContact />
				</section>
			</div>
		</main>
	);
}
