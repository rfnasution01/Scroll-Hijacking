export const portfolio = {
	profile: {
		name: "Your Name",
		role: "Creative Professional",
		tagline: "Build a portfolio landing page that is clean, fast, and easy to customize.",
		description:
			"Use this boilerplate to showcase your skills, selected projects, experience, and contact links. Replace the content in src/data/portfolio.ts with your own.",
		location: "Your City, Country",
		resumeUrl: "/CV.pdf",
	},
	socials: [
		{ label: "Email", href: "mailto:hello@example.com" },
		{ label: "LinkedIn", href: "https://linkedin.com/in/username" },
		{ label: "GitHub", href: "https://github.com/username" },
	],
	skills: ["Brand Strategy", "Web Design", "React", "TypeScript", "UI/UX", "Content"],
	projects: [
		{
			title: "Project One",
			description: "A short description about the result, impact, and your role in this project.",
			tags: ["Landing Page", "Design", "Development"],
			link: "#",
		},
		{
			title: "Project Two",
			description: "Showcase another featured work with measurable outcomes or highlights.",
			tags: ["Dashboard", "React", "Product"],
			link: "#",
		},
		{
			title: "Project Three",
			description: "Add case studies, client work, open-source projects, or personal experiments.",
			tags: ["Portfolio", "Branding", "Web"],
			link: "#",
		},
	],
	experience: [
		{
			role: "Your Current Role",
			company: "Company / Client",
			period: "2024 - Present",
			description: "Describe your main responsibility, collaboration, and impact.",
		},
		{
			role: "Previous Role",
			company: "Company / Client",
			period: "2022 - 2024",
			description: "Add relevant achievements that support your personal brand.",
		},
	],
	contact: {
		email: "hello@example.com",
		phone: "+62 812 0000 0000",
		cta: "Have a project in mind? Let’s talk about how I can help.",
	},
} as const;
