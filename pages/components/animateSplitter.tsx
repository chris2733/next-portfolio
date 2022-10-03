import { motion } from "framer-motion";

export function LetterSplitter({
	text,
	initialDelay,
	letterDelay,
	letterClass,
}: {
	text?: string;
	initialDelay?: number;
	letterDelay?: number;
	letterClass?: string;
}) {
	// check over this, needed to check if text was undefined so it didnt throw a non iterable error
	const splittext: string[] = text !== undefined ? Array.from(text) : [""];

	return (
		<>
			{splittext !== undefined &&
				splittext.map((el, i) => (
					<motion.span
						key={`lettersplitter${i}`}
						initial="hidden"
						animate="visible"
						variants={{
							hidden: {
								y: "100%",
							},
							visible: {
								y: "0",
								transition: {
									delay:
										i * (letterDelay ? letterDelay : 0.2) +
										(initialDelay ? initialDelay : 0),
								},
							},
						}}
						className={letterClass ? letterClass : "duration-200"}
					>
						<span dangerouslySetInnerHTML={{ __html: el }}></span>
					</motion.span>
				))}
		</>
	);
}

export function WordSplitter({
	text,
	boldText,
	boldTextClass,
	initialDelay,
	wordDelay,
	wordClass,
}: {
	text?: string;
	boldText?: string;
	boldTextClass?: boolean;
	initialDelay?: number;
	wordDelay?: number;
	wordClass?: string;
}) {
	// check over this, needed to check if text was undefined so it didnt throw a non iterable error
	// and theres some repetition
	const splittext: string[] =
		text !== undefined ? text.trim().split(/\s+/) : [""];

	const splitboldtext: string[] =
		boldText !== undefined ? boldText.trim().split(/\s+/) : [""];

	// delay normal text if bold text is present - delay by boldtext length
	const boldTextModifier =
		boldText !== undefined ? boldText.length * (wordDelay ? wordDelay : 0) : 0;

	return (
		<div className=" px-1 group hover:px-0 duration-200">
			{splitboldtext !== undefined &&
				splitboldtext.map((el, i, arr) => (
					<span key={`wordsplitter${i}`}>
						<span className="overflow-hidden inline-block">
							<motion.span
								initial="hidden"
								animate="visible"
								variants={{
									hidden: {
										y: "100%",
									},
									visible: {
										y: "0",
										transition: {
											delay:
												i * (wordDelay ? wordDelay : 0.2) +
												(initialDelay ? initialDelay + boldTextModifier : 0),
										},
									},
								}}
								className={`duration-200 inline-block mr-[0.2em] font-medium ${wordClass} ${boldTextClass}`}
							>
								{`${el} `}
							</motion.span>
						</span>
						{i == arr.length - 1 && (
							<span className="overflow-hidden inline-block">
								<motion.span
									initial="hidden"
									animate="visible"
									variants={{
										hidden: {
											y: "100%",
										},
										visible: {
											y: "0",
											transition: {
												delay:
													i * (wordDelay ? wordDelay : 0.2) +
													(initialDelay ? initialDelay + boldTextModifier : 0),
											},
										},
									}}
									className={`duration-200 inline-block mr-[0.2em] font-medium px-0 group-hover:px-1 ${wordClass} ${boldTextClass}`}
								>
									{` - `}
								</motion.span>
							</span>
						)}
					</span>
				))}
			{splittext !== undefined &&
				splittext.map((el, i) => (
					<span className="overflow-hidden inline-block">
						<motion.span
							key={`wordsplitter${i}`}
							initial="hidden"
							animate="visible"
							variants={{
								hidden: {
									y: "100%",
								},
								visible: {
									y: "0",
									transition: {
										delay:
											i * (wordDelay ? wordDelay : 0.2) +
											(initialDelay ? initialDelay + boldTextModifier : 0),
									},
								},
							}}
							className={
								wordClass ? wordClass : "duration-200 inline-block mr-[0.2em]"
							}
						>
							{`${el} `}
						</motion.span>
					</span>
				))}
		</div>
	);
}
