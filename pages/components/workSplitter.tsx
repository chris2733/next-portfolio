import { motion } from "framer-motion";

export default function WordSplitter({
	text,
	boldText,
	boldTextClass,
	initialDelay,
	wordDelay,
	wordClass,
	speed = "duration-500",
}: {
	text?: string;
	boldText?: string;
	boldTextClass?: boolean;
	initialDelay?: number;
	wordDelay?: number;
	wordClass?: string;
	speed?: string;
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
		<div className={`px-1 group hover:px-0 ${speed}`}>
			{splitboldtext !== undefined &&
				boldText !== undefined &&
				splitboldtext.map((el, i, arr) => (
					<span key={`boldwordsplitter${i}`}>
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
								className={`${speed} inline-block mr-[0.2em] font-medium ${wordClass} ${boldTextClass}`}
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
									className={`${speed} inline-block mr-[0.2em] font-medium px-0 group-hover:px-1 ${wordClass} ${boldTextClass}`}
								>
									{` - `}
								</motion.span>
							</span>
						)}
					</span>
				))}
			{splittext !== undefined &&
				splittext.map((el, i, arr) => (
					<span
						className="overflow-hidden inline-block"
						key={`wordsplitter${i}`}
					>
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
							className={`${speed} inline-block ${
								i !== arr.length - 1 && "mr-[0.2em]"
							} ${wordClass && wordClass}`}
						>
							{`${el} `}
						</motion.span>
					</span>
				))}
		</div>
	);
}
