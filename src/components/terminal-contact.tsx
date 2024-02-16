"use client";
import { cn } from "@/utils/cn";
import {
	AlertCircle,
	CheckCircle,
	RotateCcw,
	TerminalIcon,
	XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import "tailwindcss/tailwind.css";
import emailDomains from "../assets/email-domains.json";
import { Button } from "./ui/button";

const fields = [
	{
		id: "email",
		label: "Enter your email:",
		question: (
			<span>
				To start, could you give me{" "}
				<span className="text-orange-300">your email?</span>
			</span>
		),
	},
	{
		id: "name",
		label: "Enter your full name:",
		question: (
			<span>
				Awesome! And what's <span className="text-orange-300">your name?</span>
			</span>
		),
	},
	{
		id: "desc",
		label: "Enter your message:",
		question: (
			<span>
				Perfect, and{" "}
				<span className="text-orange-300">how can i help you?</span>
			</span>
		),
	},
] as const;

export const TerminalContact = () => {
	const [formState, setFormState] = useState({ name: "", email: "", desc: "" });
	const inputRef = useRef<HTMLSpanElement>(null);
	const [autocomplete, setAutocomplete] = useState("");
	const [currentField, setCurrentField] = useState<{
		id: "email" | "name" | "desc";
		label: string;
		question: JSX.Element;
	}>(fields[0]);

	const [codes, setCodes] = useState<
		{
			question?: (typeof currentField)["question"];
			label: string;
			field: (typeof currentField)["id"];
			input: string;
			output?: { type: "error" | "succeed" | "warn"; message: string };
		}[]
	>([]);
	const [codesHistoricPosition, setCodesHistoricPosition] = useState(0);
	const [codesHistoric, setCodesHistoric] = useState<string[]>([]);
	const [caretPosition, setCaretPosition] = useState("0px");

	function setCaretX() {
		const selection = window.getSelection();
		(selection?.anchorNode as HTMLElement).id

		const startOffset = (selection?.anchorOffset || selection?.focusOffset || 0);

		const x =
			(startOffset < 0 ? 0 : startOffset) *
			(inputRef.current!.offsetWidth /
				(inputRef.current?.innerText.length || 1));

		setCaretPosition(`${x}px`);
	}

	useEffect(() => {
		document?.addEventListener("selectionchange", () => setCaretX());
		return () => document?.removeEventListener("selectionchange", () => setCaretX());
	}, []);

	function resetForm() {
		setFormState({ desc: "", email: "", name: "" });
		inputRef.current!.innerText = "";
		setCurrentField(fields[0]);
		setCodesHistoricPosition(0);
		setCodes([]);
	}

	function resetCaretX() {
		const selection = window.getSelection();
		selection?.modify("move", "forward", "line");
	}

	function handleEmailAutocomplete() {
		const [email, domain] = inputRef.current!.innerText.split("@");
		const domainSearch = domain?.length ? `@${domain}` : "@";
		if (email.length && inputRef.current?.innerText.includes("@")) {
			const domainFind = emailDomains.find((e) => {
				return e.startsWith(domainSearch.toLowerCase());
			});
			setAutocomplete(domainFind?.replace(domainSearch, "") || "");
		} else setAutocomplete("");
	}

	const handleTerminalChanges = () => {
		setCaretX();
		setCodesHistoricPosition(0);
		handleEmailAutocomplete();
	};

	const handleTerminalClick = () => {
		inputRef.current!.focus();
		setCodesHistoricPosition(0);
	};

	function validateEmail(email: string) {
		const regex =
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (email.match(regex)) return true;
		throw ["error", "Insira um e-mail valido."];
	}
	function validateName(name: string) {
		if (name.length > 2) return true;
		throw [
			"warn",
			"Please can you insert a valid name with more than two characters.",
		];
	}

	const handleTerminalShortCuts = (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (e.key === "Enter" && inputRef.current?.innerText.length) {
			try {
				if (currentField.id === "email") {
					validateEmail(inputRef.current?.innerText);
					setCurrentField(fields[1]);
				}
				if (currentField.id === "name") {
					validateName(inputRef.current?.innerText);
					setCurrentField(fields[2]);
				}

				setCodes([
					...codes,
					{
						question: !["error", "warn"].includes(
							codes[codes.length - 1]?.output?.type || "",
						)
							? currentField.question
							: undefined,
						input: inputRef.current?.innerText,
						field: currentField.id,
						label: currentField.label,
					},
				]);
			} catch (err: any) {
				setCodes([
					...codes,
					{
						question:
							codes[codes.length - 1]?.field !== currentField.id
								? !codes[codes.length - 1]?.question
									? currentField.question
									: undefined
								: undefined,
						field: currentField.id,
						input: inputRef.current?.innerText,
						label: currentField.label,
						output: { type: err[0], message: err[1] as string },
					},
				]);
			}

			setCodesHistoric([...codesHistoric, inputRef.current?.innerText]);
			inputRef.current!.innerText = "";
			document.getElementById("terminal")?.scrollTo({ left: 0 });
		}
	};

	return (
		<div
			className="pt-4 backdrop-blur relative rounded-lg shadow-lg mx-auto max-w-3xl w-full"
			onClick={handleTerminalClick}
			onKeyUp={handleTerminalShortCuts}
			role="form"
		>
			<div className="flex items-center px-4 justify-between pb-2 font-mono border-b-1 border-white">
				<div className="flex items-center space-x-1 w-full">
					<TerminalIcon size={20} />
					<span className="text-gray-300 text-sm">Contact Terminal</span>
				</div>
				<Link href="mailto:contact@gbrogio.dev">contact@gbrogio.dev</Link>
				<div className="flex space-x-1 justify-end w-full">
					<span className="h-3 w-3 bg-red-500 rounded-full" />
					<span className="h-3 w-3 bg-yellow-500 rounded-full" />
					<span className="h-3 w-3 bg-green-500 rounded-full" />
				</div>
			</div>
			<Button
				className="absolute top-[3.4rem] right-6 z-20 bg-white/5 rounded-md"
				variant="ghost"
				onClick={resetForm}
				type="button"
			>
				<RotateCcw size="1.2rem" />{" "}
				<span className="sr-only">Redo the form</span>
			</Button>
			<div
				id="terminal"
				className="max-h-96 min-h-96 w-full cursor-text overflow-y-scroll flex-col-reverse items-end flex pb-44 rounded-b-lg bg-orange-950/10 font-mono shadow-xl"
			>
				<div className="p-2 text-lg flex-1 text-slate-100 w-full h-full">
					<p>Hey there! We're excited to link 🔗</p>
					<p className="overflow-hidden whitespace-nowrap font-light max-w-full">
						------------------------------------------------------------------------------------------------------------------------------------------------
					</p>

					<p>
						{codes.map((code, i) => (
							<span key={i.toString()}>
								{code.question && (
									<>
										{code.question}
										<br />
									</>
								)}
								<span className="whitespace-nowrap">
									<span className="text-emerald-400">➜ </span>
									<span className="text-cyan-300">~ </span>
									<span className="opacity-50 mr-2">{code.label}</span>
									<span className="whitespace-nowrap">{code.input}</span>
								</span>
								<br />
								{code.output && (
									<span
										className={cn(
											"whitespace-nowrap flex space-x-2 items-center",
											{
												"text-destructive": code.output.type === "error",
												"text-yellow-500": code.output.type === "warn",
											},
										)}
									>
										{code.output.type === "succeed" ? (
											<CheckCircle size="1.2rem" />
										) : code.output.type === "warn" ? (
											<AlertCircle size="1.2rem" />
										) : (
											<XCircle size="1.2rem" />
										)}
										<span>
											{(code.output.type === "error"
												? "Error: "
												: code.output.type === "warn"
												  ? "Warn: "
												  : "") + code.output.message}
										</span>
									</span>
								)}
							</span>
						))}
					</p>

					<p className="whitespace-nowrap">
						{!["error", "warn"].includes(
							codes[codes.length - 1]?.output?.type || "",
						) && (
							<>
								{currentField.question}
								<br />
							</>
						)}

						<span className="text-emerald-400">➜ </span>
						<span className="text-cyan-300">~ </span>
						<span className="opacity-50 mr-2">{currentField.label}</span>
						<span className="relative w-full inline whitespace-nowrap pr-4">
							<span
								className="whitespace-nowrap transition-none outline-none border-none w-full caret-transparent"
								ref={inputRef}
								contentEditable="plaintext-only"
								tabIndex={0}
								role="textbox"
								onInput={() => handleTerminalChanges()}
								onKeyDown={(e) => {
									if (
										e.key === "ArrowUp" &&
										!inputRef.current!.innerText.length
									) {
										e.preventDefault();
										const lastInput =
											codesHistoric[
												codesHistoric.length - codesHistoricPosition - 1
											];
										if (!lastInput) return;
										setAutocomplete(lastInput);
										setCodesHistoricPosition(codesHistoricPosition + 1);
									}

									if (
										e.key === "ArrowDown" &&
										!inputRef.current!.innerText.length
									) {
										e.preventDefault();
										const lastInput =
											codesHistoric[
												codesHistoric.length - codesHistoricPosition + 1
											];
										if (!lastInput) return;
										setAutocomplete(lastInput);
										setCodesHistoricPosition(codesHistoricPosition - 1);
									}

									if (e.key === "ArrowRight" && autocomplete.length) {
										inputRef.current!.innerText =
											inputRef.current!.innerText + autocomplete;
										setAutocomplete("");

										resetCaretX();
										handleTerminalChanges();
									}

									return (
										(currentField.id === "email"
											? ["Enter", " "]
											: ["Enter"]
										).includes(e.key) && e.preventDefault()
									);
								}}
							/>
							<span
								aria-hidden
								className="w-2 h-5 bg-slate-100 absolute animate-pulse duration-500 transition-none translate-y-1 -ml-[px] pointer-events-none"
								style={{
									left: caretPosition,
								}}
							/>
							<span className="inline opacity-50 pointer-events-none transition-none">
								{autocomplete}
							</span>
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};
